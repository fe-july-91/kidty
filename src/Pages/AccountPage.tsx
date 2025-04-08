import { Dashboard } from '../Components/Dashboard';
import { avatars, colors } from '../Utils/kit';
import { useEffect, useState } from 'react';
import { Child, EyeResponce, VaccineData } from '../Shared/types/types';
import { calculateFullChildAge } from '../Shared/hendlers/generateYearArray';
import { AddModal } from '../Components/AddModal';
import { EditModal } from '../Components/EditModal';
import { client } from '../Utils/httpClient';
import { Button } from '@heroui/react';
import { TitleCardBlock } from '../Components/TitleCardBlock';
import { findCardImage } from '../Shared/servises/findCardImage';
import { getChildData } from '../api/DataUpdate';

export const AccountPage: React.FC = () => {  
  const [children, setChildren] = useState<Child[]>([]);
  const [child, setChild] = useState<Child | null>(null);
  const [isAddmodal, setIsAddModal] = useState(false);
  const [additingModal, setAdditingModal] = useState(false);
  const [errowMessage, setErrowmessage] = useState('');
  const [lastDataValues, setLastDataValues] = useState({
    weight: { name: "Вага", value: 0, unit: "" },
    height: { name: "Зріст", value: 0, unit: "" },
    foot: { name: "Стопа", value: 0, unit: "" },
    yeys: { name: "Зір", value: "", unit: "" },
    vaccination: { name: "Щеплення", value: "", unit: "" }
  });
  

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

  useEffect(() => {
    if (child) {
      Promise.all([
        getChildData("weight", child.id),
        getChildData("height", child.id),
        getChildData("foot", child.id),
        client.get<EyeResponce>(`children/${child.id}/eye`),
        client.get<VaccineData[]>(`children/${child.id}/vaccination`)
      ]).then(([weightData, heightData, footData, eyeData,vaccineDate]) => {
        setLastDataValues({
          weight: { name: "Вага", value: Math.max(...weightData.map(obj => obj.value)) || 0, unit: "кг" },
          height: { name: "Зріст", value: Math.max(...heightData.map(obj => obj.value)) || 0, unit: "см" },
          foot: { name: "Стопа", value: Math.max(...footData.map(obj => obj.value)) || 0, unit: "см" },
          yeys: {name: "Зір", value: `L${eyeData.leftEye} R${eyeData.rightEye}`, unit: ""}, 
          vaccination: {name:"Щеплення" , value: `${vaccineDate[vaccineDate.length-1]?.date || ""} ${vaccineDate[vaccineDate.length-1]?.type || ""}`, unit: ""}
        });
      }).catch(err => setErrowmessage(err.message || "Помилка при завантаженні даних"));
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
    <div className="relative flex flex-col bg-[#ffffffAA] min-h-[calc(100vh-96px)] lg:min-h-[calc(100vh-128px)]">
      {errowMessage && <div className="form__error">{errowMessage}</div>}
      {child && (
        <>
          <div className="px-4 h-full lg:px-10 flex flex-row flex-wrap gap-6 justify-between items-end py-4 shadow-custom ">
            {/* Child's info */}
            <div className='flex flex-row items-center flex-wrap gap-4 lg:gap-8'>
              {/* child photo */}
              <div className="flex">
                <div className='flex flex-row justify-start gap-4 p-4 bg-background rounded-2xl shadow-custom lg:min-w-[480px]'>
                  <img
                    src={avatars[+child.image]}
                    alt="avatar"
                    className="cursor-pointer max-h-[160px] w-[120px] md:w-[140px] lg:w-[145px] object-cover rounded-2xl transition-transform duration-300 hover:scale-95"
                    onClick={() => setAdditingModal(true)}
                    loading="lazy"
                  />
                  {/* child Name */}
                  <div className="flex flex-col ">
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
              </div>
                {/* child data */}
              <div className='flex flex-col gap-4 flex-shrink-[2] lg:max-w-[400px]'>
                <div className='flex flex-row flex-wrap gap-3 flex-shrink-[2]'>
                  {Object.values(lastDataValues).map(cardType => (
                    <div className='px-4 py-2 bg-background rounded-2xl shadow-custom'>
                      <TitleCardBlock
                        value={cardType.value.toString()}
                        image={findCardImage(cardType.name)}
                        title={cardType.name}
                        unit={cardType.unit}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* children */}
            <div className="flex flex-row flex-wrap items-center gap-6">
              <div className=" flex flex-row gap-4 items-center flex-wrap  max-w-[420px]">
                {children.map((childItem) => (
                  <div className="flex flex-col cursor-pointer transition-transform duration-300 hover:scale-125">
                    <div
                      key={childItem.id}
                      className={`w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full overflow-hidden shadow-custom  ${
                        child.id === childItem.id
                          ? 'outline outline-4 outline-white'
                          : 'outline-none'
                      }`}
                      onClick={() => handleChildChange(childItem.id)}
                    >
                      <img
                        src={avatars[+childItem.image]}
                        alt="avatar"
                        loading="lazy"
                        className="w-full h-full object-cover "
                      />
                    </div>
                    <div className="flex flex-col items-center text-sm text-gray-900">
                      <div>{childItem.name}</div>
                      {/* <div>{childItem.surname}</div> */}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className='w-full sm:w-auto'
                variant="solid"
                color="secondary"
                type="submit"
                onPress={handleAddChild}
              >
                + Додати
              </Button>
            </div>
          </div>

          {/* Dashboard */}
          <div
            className="pt-8 w-full"
            style={{ backgroundColor: colors[child.id] }}
          >
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
