import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { client } from '../Utils/httpClient';
import { useLocalStorage } from '../Shared/CustomHooks/useLocalStorage';
import { button, logInForm } from '../Utils/Lang';
import { Button, Input, PressEvent, Checkbox } from '@heroui/react';

export const LogInForm = () => {
  const navigate = useNavigate();
  const [savedEmail, setSavedEmail] = useLocalStorage<string>('email', '');
  const [savedPassword, setSavedPassword] = useLocalStorage<string>(
    'password',
    ''
  );

  const { logIn, setToken } = useContext(AuthContext);
  const [errowMessage, setErrowmessage] = useState('');
  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState(savedPassword);
  const [checked, setChecked] = useState(true);

  const handleCheckedButton = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  const handleSubmit = (
    e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    setErrowmessage('');

    client
      .post('auth/login', { email: email.trim(), password: password.trim() })
      .then((response: any) => {
          logIn();
          navigate('/account');
          setToken(response.token);

        if (checked) {
          setSavedEmail(email);
          setSavedPassword(password);
        }
      })
      .catch((error) => {
        setErrowmessage(error.message)
      });
  };

  return (
    <div className="flex max-w-[400px] bg-background px-4 md:px-10 py-10 mx-4 my-12 rounded-3xl shadow-custom">
      <form className="flex flex-col gap-6">
        <div className="text-xl md:text-2xl text-primary-700">{logInForm.header.ua}</div>

        <Input
          label={logInForm.email.ua}
          type="email"
          value={email}
          isInvalid={!!errowMessage}
          id="exampleInputEmail1"
          onChange={(event) => setEmail(event.target.value)}
        />

        <Input
          label={logInForm.password.ua}
          type="password"
          value={password}
          isInvalid={!!errowMessage}
          id="exampleInputPassword1"
          onChange={(event) => setPassword(event.target.value)}
        />

        {errowMessage && (
          <div className="p-4 text-danger-700 bg-danger-100 rounded-lg">
            {errowMessage}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Checkbox size='sm' isSelected={checked} onChange={handleCheckedButton}>
            {logInForm.remember.ua}
          </Checkbox>

          <Link to="/recovery" className="text-xs md:text-sm text-primary">
            {logInForm.forgot.ua}
          </Link>
        </div>

        <Button variant="solid" color="primary" onPress={handleSubmit}>
          {button.logIn.ua}
        </Button>

        <Button
          color='primary'
          variant='light'
          className="flex flex-row gap-2 justify-center items-center border-1 border-primary bg-white"
        >
          <i className="icons icons--google"></i> {button.logIn.ua} з Google
        </Button>
      </form>
    </div>
  );
};
