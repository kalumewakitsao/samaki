import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { BUSINESS, mailtoLink, whatsappLink } from '../../core/data/business';
import { CATEGORIES, PRODUCTS, SERVICES, findOffering } from '../../core/data/catalogue';
import { EnquiryApiService } from '../../core/enquiry/enquiry-api.service';
import {
  ContactMethod,
  EnquiryPayload,
  EnquiryType,
  FARM_TYPES,
  FarmType,
  FieldErrors,
  LIMITS,
  enquiryToText,
  validateEnquiry,
} from '../../core/enquiry/enquiry-schema';
import { QuoteListStore } from '../../core/enquiry/quote-list.store';
import { AnalyticsService } from '../../core/services/analytics.service';
import { Icon } from '../icon';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type ErrorKind = 'unavailable' | 'failed' | 'offline' | 'rate_limited' | 'retry' | 'invalid';

const DRAFT_KEY = 'samaki-enquiry-draft';

const FIELD_ORDER: (keyof FieldErrors)[] = [
  'items',
  'message',
  'location',
  'name',
  'phone',
  'email',
];
const FIELD_LABELS: Record<string, string> = {
  items: 'What you need',
  location: 'Town or county',
  name: 'Your name',
  phone: 'Phone number',
  email: 'Email address',
  message: 'Message',
};

@Component({
  selector: 'sx-enquiry-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    InputText,
    Select,
    Textarea,
    Checkbox,
    Icon,
  ],
  templateUrl: './enquiry-form.html',
  styleUrl: './enquiry-form.scss',
})
export class EnquiryForm {
  readonly type = input<EnquiryType>('quote');

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(EnquiryApiService);
  private readonly analytics = inject(AnalyticsService);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly list = inject(QuoteListStore);
  protected readonly business = BUSINESS;
  protected readonly limits = LIMITS;
  protected readonly farmTypes = [...FARM_TYPES];
  protected readonly whatsappEnabled = BUSINESS.whatsapp.enabled;

  protected readonly addOptions = [
    ...CATEGORIES.map((c) => ({
      label: c.name,
      items: PRODUCTS.filter((p) => p.category === c.id).map((p) => ({
        label: p.name,
        value: p.slug,
      })),
    })),
    { label: 'Farm services', items: SERVICES.map((s) => ({ label: s.name, value: s.slug })) },
  ];

  protected readonly form = this.fb.group({
    farmType: this.fb.control<FarmType | null>(null),
    location: [''],
    name: [''],
    phone: [''],
    email: [''],
    contactMethod: this.fb.control<ContactMethod>('phone'),
    message: [''],
    marketingConsent: [false],
    website: [''],
  });

  protected readonly status = signal<Status>('idle');
  protected readonly errorKind = signal<ErrorKind | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly errors = signal<FieldErrors>({});
  protected readonly submitted = signal(false);
  protected readonly reference = signal('');
  protected readonly sent = signal<EnquiryPayload | null>(null);
  protected readonly accepting = signal<boolean | null>(null);
  protected readonly addSelection = signal<string | null>(null);

