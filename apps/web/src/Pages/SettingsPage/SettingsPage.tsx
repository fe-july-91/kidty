import { useCallback, useState } from 'react';
import { useLocalStorage } from '../../Shared/CustomHooks/useLocalStorage';
import { client } from '../../Utils/httpClient';
import { PersonalData } from '../../Shared/types/types';
import { Button, Input, PressEvent } from '@heroui/react';
import { Link, useNavigate } from 'react-router';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { useTranslation } from 'react-i18next';

export const SettingsPage = () => {
  const { t } = useTranslation();
  const [savedEmail, setSavedEmail] = useLocalStorage<string>('email', '');
  const [savedUserName, setSavedUserName] = useLocalStorage<string>('userName', '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [email, setEmail] = useState(savedEmail);
  const [name, setName] = useState(savedUserName);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [isSuccess, setIsSuccess] = useState('');
  const [isLoading, setIsLoading] = useState({
    data: false,
    password: false,
    delete: false
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    name: false,
    email: false,
  });
  const [passwordsErrors, setPasswordsErrors] = useState({
    password1: false,
    password2: false,
  });

  const isSaveValid = name.trim() !== '' && email.trim() !== '' && /^\S+@\S+\.\S+$/.test(email);
  const isPasswordsValid = password1.trim() !== '' && password2.trim() === password1.trim();

  const handleDataSubmit = (e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if ('preventDefault' in e) e.preventDefault();
    
    setErrorMessage('');
    setIsLoading(prev => ({...prev, data: true}));

    if (!isSaveValid) {
      setErrorMessage(t('common.checkInput'));
      setIsLoading(prev => ({...prev, data: false}));
      return;
    }

    client.put<PersonalData>('account/reset-data', { name, email })
      .then((response) => {
        setEmail(response.email);
        setName(response.name);
        setSavedUserName(response.name);
        setSavedEmail(response.email);
        setIsSuccess(t('settings.dataSaved'));
      })
      .catch((error) => setErrorMessage(error.message || t('settings.dataError')))
      .finally(() => setIsLoading(prev => ({...prev, data: false})));
  };

  const handlePasswordSubmit = (e: PressEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if ('preventDefault' in e) e.preventDefault();
    
    setErrorMessage('');
    setIsSuccess('');
    setIsLoading(prev => ({...prev, password: true}));

    if (!isPasswordsValid) {
      setErrorMessage(t('common.checkInput'));
      setIsLoading(prev => ({...prev, password: false}));
      return;
    }

    client.put('account/reset-password', { password: password1, repeatPassword: password2 })
      .then(() => {
        setIsSuccess(t('settings.passwordSaved'));
        setIsChangePassword(false);
        setPassword1('');
        setPassword2('');
      })
      .catch((error) => setErrorMessage(error.message || t('settings.passwordError')))
      .finally(() => setIsLoading(prev => ({...prev, password: false})));
  };

  const deleteAccount = useCallback(async () => {
    try {
      setIsLoading(prev => ({...prev, delete: true}));
      setErrorMessage('');
      
      await client.delete("account/delete");
      setSavedEmail('');
      setSavedUserName('');
      localStorage.clear(); 
      
      navigate("/", { replace: true }); 
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(t('settings.deleteError'));
      }
      onOpen();
    } finally {
      setIsLoading(prev => ({...prev, delete: false}));
    }
  }, [navigate, onOpen, setSavedEmail, setSavedUserName]);

  return (
    <div className="flex justify-center bg-primary-800 min-h-[calc(100vh-96px)] lg:min-h-[calc(100vh-128px)]">
      <div className="flex flex-col gap-8 bg-background shadow-custom border-1 border-primary p-6 md:p-10 rounded-xl mt-8 h-fit opacity-0 animate-floatUp w-full max-w-2xl">
      <div className='flex text-primary text-sm'>
         <div className="border-b-1 border-background hover:border-primary transition-border duration-100 cursor-pointer">
          <Link to="/account" >
            {t('nav.logout')}
          </Link>
        </div>
        </div>

        <div className="text-2xl md:text-3xl text-primary-700">
          {t('settings.title')}
        </div>

        <form className="flex flex-col w-full gap-4">
          <Input
            label={t('settings.name')}
            type="text"
            value={name}
            isInvalid={errors.name}
            id="name"
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setErrors(prev => ({...prev, name: name.trim() === ''}))}
          />
          
          <Input
            label={t('settings.email')}
            type="email"
            value={email}
            isInvalid={errors.email}
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => setErrors(prev => ({
              ...prev,
              email: email.trim() === '' || !/^\S+@\S+\.\S+$/.test(email),
            }))}
          />

          <Button 
            type="submit" 
            variant="solid" 
            color="primary" 
            onPress={handleDataSubmit}
            isLoading={isLoading.data}
          >
            {t('common.save')}
          </Button>

          {isSuccess && (
            <div className="p-4 text-green-700 bg-green-100 rounded-lg">
              {isSuccess}
            </div>
          )}
          {errorMessage && (
            <div className="p-4 text-danger-700 bg-danger-100 rounded-lg">
              {errorMessage}
            </div>
          )}
          <hr />
        </form>

        <div className="flex flex-col gap-4">
          <div className='flex flex-row justify-between'>
              <Button
                variant="light"
                color="primary"
                onPress={() => setIsChangePassword(!isChangePassword)}
              >
                {isChangePassword ? t('settings.cancelPasswordChange') : t('settings.changePassword')}
              </Button>
            {!isChangePassword && (
              <Button
                  variant="light"
                  color="danger"
                  onPress={onOpen}
                  isLoading={isLoading.delete}
                >
                  {t('settings.deleteAccount')}
                </Button>
            )}
          </div>

          {isChangePassword && (
            <form className="flex flex-col gap-4">
              <Input
                label={t('settings.newPassword')}
                type="password"
                value={password1}
                isInvalid={passwordsErrors.password1}
                id="new-password"
                onChange={(event) => setPassword1(event.target.value)}
                onBlur={() => setPasswordsErrors(prev => ({
                  ...prev,
                  password1: password1.trim() === '',
                }))}
              />
              
              <Input
                label={t('settings.repeatNewPassword')}
                type="password"
                value={password2}
                isInvalid={passwordsErrors.password2}
                id="confirm-password"
                onChange={(event) => setPassword2(event.target.value)}
                onBlur={() => setPasswordsErrors(prev => ({
                  ...prev,
                  password2: password2.trim() !== password1.trim(),
                }))}
              />

              <Button 
                type="submit" 
                variant="solid" 
                color="primary" 
                onPress={handlePasswordSubmit}
                isLoading={isLoading.password}
              >
                {t('common.confirm')}
              </Button>
            </form>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{t('settings.deleteTitle')}</ModalHeader>
              <ModalBody>
                <p className="text-primary-600">
                  {t('settings.deleteText')}
                </p>
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="solid" 
                  onPress={deleteAccount}
                  isLoading={isLoading.delete}
                >
                  {t('common.delete')}
                </Button>
                <Button color="primary" variant="light" onPress={onClose}>
                  {t('common.cancel')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};