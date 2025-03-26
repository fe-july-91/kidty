import React from 'react';
import { months } from '../../Utils/kit';
import './SelectionCardBlock.scss';

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
      setActiveSlider(false);
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedYear(event.target.value);
      setActiveSlider(false);
    };

    return (
      <div className="SelectionCardBlock">
        <select
          className="SelectionCardBlock__select"
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
          className="SelectionCardBlock__select"
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
