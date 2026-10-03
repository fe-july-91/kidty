import Slider from 'react-input-slider';
import React from 'react';
import { setUnits } from '../Shared/servises/setUnits';
import { CardTitleTypes } from '../Shared/types/types';

type Props = {
  setSliderValue: React.Dispatch<React.SetStateAction<{ x: number }>>;
  sliderValue: { x: number };
  sliderWidth?: string;
  range: { min: number; max: number };
  title?: string;
};

export const SliderElement: React.FC<Props> = React.memo(
  ({
    setSliderValue,
    sliderValue,
    sliderWidth = '100%',
    range,
    title = '',
  }) => {
    const units = setUnits(title);
    return (
      <div className="w-full">
        {title !== CardTitleTypes.eyes &&
          title !== CardTitleTypes.vactination && (
            <p className="text-xl font-medium text-secondary ">
              {sliderValue.x} {units}
            </p>
          )}
        <Slider
          axis="x"
          xmin={range.min}
          xmax={range.max}
          x={sliderValue.x}
          onChange={({ x }) => setSliderValue((state) => ({ ...state, x }))}
          styles={{
            track: {
              backgroundColor: '#ddd',
              marginTop: '11px',
              height: '8px',
              width: sliderWidth,
              borderRadius: '4px',
            },
            active: {
              backgroundColor: '#FF5C9D',
            },
            thumb: {
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#FF5C9D',
              boxShadow: '0px 0px 4px rgba(0,0,0,0.2)',
            },
          }}
        />
      </div>
    );
  }
);
