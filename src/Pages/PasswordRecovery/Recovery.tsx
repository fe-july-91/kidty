import { useState } from 'react';
import './Recovery.scss';
import { client } from '../../Utils/httpClient';

export const Recovery = () => {
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
          'Посилання для зміни пароля надіслано на вашу електронну адресу!'
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
          <div className="Recovery__header">Відновлення пароля</div>

          <form className="settings__form">
            <div className="form__input">
              <label htmlFor="exampleInputEmail1" className="form__label">
                Введіть адресу електронної пошти
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
              Відправіти
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
