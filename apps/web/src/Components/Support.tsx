import { Button, Form, Input, Textarea } from '@heroui/react';
import { mailToSupport } from '../api/support';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../Context/AuthContext';

type Props = {
  /** "dark" sits on the blue home-page panel, "light" on a white card. */
  tone?: 'dark' | 'light';
};

export const Support: React.FC<Props> = ({ tone = 'dark' }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const light = tone === 'light';

  const [isSend, setIsSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const formData = {
      name: String(data.name),
      email: String(data.email),
      message: String(data.message),
    };

    setSending(true);
    setError('');
    mailToSupport(formData)
      .then(() => setIsSend(true))
      .catch((err) => setError(err instanceof Error ? err.message : t('common.genericError')))
      .finally(() => setSending(false));
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    setError('');
  };

  const errorClass = light ? 'min-h-[20px]' : 'text-warning-500 min-h-[20px]';

  return (
    <div className="flex flex-col justify-start w-full">
      {isSend ? (
        <div
          role="status"
          className={
            light
              ? 'rounded-xl bg-primary-100 px-4 py-3 text-primary-800'
              : 'text-2xl lg:text-xl text-white p-4 border-small rounded-lg'
          }
        >
          {t('support.success')}
        </div>
      ) : (
        <Form
          className={`w-full max-w-2xl flex flex-col font-sans ${light ? 'gap-3' : 'space-y-4 md:space-y-6'}`}
          validationBehavior="native"
          onSubmit={handleSubmit}
          onReset={handleReset}
        >
          <div className={light ? 'grid w-full gap-3 sm:grid-cols-2' : 'contents'}>
            <Input
              isRequired
              errorMessage={t('support.nameRequired')}
              name="name"
              placeholder={t('support.name')}
              defaultValue={user?.name}
              type="text"
              variant={light ? 'bordered' : 'flat'}
              classNames={{ errorMessage: errorClass }}
            />

            <Input
              isRequired
              errorMessage={t('support.emailInvalid')}
              name="email"
              placeholder={t('support.email')}
              defaultValue={user?.email}
              type="email"
              variant={light ? 'bordered' : 'flat'}
              classNames={{ errorMessage: errorClass }}
            />
          </div>

          <Textarea
            isRequired
            name="message"
            className="max-w-2xl"
            placeholder={t('support.message')}
            variant={light ? 'bordered' : 'flat'}
            minRows={light ? 4 : 3}
          />

          {error && (
            <p role="alert" className={`text-sm ${light ? 'text-danger-600' : 'text-warning-500'}`}>
              {error}
            </p>
          )}

          {light ? (
            <Button radius="full" color="primary" type="submit" isLoading={sending}>
              {t('common.send')}
            </Button>
          ) : (
            <div className="flex w-full flex-col md:flex-row gap-2">
              <Button className="border-gray-100 text-white" type="reset" color="warning" variant="ghost">
                {t('common.reset')}
              </Button>

              <Button variant="solid" color="primary" type="submit" isLoading={sending}>
                {t('common.send')}
              </Button>
            </div>
          )}
        </Form>
      )}
    </div>
  );
};
