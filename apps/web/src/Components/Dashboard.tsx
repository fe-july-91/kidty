import { Child } from '../Shared/types/types';
import { EyesCard } from '../Charts/Eyes/EyesCard';
import {
  calculateChildAge,
  generateYearArray,
} from '../Shared/hendlers/generateYearArray';
import { CardVaccines } from '../Cards/CardVaccines/CardVaccines';
import { useMemo } from 'react';
import { GrowthCard } from '../Charts/Growth/GrowthCard';

type Props = {
  child: Child;
};

export const Dashboard: React.FC<Props> = ({ child }) => {
  const years = useMemo(() => generateYearArray(child.birth), [child]);
  const age = useMemo(() => calculateChildAge(child.birth), [child]);

  const items = [
    {
      component: <GrowthCard key={`${child.id}-height`} child={child} metric="height" />,
    },
    {
      component: <GrowthCard key={`${child.id}-weight`} child={child} metric="weight" />,
    },
    {
      component: <GrowthCard key={`${child.id}-foot`} child={child} metric="foot" />,
    },
    { component: <EyesCard key={`${child.id}-eyes`} childId={child.id} /> },
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
