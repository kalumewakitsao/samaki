import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { EnquiryPayload, FieldErrors } from './enquiry-schema';

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; kind: 'invalid'; errors: FieldErrors }
  | { ok: false; kind: 'unavailable' | 'failed' | 'offline' | 'rate_limited' | 'retry'; message?: string };

@Injectable({ providedIn: 'root' })
export class EnquiryApiService {
  private readonly http = inject(HttpClient);

  /** Whether the server can deliver enquiries right now. False when the API is missing or has no destination. */
  async accepting(): Promise<boolean> {
    try {
      const res = await firstValueFrom(this.http.get<{ accepting: boolean }>('/api/enquiries/status'));
      return res.accepting === true;
    } catch {
      return false;
    }
  }

  async submit(payload: EnquiryPayload): Promise<SubmitResult> {
    try {
      const res = await firstValueFrom(this.http.post<{ reference: string }>('/api/enquiries', payload));
      return { ok: true, reference: res.reference };
    } catch (e) {
      const err = e as HttpErrorResponse;
      if (err.status === 0) return { ok: false, kind: 'offline' };
      if (err.status === 422) return { ok: false, kind: 'invalid', errors: err.error?.errors ?? {} };
      if (err.status === 429) return { ok: false, kind: 'rate_limited', message: err.error?.message };
      if (err.status === 400) return { ok: false, kind: 'retry', message: err.error?.message };
      if (err.status === 503 || err.status === 404) return { ok: false, kind: 'unavailable' };
      return { ok: false, kind: 'failed' };
    }
  }
}
