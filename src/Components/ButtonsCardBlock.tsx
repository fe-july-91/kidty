import React from 'react';
import { Button, PressEvent } from '@heroui/react';
import { button } from '../Utils/Lang';

type Props = {
  handleData: (
    e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  setActiveSlider: (value: boolean) => void;
  activeSlider: boolean;
};

export const ButtonsCardBlock: React.FC<Props> = React.memo(
  ({ activeSlider, handleData, setActiveSlider }) => {
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
            type="submit"
            onPress={handleEditClick}
          >
            {button.eddit.ua}
          </Button>
        ) : (
          <div className="button--container">
            <Button
              variant="solid"
              color="secondary"
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
