import React, { useEffect, useState } from 'react';
import { vaccine, vaccinesSelect } from '../../Utils/kit';
import { parse } from 'date-fns';
import './CardVaccines.scss';
import { CardTitleTypes, Child, VaccineData } from '../../Shared/types/types';
import { VaccinesChart } from '../../Charts/VaccinesChart/VaccinesChart';
import { VaccinesMobile } from '../../Charts/VaccinesChartMobile/VaccinesMobile';
import { TitleCardBlock } from '../../Components/TitleCardBlock';
import { VaccineEditBlock } from '../../Components/VaccineEditBlock/VaccineEditBlock';
import { client } from '../../Utils/httpClient';
import { Loader } from '../../Components/Loader/Loader';

type Props = {
  years: string[];
  age?: number;
  child: Child;
};

export const CardVaccines: React.FC<Props> = ({ child }) => {
  const [data, setData] = useState<VaccineData[] | []>([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedVaccine, setSelectedVaccine] = useState(vaccinesSelect[0]);
  const [activeVaccine, setActiveVaccine] = useState<VaccineData | null>(null);
  const [activeBatton, setActiveButton] = useState(false);
  const [newParametrs, setNewParametrs] = useState<Omit<
    VaccineData,
    'id'
  > | null>(null);
  const [errowMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    client
      .get<VaccineData[]>(`children/${child.id}/vaccination`)
      .then((response) => {
        setData(response);
      })
      .catch((err) => setErrorMessage(err.message || 'Щось пішло не так'))
      .finally(() => setIsLoading(false));
  }, [child]);

  const formattedDate = selectedDate
    .toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\./g, '-');

  const saveData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    const newParametr: Omit<VaccineData, 'id'> = {
      type: selectedVaccine,
      date: formattedDate,
    };
    const clone = data.find(
      (d) => d.date === newParametr.date && d.type === newParametr.type
    );

    if (activeVaccine) {
      client
        .put<VaccineData>(
          `children/${child.id}/vaccination/${activeVaccine.id}`,
          newParametr
        )
        .then((response) => {
          const updatedData = data.map((d) =>
            d.id === response.id ? response : d
          );

          if (clone) {
            updatedData.filter((d) => d !== clone);
          }

          setData(updatedData.filter((d) => d !== clone));
        });
    } else {
      if (!clone) {
        client
          .post<VaccineData>(`children/${child.id}/vaccination`, newParametr)
          .then((response) => {
            setData((currentdata) => [...currentdata, response]);
          });
      }
    }

    setNewParametrs(newParametr);
    setActiveVaccine(null);
    setSelectedVaccine(vaccinesSelect[0]);
    setSelectedDate(new Date());
  };

  const removeData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const updatedData = data.filter((d) => d.id !== activeVaccine?.id);
    setData(updatedData);
    console.log('delete');
    client
      .delete(`children/${child.id}/vaccination/${activeVaccine?.id}`)
      .catch((err) => setErrorMessage(err.message || 'Щось пішло не так'));

    setActiveVaccine(null);
    setSelectedVaccine(vaccinesSelect[0]);
    setSelectedDate(new Date());
  };

  const HandleGraph = (v: VaccineData) => {
    if (v === activeVaccine) {
      setActiveButton(false);
      setActiveVaccine(null);
    } else {
      setActiveVaccine(v);
      setActiveButton(true);
      setSelectedVaccine(v.type);
      setNewParametrs(null);
      if (v.date) {
        const parsedDate = parse(v.date, 'dd-MM-yyyy', new Date());
        setSelectedDate(new Date(parsedDate));
      }
    }
  };

  const handleVaccineclick = (vaccineType: string) => {
    setSelectedVaccine(vaccineType);
    setSelectedDate(new Date());
    setActiveButton(true);
  };

  return (
    <div className="vaccine">
      {errowMessage && <div className="form__error">{errowMessage}</div>}
      <div className="vaccine__top">
        <TitleCardBlock image={vaccine} title={CardTitleTypes.vactination} />

        <div className="vaccine--chart-mobile">
          {isLoading ? (
            <Loader />
          ) : (
            <VaccinesMobile
              width={500}
              height={360}
              data={data}
              activeVaccine={activeVaccine}
              selectedVaccine={selectedVaccine}
              newVaccine={newParametrs}
              birth={child.birth}
              HandleGraph={HandleGraph}
              activeBatton={activeBatton}
              handleVaccineclick={handleVaccineclick}
            />
          )}
        </div>

        <VaccineEditBlock
          activeVaccine={activeVaccine}
          activeBatton={activeBatton}
          selectedVaccine={selectedVaccine}
          setStartDate={setSelectedDate}
          startDate={selectedDate}
          setActiveButton={setActiveButton}
          setSelectedVaccine={setSelectedVaccine}
          handleData={saveData}
          handleRemoveData={removeData}
        />
      </div>

      <div className="vaccine--chart">
        {isLoading ? (
          <Loader />
        ) : (
          <VaccinesChart
            width={800}
            height={360}
            data={data}
            activeVaccine={activeVaccine}
            selectedVaccine={selectedVaccine}
            newVaccine={newParametrs}
            birth={child.birth}
            HandleGraph={HandleGraph}
            activeBatton={activeBatton}
            handleVaccineclick={handleVaccineclick}
          />
        )}
      </div>
    </div>
  );
};
