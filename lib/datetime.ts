/**
 * lib/datetime.ts
 *
 * IST-safe consultation date/time helpers.
 *
 * The Vastu Arya backend stores consultation date/time as two separate fields:
 *   - `consultationDate`: full ISO string (typically "YYYY-MM-DDT00:00:00.000Z")
 *   - `consultationTime`: "HH:MM" (24-hour, no timezone)
 *
 * These values represent the *literal* wall-clock time in Asia/Kolkata (IST)
 * that the admin picked. They must NEVER be converted through the browser's
 * timezone (which would shift them for users travelling / abroad).
 *
 * This module implements a pure, deterministic conversion from those raw
 * fields to (a) a rendered "15 Mar 2026", "3:30 PM IST" pair and (b) a Date
 * object that points to the correct absolute UTC instant of that wall time
 * (used only for the countdown).
 *
 * No external timezone library required — all conversions are done via the
 * IANA-aware `Intl.DateTimeFormat` API which is available in every browser.
 */

const IST_TZ = 'Asia/Kolkata';

/** Parse a date value that came from the backend and extract its IST calendar Y-M-D. */
function extractYMD(raw?: string): { y: number; m: number; d: number } | null {
  if (!raw) return null;
  // Case 1: pure "YYYY-MM-DD" — no timezone ambiguity, use verbatim (this is
  // what the admin selected in the date picker).
  const dOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (dOnly) return { y: +dOnly[1], m: +dOnly[2], d: +dOnly[3] };
  // Case 2: full ISO string (backend converts date+time to UTC on save). We
  // must project that absolute instant back into the Asia/Kolkata calendar
  // day, otherwise an admin picking e.g. 00:30 IST on 15-Mar (stored by the
  // backend as 14-Mar 19:00Z) would render as "14 Mar" in the customer's UI.
  const parsed = new Date(raw);
  if (!isNaN(parsed.getTime())) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: IST_TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(parsed).reduce<Record<string, string>>((acc, p) => {
      if (p.type !== 'literal') acc[p.type] = p.value;
      return acc;
    }, {});
    if (parts.year && parts.month && parts.day) {
      return { y: +parts.year, m: +parts.month, d: +parts.day };
    }
  }
  // Fallback: raw substring (works for backends that store date-only ISO).
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (iso) return { y: +iso[1], m: +iso[2], d: +iso[3] };
  return null;
}

/** Parse an "HH:MM" or "HH:MM:SS" string. */
function extractHM(raw?: string): { h: number; min: number } | null {
  if (!raw) return null;
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(raw);
  if (!m) return null;
  return { h: +m[1], min: +m[2] };
}

/**
 * Build the absolute UTC Date pointing to the given IST wall-clock instant.
 * Approach: assume IST is UTC+5:30 (India has never observed DST since 1945),
 * so wall-clock T IST = T - 5:30 UTC.
 */
function istWallToUtcDate(y: number, m: number, d: number, h: number, min: number): Date {
  return new Date(Date.UTC(y, m - 1, d, h - 5, min - 30));
}

export interface ConsultationDisplay {
  /** e.g. "15 Mar 2026" — the exact IST calendar date the admin picked */
  date: string | null;
  /** e.g. "3:30 PM" — the exact IST wall-clock time the admin picked */
  time: string | null;
  /** e.g. "15 Mar 2026, 3:30 PM IST" — combined single-line label */
  combined: string | null;
  /** Absolute UTC Date pointing to the IST wall-clock moment (for countdowns) */
  dt: Date | null;
  /** Human-readable timezone label — always "IST" */
  tzLabel: 'IST';
}

/**
 * Convert backend consultationDate + consultationTime into a display bundle.
 * ALL fields are computed in Asia/Kolkata, never in the browser's local TZ.
 */
export function formatIST(dateRaw?: string, timeRaw?: string): ConsultationDisplay {
  const ymd = extractYMD(dateRaw);
  const hm = extractHM(timeRaw);
  if (!ymd) {
    return { date: null, time: null, combined: null, dt: null, tzLabel: 'IST' };
  }

  const h = hm?.h ?? 0;
  const min = hm?.min ?? 0;
  const dt = istWallToUtcDate(ymd.y, ymd.m, ymd.d, h, min);

  const dateFmt = new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeFmt = new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const date = dateFmt.format(dt);
  const time = hm ? timeFmt.format(dt) : null;
  const combined = time ? `${date}, ${time} IST` : `${date} (IST)`;

  return { date, time, combined, dt, tzLabel: 'IST' };
}

/**
 * Format any absolute-instant timestamp (e.g. createdAt / updatedAt) in IST
 * with the "IST" suffix so it's unambiguous for users outside India.
 */
export function formatInstantIST(
  input: string | number | Date,
  opts: { withTime?: boolean; withTz?: boolean } = { withTime: true, withTz: true },
): string {
  const dt = input instanceof Date ? input : new Date(input);
  if (isNaN(dt.getTime())) return '';
  const fmt = new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(opts.withTime !== false
      ? { hour: 'numeric', minute: '2-digit', hour12: true }
      : {}),
  });
  const s = fmt.format(dt);
  return opts.withTz === false ? s : `${s} IST`;
}
