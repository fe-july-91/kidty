import { months } from '../../Utils/kit';
import { Data } from '../types/types';

export function sortDataByMonth(data: Data[]) {
  const monthsOrder = months;

  return data.sort((a, b) => {
    const monthAIndex = monthsOrder.indexOf(a.month);
    const monthBIndex = monthsOrder.indexOf(b.month);
    return monthAIndex - monthBIndex;
  });
}
