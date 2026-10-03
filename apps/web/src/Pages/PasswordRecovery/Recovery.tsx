import { useState } from 'react';
import './Recovery.scss';
import { client } from '../../Utils/httpClient';
import { useTranslation } from 'react-i18next';

export const Recovery = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [errowMessage, setErrowmessage] = useState('');
  const [isSuccess, setIsSuccess] = useState('');

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    client
      .post('auth/forgot-password', { email: email.trim() })
      .then(() =>
        setIsSuccess(
          t('auth.recoverySent')
        )
      )
      .catch((error) => {
        const serverError = error.response?.error || error.message;
        setErrowmessage(serverError);
      });
  };

  return (
    <div className="Recovery">
      {!isSuccess && (
        <div className="Recovery__container">
          <div className="Recovery__header">{t('auth.recoveryTitle')}</div>

          <form className="settings__form">
            <div className="form__input">
              <label htmlFor="exampleInputEmail1" className="form__label">
                {t('auth.recoveryText')}
              </label>
              <input
                type="email"
                value={email}
                className="form__control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
           <div className="text-md text-primary-600 bg-secondary-100 px-2">{errowMessage}</div>
            <button
              type="submit"
              className="form__button"
              onClick={(e) => handleSubmit(e)}
            >
              {t('common.send')}
            </button>
          </form>
        </div>
      )}

      {isSuccess && (
        <div className="PopUpWindow">
          <header className="PopUpWindow__header">{isSuccess}</header>
        </div>
      )}
    </div>
  );
};
