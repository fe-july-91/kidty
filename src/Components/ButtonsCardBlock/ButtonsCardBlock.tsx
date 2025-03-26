import React from 'react';
import './ButtonsCardBlock.scss';

type Props = {
  handleData: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      setActiveSlider(false);
      handleData(e);
    };

    return (
      <>
        {!activeSlider ? (
          <button
            className="button button--big edit-button"
            onClick={handleEditClick}
          >
            {' '}
            Редагувати
          </button>
        ) : (
          <div className="button--container">
            <button className="button" onClick={handleApplyClick}>
              {' '}
              Додати
            </button>

            <button
              className="button button--cansel"
              onClick={handleCanсelClick}
            >
              {' '}
              Cкасувати
            </button>
          </div>
        )}
      </>
    );
  }
);
