import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { BarChart } from '../../Charts/HeightBarChart/BarChart';
import './CardItem.scss';
import { cardSize, months, sliderRange } from '../../Utils/kit';
import { findTodayMonth } from '../../Shared/servises/findTodayMonth';
import { SliderElement } from '../../Components/SliderElement/SliderElement';
import { SelectionCardBlock } from '../../Components/SelectionCardBlock/SelectionCardBlock';
import { TitleCardBlock } from '../../Components/CardTitleBlock/TitleCardBlock';
import { ButtonsCardBlock } from '../../Components/ButtonsCardBlock/ButtonsCardBlock';
import { reduser } from '../../Shared/servises/reduser';
import { CardTitleTypes, Data } from '../../Shared/types/types';
import { findCardImage } from '../../Shared/servises/findCardImage';
import { WeightLineChart } from '../../Charts/WeightLineChart/WeightLineChart';
import { FootChart } from '../../Charts/FootLineChart/FootChart';
import { client } from '../../Utils/httpClient';
import { findKeyByValue } from '../../Shared/hendlers/findKeyByValue';

type Props = {
  years: string[];
  cardType: string;
  childId: number;
};

export const CardItem: React.FC<Props> = ({ years, cardType, childId }) => {
  const [data, setData] = useState<Data[] | []>([]);
  const [errowMessage, setErrorMessage] = useState('');
  const [activeSlider, setActiveSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState({ x: 0 });
  const typeOfValue = findKeyByValue(
    CardTitleTypes,
    cardType
  ) as keyof typeof sliderRange;

  useEffect(() => {
    client
      .get<Data[]>(`children/${childId}/${typeOfValue}`)
      .then((response) => {
        setData(response);
        setSliderValue({ x: response[response.length - 1].value });
      })
      .catch((err) => setErrorMessage(err.message || 'Щось пішло не так'))
      .finally(() => {
        dispatch({ type: 'selectedMonth', payload: months[findTodayMonth()] });
      });
  }, [cardType, childId, typeOfValue, years]);

  const initialState = {
    selectedYear: years[0],
    selectedMonth: months[findTodayMonth()],
    data: data,
  };

  const [state, dispatch] = useReducer(reduser, initialState);

  const filteredData = useMemo(() => {
    return state.data.filter((d) => +d.year === +state.selectedYear);
  }, [state.selectedYear, state.data]);

  const currentData = useMemo(() => {
    return filteredData.find((d) => d.month === state.selectedMonth);
  }, [state.selectedMonth, filteredData]);

  const saveData = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (e) {
        e.preventDefault();
      }

      const newParametr: Omit<Data, 'id'> = {
        year: state.selectedYear,
        month: state.selectedMonth,
        value: sliderValue.x,
      };

      if (currentData) {
        client
          .put<Data>(
            `children/${childId}/${typeOfValue}/${currentData.id}`,
            newParametr
          )
          .then((response) => {
            const updatedData = state.data.map((d) =>
              d.id === response.id ? response : d
            );
            dispatch({ type: 'data', payload: updatedData });
          });
      } else {
        client
          .post<Data>(`children/${childId}/${typeOfValue}`, newParametr)
          .then((response) => {
            dispatch({ type: 'data', payload: [...state.data, response] });
          });
      }
      setSliderValue({ x: 0 });
    },
    [
      sliderValue.x,
      currentData,
      state.data,
      state.selectedMonth,
      state.selectedYear,
      childId,
      typeOfValue,
    ]
  );

  useEffect(() => {
    dispatch({ type: 'data', payload: data });
  }, [data]);

  const HandleGraph = useCallback(
    (d: Data) => {
      setActiveSlider(true);
      dispatch({ type: 'selectedMonth', payload: d.month });
      if (d.value) {
        setSliderValue({ x: d.value });
      } else {
        setSliderValue({ x: 0 });
      }
    },
    [setActiveSlider, setSliderValue]
  );

  return (
    <>
      <div className="card">
        <div className="card__top">
          <div className="card__leftBlock">
            <TitleCardBlock
              activeSlider={activeSlider}
              currentData={currentData}
              sliderValue={sliderValue}
              image={findCardImage(cardType)}
              title={cardType}
            />

            <SelectionCardBlock
              selectedYear={state.selectedYear}
              years={years}
              selectedMonth={state.selectedMonth}
              setSelectedYear={(year) =>
                dispatch({ type: 'selectedYear', payload: year })
              }
              setSelectedMonth={(month) =>
                dispatch({ type: 'selectedMonth', payload: month })
              }
              setActiveSlider={setActiveSlider}
            />
          </div>

          <div className="card__rightBlock">
            {activeSlider && (
              <SliderElement
                setSliderValue={(value) => setSliderValue(value)}
                sliderValue={sliderValue}
                range={sliderRange[typeOfValue]}
              />
            )}

            <ButtonsCardBlock
              handleData={saveData}
              activeSlider={activeSlider}
              setActiveSlider={setActiveSlider}
            />
          </div>
        </div>

        <div className="card__chart">
          {cardType === CardTitleTypes.height && (
            <BarChart
              width={cardSize.width}
              height={cardSize.height}
              data={filteredData}
              selectedMonth={state.selectedMonth}
              slider={sliderValue.x}
              HandleGraph={HandleGraph}
            />
          )}

          {cardType === CardTitleTypes.weight && (
            <WeightLineChart
              width={cardSize.width}
              height={cardSize.height}
              data={filteredData}
              selectedMonth={state.selectedMonth}
              slider={sliderValue.x}
              HandleGraph={HandleGraph}
            />
          )}

          {cardType === CardTitleTypes.foot && (
            <FootChart
              width={cardSize.width}
              height={cardSize.height}
              data={filteredData}
              selectedMonth={state.selectedMonth}
              slider={sliderValue.x}
              HandleGraph={HandleGraph}
            />
          )}
        </div>
      </div>

      {errowMessage && <div className="form__error">{errowMessage}</div>}
    </>
  );
};
