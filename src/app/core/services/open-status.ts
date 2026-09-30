import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { BUSINESS } from '../data/business';

export interface OpenState {
  open: boolean;
  /** Short plain-language line, for example "Open now until 6 pm" or "Opens Monday at 9 am". */
  label: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function hourLabel(h: number): string {
  const suffix = h < 12 ? 'am' : 'pm';
  return `${h % 12 === 0 ? 12 : h % 12} ${suffix}`;
}

/** Whether the office is open at `now`, worked out in Nairobi time. */
export function openState(now: Date, hours = BUSINESS.hours): OpenState {
  const local = new Date(now.getTime() + hours.utcOffsetHours * 3_600_000);
  const day = local.getUTCDay();
  const minutes = local.getUTCHours() * 60 + local.getUTCMinutes();
  const openDays: readonly number[] = hours.days;
  const opens = hours.opensHour * 60;
  const closes = hours.closesHour * 60;

  if (openDays.includes(day) && minutes >= opens && minutes < closes) {
    return { open: true, label: `Open now until ${hourLabel(hours.closesHour)}` };
  }
  if (openDays.includes(day) && minutes < opens) {
    return { open: false, label: `Opens today at ${hourLabel(hours.opensHour)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7;
    if (openDays.includes(next)) {
      const when = i === 1 ? 'tomorrow' : DAY_NAMES[next];
      return { open: false, label: `Opens ${when} at ${hourLabel(hours.opensHour)}` };
    }
  }
  return { open: false, label: 'Closed' };
}

/**
 * Live open or closed status for the office. Worked out in the browser only
 * (null during server rendering), so prerendered pages never carry a stale time.
 */
@Injectable({ providedIn: 'root' })
export class OpenStatus {
  readonly state = signal<OpenState | null>(null);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const update = () => this.state.set(openState(new Date()));
    update();
    const timer = setInterval(update, 60_000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
}
