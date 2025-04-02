import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sketch from '../Components/Sketch';
import BannerWrapper from '../Components/Banner/Wrapper';
import { Button} from '@heroui/react';
import { carouselImages, giff } from '../Utils/kit';
import { Carousel } from '../Components/Carousel';
import { Support } from '../Components/Support';
import { button, homePage } from '../Utils/Lang';
import { useInView } from 'react-intersection-observer';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [aboutRef, aboutInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const [contactsRef, contactsInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F7F8] items-center px-4 py-10 md:py-16 lg:px-10">
      <div className="text-3xl text-center sm:text-3xl md:text-4xl font-medium text-secondary-500 animate-floatUp snap-start">
      {homePage.header.ua}
      </div>
      {/* banner */}
      <div className='my-8'>
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
          {button.logIn.ua}
        </Button>

        <Button
          onPress={() => navigate('signup')}
          size='lg'
          variant="solid"
          
          color='secondary'
        >
          {button.signUp.ua}
        </Button>
      </div>

      {/* about */}
      <div className='relative snap-start'>
        {/* bg-circle */}

        {/* <div
          className='absolute top-56 w-[1500px] h-[1500px] rounded-full bg-info'
        >
        </div> */}

        <div
          ref={aboutRef}
          className={`flex flex-col gap-8 lg:flex-row mt-10 md:mt-20 md:pt-10  bg-primary-700 rounded-3xl px-10 pb-8 z-50
            transition-all duration-700 ease-out
            ${aboutInView ? 'opacity-100 -translate-y-4' : 'opacity-0 translate-y-4'}`}
          style={{ animationDelay: `1.5s` }}
        >
          {/* list of blocks */}
          <div className="flex flex-col gap-4 md:gap-6 text-lg text-primary-800 min-w-[330px] pt-6 z-20">
            <span className=" text-2xl lg:text-4xl text-white font-bold pb-2">
            Усі дані під рукою:
            </span>
                {homePage.list.map(l => (
              <div className="flex flex-row items-start gap-2 bg-white shadow-custom rounded-3xl p-6  transition-transform duration-300 hover:scale-110">
                <div className="flex-shrink-0 mt-2 w-3 h-3 bg-info rounded-full"></div>
                  <div>
                    {l.ua}
                  </div>
                </div>
                ))}
            </div>

          {/* Carousel */}
          <div className=" ">
            <Carousel
              images={carouselImages}
            />
          </div>
        </div>

      </div>

      {/* Contacts */}
      <div
        ref={contactsRef}
        className={`snap-start flex flex-col min-h-[480px] w-full px-10 justify-around items-center md:flex-row gap-8 mt-10 md:mt-32 bg-secondary rounded-3xl py-8'
      transition-all duration-700 ease-out
          ${contactsInView ? 'opacity-100 -translate-y-4' : 'opacity-0 translate-y-4'}`}
        style={{ animationDelay: `1s` }}
      >
        <div className='flex-1 w-full'>
          <Support />
        </div>

        <div className='flex-1 mb-8 lg:my-8 flex rounded-3xl overflow-hidden lg:mr-10'>
          <img className='w-full' src={giff} alt="gif" />
        </div>
      </div>
      
    </div>
  );
};
export default HomePage;
