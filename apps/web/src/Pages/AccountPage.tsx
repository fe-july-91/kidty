import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { Dashboard } from '../Components/Dashboard';
import { Avatar } from '../Components/Avatar';
import { AddModal } from '../Components/AddModal';
import { EditModal } from '../Components/EditModal';
import { Child } from '../Shared/types/types';
import { calculateFullChildAge } from '../Shared/hendlers/generateYearArray';
import { client } from '../Utils/httpClient';

export const AccountPage: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [child, setChild] = useState<Child | null>(null);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    client
      .get<Child[]>('children')
      .then((response) => {
        setChildren(response);
        if (response.length > 0) {
          setChild(response[0]);
        } else {
          setIsAddModal(true);
        }
      })
      .catch((err) =>
        setErrorMessage(err.message || 'Щось пішло не так, спробуйте ще раз')
      );
  }, []);

  // Show a child and keep the list in sync after it is added or edited.
  const showChild = (next: Child) => {
    setChild(next);
    setChildren((prev) =>
      prev.some((c) => c.id === next.id)
        ? prev.map((c) => (c.id === next.id ? next : c))
        : [...prev, next]
    );
  };

  const age = child ? calculateFullChildAge(child.birth) : null;

  return (
    <div className="min-h-[calc(100vh-96px)] lg:min-h-[calc(100vh-120px)] bg-canvas text-ink">
      <div className="mx-auto grid max-w-[1180px] gap-5 px-4 py-6 md:py-8">
        {errorMessage && <div className="form__error">{errorMessage}</div>}

        {child && age && (
          <section className="flex flex-wrap items-center justify-between gap-5 rounded-[22px] bg-white p-5 shadow-card">
            <div className="flex min-w-0 items-center gap-4 md:gap-5">
              <button
                type="button"
                onClick={() => setIsEditModal(true)}
                className="shrink-0 rounded-[18px] md:rounded-[22px] overflow-hidden focus-visible:outline-2 focus-visible:outline-primary"
                aria-label="Редагувати профіль"
              >
                <Avatar index={child.image} className="size-16 md:size-[84px]" />
              </button>
              <div className="min-w-0">
                <h1 className="text-[22px] md:text-[26px] font-semibold leading-tight">
                  {child.name} {child.surname}
                </h1>
                <p className="mt-1 text-sm text-ink-2">
                  {age.years} р. {age.months} міс. · {child.birth.replaceAll('-', '.')} ·{' '}
                  {child.genderName.toLowerCase()}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditModal(true)}
                  className="mt-1 text-sm text-primary hover:text-primary-700"
                >
                  Редагувати профіль
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4" role="group" aria-label="Діти">
              {children.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setChild(item)}
                  aria-pressed={item.id === child.id}
                  className={`grid justify-items-center gap-1 text-xs ${
                    item.id === child.id ? 'font-semibold text-ink' : 'text-ink-2'
                  }`}
                >
                  <Avatar
                    index={item.image}
                    className={`size-11 rounded-full outline-2 outline-offset-2 ${
                      item.id === child.id ? 'outline-primary' : 'outline-transparent'
                    }`}
                  />
                  {item.name}
                </button>
              ))}
              <Button color="primary" radius="full" onPress={() => setIsAddModal(true)}>
                Додати дитину
              </Button>
            </div>
          </section>
        )}

        {child && <Dashboard child={child} />}
      </div>

      {isAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
          <AddModal
            children={children}
            setModal={setIsAddModal}
            setCurrentChild={showChild}
          />
        </div>
      )}

      {child && isEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
          <EditModal
            setModal={setIsEditModal}
            currentChild={child}
            setCurrentChild={showChild}
            setChildren={setChildren}
          />
        </div>
      )}
    </div>
  );
};
