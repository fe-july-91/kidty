import { useEffect, useState } from 'react';
import './SettingsPage.scss';
import cn from 'classnames';
import { useLocalStorage } from '../../Shared/CustomHooks/useLocalStorage';
import { Link } from 'react-router-dom';
import { client } from '../../Utils/httpClient';
import { PersonalData } from '../../Shared/types/types';
import { CSSTransition } from 'react-transition-group';

export const SettingsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [savedEmail, setSavedEmail] = useLocalStorage<string>('email', '');
  const [savedUserName, setSavedUserName] = useLocalStorage<string>(
    'userName',
    ''
  );
  const [errowMessage, setErrowmessage] = useState('');
  const [isChengePassord, setIsChengePassord] = useState(false);
  const [email, setEmail] = useState(savedEmail);
  const [name, setName] = useState(savedUserName);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [isSuccess, setIsSuccess] = useState('');

  const [errors, setErrors] = useState({
    name: false,
    email: false,
  });
  const [passwordsErrors, setPasswordsErrors] = useState({
    password1: false,
    password2: false,
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const isSaveValid =
    name.trim() !== '' && email.trim() !== '' && /^\S+@\S+\.\S+$/.test(email);

  const isPasswordsValid =
    password1.trim() !== '' && password2.trim() === password1.trim();

  const handleDataSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setErrowmessage('');

    client
      .put<PersonalData>('account/reset-data', {
        name: name,
        email: email,
      })
      .then((response) => {
        setEmail(response.email);
        setName(response.name);
        setSavedUserName(response.name);
        setSavedEmail(response.email);
        setIsSuccess('Персональні дані успішно змінені 🎉');
      })
      .catch((respond) => setErrowmessage(respond.errors[0]));

    if (!isSaveValid) {
      setErrowmessage('Будь ласка, перевірте правильність введених даних.');
      return;
    }
  };

  const handlePasswordSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setErrowmessage('');
    setIsSuccess('');

    client
      .put('account/reset-password', {
        password: password1,
        repeatPassword: password2,
      })
      .then(() => {
        setIsSuccess('Пароль успішно скинуто 🎉');
        setIsChengePassord(false);
      })
      .catch((respond) => setErrowmessage(respond.errors[0]));

    if (!isPasswordsValid) {
      setErrowmessage('Будь ласка, перевірте правильність введених даних.');
      return;
    }
  };

  return (
    <div className="settings">
      <CSSTransition
        in={isVisible}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="settings__container">
          <div className="settings__header">
            {' '}
            Налаштування облікового запису{' '}
          </div>

          <form className="settings__form">
            <div className="form__input">
              <label htmlFor="name" className="form__label">
                Ім'я
              </label>
              <input
                type="text"
                value={name}
                className={cn('form__control', {
                  'form__control--invalid': errors.name,
                })}
                id="name"
                onChange={(event) => setName(event.target.value)}
                onBlur={() =>
                  setErrors((prev) => ({ ...prev, name: name.trim() === '' }))
                }
              />
            </div>
            <div className="form__input">
              <label htmlFor="exampleInputEmail1" className="form__label">
                Адреса електронної пошти
              </label>
              <input
                type="email"
                value={email}
                className={cn('form__control', {
                  'form__control--invalid': errors.email,
                })}
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() =>
                  setErrors((prev) => ({
                    ...prev,
                    email: email.trim() === '' || !/^\S+@\S+\.\S+$/.test(email),
                  }))
                }
              />
            </div>
            <button
              type="submit"
              className="form__button"
              onClick={(e) => handleDataSubmit(e)}
              disabled={!isSaveValid}
            >
              Зберегти
            </button>
            {isSuccess && <div className="form__success"> {isSuccess} </div>}
            {errowMessage && <div className="form__error">{errowMessage}</div>}
            <hr className="form__divider" />
          </form>

          <div className="settings__links">
            <button
              className="form__link settings__link"
              onClick={() => setIsChengePassord(!isChengePassord)}
            >
              Змінити пароль
            </button>

            <Link to="/account" className="form__link settings__link">
              <p>Вийти</p>
            </Link>
          </div>

          <form
            className={`settings__password ${isChengePassord ? 'settings__password--visible' : ''}`}
            action="/submit-form"
          >
            <div className="form__input">
              <label htmlFor="exampleInputPassword1" className="form__label">
                Новий пароль
              </label>
              <input
                type="password"
                value={password1}
                className={cn('form__control', {
                  'form__control--invalid': passwordsErrors.password1,
                })}
                id="exampleInputPassword1"
                onChange={(event) => setPassword1(event.target.value)}
                onBlur={() =>
                  setPasswordsErrors((prev) => ({
                    ...prev,
                    password1: password1.trim() === '',
                  }))
                }
              />
            </div>
            <div className="form__input">
              <label htmlFor="exampleInputPassword2" className="form__label">
                Підтвердити новий пароль
              </label>
              <input
                type="password"
                value={password2}
                className={cn('form__control', {
                  'form__control--invalid': passwordsErrors.password2,
                })}
                id="exampleInputPassword2"
                onChange={(event) => setPassword2(event.target.value)}
                onBlur={() =>
                  setPasswordsErrors((prev) => ({
                    ...prev,
                    password2: password2.trim() === '',
                  }))
                }
              />
            </div>

            <button
              type="submit"
              className="form__button"
              onClick={(e) => handlePasswordSubmit(e)}
              disabled={!isPasswordsValid}
            >
              Підтвердити
            </button>

            <div className="form__options"></div>
          </form>
        </div>
      </CSSTransition>
    </div>
  );
};
