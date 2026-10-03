import { Data } from '../types/types';

export type State = {
  selectedYear: string;
  selectedMonth: string;
  data: Data[];
};

export type Action =
  | { type: 'selectedYear'; payload: string }
  | { type: 'selectedMonth'; payload: string }
  | { type: 'data'; payload: Data[] };

export function reduser(state: State, action: Action): State {
  const { type, payload } = action;
  return { ...state, [type]: payload };
}
