import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Button, Input } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { AuthLayout, FormError, FormNotice } from '../Components/AuthLayout';
import { client } from '../Utils/httpClient';

/** Opened from the link in the password reset email (#/reset-password?token=…). */
export const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await client.post('auth/reset-password', { token, password, repeatPassword });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.genericError'));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title={t('auth.resetTitle')}>
        <FormError message={t('auth.resetMissing')} />
        <Link to="/recovery" className="text-center text-sm text-primary hover:text-primary-700">
          {t('auth.requestNewLink')}
        </Link>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title={t('auth.resetTitle')}>
        <FormNotice message={t('auth.resetDone')} />
        <Button color="primary" radius="full" onPress={() => navigate('/login')}>
          {t('auth.login')}
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('auth.resetTitle')} subtitle={t('auth.resetText')}>
      <form className="grid gap-4" onSubmit={submit} noValidate>
        <Input
          label={t('auth.newPassword')}
          type="password"
          value={password}
          onValueChange={setPassword}
          variant="bordered"
          autoComplete="new-password"
          description={t('auth.passwordHint')}
          isRequired
        />
        <Input
          label={t('auth.repeatNewPassword')}
          type="password"
          value={repeatPassword}
          onValueChange={setRepeatPassword}
          variant="bordered"
          autoComplete="new-password"
          isInvalid={repeatPassword !== '' && repeatPassword !== password}
          errorMessage={t('apiErrors.passwordsMismatch')}
          isRequired
        />
        <FormError message={error} />
        <Button type="submit" color="primary" radius="full" isLoading={loading} isDisabled={password.length < 8 || password !== repeatPassword}>
          {t('auth.saveNewPassword')}
        </Button>
      </form>
      {error && (
        <Link to="/recovery" className="text-center text-sm text-primary hover:text-primary-700">
          {t('auth.requestNewLink')}
        </Link>
      )}
    </AuthLayout>
  );
};
