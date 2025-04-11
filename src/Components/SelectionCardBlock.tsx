import React from 'react';
import { months } from '../Utils/kit';

type Props = {
  selectedYear: string;
  years: string[];
  selectedMonth: string;
  setSelectedYear: (year: string) => void;
  setSelectedMonth: (month: string) => void;
  setActiveSlider: (value: boolean) => void;
};

export const SelectionCardBlock: React.FC<Props> = React.memo(
  ({
    selectedYear,
    years,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    setActiveSlider,
  }) => {
    const handleMonthChenge = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedMonth(event.target.value);
      //setActiveSlider(false);
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedYear(event.target.value);
      setActiveSlider(false);
    };

    return (
      <div className="flex flex-col gap-2">
        <select
          className="text-primary-900 bg-none w-[100px] border-b-1 border-gray-400"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          className="text-primary-900 bg-none w-[100px] border-b-1 border-gray-400"
          value={selectedMonth}
          onChange={handleMonthChenge}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
