import { Dashboard } from '../Components/Dashboard/Dashboard';
import { avatars, colors } from '../Utils/kit';
import { useEffect, useState } from 'react';
import { Child } from '../Shared/types/types';
import { calculateFullChildAge } from '../Shared/hendlers/generateYearArray';
import { AddModal } from '../Components/AddModal';
import { EditModal } from '../Components/EditModal';
import { client } from '../Utils/httpClient';

export const AccountPage: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [child, setChild] = useState<Child | null>(null);
  const [isAddmodal, setIsAddModal] = useState(false);
  const [additingModal, setAdditingModal] = useState(false);
  const [errowMessage, setErrowmessage] = useState('');

  useEffect(() => {
    client
      .get<Child[]>(`children`)
      .then((response) => {
        setChildren(response);
        if (response.length > 0) {
          setChild(response[0]);
        } else if (response.length === 0) {
          setIsAddModal(true);
        }
      })
      .catch((err) =>
        setErrowmessage(err.message || 'Щось пішло не так, спробуйте ще раз')
      );
  }, []);

  useEffect(() => {
    if (child) {
      client
        .get<Child>(`children/${child.id}`)
        .then((updatedChild) => {
          setChildren((prevChildren) =>
            prevChildren.map((c) =>
              c.id === updatedChild.id ? updatedChild : c
            )
          );
          client
            .get<Child[]>(`children`)
            .then((response) => setChildren(response))
            .catch((err) =>
              setErrowmessage(err.message || 'Щось пішло не так')
            );
        })
        .catch((err) =>
          setErrowmessage(err.message || 'Не вдалося оновити дані')
        );
    }
  }, [child]);

  const handleChildChange = (index: number) => {
    const currentChild = children.find((ch) => ch.id === index)!;
    setChild(currentChild);
  };

  const handleAddChild = () => {
    setIsAddModal(true);
  };

  const fullAge = child
    ? calculateFullChildAge(child.birth)
    : { years: 0, months: 0 };

  return (
    <div className="relative flex flex-col bg-[#ffffff99]">
      {errowMessage && <div className="form__error">{errowMessage}</div>}
      {child && (
        <>
          <div className="px-4 lg:px-10 flex flex-row flex-wrap gap-10 justify-between items-end py-4 shadow-custom">
            <div className="flex flex-row justify-start gap-4">
              <img
                src={avatars[+child.image]}
                alt="avatar"
                className="cursor-pointer w-[120px] md:w-[140px] lg:w-[160px] object-cover rounded-3xl shadow-custom transition-transform duration-300 hover:scale-110"
                onClick={() => setAdditingModal(true)}
                loading="lazy"
              />
              <div className="flex flex-col bg-white shadow-custom p-2 px-4 rounded-3xl ">
                <header className="text-2xl text-primary py-2">{`${child.name} ${child.surname}`}</header>
                <p className="text-[18px] text-gray-600 ">
                  Вік: {fullAge.years}p. {fullAge.months}м.
                </p>
                <p className="text-[18px] text-gray-600 ">
                  Рік народження:{' '}
                  <span className="whitespace-nowrap">{child.birth}</span>
                </p>
                <p className="text-[18px] text-gray-600 ">
                  Стать: {child.genderName}
                </p>
              </div>
            </div>

            <div className=" flex flex-row gap-2 items-center flex-wrap">
              {children.map((childItem) => (
                <div
                  key={childItem.id}
                  className={`cursor-pointer rounded-full overflow-hidden shadow-custom transition-transform duration-300 hover:scale-125 ${
                    child.id === childItem.id
                      ? 'outline outline-4 outline-gray-100'
                      : 'outline-none'
                  }`}
                  onClick={() => handleChildChange(childItem.id)}
                >
                  <img
                    src={avatars[+childItem.image]}
                    alt="avatar"
                    loading="lazy"
                    className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] object-cover "
                  />
                </div>
              ))}

              <div
                className="flex flex-row gap-2 h-10 cursor-pointer text-md font-medium text-primary-700  items-center"
                onClick={handleAddChild}
              >
                <div className="text-2xl text-primary-700"> + </div>
                <div>
                  Додати
                  <br />
                  дитину
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8" style={{ backgroundColor: colors[child.id] }}>
            {child && <Dashboard child={child} />}
          </div>
        </>
      )}

      {isAddmodal && (
        <div className="absolute z-50 h-full bg-black bg-opacity-60 mx-auto w-full">
          <AddModal
            children={children}
            setModal={setIsAddModal}
            setCurrentChild={setChild}
          />
        </div>
      )}

      {child && additingModal && (
        <div className="absolute z-50 h-full bg-black bg-opacity-60 mx-auto w-full">
          <EditModal
            setModal={setAdditingModal}
            currentChild={child}
            setCurrentChild={setChild}
            setChildren={setChildren}
          />
        </div>
      )}
    </div>
  );
};
