import { useState } from 'react';
import { useNavigate } from 'react-router';
import { client } from '../Utils/httpClient';
import { Button, Input, PressEvent } from '@heroui/react';
import { useTranslation } from 'react-i18next';

export const SignUpForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errowMessage, setErrowmessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    setErrowmessage('');
    setIsLoading(true); 

    if (!validateFields()) {
      setErrowmessage(t('common.checkInput'));
      setIsLoading(false); 
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
      .catch((error) => {
        setErrowmessage(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {!isRegistered ? (
        <div className="flex max-w-[400px] bg-background px-4 md:px-10 py-10 mx-4 my-12 rounded-3xl shadow-custom">
          <form className="flex flex-col gap-4">
            <div className="text-xl md:text-2xl text-primary-700">
              {t('auth.welcome')}
            </div>

            <Input
              label={t('auth.name')}
              type="text"
              value={name}
              isInvalid={errors.name}
              id="name"
              onChange={(event) => setName(event.target.value)}
              onBlur={() =>
                setErrors((prev) => ({ ...prev, name: name.trim() === '' }))
              }
            />

            <Input
              label={t('auth.email')}
              type="email"
              value={email}
              isInvalid={errors.email}
              id="exampleInputEmail1"
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  email: email.trim() === '' || !/^\S+@\S+\.\S+$/.test(email),
                }))
              }
            />

            <Input
              label={t('auth.password')}
              type="password"
              value={password1}
              isInvalid={errors.password1}
              id="exampleInputPassword1"
              onChange={(event) => setPassword1(event.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  password1: password1.trim() === '',
                }))
              }
            />

            <Input
              label={t('auth.repeatPassword')}
              type="password"
              value={password2}
              isInvalid={errors.password2}
              id="exampleInputPassword2"
              onChange={(event) => setPassword2(event.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  password2: password2.trim() !== password1.trim(),
                }))
              }
            />

            {errowMessage && (
              <div className="p-4 text-danger-700 bg-danger-100 rounded-lg">
                {errowMessage}
              </div>
            )}

            <Button
              variant="solid"
              color="primary"
              onPress={handleSubmit}
              isDisabled={!isFormValid || isLoading} 
              isLoading={isLoading} 
            >
              {t('auth.signup')}
            </Button>

            <Button
              color='primary'
              variant='light'
              className="flex flex-row gap-2 justify-center items-center border-1 border-primary bg-white"
            >
              <i className="icons icons--google"></i> {t('auth.signupWithGoogle')}
            </Button>
          </form>
        </div>
      ) : (
        <div className="mx-4 p-8 bg-background rounded-2xl shadow-custom max-w-[400px]">
          <div className="text-2xl text-primary-700 pb-2">
            {t('auth.signupSuccessTitle')}
          </div>
          <p className="text-md text-primary-600">
            {t('auth.signupSuccessText')} {email}
          </p>
          <Button
            className="mt-6 w-full"
            color="primary"
            onPress={() => navigate('/login')}
          >
            {t('auth.login')}
          </Button>
        </div>
      )}
    </>
  );
};