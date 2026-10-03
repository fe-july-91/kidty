export const getAgeAtVaccination = (vaccDate, birthDate) => {
  // Преобразуем строки в объекты Date
  const [birthDay, birthMonth, birthYear] = birthDate.split('-').map(Number);
  const birth = new Date(birthYear, birthMonth - 1, birthDay); // Месяцы считаются с 0

  const [vaccDay, vaccMonth, vaccYear] = vaccDate.split('-').map(Number);
  const vaccination = new Date(vaccYear, vaccMonth - 1, vaccDay);

  if (isNaN(birth.getTime()) || isNaN(vaccination.getTime())) {
    console.error('Invalid date provided');
    return 'Invalid date';
  }

  // Вычисляем возраст
  let ageYears = vaccination.getFullYear() - birth.getFullYear();
  let ageMonths = vaccination.getMonth() - birth.getMonth();

  // Корректируем, если месяцы отрицательны
  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  return `${ageYears}p${ageMonths}м`;
};
