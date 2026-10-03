import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Input } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { client } from '../../Utils/httpClient';
import { PersonalData } from '../../Shared/types/types';
import { AuthContext } from '../../Context/AuthContext';

const card = 'grid gap-4 rounded-[22px] bg-white p-5 shadow-card md:p-6';
const EMAIL = /^\S+@\S+\.\S+$/;

type Notice = { kind: 'success' | 'error'; text: string } | null;

const NoticeBox = ({ notice }: { notice: Notice }) =>
  notice && (
    <p
      role={notice.kind === 'error' ? 'alert' : 'status'}
      className={`rounded-xl px-4 py-3 text-sm ${
        notice.kind === 'error' ? 'bg-danger-100 text-danger-700' : 'bg-primary-100 text-primary-800'
      }`}
    >
      {notice.text}
    </p>
  );

export const SettingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [dataNotice, setDataNotice] = useState<Notice>(null);
  const [savingData, setSavingData] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<Notice>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const dataValid = name.trim() !== '' && EMAIL.test(email.trim());
  const passwordValid = currentPassword !== '' && password !== '' && password === repeatPassword;

  const saveData = async () => {
    setSavingData(true);
    setDataNotice(null);
    try {
      const updated = await client.put<PersonalData>('account/reset-data', {
        name: name.trim(),
        email: email.trim(),
      });
      setUser(updated);
      setDataNotice({ kind: 'success', text: t('settings.dataSaved') });
    } catch (err) {
      setDataNotice({ kind: 'error', text: err instanceof Error ? err.message : t('settings.dataError') });
    } finally {
      setSavingData(false);
    }
  };

  const savePassword = async () => {
    setSavingPassword(true);
    setPasswordNotice(null);
    try {
      await client.put('account/reset-password', { currentPassword, password, repeatPassword });
      setCurrentPassword('');
      setPassword('');
      setRepeatPassword('');
      setPasswordNotice({ kind: 'success', text: t('settings.passwordSaved') });
    } catch (err) {
      setPasswordNotice({ kind: 'error', text: err instanceof Error ? err.message : t('settings.passwordError') });
    } finally {
      setSavingPassword(false);
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await client.delete('account/delete');
      setUser(null);
      navigate('/', { replace: true });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t('settings.deleteError'));
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] bg-canvas text-ink lg:min-h-[calc(100vh-120px)]">
      <div className="mx-auto grid max-w-2xl gap-5 px-4 py-6 md:py-8">
        <Link to="/account" className="w-fit text-sm text-primary hover:text-primary-700">
          ← {t('settings.back')}
        </Link>
        <h1 className="text-[26px] font-semibold leading-tight">{t('settings.title')}</h1>

        <section className={card}>
          <h2 className="text-[17px] font-semibold">{t('settings.personalData')}</h2>
          <Input label={t('settings.name')} value={name} onValueChange={setName} variant="bordered" autoComplete="name" />
          <Input label={t('settings.email')} type="email" value={email} onValueChange={setEmail} variant="bordered" autoComplete="email" />
          <NoticeBox notice={dataNotice} />
          <Button className="w-fit" radius="full" color="primary" onPress={saveData} isLoading={savingData} isDisabled={!dataValid}>
            {t('common.save')}
          </Button>
        </section>

        <section className={card}>
          <h2 className="text-[17px] font-semibold">{t('settings.changePassword')}</h2>
          <Input label={t('settings.currentPassword')} type="password" value={currentPassword} onValueChange={setCurrentPassword} variant="bordered" autoComplete="current-password" />
          <Input label={t('settings.newPassword')} type="password" value={password} onValueChange={setPassword} variant="bordered" autoComplete="new-password" />
          <Input
            label={t('settings.repeatNewPassword')}
            type="password"
            value={repeatPassword}
            onValueChange={setRepeatPassword}
            variant="bordered"
            autoComplete="new-password"
            isInvalid={repeatPassword !== '' && repeatPassword !== password}
            errorMessage={t('apiErrors.passwordsMismatch')}
          />
          <NoticeBox notice={passwordNotice} />
          <Button className="w-fit" radius="full" color="primary" onPress={savePassword} isLoading={savingPassword} isDisabled={!passwordValid}>
            {t('settings.changePassword')}
          </Button>
        </section>

        <section className={card}>
          <h2 className="text-[17px] font-semibold">{t('settings.deleteAccount')}</h2>
          <p className="text-sm text-ink-2">{t('settings.deleteText')}</p>
          {deleteError && <p role="alert" className="text-sm text-danger-600">{deleteError}</p>}
          {confirmDelete ? (
            <div className="flex flex-wrap gap-2">
              <Button radius="full" className="bg-secondary-600 text-white" onPress={deleteAccount} isLoading={deleting}>
                {t('settings.deleteConfirm')}
              </Button>
              <Button radius="full" variant="bordered" className="border-hairline text-ink-2" onPress={() => setConfirmDelete(false)} isDisabled={deleting}>
                {t('common.cancel')}
              </Button>
            </div>
          ) : (
            <Button className="w-fit border-hairline text-secondary-600" radius="full" variant="bordered" onPress={() => setConfirmDelete(true)}>
              {t('settings.deleteAccount')}
            </Button>
          )}
        </section>
      </div>
    </div>
  );
};
