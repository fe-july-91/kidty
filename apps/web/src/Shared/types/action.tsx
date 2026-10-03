import { Data } from './types';

export type Action =
  | { type: 'year'; payload: string }
  | { type: 'month'; payload: string }
  | { type: 'data'; payload: Data[] }
  | { type: 'filteredData'; payload: Data[] }
  | { type: 'currentData'; payload: Data }
  | { type: 'maxValue'; payload: number };
