import React, { useState } from 'react';
import { AvatarSelector } from './AvatarSelector/AvatarSelector';
import { client } from '../Utils/httpClient';
import { Child } from '../Shared/types/types';
import { PopUpWindow } from './PopUpWindow';
import { Button, Input, Select, SelectItem } from '@heroui/react';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [isPopUp, setIsPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState({
    save: false,
    delete: false
  });

  const [selectedGender, setSelectedGender] = useState(currentChild.genderName);
  const [selectedDay, setSelectedDay] = useState(day);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [avatarIndex, setAvatarIndex] = useState<number>(+currentChild.image);
  const [surname, setSurname] = useState(currentChild.surname);
  const [name, setName] = useState(currentChild.name);

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const handleDelete = () => setIsPopUp(true);

  const deleteChild = async () => {
    setIsLoading(prev => ({...prev, delete: true}));
    try {
      await client.delete(`children/${currentChild.id}`);
      const response = await client.get<Child[]>(`children`);
      setChildren(response);
      if (response.length > 0) {
        setCurrentChild(response[0]);
      }
      setModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else if (typeof err === 'string') {
        setErrorMessage(err);
      } else {
        setErrorMessage('Щось пішло не так');
      }
    } finally {
      setIsLoading(prev => ({...prev, delete: false}));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(prev => ({...prev, save: true}));
    setErrorMessage('');
    
    try {
      const response = await client.put<Child>(`children/${currentChild.id}`, {
        birth: `${selectedDay}-${selectedMonth}-${selectedYear}`,
        genderName: selectedGender,
        image: avatarIndex.toString(),
        name,
        surname,
      });
      setCurrentChild(response);
      setModal(false);
    } catch (error) {
      setErrorMessage('Помилка при збереженні даних');
    } finally {
      setIsLoading(prev => ({...prev, save: false}));
    }
  };

  const isFormValid = name.trim() && surname.trim() && selectedDay && selectedMonth && selectedYear;

  return (
    <div className="pt-6 animate-floatUp">
      {isPopUp ? (
        <PopUpWindow
          message={`Ви дійсно хочете видалити дані про дитину (${currentChild.name})?`}
          handleApplyClick={deleteChild}
          handleCanсelClick={() => setIsPopUp(false)}
          isLoading={isLoading.delete}
        />
      ) : (
        <div className="mx-auto flex flex-col gap-4 w-[375px] md:w-[400px] bg-primary-100 px-6 py-8 rounded-3xl">
          <div className="text-right">
            <Button
              isIconOnly
              variant="light"
              color="primary"
              className="w-10 rounded-full self-end"
              onPress={() => setModal(false)}
            >
              <Icon icon="lucide:x" width={24} height={24} />
            </Button>
          </div>

          <h2 className="text-2xl font-medium text-primary-700 text-center">
            Редагувати дані дитини
          </h2>

          <AvatarSelector
            avatarIndex={avatarIndex}
            setAvatarIndex={setAvatarIndex}
          />

          <Input
            label="Ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />

          <Input
            label="Прізвище"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full"
          />

          <Select
            label="Стать"
            selectedKeys={[selectedGender]}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full"
          >
            <SelectItem key="Хлопчик">Хлопчик</SelectItem>
            <SelectItem key="Дівчинка">Дівчинка</SelectItem>
          </Select>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-primary-500">Дата народження</label>
            <div className="flex gap-2">
              <Select
                label="День"
                selectedKeys={[selectedDay]}
                onSelectionChange={(keys) => {
                  const day = Array.from(keys)[0]?.toString() || '';
                  setSelectedDay(day);
                }}
                className="flex-1"
              >
                {days.map((day) => (
                  <SelectItem key={day} textValue={day}>
                    {day}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Місяць"
                selectedKeys={[selectedMonth]}
                onSelectionChange={(keys) => {
                  const month = Array.from(keys)[0]?.toString() || '';
                  setSelectedMonth(month);
                }}
                className="flex-1"
              >
                {months.map((month) => (
                  <SelectItem key={month} textValue={month}>
                    {month}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Рік"
                selectedKeys={[selectedYear]}
                onSelectionChange={(keys) => {
                  const year = Array.from(keys)[0]?.toString() || '';
                  setSelectedYear(year);
                }}
                className="flex-1"
              >
                {years.map((year) => (
                  <SelectItem key={year.toString()} textValue={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {errorMessage && (
            <div className="text-danger text-sm p-2 bg-danger-100 rounded-md">
              {errorMessage}
            </div>
          )}

          <Button
            color="primary"
            className="w-full"
            onPress={handleSubmit}
            isLoading={isLoading.save}
            isDisabled={!isFormValid || isLoading.save}
          >
            Зберегти
          </Button>

          <Button
            color="danger"
            variant="solid"
            className="w-full"
            onPress={handleDelete}
          >
            Видалити дитину
          </Button>
        </div>
      )}
    </div>
  );
};