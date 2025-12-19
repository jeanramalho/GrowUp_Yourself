// recurrenceUtils stub: simplified weekly/byday generator
import { addDays } from 'date-fns';

export const generateNextOccurrences = (rule: string, count: number, fromDate = new Date()): string[] => {
  // rule example: 'weekly:TH'
  // returns ISO date strings
  const parts = rule.split(':');
  if (parts[0] !== 'weekly') return [];
  const dayMap: Record<string, number> = { SU:0, MO:1, TU:2, WE:3, TH:4, FR:5, SA:6 };
  const weekday = dayMap[parts[1]] || 4;
  const results: string[] = [];
  let d = new Date(fromDate);
  while (results.length < count) {
    if (d.getDay() === weekday) {
      results.push(d.toISOString());
      d = addDays(d, 7);
    } else {
      d = addDays(d, 1);
    }
  }
  return results;
};
