import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import './CardEyes.scss';
import { CardTitleTypes } from '../../Shared/types/types';
import { cardSize, eye, sliderRange } from '../../Utils/kit';
import { EyesChart } from '../../Charts/EyesChart/EyesChart';
import { TitleCardBlock } from '../../Components/TitleCardBlock';
import { SliderElement } from '../../Components/SliderElement/SliderElement';
import { ButtonsCardBlock } from '../../Components/ButtonsCardBlock';
import { client } from '../../Utils/httpClient';
import { PressEvent } from '@heroui/react';

type Props = {
  childId: number;
};

type EyeResponce = {
  id: number;
  childId: number;
  leftEye: number;
  rightEye: number;
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
    <div className="eyes">
      <div className="eyes__top">
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

      <div className="eyes__eye">
        <div className="eyes__values">
          <p className="eyes__sign">Ліве око:</p>
          <p
            className={cn('eyes__value', {
              'eyes__value--activeLeft': activeSlider,
            })}
          >
            {activeSlider ? leftSliderValue.x : data.leftEye}
          </p>
        </div>

        {activeSlider && (
          <SliderElement
            setSliderValue={setLeftSliderValue}
            sliderValue={leftSliderValue}
            sliderWidth="50%"
            range={sliderRange.eye}
          />
        )}
      </div>

      <div className="eyes__eye">
        <div className="eyes__values">
          <p className="eyes__sign">Праве око:</p>
          <p
            className={cn('eyes__value', {
              'eyes__value--activeRight': activeSlider,
            })}
          >
            {activeSlider ? rightSliderValue.x : data.rightEye}
          </p>
        </div>

        {activeSlider && (
          <SliderElement
            setSliderValue={setRightSliderValue}
            sliderValue={rightSliderValue}
            sliderWidth="50%"
            range={sliderRange.eye}
          />
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
