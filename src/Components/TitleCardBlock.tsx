import { Data } from '../Shared/types/types';
import React from 'react';

type Props = {
  activeSlider?: boolean;
  currentData?: Data | undefined;
  value?: string;
  image: string;
  title: string;
};

export const TitleCardBlock: React.FC<Props> = React.memo(
  ({ image, title, value }) => {
    return (
      <div className="flex flex-row gap-2 items-start">
        <img
          src={image}
          alt="foot"
          className="w-8 object-contain items-start"
        />
        <div className='flex flex-row items-center gap-2'>
          <p className="text-xl font-medium text-gray-800">{title}</p>
          <p> {value ? value : "" }</p>
        </div>
      </div>
    );
  }
);
