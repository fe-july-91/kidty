import { VaccineData } from '../../Shared/types/types';
import { vaccinesSelect } from '../../Utils/kit';

type Props = {
  activeVaccine: VaccineData | null;
  activeBatton: boolean;
  selectedVaccine: string;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  startDate: Date;
  setActiveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedVaccine: React.Dispatch<React.SetStateAction<string>>;
  handleData: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleRemoveData: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

export const VaccineEditBlock: React.FC<Props> = ({
  activeVaccine,
  activeBatton,
  selectedVaccine,
  setStartDate,
  startDate,
  setActiveButton,
  setSelectedVaccine,
  handleData,
  handleRemoveData,
}) => {
  const handleEditClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setActiveButton(true);
  };

  const handleApplyClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    handleData(e);
    setActiveButton(false);
  };

  const handleRemoveClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (activeVaccine) {
      handleRemoveData(e);
    }
    setActiveButton(false);
  };

  const handleVaccineChenge = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVaccine(event.target.value);
  };

  return (
    <div className="vaccine__top--rightBlock">
      {!activeVaccine && !activeBatton ? (
        <button
          className="vaccine__top__button edit-button"
          onClick={handleEditClick}
        >
          Редагувати
        </button>
      ) : (
        <>
          <div className="vaccine__top--picker">
            {!activeVaccine ? (
              <select
                className="vaccine__top--selectVaccine"
                value={selectedVaccine}
                onChange={handleVaccineChenge}
              >
                {vaccinesSelect.map((vaccine) => (
                  <option key={vaccine} value={vaccine}>
                    {vaccine}
                  </option>
                ))}
              </select>
            ) : (
              <span className="vaccine__top--type">{selectedVaccine}</span>
            )}

            <input
              type="date"
              className="vaccine__top--selectDate"
              value={startDate.toISOString().split('T')[0]} // yyyy-mm-dd
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setStartDate(newDate);
              }}
            />
          </div>

          <div className="vaccine__top__button__container">
            <button
              className="vaccine__top__button vaccine__top__button--add"
              onClick={handleApplyClick}
            >
              {activeVaccine ? `Зберегти` : `Додати`}
            </button>
            <button
              className="vaccine__top__button vaccine__top__button--cancel"
              onClick={handleRemoveClick}
            >
              {' '}
              {activeVaccine ? `Видалити` : `Скасувати`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
