import React from 'react';
import { Slider } from '@heroui/react';
import { setUnits } from '../Shared/servises/setUnits';
import { CardTitleTypes } from '../Shared/types/types';

type Props = {
  setSliderValue: React.Dispatch<React.SetStateAction<{ x: number }>>;
  sliderValue: { x: number };
  sliderWidth?: string;
  range: { min: number; max: number };
  step?: number;
  title?: string;
};

export const SliderElement: React.FC<Props> = React.memo(
  ({
    setSliderValue,
    sliderValue,
    sliderWidth = '100%',
    range,
    step = 1,
    title = '',
  }) => {
    const units = setUnits(title);

    return (
      <div className="w-full" style={{ maxWidth: sliderWidth }}>
        {title !== CardTitleTypes.eyes &&
          title !== CardTitleTypes.vactination && (
            <p className="text-xl font-medium text-secondary">
              {sliderValue.x} {units}
            </p>
          )}
        <Slider
          aria-label={title || 'Значення'}
          color="secondary"
          size="sm"
          minValue={range.min}
          maxValue={range.max}
          step={step}
          value={sliderValue.x}
          onChange={(value) => {
            const x = Array.isArray(value) ? value[0] : value;
            setSliderValue((state) => ({ ...state, x }));
          }}
          className="py-2"
        />
      </div>
    );
  }
);