  private readonly value = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });
  private idempotencyKey = '';
  private shownAt = 0;
  private started = false;

  private readonly summaryEl = viewChild<ElementRef<HTMLElement>>('summary');
  private readonly successEl = viewChild<ElementRef<HTMLElement>>('success');
  private readonly problemEl = viewChild<ElementRef<HTMLElement>>('problem');

  protected readonly errorList = computed(() => {
    const e = this.errors();
    return FIELD_ORDER.filter((k) => e[k]).map((k) => ({
      field: k,
      label: FIELD_LABELS[k],
      message: e[k]!,
    }));
  });

  /** Live progress for the three parts of the quote form. */
  protected readonly progress = computed(() => {
    const v = this.value();
    const items = this.list.items().length > 0;
    const farm = !!v.location?.trim();
    const contact = !!v.name?.trim() && !!v.phone?.trim();
    return [
      { label: 'What you need', done: items },
      { label: 'Your farm', done: farm },
      { label: 'Contact details', done: contact },
    ];
  });

  protected readonly successMethod = computed(() => {
    const s = this.sent();
    if (!s) return '';
    return s.contactMethod === 'email'
      ? 'by email'
      : s.contactMethod === 'whatsapp'
        ? 'on WhatsApp'
        : 'by phone';
  });

  protected readonly fallbackEmail = computed(() => {
    const p = this.payload();
    return mailtoLink(p.type === 'quote' ? 'Quote request' : 'Enquiry', enquiryToText(p));
  });
  protected readonly fallbackWhatsapp = computed(() => whatsappLink(enquiryToText(this.payload())));

  constructor() {
    if (!this.browser) return;
    this.reset();
    this.restoreDraft();
    this.api.accepting().then((ok) => this.accepting.set(ok));
    this.form.valueChanges.subscribe(() => {
      this.saveDraft();
      if (!this.started) {
        this.started = true;
        this.analytics.track('enquiry_start', { type: this.type() });
      }
      if (this.submitted()) this.errors.set(this.clientErrors());
    });
  }

  protected fieldError(name: keyof FieldErrors): string | undefined {
    return this.submitted() ? this.errors()[name] : undefined;
  }

  protected addItem(slug: string | null): void {
    if (!slug) return;
    this.list.add(slug);
    this.addSelection.set(null);
    if (this.submitted()) this.errors.set(this.clientErrors());
    queueMicrotask(() => this.addSelection.set(null));
  }

  protected removeItem(slug: string): void {
    this.list.remove(slug);
    if (this.submitted()) this.errors.set(this.clientErrors());
  }

  protected quantityInput(slug: string, event: Event): void {
    this.list.setQuantity(slug, (event.target as HTMLInputElement).value.slice(0, LIMITS.quantity));
  }

  protected hint(slug: string): string {
    const o = findOffering(slug);
    return o?.kind === 'product' ? o.quantityHint : 'For example, one visit in March';
  }

  protected focusField(field: string, event: Event): void {
    event.preventDefault();
    const el =
      this.doc.getElementById(`f-${field}`) ??
      this.doc.querySelector<HTMLElement>(
        `#f-${field} input, [data-field="${field}"] input, [data-field="${field}"] [tabindex]`,
      );
    el?.focus();
    el?.scrollIntoView({ block: 'center' });
  }

  async submit(): Promise<void> {
    if (this.status() === 'submitting') return;
    this.submitted.set(true);
    this.errorKind.set(null);
    const errors = this.clientErrors();
    this.errors.set(errors);
    if (Object.keys(errors).length) {
      this.status.set('error');
      this.errorKind.set('invalid');
      this.analytics.track('enquiry_error', { type: this.type(), reason: 'validation' });
      setTimeout(() => this.summaryEl()?.nativeElement.focus());
      return;
    }

    const payload = this.payload();
    this.status.set('submitting');
    this.analytics.track('enquiry_submit', { type: this.type(), items: payload.items.length });
    const result = await this.api.submit(payload);

    if (result.ok) {
      this.reference.set(result.reference);
      this.sent.set(payload);
      this.status.set('success');
      if (this.type() === 'quote') this.list.completed(payload.items);
      this.clearDraft();
      this.analytics.track('enquiry_success', {
        type: this.type(),
        items: payload.items.length,
        contact: payload.contactMethod,
      });
      setTimeout(() => {
        this.successEl()?.nativeElement.focus();
        this.successEl()?.nativeElement.scrollIntoView({ block: 'start' });
      });
      return;
    }

    this.status.set('error');
    this.errorKind.set(result.kind);
    this.errorMessage.set('message' in result ? (result.message ?? '') : '');
    if (result.kind === 'invalid') this.errors.set(result.errors);
    if (result.kind === 'unavailable') this.accepting.set(false);
    this.analytics.track('enquiry_error', { type: this.type(), reason: result.kind });
    setTimeout(() =>
      (result.kind === 'invalid' ? this.summaryEl() : this.problemEl())?.nativeElement.focus(),
    );
  }

  protected startAnother(): void {
    this.form.reset({ contactMethod: 'phone', marketingConsent: false });
    this.status.set('idle');
    this.submitted.set(false);
    this.errors.set({});
    this.sent.set(null);
    this.reset();
  }

  protected repeatLast(): void {
    this.list.repeatLast();
  }

  private payload(): EnquiryPayload {
    const v = this.form.getRawValue();
    return {
      type: this.type(),
      items: this.type() === 'quote' ? this.list.items() : [],
      farmType: v.farmType ?? '',
      location: v.location.trim(),
      name: v.name.trim(),
      phone: v.phone.trim(),
      email: v.email.trim(),
      contactMethod: v.contactMethod,
      message: v.message.trim(),
      marketingConsent: v.marketingConsent,
      idempotencyKey: this.idempotencyKey,
      website: v.website,
      elapsedMs: this.browser ? Math.round(performance.now() - this.shownAt) : 0,
      sourcePath: this.router.url.split('?')[0],
    };
  }

  private clientErrors(): FieldErrors {
    return validateEnquiry({ ...this.payload(), elapsedMs: LIMITS.minElapsedMs });
  }

  private reset(): void {
    this.idempotencyKey = crypto.randomUUID();
    this.shownAt = performance.now();
    this.started = false;
  }

  private restoreDraft(): void {
    try {
      const raw = sessionStorage.getItem(`${DRAFT_KEY}-${this.type()}`);
      if (raw) this.form.patchValue({ ...JSON.parse(raw), website: '' }, { emitEvent: false });
    } catch {
      // A missing or unreadable draft is not a problem.
    }
  }

  private saveDraft(): void {
    try {
      const { website: _w, ...rest } = this.form.getRawValue();
      sessionStorage.setItem(`${DRAFT_KEY}-${this.type()}`, JSON.stringify(rest));
    } catch {
      // Storage blocked: inputs still stay on the page.
    }
  }

  private clearDraft(): void {
    try {
      sessionStorage.removeItem(`${DRAFT_KEY}-${this.type()}`);
    } catch {
      // Nothing to clear.
    }
  }
}
