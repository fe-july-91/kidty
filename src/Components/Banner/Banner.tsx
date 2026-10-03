import React, { useEffect, useState } from 'react';
import { avatars } from '../../Utils/kit';

const ROWS = 3;
const CONFETTI_COUNT = 60;
const CONFETTI_COLORS = [
  '#FF3232',
  '#32FF32',
  '#3232FF',
  '#FFFF32',
  '#FF32FF',
  '#32FFFF',
];
const CONFETTI_SHAPES = ['rounded-full', 'rounded-none', 'triangle'];

const getColumns = (width: number) => {
  if (width < 480) return 2;
  if (width < 768) return 4;
  if (width < 1040) return 5;
  if (width < 1280) return 6;
  if (width < 1440) return 7;
  return 9;
};

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const randomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)];

const createConfetti = () =>
  Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    left: random(0, 100),
    size: random(8, 15),
    duration: random(4, 12),
    delay: -random(0, 12),
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
  }));

export const Banner: React.FC = () => {
  const [columns, setColumns] = useState(() => getColumns(window.innerWidth));
  const [avatarList] = useState(() =>
    Array.from({ length: ROWS * getColumns(Infinity) }, randomAvatar)
  );
  const [confetti] = useState(createConfetti);

  useEffect(() => {
    const handleResize = () => setColumns(getColumns(window.innerWidth));

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-[750px] overflow-hidden bg-primary-800">
      {confetti.map((c) => (
        <span
          key={c.id}
          className={`absolute top-0 animate-confetti ${c.shape === 'triangle' ? '' : c.shape}`}
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            clipPath:
              c.shape === 'triangle'
                ? 'polygon(50% 0, 100% 100%, 0 100%)'
                : undefined,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      <div
        className="relative mt-[140px] mx-auto grid gap-y-6 justify-items-center w-full px-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {avatarList.slice(0, ROWS * columns).map((src, i) => (
          <div
            key={i}
            className="transition-transform duration-300 hover:scale-[1.6] hover:z-10"
          >
            <img
              src={src}
              alt=""
              className="w-[min(110px,22vw)] aspect-square opacity-0 animate-floatIn"
              style={{ animationDelay: `${i * 0.03}s` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
