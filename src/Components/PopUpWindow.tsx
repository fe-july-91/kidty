import React from 'react';
import { Button } from '@heroui/react';

type Props = {
  message: string;
  handleApplyClick: () => void;
  handleCanсelClick: (value: boolean) => void;
  isLoading?: boolean;
};

export const PopUpWindow: React.FC<Props> = ({
  message,
  handleApplyClick,
  handleCanсelClick,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col gap-6 w-[375px] mx-auto bg-white rounded-3xl p-8">
      <header className="text-xl text-primary-700 font-semibold">{message}</header>
      <div className='flex flex-row gap-4'>
      <Button
        color="secondary"
        className="text-white rounded-xl my-2 w-24"
        onPress={() => handleApplyClick()}
      >
        Так
      </Button>
      <Button
        color="primary"
          className="text-white rounded-xl my-2 w-24"
          onPress={() => handleCanсelClick(false)}
      >
        Ні
      </Button>
    
      </div>
    </div>
  );
};
