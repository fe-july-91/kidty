import { Data } from '../types/types';

export const filterDataByYear = (data: Data[], selectedYear: string) => {
  return data.filter((d) => d.year === selectedYear);
};
