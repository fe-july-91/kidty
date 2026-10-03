import React, { useEffect, useId, useState } from 'react';
import { Button, Input } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { client } from '../Utils/httpClient';
import { avatars } from '../Utils/kit';
import { Child } from '../Shared/types/types';
import { Avatar } from './Avatar';

// Gender values as the API stores them.
const GENDERS = [
  { value: 'Дівчинка', key: 'girl' },
  { value: 'Хлопчик', key: 'boy' },
] as const;

type Props = {
  /** Child to edit; omitted when adding a new one. */
  child?: Child;
  /** False while the user has no children yet (they must add one). */
  canClose: boolean;
  onClose: () => void;
  onSaved: (child: Child) => void;
  onDeleted?: (children: Child[]) => void;
};

/** "DD-MM-YYYY" (API) ↔ "YYYY-MM-DD" (date input). */
const toInputDate = (birth: string) => birth.split('-').reverse().join('-');
const toApiDate = (value: string) => value.split('-').reverse().join('-');
const today = () => new Date().toISOString().slice(0, 10);

export const ChildFormModal: React.FC<Props> = ({ child, canClose, onClose, onSaved, onDeleted }) => {
  const { t } = useTranslation();
  const titleId = useId();
  const [name, setName] = useState(child?.name ?? '');
  const [surname, setSurname] = useState(child?.surname ?? '');
  const [gender, setGender] = useState(child?.genderName ?? '');
  const [birth, setBirth] = useState(child ? toInputDate(child.birth) : '');
  const [avatar, setAvatar] = useState(child ? Number(child.image) || 0 : 0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isValid = name.trim() && surname.trim() && gender && birth;

  useEffect(() => {
    if (!canClose) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canClose, onClose]);

  const save = async () => {
    const body = {
      name: name.trim(),
      surname: surname.trim(),
      genderName: gender,
      birth: toApiDate(birth),
      image: avatar,
    };
    setBusy(true);
    setError('');
    try {
      const saved = child
        ? await client.put<Child>(`children/${child.id}`, body)
        : await client.post<Child>('children', body);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.saveError'));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!child) return;
    setBusy(true);
    setError('');
    try {
      await client.delete(`children/${child.id}`);
      onDeleted?.(await client.get<Child[]>('children'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.deleteError'));
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 px-4 py-8 md:items-center"
      onMouseDown={(e) => canClose && e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="grid w-full max-w-[460px] gap-5 rounded-[22px] bg-white p-5 shadow-card md:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="text-xl font-semibold text-ink">
            {child ? t('childForm.editTitle') : t('childForm.addTitle')}
          </h2>
          {canClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t('childForm.close')}
              className="-mr-1 -mt-1 rounded-full p-1.5 text-muted hover:bg-soft hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>

        <fieldset className="grid gap-2">
          <legend className="mb-2 text-sm text-ink-2">{t('childForm.chooseAvatar')}</legend>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
            {avatars.map((_: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => setAvatar(i)}
                aria-pressed={avatar === i}
                aria-label={t('childForm.avatar', { n: i + 1 })}
                className="justify-self-center rounded-full"
              >
                <Avatar
                  index={i}
                  className={`size-11 rounded-full outline-2 outline-offset-2 transition-transform hover:scale-105 ${
                    avatar === i ? 'outline-primary' : 'outline-transparent'
                  }`}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input label={t('childForm.name')} value={name} onValueChange={setName} variant="bordered" autoFocus />
          <Input label={t('childForm.surname')} value={surname} onValueChange={setSurname} variant="bordered" />
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <fieldset>
            <legend className="mb-1.5 text-sm text-ink-2">{t('childForm.gender')}</legend>
            <div className="inline-flex rounded-full bg-soft p-[3px]">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  aria-pressed={gender === g.value}
                  onClick={() => setGender(g.value)}
                  className={`rounded-full px-4 py-1.5 text-sm ${
                    gender === g.value ? 'bg-white font-semibold text-ink shadow-sm' : 'text-ink-2'
                  }`}
                >
                  {t(`gender.${g.key}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="grid gap-1.5 text-sm text-ink-2">
            {t('childForm.birth')}
            <input
              type="date"
              value={birth}
              max={today()}
              onChange={(e) => setBirth(e.target.value)}
              className="rounded-xl border-2 border-hairline bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
            />
          </label>
        </div>

        {error && <p className="text-sm text-danger-600">{error}</p>}

        {confirmDelete && child ? (
          <div className="grid gap-3 rounded-2xl bg-secondary-100 p-4">
            <p className="text-sm text-ink">{t('childForm.deleteConfirm', { name: child.name })}</p>
            <div className="flex gap-2">
              <Button size="sm" radius="full" className="bg-secondary-600 text-white" onPress={remove} isLoading={busy}>
                {t('common.delete')}
              </Button>
              <Button size="sm" radius="full" variant="bordered" className="border-hairline text-ink-2" onPress={() => setConfirmDelete(false)} isDisabled={busy}>
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            {child ? (
              <button type="button" onClick={() => setConfirmDelete(true)} className="text-sm text-secondary-600 hover:text-secondary-800">
                {t('childForm.deleteChild')}
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              {canClose && (
                <Button radius="full" variant="bordered" className="border-hairline text-ink-2" onPress={onClose} isDisabled={busy}>
                  {t('common.cancel')}
                </Button>
              )}
              <Button radius="full" color="primary" onPress={save} isLoading={busy} isDisabled={!isValid}>
                {t('common.save')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
