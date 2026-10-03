import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Checkbox, Input } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../Context/AuthContext';
import { AuthLayout, FormError } from '../Components/AuthLayout';
import { client } from '../Utils/httpClient';
import { useLocalStorage } from '../Shared/CustomHooks/useLocalStorage';
import { PersonalData } from '../Shared/types/types';

export const LogInPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logIn } = useContext(AuthContext);
  // "Remember me" keeps only the email; the password is never stored.
  const [savedEmail, setSavedEmail] = useLocalStorage<string>('email', '');
  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await client.post<{ user: PersonalData }>('auth/login', {
        email: email.trim(),
        password,
      });
      setSavedEmail(remember ? email.trim() : '');
      logIn(user);
      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.genericError'));
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.welcome')}>
      <form className="grid gap-4" onSubmit={submit} noValidate>
        <Input label={t('auth.email')} type="email" value={email} onValueChange={setEmail} variant="bordered" autoComplete="email" isRequired />
        <Input label={t('auth.password')} type="password" value={password} onValueChange={setPassword} variant="bordered" autoComplete="current-password" isRequired />
        <div className="flex items-center justify-between gap-3 text-sm">
          <Checkbox size="sm" isSelected={remember} onValueChange={setRemember}>
            {t('auth.remember')}
          </Checkbox>
          <Link to="/recovery" className="text-primary hover:text-primary-700">
            {t('auth.forgot')}
          </Link>
        </div>
        <FormError message={error} />
        <Button type="submit" color="primary" radius="full" isLoading={loading} isDisabled={!email.trim() || !password}>
          {t('auth.login')}
        </Button>
      </form>
      <p className="text-center text-sm text-ink-2">
        {t('auth.noAccount')}{' '}
        <Link to="/signup" className="text-primary hover:text-primary-700">
          {t('auth.signup')}
        </Link>
      </p>
    </AuthLayout>
  );
};
