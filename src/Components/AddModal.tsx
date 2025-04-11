import React, { useState } from 'react';
import { AvatarSelector } from './AvatarSelector/AvatarSelector';
import { client } from '../Utils/httpClient';
import { Child } from '../Shared/types/types';
import { Button, Input, Select, SelectItem } from '@heroui/react';
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
  const [isLoading, setIsLoading] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleChange = (name: string, value: string) => {
    setFormData(prev => {
      if (name in prev.birth) {
        return {
          ...prev,
          birth: {
            ...prev.birth,
            [name]: value,
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
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

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await client.post<Child>('children', {
        birth: `${formData.birth.day}-${formData.birth.month}-${formData.birth.year}`,
        genderName: formData.gender,
        image: formData.avatarIndex,
        name: formData.name,
        surname: formData.surname,
      });
      
      setCurrentChild(response);
      setModal(false);
    } catch (error) {
      setErrorMessage('Помилка при сохраненні даних');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-6 animate-floatUp">
      <div className="mx-auto flex flex-col gap-4 w-[375px] md:w-[400px] bg-primary-100 px-6 py-4 rounded-3xl">
        {children.length > 0 && (
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
        )}

        <h2 className="text-2xl font-medium text-primary-700 text-center">
          Введіть дані дитини
        </h2>
        
        <AvatarSelector
          setAvatarIndex={handleAvatarChange}
          avatarIndex={formData.avatarIndex}
        />

        <Input
          label="Ім'я"
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full"
        />

        <Input
          label="Прізвище"
          type="text"
          name="surname"
          value={formData.surname}
          onChange={(e) => handleChange('surname', e.target.value)}
          className="w-full"
        />

        <Select
          label="Стать"
          name="gender"
          selectedKeys={formData.gender ? [formData.gender] : []}
          onChange={(e) => handleChange('gender', e.target.value)}
          className="w-full"
        >
          <SelectItem key="">Виберіть стать</SelectItem>
          <SelectItem key="Хлопчик">Хлопчик</SelectItem>
          <SelectItem key="Дівчинка">Дівчинка</SelectItem>
        </Select>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-primary-500">Дата народження</label>
          <div className="flex gap-2">
          <Select
            label="День"
            selectedKeys={formData.birth.day ? [formData.birth.day] : []}
            onSelectionChange={(keys) => {
              const day = Array.from(keys)[0]?.toString() || '';
              handleChange('day', day);
            }}
            className="flex-1"
          >
            {days.map((day) => (
              <SelectItem key={day.toString()} textValue={day.toString()}>
                {day}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Місяць"
            selectedKeys={formData.birth.month ? [formData.birth.month] : []}
            onSelectionChange={(keys) => {
              const month = Array.from(keys)[0]?.toString() || '';
              handleChange('month', month);
            }}
            className="flex-1"
          >
            {months.map((month) => (
              <SelectItem key={month.toString()} textValue={month.toString()}>
                {month}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Рік"
            selectedKeys={formData.birth.year ? [formData.birth.year] : []}
            onSelectionChange={(keys) => {
              const year = Array.from(keys)[0]?.toString() || '';
              handleChange('year', year);
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
          className="w-full mt-2"
          onPress={handleSubmit}
          isDisabled={!isSaveValid}
          isLoading={isLoading}
        >
          Зберегти
        </Button>
      </div>
    </div>
  );
};
