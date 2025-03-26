import { parseDate } from '../hendlers/parseDate';
import { VaccineData } from '../types/types';

export const updateVaccines = (
  newVaccine: VaccineData,
  currentVaccines: VaccineData[]
): VaccineData[] => {
  let newSetOfVaccines;
  const clone = currentVaccines.find(
    (d) => d.date === newVaccine.date && d.type === newVaccine.type
  );
  if (!clone) {
    newSetOfVaccines = [...currentVaccines, newVaccine]
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      .map((v, i) => ({ ...v, orderNumber: i + 1 }));
  } else {
    newSetOfVaccines = currentVaccines;
  }
  return newSetOfVaccines;
};
