import React, { useState } from 'react';
import { AvatarSelector } from './AvatarSelector/AvatarSelector';
import { client } from '../Utils/httpClient';
import { Child } from '../Shared/types/types';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

type Props = {
  setModal: (a: boolean) => void;
  setCurrentChild: (value: Child) => void;
  children: Child[];
};

export const AddModal: React.FC<Props> = ({
  setModal,
  setCurrentChild,
  children,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    gender: '',
    birth: { day: '', month: '', year: '' },
    avatarIndex: 0,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name in formData.birth) {
      setFormData((prev) => ({
        ...prev,
        birth: {
          ...prev.birth,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAvatarChange = (index: number) => {
    setFormData((prev) => ({ ...prev, avatarIndex: index }));
  };

  const isSaveValid =
    formData.name.trim() &&
    formData.surname.trim() &&
    formData.gender &&
    formData.birth.day &&
    formData.birth.month &&
    formData.birth.year;

  const handleSubmit = () => {
    client
      .post<Child>('children', {
        birth: `${formData.birth.day}-${formData.birth.month}-${formData.birth.year}`,
        genderName: formData.gender,
        image: formData.avatarIndex,
        name: formData.name,
        surname: formData.surname,
      })
      .then((response) => {
        setCurrentChild(response);
        setModal(false);
      })
      .catch(() => setErrorMessage('Помилка при сохраненні даних'));
  };

  return (
    <div className="pt-6 animate-floatUp">
      <form className="mx-auto flex flex-col gap-2 w-[375px] md:w-[400px] bg-primary-100 px-6 py-4 rounded-3xl">
        {children.length > 0 && (
          <div className="text-right">
            <Button
              isIconOnly
              variant="flat"
              color="primary"
              className="w-10 rounded-full"
              onPress={() => setModal(false)}
            >
              <Icon
                className="text-gray-700"
                icon="lucide:x"
                width={24}
                height={24}
              />
            </Button>
          </div>
        )}

        <div className="text-2xl font-medium text-primary-700 text-center">
          Введіть дані дитини
        </div>
        <AvatarSelector
          setAvatarIndex={handleAvatarChange}
          avatarIndex={formData.avatarIndex}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm text-primary-500">
            Ім'я
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            className="form__control"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="surname" className="text-sm text-primary-500">
            Прізвище
          </label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            className="form__control"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="gender" className="text-sm text-primary-500">
            Стать
          </label>
          <select
            name="gender"
            className="form__control"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Виберіть стать</option>
            <option value="Хлопчик">Хлопчик</option>
            <option value="Дівчинка">Дівчинка</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-primary-500">Дата народження</label>
          <div className="flex flex-row justify-between text-gray-700">
            <select
              name="day"
              className="w-24 p-2 rounded-md cursor-pointer "
              value={formData.birth.day}
              onChange={handleChange}
            >
              <option value="">День</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              name="month"
              className="w-24 p-2 rounded-md cursor-pointer"
              value={formData.birth.month}
              onChange={handleChange}
            >
              <option value="">Місяць</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              name="year"
              className="w-24 p-2 rounded-md cursor-pointer"
              value={formData.birth.year}
              onChange={handleChange}
            >
              <option value="">Рік</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {errorMessage && (
          <div className="w-full text-danger">{errorMessage}</div>
        )}

        <Button
          color="primary"
          className="text-white rounded-xl disabled:bg-primary-300 my-2"
          onPress={handleSubmit}
          disabled={!isSaveValid}
        >
          Зберегти
        </Button>
      </form>
    </div>
  );
};
