import { Maria, Yana } from '../Utils/kit';
import { Avatar } from '../Components/Avatar';
import { Support } from '../Components/Support';
import { useTranslation } from 'react-i18next';

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

type Person = {
  name: string;
  role: string;
  text: string;
  photo: string;
  linkedin: string;
};

const PersonCard: React.FC<Person> = ({ name, role, text, photo, linkedin }) => (
  <article className="flex flex-col gap-5 rounded-[22px] bg-white p-6 shadow-card md:p-8">
    <div className="flex items-center gap-4">
      <img
        src={photo}
        alt={name}
        className="size-20 shrink-0 rounded-full object-cover ring-4 ring-soft"
      />
      <div className="grid gap-1">
        <h3 className="text-xl font-semibold text-ink">{name}</h3>
        <p className="text-sm font-medium text-secondary-600">{role}</p>
      </div>
    </div>
    <p className="text-[16px] leading-relaxed text-ink-2">{text}</p>
    <a
      href={linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-medium text-primary hover:text-primary-700"
    >
      <LinkedInIcon />
      LinkedIn
    </a>
  </article>
);

export const RightsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-96px)] bg-canvas text-ink lg:min-h-[calc(100vh-120px)]">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 md:px-8 md:py-16">
        <header className="grid max-w-3xl gap-4">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-2">
            <span className="size-2 rounded-full bg-secondary-500" aria-hidden="true" />
            {t('about.eyebrow')}
          </span>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-[2.5rem]">
            {t('about.title')}
          </h1>
          <p className="text-lg leading-relaxed text-ink-2">{t('about.intro')}</p>
        </header>

        <section className="grid gap-5">
          <h2 className="text-xl font-semibold">{t('about.team')}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <PersonCard
              name={t('about.maria')}
              role={t('about.mariaRole')}
              text={t('about.mariaText')}
              photo={Maria}
              linkedin="https://www.linkedin.com/in/mariashmakova/"
            />
            <PersonCard
              name={t('about.yana')}
              role={t('about.yanaRole')}
              text={t('about.yanaText')}
              photo={Yana}
              linkedin="https://www.linkedin.com/in/yana-stepanova-syna/"
            />
          </div>
        </section>

        <section className="grid gap-6 rounded-[22px] bg-white p-6 shadow-card md:grid-cols-[1fr_1.4fr] md:gap-10 md:p-8">
          <div className="grid content-start gap-3">
            <div className="flex -space-x-3" aria-hidden="true">
              <Avatar index={1} className="size-14 rounded-full ring-4 ring-white" />
              <Avatar index={3} className="size-14 rounded-full ring-4 ring-white" />
            </div>
            <h2 className="text-xl font-semibold">{t('about.contactTitle')}</h2>
            <p className="text-ink-2">{t('about.contact')}</p>
          </div>
          <Support tone="light" />
        </section>
      </div>
    </div>
  );
};
