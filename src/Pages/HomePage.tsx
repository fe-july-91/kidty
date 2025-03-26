import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LangContext } from '../Context/LangContext';
import Sketch from '../Components/Sketch';
import BannerWrapper from '../Components/Banner/Wrapper';
import { Button} from '@heroui/react';
import { carouselImages, giff } from '../Utils/kit';
import { Carousel } from '../Components/Carousel';
import { Support } from '../Components/Support';


export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLang } = useContext(LangContext);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F7F8] items-center px-4 py-10 md:py-16 lg:px-10">
      <div className="text-3xl text-center sm:text-3xl md:text-4xl font-medium text-primary-700 animate-floatUp">
        {currentLang === 'UA'
          ? 'KIDTY - надійний cервіс для турботливих батьків'
          : 'KIDTY – сaring for your little ones, together with you'}
      </div>
      {/* banner */}
      <div className=''>
        <BannerWrapper sketch={Sketch} />
      </div>
       {/* buttons */}
      <div
        className="flex flex-col justify-center opacity-0 gap-4 md:flex-row animate-floatUp w-full"
        style={{ animationDelay: `1.2s` }}
      >
        <Button
          onPress={() => navigate('account')}
          size='lg'
          variant="solid"
          color='primary'
        >
          {currentLang === 'UA' ? 'Увійти' : 'Log In'}
        </Button>

        <Button
          onPress={() => navigate('signup')}
          size='lg'
          variant="solid"
          
          color='secondary'
        >
          {currentLang === 'UA' ? 'Зареєструватися' : 'Sign Up'}
        </Button>
      </div>

      {/* about */}
      <div
        className='flex flex-col gap-8 lg:flex-row mt-10 md:mt-20 md:pt-10  bg-primary rounded-3xl px-10 pb-8 opacity-0 animate-floatUp'
        style={{ animationDelay: `1.5s` }}
      >
        {/* list of blocks */}
        <div
          className="flex flex-col gap-6 text-lg text-primary-800 min-w-[330px] pt-6 "
        >
          <div className="flex flex-row items-start gap-2 bg-primary-100 shadow-custom rounded-3xl p-8  transition-transform duration-300 hover:scale-110">
            <div className="flex-shrink-0 mt-2 w-3 h-3 bg-primary rounded-full"></div>
            <div>
              {currentLang === 'UA'
                ? 'Відстежуйте фізичні показники вашої дитини'
                : "Track your child's physical health data"}
            </div>
          </div>

          <div className="flex flex-row items-start gap-2 bg-primary-100 shadow-custom rounded-3xl p-8 transition-transform duration-300 hover:scale-110">
            <div className="flex-shrink-0 mt-2 w-3 h-3 bg-primary rounded-full"></div>

            <div>
              {currentLang === 'UA'
                ? 'Bедіть персональний календар вакцинації'
                : "Manage your child's personal vaccination calendar"}
            </div>
          </div>

          <div className="flex flex-row items-start gap-2 bg-primary-100 shadow-custom rounded-3xl p-8 transition-transform duration-300 hover:scale-110">
            <div className="flex-shrink-0 mt-2 w-3 h-3 bg-primary rounded-full"></div>

            <div>
              {currentLang === 'UA'
                ? 'Зберігайте інформацію про всіх дітей в одному додатку'
                : "Keep your children's necessary information in one app"}
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className=" ">
          <Carousel
            images={carouselImages}
          />
        </div>
      </div>

      {/* Contacts */}
      <div className='flex flex-col min-h-[480px] w-full px-10 justify-around items-center md:flex-row gap-8 mt-10 md:mt-20 bg-secondary rounded-3xl py-8'>
        <div className='flex-1 w-full'>
          <Support />
        </div>

        <div className='flex-1 flex rounded-3xl overflow-hidden lg:mr-10'>
          <img className='w-full' src={giff} alt="gif" />
        </div>
      </div>
      
    </div>
  );
};
export default HomePage;
