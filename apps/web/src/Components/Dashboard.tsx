import { CardTitleTypes, Child } from '../Shared/types/types';
import { CardEyes } from '../Cards/CardEyes/CardEyes';
import {
  calculateChildAge,
  generateYearArray,
} from '../Shared/hendlers/generateYearArray';
import { CardVaccines } from '../Cards/CardVaccines/CardVaccines';
import { useMemo } from 'react';
import { CardItem } from '../Cards/CardItem/CardItem';

type Props = {
  child: Child;
};

export const Dashboard: React.FC<Props> = ({ child }) => {
  const years = useMemo(() => generateYearArray(child.birth), [child]);
  const age = useMemo(() => calculateChildAge(child.birth), [child]);

  const items = [
    {
      component: (
        <CardItem
          childId={child.id}
          years={years}
          cardType={CardTitleTypes.height}
        />
      ),
    },
    {
      component: (
        <CardItem
          childId={child.id}
          years={years}
          cardType={CardTitleTypes.weight}
        />
      ),
    },
    {
      component: (
        <CardItem
          childId={child.id}
          years={years}
          cardType={CardTitleTypes.foot}
        />
      ),
    },
    { component: <CardEyes childId={child.id} /> },
    {
      component: <CardVaccines years={years} age={age} child={child} />,
      big: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-5">
      {items.map((item, index) => (
        <div
          key={index}
          className={`group relative min-w-0 rounded-[22px] bg-white shadow-card ${
            item.big ? 'lg:col-span-2' : ''
          }`}
        >
          {item.component}
        </div>
      ))}
    </div>
  );
};
