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
      delay: '0s',
    },
    {
      component: (
        <CardItem
          childId={child.id}
          years={years}
          cardType={CardTitleTypes.weight}
        />
      ),
      delay: '0.2s',
    },
    {
      component: (
        <CardItem
          childId={child.id}
          years={years}
          cardType={CardTitleTypes.foot}
        />
      ),
      delay: '0.4s',
    },
    { component: <CardEyes childId={child.id} />, delay: '0.6s' },
    {
      component: <CardVaccines years={years} age={age} child={child} />,
      delay: '0.8s',
      big: true,
    },
  ];

  return (
    <div className="w-full px-4 sm:pl-6 md:pl-8">
      <div className="w-full flex flex-wrap gap-5 pb-8">
        {items.map((item, index) => (
          <div
            key={index}
            className={`
              relative bg-white rounded-[25px] opacity-0 hover:shadow-lg animate-floatUp
              group ${
                item.big
                  ? 'w-full md:w-full xl:w-[calc(66.666%-20px)]'
                  : 'w-full lg:w-[calc(50%-20px)] xl:w-[calc(33.333%-20px)]'
              }
            `}
            style={{ animationDelay: item.delay }}
          >
            <div className="relative h-full">
              {item.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
