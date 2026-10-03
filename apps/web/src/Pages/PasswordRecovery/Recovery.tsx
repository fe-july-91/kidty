import { useState } from 'react';
import { Link } from 'react-router';
import { Button, Input } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { AuthLayout, FormError, FormNotice } from '../../Components/AuthLayout';
import { client } from '../../Utils/httpClient';

export const Recovery = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await client.post('auth/forgot-password', { email: email.trim() });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.recoveryTitle')} subtitle={sent ? undefined : t('auth.recoveryText')}>
      {sent ? (
        <FormNotice message={t('auth.recoverySent')} />
      ) : (
        <form className="grid gap-4" onSubmit={submit} noValidate>
          <Input label={t('auth.email')} type="email" value={email} onValueChange={setEmail} variant="bordered" autoComplete="email" isRequired />
          <FormError message={error} />
          <Button type="submit" color="primary" radius="full" isLoading={loading} isDisabled={!email.trim()}>
            {t('common.send')}
          </Button>
        </form>
      )}
      <Link to="/login" className="text-center text-sm text-primary hover:text-primary-700">
        {t('auth.backToLogin')}
      </Link>
    </AuthLayout>
  );
};
