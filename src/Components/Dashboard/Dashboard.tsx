import { CardTitleTypes, Child } from '../../Shared/types/types';
import './Dashboard.scss';
import { CardEyes } from '../../Cards/CardEyes/CardEyes';
import {
  calculateChildAge,
  generateYearArray,
} from '../../Shared/hendlers/generateYearArray';
import { CardVaccines } from '../../Cards/CardVaccines/CardVaccines';
import { useMemo } from 'react';
import { CardItem } from '../../Cards/CardItem/CardItem';

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
    <div className="dashboard">
      {items.map((item, index) => (
        <div
          key={index}
          className={`dashboard__item ${item.big ? 'dashboard__item-big' : ''}`}
          style={{ animationDelay: item.delay }}
        >
          {item.component}
        </div>
      ))}
    </div>
  );
};
