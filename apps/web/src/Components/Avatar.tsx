import React from 'react';
import { avatarBackgrounds, avatars } from '../Utils/kit';

type Props = {
  index: number | string;
  className?: string;
  alt?: string;
};

/** Avatar image (transparent background) on its own soft background colour. */
export const Avatar: React.FC<Props> = ({ index, className = '', alt = '' }) => {
  const i = Number(index) || 0;

  return (
    <img
      src={avatars[i] ?? avatars[0]}
      alt={alt}
      loading="lazy"
      className={`object-contain object-bottom ${className}`}
      style={{ backgroundColor: avatarBackgrounds[i] ?? 'var(--color-chip)' }}
    />
  );
};
