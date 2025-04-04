import React from 'react';
import { Button, PressEvent } from '@heroui/react';
import { button } from '../Utils/Lang';

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
          <Button
            className="buttons-block opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            variant="solid"
            color="primary"
            onPress={handleEditClick}
          >
            {button.eddit.ua}
          </Button>
        ) : (
            <div className="w-full flex flex-col md:flex-row gap-2">
                <Button
                variant="solid"
                color="secondary"
                type="submit"
                onPress={() => {
                  if (deleteData && dataId) {
                    deleteData(dataId)
                    setActiveSlider(false);                    
                    }
                }}
              >
                X
              </Button>
                
              <Button
              className='text-white'
              variant="solid"
              color="success"
              type="submit"
              onPress={handleCanсelClick}
            >
              Cкасувати
            </Button>

            <Button
              variant="solid"
              color="primary"
              type="submit"
              onPress={handleApplyClick}
            >
              Додати
            </Button>
          </div>
        )}
      </>
    );
  }
);
