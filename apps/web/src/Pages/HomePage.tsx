import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@heroui/react';
import {
  avatars,
  eye,
  foot,
  height,
  notebook,
  phone,
  vaccination,
  vaccine,
  weight,
  weightCard,
} from '../Utils/kit';
import { Support } from '../Components/Support';
import { Reveal } from '../Components/Reveal';
import { Avatar } from '../Components/Avatar';
import { useTranslation } from 'react-i18next';


const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean }> = ({
  children,
  light = false,
}) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
      light
        ? 'bg-white/10 text-primary-100 ring-1 ring-white/15'
        : 'bg-white text-primary-700 ring-1 ring-primary-200/70'
    }`}
  >
    <span className="size-1.5 rounded-full bg-secondary-500" />
    {children}
  </span>
);

const SectionHeading: React.FC<{
  eyebrow: string;
  title: string;
  text?: string;
}> = ({ eyebrow, title, text }) => (
  <Reveal className="mx-auto max-w-2xl text-center">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="mt-4 text-3xl md:text-[2.75rem] md:leading-[1.15] font-bold tracking-tight text-primary-900">
      {title}
    </h2>
    {text && <p className="mt-4 text-lg text-gray-500">{text}</p>}
  </Reveal>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`h-full rounded-3xl bg-white p-6 md:p-8 ring-1 ring-primary-900/5 shadow-[0_1px_2px_rgba(19,24,106,0.04),0_8px_24px_-12px_rgba(19,24,106,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(19,24,106,0.04),0_20px_40px_-16px_rgba(19,24,106,0.22)] ${className}`}
  >
    {children}
  </div>
);

const IconTile: React.FC<{ src: string; className?: string }> = ({
  src,
  className = 'bg-primary-100',
}) => (
  <span
    className={`inline-flex size-12 items-center justify-center rounded-2xl ${className}`}
  >
    <img src={src} alt="" className="size-7" />
  </span>
);

const AvatarStack: React.FC<{ count?: number; size?: string }> = ({
  count = 5,
  size = 'size-10',
}) => (
  <div className="flex shrink-0 -space-x-3">
    {avatars.slice(0, count).map((src: string, i: number) => (
      <Avatar
        key={src}
        index={i}
        className={`${size} rounded-full ring-2 ring-white`}
      />
    ))}
  </div>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="size-5 shrink-0">
    <path
      fillRule="evenodd"
      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const stepItems = t('home.steps.items', { returnObjects: true }) as { title: string; text: string }[];
  const mobileItems = t('home.mobile.items', { returnObjects: true }) as string[];

  return (
    <div className="bg-[#F7F7FB] text-primary-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -left-32 size-[520px] rounded-full bg-primary-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-[-10%] size-[520px] rounded-full bg-secondary-100/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 md:px-8 md:pt-24 md:pb-28 lg:grid-cols-[1fr_1.1fr]">
          <div className="text-center lg:text-left">
            <div className="opacity-0 animate-floatUp">
              <Eyebrow>{t('home.hero.eyebrow')}</Eyebrow>
            </div>

            <h1
              className="mt-6 text-4xl sm:text-5xl lg:text-[3.6rem] font-bold leading-[1.08] tracking-tight opacity-0 animate-floatUp"
              style={{ animationDelay: '100ms' }}
            >
              {t('home.hero.title')}{' '}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                {t('home.hero.titleAccent')}
              </span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-500 lg:mx-0 opacity-0 animate-floatUp"
              style={{ animationDelay: '200ms' }}
            >
              {t('home.hero.text')}
            </p>

            <div
              className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start opacity-0 animate-floatUp"
              style={{ animationDelay: '300ms' }}
            >
              <Button
                size="lg"
                color="primary"
                radius="full"
                className="px-8 font-medium shadow-lg shadow-primary-500/30"
                onPress={() => navigate('signup')}
              >
                {t('home.hero.primary')}
              </Button>
              <Button
                size="lg"
                variant="bordered"
                radius="full"
                className="border-primary-200 bg-white/70 px-8 font-medium text-primary-800"
                onPress={() => navigate('account')}
              >
                {t('home.hero.secondary')}
              </Button>
            </div>

            <div
              className="mt-10 flex items-center justify-center gap-4 lg:justify-start opacity-0 animate-floatUp"
              style={{ animationDelay: '400ms' }}
            >
              <AvatarStack />
              <span className="text-sm text-gray-500">{t('home.hero.note')}</span>
            </div>
          </div>

          <div
            className="relative opacity-0 animate-fadeIn"
            style={{ animationDelay: '250ms' }}
          >
            <div className="absolute inset-x-6 inset-y-10 rounded-[2.5rem] bg-gradient-to-br from-primary-200 via-primary-100 to-secondary-100" />
            <img
              src={notebook}
              alt={t('home.hero.laptopAlt')}
              className="relative w-full"
            />

            <div className="absolute -left-2 bottom-10 hidden items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-xl ring-1 ring-primary-900/5 backdrop-blur sm:flex motion-safe:animate-floatY">
              <IconTile src={height} className="bg-success-100 size-10" />
              <div>
                <div className="text-xs text-gray-500">{t('home.features.growthTitle')}</div>
                <div className="font-semibold">{t('home.features.growthChip')}</div>
              </div>
            </div>

            <div className="absolute -right-2 top-6 hidden items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-xl ring-1 ring-primary-900/5 backdrop-blur sm:flex motion-safe:animate-floatY"
              style={{ animationDelay: '-3s' }}
            >
              <IconTile src={vaccine} className="bg-secondary-100 size-10" />
              <div className="font-semibold">{t('home.features.vaccinesTitle')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow={t('home.features.eyebrow')}
          title={t('home.features.title')}
          text={t('home.features.text')}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-6">
          <Reveal className="md:col-span-4 md:row-span-2">
            <Card className="flex flex-col overflow-hidden">
              <div className="flex gap-2">
                <IconTile src={height} />
                <IconTile src={weight} className="bg-success-100" />
                <IconTile src={foot} className="bg-secondary-100" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">{t('home.features.growthTitle')}</h3>
              <p className="mt-2 max-w-md text-gray-500">{t('home.features.growthText')}</p>
              <div className="-mx-6 -mb-6 mt-6 flex flex-1 items-end justify-center bg-gradient-to-b from-transparent to-primary-100/60 px-6 md:-mx-8 md:-mb-8">
                <img
                  src={weightCard}
                  alt=""
                  className="w-full max-w-lg translate-y-[8%]"
                />
              </div>
            </Card>
          </Reveal>

          <Reveal className="md:col-span-2" delay={100}>
            <Card>
              <IconTile src={eye} className="bg-info-100" />
              <h3 className="mt-6 text-xl font-semibold">{t('home.features.eyesTitle')}</h3>
              <p className="mt-2 text-gray-500">{t('home.features.eyesText')}</p>
            </Card>
          </Reveal>

          <Reveal className="md:col-span-2" delay={200}>
            <Card>
              <AvatarStack count={4} size="size-12" />
              <h3 className="mt-6 text-xl font-semibold">{t('home.features.familyTitle')}</h3>
              <p className="mt-2 text-gray-500">{t('home.features.familyText')}</p>
            </Card>
          </Reveal>

          <Reveal className="md:col-span-6">
            <Card className="grid items-center gap-8 overflow-hidden lg:grid-cols-[1fr_1.6fr]">
              <div>
                <IconTile src={vaccine} className="bg-secondary-100" />
                <h3 className="mt-6 text-2xl font-semibold">{t('home.features.vaccinesTitle')}</h3>
                <p className="mt-2 text-gray-500">{t('home.features.vaccinesText')}</p>
              </div>
              <img
                src={vaccination}
                alt=""
                className="w-full"
              />
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Steps */}
      <section className="border-y border-primary-900/5 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <SectionHeading eyebrow={t('home.steps.eyebrow')} title={t('home.steps.title')} />

          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            <div className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-gradient-to-r from-primary-200 via-secondary-200 to-primary-200 md:block" />
            {stepItems.map((step, i) => (
              <Reveal key={step.title} delay={i * 120}>
                <li className="relative flex flex-col items-center text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-white text-lg font-semibold text-primary-600 ring-1 ring-primary-200 shadow-[0_0_0_8px_white]">
                    0{i + 1}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-gray-500">{step.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-14 flex justify-center">
            <Button
              size="lg"
              color="primary"
              radius="full"
              className="px-8 font-medium shadow-lg shadow-primary-500/30"
              onPress={() => navigate('signup')}
            >
              {t('home.hero.primary')}
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Mobile */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="relative grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-primary-800 px-6 pt-12 md:px-14 lg:grid-cols-2 lg:pt-16">
            <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary-500/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-10 size-80 rounded-full bg-secondary-500/20 blur-3xl" />

            <div className="relative">
              <Eyebrow light>{t('home.mobile.eyebrow')}</Eyebrow>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight tracking-tight text-white">
                {t('home.mobile.title')}
              </h2>
              <ul className="mt-8 space-y-4">
                {mobileItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-primary-100">
                    <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-info-300">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <img
              src={phone}
              alt={t('home.mobile.phoneAlt')}
              className="relative mx-auto -mb-28 w-[260px] sm:w-[300px] lg:-mb-36 lg:w-[320px]"
            />
          </div>
        </Reveal>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-8 md:pb-32">
        <Reveal>
          <div className="grid gap-10 rounded-[2.5rem] bg-gradient-to-br from-primary-900 to-primary-700 p-6 sm:p-10 md:p-14 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <Eyebrow light>{t('home.contact.eyebrow')}</Eyebrow>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight tracking-tight text-white">
                {t('home.contact.title')}
              </h2>
              <p className="mt-4 max-w-sm text-lg text-primary-200">{t('home.contact.text')}</p>
            </div>
            <Support />
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default HomePage;
