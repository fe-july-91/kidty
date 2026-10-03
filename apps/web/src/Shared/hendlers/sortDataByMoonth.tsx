import { months } from '../../Utils/kit';
import { Data } from '../types/types';

/** Returns a copy of `data` sorted by calendar month. */
export function sortDataByMonth(data: Data[]) {
  return [...data].sort(
    (a, b) => months.indexOf(a.month) - months.indexOf(b.month)
  );
}

/**
 * While the slider is open, shows the selected month at the slider value,
 * adding a temporary entry if that month has no value yet.
 */
export function withSliderPreview(
  data: Data[],
  selectedMonth: string,
  slider?: number
): Data[] {
  if (!slider || slider <= 0) return data;

  const hasMonth = data.some((d) => d.month === selectedMonth);
  const preview = hasMonth
    ? data.map((d) => (d.month === selectedMonth ? { ...d, value: slider } : d))
    : [...data, { id: -1, year: '', month: selectedMonth, value: slider }];

  return sortDataByMonth(preview);
}
