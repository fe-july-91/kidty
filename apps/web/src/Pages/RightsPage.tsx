import { Maria, Yana } from '../Utils/kit';
import { Avatar } from '../Components/Avatar';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export const RightsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className=" h-full py-8 md:py-12 z-50 relative bg-[#F6F7F8] min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-128px)]">
     
      <div
        className="grid gap-4 grid-cols-4 justify-center px-4 sm:px-8 sm:grid-cols-24 lg:grid-cols-24 xl:grid-cols-32px grid-rows-[auto_auto]"
      >
        <div className="z-20 col-span-full h-fit flex flex-col gap-4 items-start  mb-4">
          <header className="text-5xl text-secondary-500 font-medium">
            {t('about.hi')}
          </header>
          <p className="col-span-2 pb-2 text-[20px] text-left text-gray-800 sm:col-span-full">
            {t('about.intro')}
          </p>
        </div>

        <div className="col-span-full mb-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-4 p-8 rounded-3xl bg-secondary-600 animate-floatUp shadow-custom">
              <div className="flex flex-row justify-start items-center gap-4 ">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden shrink-0 border-2">
                  <img className="object-cover" src={Maria} alt="Maria" />
                </div>
                <div className="flex flex-col gap-1 text-lg text-white">
                  <h3 className="text-3xl text-left">
                    {t('about.maria')}
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
                {t('about.mariaText')}
              </div>
            </div>

            <div className="flex flex-col gap-4 p-8 rounded-3xl bg-secondary-600 animate-floatUp shadow-custom">
              <div className="flex flex-row gap-4">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden shrink-0 border-2">
                  <img className="object-cover" src={Yana} alt="Maria" />
                </div>
                <div className="flex flex-col gap-1 text-lg text-white">
                  <h3 className="text-3xl text-left">
                    {t('about.yana')}
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
                {t('about.yanaText')}
              </div>
            </div>
          </div>
        </div>

        <div className="z-20 col-span-full mt-4">
          <p className="z-20 text-lg text-gray-800 mb-4 text-center">
            {t('about.contact')}
          </p>
          <div className="col-span-full">
            <div className="flex flex-row gap-8 justify-center ">
              <Link
                to="https://www.linkedin.com/in/mariashmakova"
                target="_blank"
              >
                <Avatar
                  index={1}
                  alt={t('about.maria')}
                  className="w-[100px] rounded-xl shadow-custom transition-transform duration-300 hover:scale-110"
                />
              </Link>

              <Link
                to="https://www.linkedin.com/in/yana-stepanova-syna"
                target="_blank"
              >
                <Avatar
                  index={3}
                  alt={t('about.yana')}
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
