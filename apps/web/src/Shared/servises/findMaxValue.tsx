import { Data } from '../types/types';

export const findMaxValue = (newData: Data[]): number => {
  let maxValue = 0;
  if (!newData.length) {
    maxValue = Math.max(
      ...newData.filter((d) => d.value > 0).map((d) => d.value)
    );
  }

  return maxValue;
};
