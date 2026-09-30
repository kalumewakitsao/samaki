import { describe, expect, it } from 'vitest';
import { openState } from './open-status';

// Times are given in UTC; Nairobi is UTC+3.
describe('openState', () => {
  it('is open on a weekday afternoon in Nairobi', () => {
    // Wednesday 30 September 2026, 14:00 in Nairobi
    expect(openState(new Date('2026-09-30T11:00:00Z'))).toEqual({
      open: true,
      label: 'Open now until 6 pm',
    });
  });

  it('opens later the same day before 9 am', () => {
    expect(openState(new Date('2026-09-30T04:30:00Z')).label).toBe('Opens today at 9 am');
  });

  it('closes at 6 pm and opens tomorrow', () => {
    expect(openState(new Date('2026-09-30T15:00:00Z'))).toEqual({
      open: false,
      label: 'Opens tomorrow at 9 am',
    });
  });

  it('opens on Monday after Friday evening', () => {
    // Friday 2 October 2026, 19:00 in Nairobi
    expect(openState(new Date('2026-10-02T16:00:00Z')).label).toBe('Opens Monday at 9 am');
  });

  it('opens on Monday during the weekend', () => {
    // Saturday 3 October 2026, 11:00 in Nairobi
    expect(openState(new Date('2026-10-03T08:00:00Z')).label).toBe('Opens Monday at 9 am');
  });
});
