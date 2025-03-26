import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CarouselProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  autoPlay?: boolean;
  interval?: number;
}

export function Carousel({ images, autoPlay = true, interval = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const timeoutRef = React.useRef<number | null>(null);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const previousSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  React.useEffect(() => {
    if (isPlaying) {
      timeoutRef.current = window.setTimeout(nextSlide, interval);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isPlaying, interval, nextSlide]);

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full max-w-5xl">
      {/* Main carousel container */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="object-cover w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between">
        <Button
          isIconOnly
          variant="flat"
          className="bg-background/60 backdrop-blur-lg"
          onPress={previousSlide}
          isDisabled={currentIndex === 0}
        >
          <Icon icon="lucide:chevron-left" width={24} />
        </Button>
        <Button
          isIconOnly
          variant="flat"
          className="bg-background/60 backdrop-blur-lg"
          onPress={nextSlide}
          isDisabled={currentIndex === images.length - 1}
        >
          <Icon icon="lucide:chevron-right" width={24} />
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-secondary w-4"
                : "bg-default-300"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Autoplay control */}
      <Button
        isIconOnly
        variant="flat"
        className="absolute bottom-4 right-4 bg-background/60 backdrop-blur-lg"
        onPress={toggleAutoPlay}
      >
        <Icon
          icon={isPlaying ? "lucide:pause" : "lucide:play"}
          width={24}
        />
      </Button>
    </div>
  );
}
