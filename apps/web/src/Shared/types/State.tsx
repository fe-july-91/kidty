import { Data } from './types';

export type State = {
  selectedYear: string;
  selectedMonth: string;
  data: Data[];
  filteredData: Data[];
  currentData: Data | undefined;
  maxValue: number;
};
