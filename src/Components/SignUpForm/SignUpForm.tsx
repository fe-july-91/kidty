import './SignUpForm.scss';
import { useState } from 'react';
import { client } from '../../Utils/httpClient';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';

export const SignUpForm = () => {
  const navigate = useNavigate();
  const [errowMessage, setErrowmessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password1: false,
    password2: false,
  });

  const validateFields = () => {
    const newErrors = {
      name: name.trim() === '',
      email: email.trim() === '' || !/^\S+@\S+\.\S+$/.test(email),
      password1: password1.trim() === '',
      password2: password2.trim() !== password1.trim(),
    };
    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const isFormValid =
    name.trim() !== '' &&
    email.trim() !== '' &&
    /^\S+@\S+\.\S+$/.test(email) &&
    password1.trim() !== '' &&
    password2.trim() === password1.trim();

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setErrowmessage('');

    if (!validateFields()) {
      setErrowmessage('Будь ласка, перевірте правильність введених даних.');
      return;
    }

    client
      .post('auth/registration', {
        email: email.trim(),
        password: password1.trim(),
        repeatPassword: password2.trim(),
        name: name.trim(),
      })
      .then((response: any) => {
        if (response.status === 500) {
          throw new Error(
            'Користувач з даною адресою електронної пошти вже зареєстрований'
          );
        }

        if (response.status === 'BAD_REQUEST') {
          throw new Error('Перевірте наявність та правильність введених даних');
        }

        setIsRegistered(true);
      })
      .catch((error) => setErrowmessage(error.message));
  };

  return (
    <>
      {!isRegistered ? (
        <form className="form">
          <div className="form__title">Ласкаво просимо до Kidti</div>
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
          <div className="form__input">
            <label htmlFor="exampleInputPassword1" className="form__label">
              Пароль
            </label>
            <input
              type="password"
              value={password1}
              className={cn('form__control', {
                'form__control--invalid': errors.password1,
              })}
              id="exampleInputPassword1"
              onChange={(event) => setPassword1(event.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  password1: password1.trim() === '',
                }))
              }
            />
          </div>
          <div className="form__input">
            <label htmlFor="exampleInputPassword2" className="form__label">
              Підтвердити пароль
            </label>
            <input
              type="password"
              value={password2}
              className={cn('form__control', {
                'form__control--invalid': errors.password2,
              })}
              id="exampleInputPassword2"
              onChange={(event) => setPassword2(event.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  password2: password2.trim() === '',
                }))
              }
            />
          </div>

          {errowMessage && <div className="form__error">{errowMessage}</div>}
          <button
            type="submit"
            className="form__button"
            onClick={(e) => handleSubmit(e)}
            disabled={!isFormValid}
          >
            Зареєструватися
          </button>

          <button type="button" className="form__button-social">
            <i className="icons icons--google"></i> Зареєструватися з Google
          </button>
        </form>
      ) : (
        <div className="notification">
          <div className="notification__header">
            {' '}
            Мяу 🎉 ! <br /> Лист-підтвердження надіслано на вказану електронну
            пошту!
          </div>
          <p className="notification__text">
            Для завершення реєстрації вам необхідно зайти на свою електронну
            пошту, відкрити лист і перейти за вказаним посиланням.
          </p>
          <button
            className="homePage__button homePage__button--logIn"
            onClick={() => navigate('/login')}
          >
            Увійти
          </button>
        </div>
      )}
    </>
  );
};
