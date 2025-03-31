import { avatars, Maria, Yana } from '../Utils/kit';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LangContext } from '../Context/LangContext';

export const RightsPage: React.FC = () => {
  const { currentLang } = useContext(LangContext);

  return (
    <div className=" h-full py-8 md:py-12 z-50 relative bg-[#F6F7F8] min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-128px)]">
      <div className='absolute top-44 w-[1500px] h-[1500px] rounded-full bg-info z-0'>
      </div>
      <div
        className="grid gap-4 grid-cols-4 justify-center px-4 sm:px-8 sm:grid-cols-24 lg:grid-cols-24 xl:grid-cols-32px grid-rows-[auto,auto]"
      >
        <div className="z-20 col-span-full h-fit flex flex-col gap-4 items-start  mb-4">
          <header className="text-5xl text-secondary-500 font-medium">
            {currentLang === 'UA' ? 'Вітаємо!' : 'Hi!'}
          </header>
          <p className="col-span-2 pb-2 text-[20px] text-left text-gray-800 sm:col-span-full">
            {currentLang === 'UA'
              ? 'KIDTY - веб-додаток створений для батьків, щоб допомогти контролювати фізіологічні дані своїх дітей, а також вести облік та графік щеплень. Додаток являє собою дашборт із візуалізацією даних, які можна додавати, видаляти, вносити зміни та проводити аналіз змін із плином часу.'
              : "KIDTY is a web application created for parents to help monitor their children's physiological data, as well as keep records and vaccination schedules. The application is a dashboard with data visualization that can be added, deleted, modified, and analyzed over time."}
          </p>
        </div>

        <div className="col-span-full mb-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-4 p-8 rounded-3xl bg-secondary-500 animate-floatUp shadow-custom">
              <div className="flex flex-row justify-start items-center gap-4 ">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden flex-shrink-0 border-2">
                  <img className="object-cover" src={Maria} alt="Maria" />
                </div>
                <div className="flex flex-col gap-1 text-lg text-white">
                  <h3 className="text-3xl text-left">
                    {currentLang === 'UA' ? 'Марія Шмакова' : 'Maria Shmakova'}
                  </h3>
                  <p>Front End Developer, UX/UI Designer</p>
                  <div className="text-left flex flex-row gap-2">
                    <a
                      className="text-primary-700 hover:text-info"
                      href="https://www.linkedin.com/in/mariashmakova/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                    <a
                      className="text-primary-700 hover:text-info"
                      href="https://github.com/msdreams"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-[18px] text-gray-100 text-left">
                {currentLang === 'UA'
                  ? 'Привіт! Я фронтенд-розробниця, яка захоплена візуалізацією даних. Сподіваюся, що з цією програмою я зможу подарувати мамам трішки спокою та впевненості, а ще усмішку, адже наші дітки-котики так швидко ростуть!'
                  : 'Hi there! I’m a front-end developer with a passion for data visualization. As a mom of two, I know firsthand how important it is to have everything you need right at your fingertips. That’s why I created this app—designed especially for moms. My hope is that it brings you a little peace of mind, confidence, and maybe even a smile as you watch your little ones grow up so quickly!'}
              </div>
            </div>

            <div className="flex flex-col gap-4 p-8 rounded-3xl bg-secondary-500 animate-floatUp shadow-custom">
              <div className="flex flex-row gap-4">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden flex-shrink-0 border-2">
                  <img className="object-cover" src={Yana} alt="Maria" />
                </div>
                <div className="flex flex-col gap-1 text-lg text-white">
                  <h3 className="text-3xl text-left">
                    {currentLang === 'UA' ? 'Яна Степанова' : 'Yana Stepanova'}
                  </h3>
                  <p className="text-left">Java Developer</p>
                  <div className="text-left flex flex-row gap-2">
                    <a
                      className="text-primary-700 hover:text-info"
                      href="https://www.linkedin.com/in/yana-stepanova-syna/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                    <a
                      className="text-primary-700 hover:text-info"
                      href="https://github.com/yanna-stepanova"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-[18px] text-gray-100 text-left">
                {currentLang === 'UA'
                  ? 'Привіт! Я — бекенд-розробниця. Як мама, я щиро зацікавилася кожним елементом цього проєкту. Особливо захоплює зручне графічне відображення даних, яке робить інформацію про здоров’я та динаміку розвитку дитини зрозумілою та легкою для аналізу.'
                  : 'Hi! Working on the backend part of this project was not only a professional challenge for me but also a true pleasure. As a mom, I found myself deeply invested in every element of this project. I’m especially fascinated by the intuitive graphical representation of data, which makes information about a child’s health and development dynamics clear and easy to analyze.'}
              </div>
            </div>
          </div>
        </div>

        <div className="z-20 col-span-full mt-4">
          <p className="z-20 text-lg text-gray-800 mb-4 text-center">
            {currentLang === 'UA'
              ? 'У разі запитань та пропозицій звертайтесь до нас!'
              : 'If you have any questions or suggestions, please contact us!'}
          </p>
          <div className="col-span-full">
            <div className="flex flex-row gap-8 justify-center ">
              <Link
                to="https://www.linkedin.com/in/mariashmakova"
                target="_blank"
              >
                <img
                  src={avatars[1]}
                  alt="kitty"
                  className="w-[100px] rounded-xl shadow-custom transition-transform duration-300 hover:scale-110"
                />
              </Link>

              <Link
                to="https://www.linkedin.com/in/yana-stepanova-syna"
                target="_blank"
              >
                <img
                  src={avatars[3]}
                  alt="kitty"
                  className="w-[100px] rounded-xl shadow-custom transition-transform duration-300 hover:scale-110"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
