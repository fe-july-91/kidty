import React from 'react';
import { Button, PressEvent } from '@heroui/react';
import { button } from '../Utils/Lang';

type Props = {
  handleData: (
    e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  setActiveSlider: (value: boolean) => void;
  activeSlider: boolean;
  sliderValue?: number ;
  deleteData?: (value: number) => void;
  dataId?:number
};

export const ButtonsCardBlock: React.FC<Props> = React.memo(
  ({ activeSlider, handleData, setActiveSlider, deleteData, dataId, sliderValue = 0 }) => {
    const handleEditClick = () => {
      setActiveSlider(true);
    };

    const handleCanсelClick = () => {
      setActiveSlider(false);
    };

    const handleApplyClick = (
      e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      setActiveSlider(false);
      handleData(e);
    };

    return (
      <>
        {!activeSlider ? (
          <div className='w-full flex flex-col md:flex-row justify-end'>
            <Button
              className="buttons-block opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              variant="solid"
              color="primary"
              onPress={handleEditClick}
            >
              {button.eddit.ua}
            </Button>
          </div>
        ) : (
            <div
              className="w-full md:min-w-[250px] flex flex-col md:flex-row md:justify-end md:items-end gap-2">
              {sliderValue !== 0 && (
                <Button
                  variant="solid"
                  color="secondary"
                  size='sm'
                  onPress={() => {
                    if (deleteData && dataId) {
                      deleteData(dataId)
                      setActiveSlider(false);                    
                      }
                  }}
                >
                  Видалити
                </Button>
              )}
                <Button
                className='text-white '
                variant="solid"
                color="success"
                size='sm'
                onPress={handleCanсelClick}
              >
                Скасувати
              </Button>
                
            <Button
              variant="solid"
              color="primary"
              onPress={handleApplyClick}
              size='sm'
            >
              Додати
              </Button>
          </div>
        )}
      </>
    );
  }
);
