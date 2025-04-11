import React, { useEffect, useState } from 'react';
import './CardEyes.scss';
import { CardTitleTypes, EyeResponce } from '../../Shared/types/types';
import { cardSize, eye, sliderRange } from '../../Utils/kit';
import { EyesChart } from '../../Charts/EyesChart/EyesChart';
import { TitleCardBlock } from '../../Components/TitleCardBlock';
import { SliderElement } from '../../Components/SliderElement';
import { ButtonsCardBlock } from '../../Components/ButtonsCardBlock';
import { client } from '../../Utils/httpClient';
import { PressEvent } from '@heroui/react';

type Props = {
  childId: number;
};

export const CardEyes: React.FC<Props> = ({ childId }) => {
  const initialData = {
    id: 0,
    childId: childId,
    leftEye: 0,
    rightEye: 0,
  };

  const [data, setData] = useState<EyeResponce>(initialData);
  const [errowMessage, setErrowmessage] = useState('');
  const [activeSlider, setActiveSlider] = useState(false);
  const [leftSliderValue, setLeftSliderValue] = useState({ x: data.leftEye });
  const [rightSliderValue, setRightSliderValue] = useState({
    x: data.rightEye,
  });

  useEffect(() => {
    client
      .get<EyeResponce>(`children/${childId}/eye`)
      .then((response) => {
        setData(response);
        setLeftSliderValue({ x: response.leftEye });
        setRightSliderValue({ x: response.rightEye });
      })
      .catch((err) => setErrowmessage(err.message || 'Щось пішло не так'));
  }, [childId]);

  const saveData = (
    e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    const newParametrs = {
      leftEye: leftSliderValue.x,
      rightEye: rightSliderValue.x,
    };

    client
      .put<EyeResponce>(`children/${childId}/eye`, newParametrs)
      .then((response) => {
        setData(response);
      })
      .catch((err) => setErrowmessage(err.message || 'Щось пішло не так'));
  };

  return (
    <div className="card flex felex-col gap-2 md:gap-0 p-6 items-center justify-center w-full">
      <div className="w-full flex flex-col justify-center md:flex-row md:justify-between md:items-top ">
        {errowMessage && <div className="form__error">{errowMessage}</div>}
        <TitleCardBlock image={eye} title={CardTitleTypes.eyes} />

        <div className="eyes__edit">
          <ButtonsCardBlock
            handleData={saveData}
            activeSlider={activeSlider}
            setActiveSlider={setActiveSlider}
          />
        </div>
      </div>

      <div className="w-full flex flex-col md:h-[55px] md:flex-row justify-between items-center">
        <div className="eyes__values">
          <p className="eyes__sign">Ліве око:</p>
          <p className="eyes__value">{data.leftEye}</p>
        </div>

        {activeSlider && (
          <div className="w-[60%]">
            <SliderElement
              setSliderValue={setLeftSliderValue}
              sliderValue={leftSliderValue}
              sliderWidth="100%"
              range={sliderRange.eye}
            />
          </div>
        )}
      </div>

      <div className="w-full flex flex-col md:h-[55px] md:flex-row justify-between items-center">
        <div className="eyes__values">
          <p className="eyes__sign">Праве око:</p>
          <p className="eyes__value">{data.rightEye}</p>
        </div>

        {activeSlider && (
          <div className="w-[60%]">
            <SliderElement
              setSliderValue={setRightSliderValue}
              sliderValue={rightSliderValue}
              sliderWidth="100%"
              range={sliderRange.eye}
            />
          </div>
        )}
      </div>

      <div className="eyes__mobile">
        <ButtonsCardBlock
          handleData={saveData}
          activeSlider={activeSlider}
          setActiveSlider={setActiveSlider}
        />
      </div>

      <div className="eyes__chart">
        <EyesChart
          width={cardSize.width}
          height={cardSize.height}
          data={data}
          sliderLeft={leftSliderValue.x}
          sliderRight={rightSliderValue.x}
        />
      </div>
    </div>
  );
};
