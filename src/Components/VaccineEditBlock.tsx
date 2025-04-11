import { VaccineData } from '../Shared/types/types';
import { vaccinesSelect } from '../Utils/kit';
import { Button, PressEvent, Select, SelectItem, Tooltip } from '@heroui/react';

type Props = {
  activeVaccine: VaccineData | null;
  activeBatton: boolean;
  selectedVaccine: string;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  startDate: Date;
  setActiveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedVaccine: React.Dispatch<React.SetStateAction<string>>;
  handleData: (
    e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleRemoveData: (
    e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  setActiveVaccine: (value: null | VaccineData) => void;
};

export const VaccineEditBlock: React.FC<Props> = ({
  activeVaccine,
  activeBatton,
  selectedVaccine = vaccinesSelect[0],
  setStartDate,
  startDate,
  setActiveButton,
  setSelectedVaccine,
  handleData,
  handleRemoveData,
  setActiveVaccine,
}) => {
  const handleEditClick = (
    e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setActiveButton(true);
  };

  const handleApplyClick = (
    e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    handleData(e);
    setActiveButton(false);
  };

  const handleRemoveClick = (
    e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (activeVaccine) {
      handleRemoveData(e);
    }
    setActiveButton(false);
  };

  const handleVaccineChange = (keys: 'all' | Set<React.Key>) => {
    const selected =
      keys instanceof Set ? (Array.from(keys)[0] as string) : vaccinesSelect[0];
    setSelectedVaccine(selected || vaccinesSelect[0]);
  };

  return (
    <div className="w-full flex flex-col items-start justify-start md:flex md:items-end">
      {!activeBatton ? (
        <div className="w-full flex flex-col md:flex-row md:items-end md:justify-end">
          <Button variant="solid" color="primary" onPress={handleEditClick}>
            Редагувати
          </Button>
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col gap-4  md:flex-row my-4 md:my-0 md:justify-end md:items-start md:text-right ">
            {!activeVaccine ? (
              <Select
                className="md:w-[250px] -translate-y-2"
                color="secondary"
                labelPlacement="outside-left"
                label="Щеплення"
                selectedKeys={new Set([selectedVaccine || vaccinesSelect[0]])}
                onSelectionChange={handleVaccineChange}
              >
                {vaccinesSelect.map((vaccine) => (
                  <SelectItem key={vaccine}>{vaccine}</SelectItem>
                ))}
              </Select>
            ) : (
              <span className="text-secondary text-3xl md:text-xl md:h-10">
                {selectedVaccine}
              </span>
            )}
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]} // yyyy-mm-dd
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setStartDate(newDate);
              }}
            />
          </div>
          <div className="w-full flex flex-col md:flex-row md:flex-nowrap lg:flex-wrap 2xl:flex-nowrap md:justify-end md:items-end gap-2">
            {activeVaccine && (
              <Button
                variant="solid"
                color="secondary"
                type="submit"
                onPress={handleRemoveClick}
              >
                Видалити
              </Button>
            )}

            <Button variant="solid" color="primary" onPress={handleApplyClick}>
              {activeVaccine ? `Зминити` : `Додати`}
            </Button>

            <Tooltip className="font-sans" content="Скасувати">
              <Button
                className="text-white md:min-w-10"
                variant="solid"
                color="success"
                onPress={() => {
                  setSelectedVaccine(vaccinesSelect[0]);
                  setActiveButton(false);
                  setActiveVaccine(null);
                  setStartDate(new Date());
                }}
              >
                x
              </Button>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  );
};
