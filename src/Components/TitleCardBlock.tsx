import { Data } from '../Shared/types/types';
import React from 'react';

type Props = {
  activeSlider?: boolean;
  currentData?: Data | undefined;
  value?: string;
  image: string;
  title: string;
  unit?: string;
};

export const TitleCardBlock: React.FC<Props> = React.memo(
  ({ image, title, value, unit }) => {
    return (
      <div className="flex flex-row gap-2 items-start">
        <img
          src={image}
          alt="foot"
          className="w-6 object-contain items-start"
        />
        <div className='flex flex-row items-center justify-center gap-2 text-gray-800'>
          <p className="text-lg font-medium">{title}</p>
          <p className='text-md'> {value ? value : ""} {unit}</p>
        </div>
      </div>
    );
  }
);
