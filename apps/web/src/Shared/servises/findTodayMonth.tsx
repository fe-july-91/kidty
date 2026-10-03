import { months } from '../../Utils/kit';

export const findTodayMonth = () => {
  const formattedDate = new Date().toLocaleDateString('ukr-GB', {
    year: 'numeric',
    month: 'long',
  });
  const todayMonth = formattedDate.split(' ')[0];

  const monthIndex = months.findIndex(
    (month) => month.toLowerCase() === todayMonth.toLowerCase()
  );

  return monthIndex;
};
