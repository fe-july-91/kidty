import React, { useState } from 'react';
import { avatars } from '../../Utils/kit';
import './AvatarSelector.scss';

type Props = {
  avatarIndex: number;
  setAvatarIndex: (value: number) => void;
};

export const AvatarSelector: React.FC<Props> = ({
  avatarIndex,
  setAvatarIndex,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAvatarSelect = (i: number) => {
    setAvatarIndex(i);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev: boolean) => !prev);
  };

  return (
    <div className="avatar-selector">
      <label className="avatar-selector__label">Виберіть аватар</label>
      <div className="avatar-selector__selected" onClick={toggleDropdown}>
        <img src={`${avatars[avatarIndex]}`} alt="Selected Avatar" />
      </div>
      {showDropdown && (
        <div className="avatar-selector__dropdown">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className="avatar-selector__dropdown--item"
              onClick={() => handleAvatarSelect(index)}
            >
              <img
                src={`${avatar}`}
                alt={`Avatar ${index + 1}`}
                className="avatar-selector__dropdown--image"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
