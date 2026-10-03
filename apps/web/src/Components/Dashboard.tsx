import { Child } from '../Shared/types/types';
import { GrowthCard } from '../Charts/Growth/GrowthCard';
import { EyesCard } from '../Charts/Eyes/EyesCard';
import { VaccinesCard } from '../Charts/Vaccines/VaccinesCard';

type Props = {
  child: Child;
};

const card = 'min-w-0 rounded-[22px] bg-white shadow-card';

export const Dashboard: React.FC<Props> = ({ child }) => (
  <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
    {(['height', 'weight', 'foot'] as const).map((metric) => (
      <section key={`${child.id}-${metric}`} className={card}>
        <GrowthCard child={child} metric={metric} />
      </section>
    ))}
    <section key={`${child.id}-eyes`} className={card}>
      <EyesCard childId={child.id} />
    </section>
    <section key={`${child.id}-vaccines`} className={`${card} lg:col-span-2`}>
      <VaccinesCard child={child} />
    </section>
  </div>
);
