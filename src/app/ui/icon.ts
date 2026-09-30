import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * The Samaki Express icon set: 24px grid, 1.75px rounded strokes, drawn for
 * this site. Icons are decorative unless given a label.
 */
const ICONS: Record<string, string[]> = {
  'arrow-right': ['M5 12h14', 'M13 6l6 6-6 6'],
  'arrow-left': ['M19 12H5', 'M11 6l-6 6 6 6'],
  check: ['M5 12.5l4.5 4.5L19 7'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
  x: ['M6 6l12 12', 'M18 6L6 18'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h10'],
  sun: [
    'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z',
    'M12 2.5v2',
    'M12 19.5v2',
    'M2.5 12h2',
    'M19.5 12h2',
    'M5.3 5.3l1.4 1.4',
    'M17.3 17.3l1.4 1.4',
    'M5.3 18.7l1.4-1.4',
    'M17.3 6.7l1.4-1.4',
  ],
  moon: ['M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z'],
  search: ['M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14z', 'M20 20l-4-4'],
  phone: [
    'M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  ],
  mail: ['M4 6h16v12H4z', 'M4 7l8 6 8-6'],
  pin: [
    'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z',
    'M12 7a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z',
  ],
  clock: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M12 7v5l3 2'],
  chat: ['M4 20l1.3-3.9A8 8 0 1 1 8 19z', 'M9 10h6', 'M9 13.5h4'],
  fish: [
    'M2.5 7.5l3.5 4.5-3.5 4.5',
    'M6 12c2.5-3.6 5.8-5.5 9-5.5 3 0 5.2 2 6.5 5.5-1.3 3.5-3.5 5.5-6.5 5.5-3.2 0-6.5-1.9-9-5.5z',
    'M16.8 10.6v.01',
    'M12.5 8.5c.9 1.2.9 5.8 0 7',
  ],
  feed: [
    'M8 7c0-1.7.9-3 2-3h4c1.1 0 2 1.3 2 3',
    'M6.5 7h11l1 12a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2z',
    'M10 12.5h.01',
    'M14 12.5h.01',
    'M12 15.5h.01',
    'M10 18h.01',
    'M14 18h.01',
  ],
  flask: ['M9 3h6', 'M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3L14 9V3', 'M7.2 14.5h9.6'],
  gauge: [
    'M4.5 17A8 8 0 1 1 19.5 17',
    'M12 16.5l3.5-5',
    'M12 16.5h.01',
    'M7.5 12.5h.01',
    'M12 9h.01',
  ],
  bubbles: [
    'M9 12a4 4 0 1 0 0 8a4 4 0 1 0 0-8z',
    'M16.5 7a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
    'M10 3a2 2 0 1 0 0 4a2 2 0 1 0 0-4z',
  ],
  filter: ['M4 5h16l-6 7.5V19l-4 2v-8.5z'],
  droplet: ['M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z', 'M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5'],
  shield: ['M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6z', 'M9 12l2 2 4-4'],
  clipboard: [
    'M9 4h6v3H9z',
    'M9 5.5H6.5A1.5 1.5 0 0 0 5 7v12.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5H15',
    'M8.5 12h7',
    'M8.5 16h5',
  ],
  cap: [
    'M2.5 9.5L12 5l9.5 4.5L12 14z',
    'M6.5 11.5v4.5c1.5 1.5 3.5 2 5.5 2s4-.5 5.5-2v-4.5',
    'M21.5 9.5v5',
  ],
  truck: [
    'M3 6h11v10H3z',
    'M14 10h4l3 3v3h-7',
    'M7.5 16a2 2 0 1 0 0 4a2 2 0 1 0 0-4z',
    'M17.5 16a2 2 0 1 0 0 4a2 2 0 1 0 0-4z',
  ],
  list: ['M9 6h11', 'M9 12h11', 'M9 18h11', 'M4.5 6h.01', 'M4.5 12h.01', 'M4.5 18h.01'],
  info: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M12 11v5', 'M12 8h.01'],
  alert: ['M12 3.5l9 16H3z', 'M12 10v4', 'M12 17h.01'],
  sprout: ['M12 21v-9', 'M12 12c0-4 3-6 7-6 0 4-3 6-7 6z', 'M12 14.5c0-3-2.5-5-6-5 0 3 2.5 5 6 5z'],
  people: [
    'M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7z',
    'M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5',
    'M16 4.5a3.5 3.5 0 0 1 0 6.5',
    'M18 14.8c1.9.7 3.1 2.4 3.5 5.2',
  ],
  external: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
  'chevron-down': ['M6 9l6 6 6-6'],
  'chevron-right': ['M9 6l6 6-6 6'],
  refresh: ['M20 11a8 8 0 1 0-2.3 5.7', 'M20 5v6h-6'],
  home: ['M4 11l8-7 8 7', 'M6 9.5V20h12V9.5'],
  repeat: [
    'M4 12V9a3 3 0 0 1 3-3h12',
    'M16 3l3 3-3 3',
    'M20 12v3a3 3 0 0 1-3 3H5',
    'M8 21l-3-3 3-3',
  ],
};

@Component({
  selector: 'sx-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'icon icon--' + name()", style: 'display:inline-flex' },
  template: `
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.aria-hidden]="label() ? null : 'true'"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() || null"
      focusable="false"
    >
      @for (d of paths(); track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<string>();
  readonly label = input<string>('');
  protected readonly paths = computed(() => ICONS[this.name()] ?? []);
}

export const ICON_NAMES = Object.keys(ICONS);
