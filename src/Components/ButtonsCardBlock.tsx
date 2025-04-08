import React from 'react';
import { Button, PressEvent } from '@heroui/react';
import { button } from '../Utils/Lang';
import { Tooltip } from "@heroui/react";

type Props = {
  handleData: (
    e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  setActiveSlider: (value: boolean) => void;
  activeSlider: boolean;
  deleteData?: (value: number) => void;
  dataId?:number
};

export const ButtonsCardBlock: React.FC<Props> = React.memo(
  ({ activeSlider, handleData, setActiveSlider, deleteData, dataId }) => {
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
            <div className="w-full flex flex-col md:flex-row md:flex-nowrap lg:flex-wrap 2xl:flex-nowrap md:justify-end md:items-end gap-2">
              <Button
                variant="solid"
                color="secondary"
                onPress={() => {
                  if (deleteData && dataId) {
                    deleteData(dataId)
                    setActiveSlider(false);                    
                    }
                }}
              >
                Видалити
              </Button>
                


            <Button
              variant="solid"
              color="primary"
              onPress={handleApplyClick}
            >
              Додати
              </Button>
              <Tooltip   className="font-sans" content="Скасувати">
                <Button
                className='text-white md:min-w-10'
                variant="solid"
                color="success"
                onPress={handleCanсelClick}
              >
                x
              </Button>
              </Tooltip>
          </div>
        )}
      </>
    );
  }
);
