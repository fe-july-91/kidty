import './SignUpForm.scss';
import { useState } from 'react';
import { client } from '../../Utils/httpClient';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { button, signUpForm } from '../../Utils/Lang';

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
      .then(() => {
        setIsRegistered(true);
      })
      .catch((error) => setErrowmessage(error.message));
  };

  return (
    <>
      {!isRegistered ? (
        <form className="form">
          <div className="form__title">{signUpForm.header.ua}</div>
          <div className="form__input">
            <label htmlFor="name" className="form__label">
            {signUpForm.name.ua}
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
            {signUpForm.email.ua}
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
            {signUpForm.password.ua}
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
            {signUpForm.repeatPassword.ua}
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
            {button.signUp.ua}
          </button>

          <button type="button" className="form__button-social">
            <i className="icons icons--google"></i> {button.signUp.ua} з Google
          </button>
        </form>
      ) : (
        <div className="mx-4 p-8 bg-background  rounded-2xl shadow-custom">
          <div className="text-2xl text-primary-700 pb-2">{signUpForm.success.header.ua}</div>
          <p className="text-md text-primary-600">{signUpForm.success.text.ua}</p>
        </div>
      )}
    </>
  );
};
