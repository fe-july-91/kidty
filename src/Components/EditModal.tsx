import React, { useState } from 'react';
import { AvatarSelector } from './AvatarSelector/AvatarSelector';
import { client } from '../Utils/httpClient';
import { Child } from '../Shared/types/types';
import { PopUpWindow } from './PopUpWindow/PopUpWindow';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

type Props = {
  setModal: (a: boolean) => void;
  currentChild: Child;
  setCurrentChild: (value: Child) => void;
  setChildren: (value: Child[]) => void;
};

export const EditModal: React.FC<Props> = ({
  setModal,
  currentChild,
  setCurrentChild,
  setChildren,
}) => {
  const [day, month, year] = currentChild.birth.split('-');
  const [errowMessage, setErrowmessage] = useState('');
  const [isPopUp, setIsPopUp] = useState(false);

  const [selectedGender, setSelectedGender] = useState(currentChild.genderName);
  const [selectedDay, setSelectedDay] = useState(day);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  const [avatarIndex, setAvatarIndex] = useState<number>(+currentChild.image);
  const [surname, setSurname] = useState(currentChild.surname);
  const [name, setName] = useState(currentChild.name);

  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleDelete = () => {
    setIsPopUp(true);
  };

  const deleteChild = () => {
    client.delete(`children/${currentChild.id}`).finally(() => {
      client
        .get<Child[]>(`children`)
        .then((response) => {
          setChildren(response);
          if (response.length > 0) {
            setCurrentChild(response[0]);
          }
        })
        .catch((err) => setErrowmessage(err.message || 'Щось пішло не так'));
      setModal(false);
    });
  };

  const handleSubmit = () => {
    client
      .put<Child>(`children/${currentChild.id}`, {
        birth: `${selectedDay}-${selectedMonth}-${selectedYear}`,
        genderName: `${selectedGender}`,
        image: `${avatarIndex}`,
        name: name,
        surname: surname,
      })
      .then((response) => {
        setCurrentChild(response);
        setModal(false);
      })
      .catch((error) => {
        setErrowmessage('Помилка при сохранении данних');
      });
  };

  return (
    <div className="pt-6 animate-floatUp">
      {isPopUp ? (
        <div className="">
          <PopUpWindow
            message={`Ви дійсно хочете видалити дані про дитину (${currentChild.name})?`}
            handleApplyClick={deleteChild}
            handleCanсelClick={setIsPopUp}
          />
        </div>
      ) : (
        <form className="mx-auto flex flex-col gap-2 w-[375px] md:w-[400px] bg-primary-100 px-6 py-8 rounded-3xl ">
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

          <div className="text-2xl font-medium text-primary-700 text-center">
            Редагувати дані дитини{' '}
          </div>
          <AvatarSelector
            avatarIndex={avatarIndex}
            setAvatarIndex={setAvatarIndex}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm text-primary-500">
              Ім'я
            </label>
            <input
              type="text"
              className="form__control"
              id="name"
              defaultValue={currentChild.name}
              required
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="surname" className="text-sm text-primary-500">
              Прізвище
            </label>
            <input
              type="text"
              className="form__control"
              id="surname"
              defaultValue={currentChild.surname}
              onChange={(event) => setSurname(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="gender" className="text-sm text-primary-500">
              Стать
            </label>
            <select
              id="gender"
              className="form__control"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value="Хлопчик">Хлопчик</option>
              <option value="Дівчинка">Дівчинка</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-primary-500">Дата народження</label>
            <div className="flex flex-row justify-between py-2 text-gray-700">
              <select
                className="w-24 p-2 rounded-md cursor-pointer"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                <option value="">День</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                className="w-24 p-2 rounded-md cursor-pointer"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Місяць</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="w-24 p-2 rounded-md cursor-pointer"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
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
          <div>{errowMessage}</div>
          <Button
            color="primary"
            className="text-white rounded-xl my-2"
            onPress={() => handleSubmit()}
          >
            Зберегти
          </Button>
          <Button
            color="secondary"
            className="text-white rounded-xl my-2"
            onPress={() => handleDelete()}
          >
            Видалити дитину
          </Button>
        </form>
      )}
    </div>
  );
};
