import { eye, foot, height, weight } from '../../Utils/kit';
import { CardTitleTypes } from '../types/types';

export const findCardImage = (name: string): string => {
  switch (name) {
    case CardTitleTypes.height:
      return height;
    case CardTitleTypes.weight:
      return weight;
    case CardTitleTypes.eyes:
      return eye;
    case CardTitleTypes.foot:
      return foot;
    default:
      return '';
  }
};
