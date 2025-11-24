
import React, { useState, useEffect, useCallback } from 'react';
import { Property, TFunction } from '../types';

interface HeroSliderProps {
  properties: Property[];
  t: TFunction;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ properties, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
  }, [properties.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  const currentProperty = properties[currentIndex];

  return (
    <div className="relative w-full h-[60vh] max-h-[600px] overflow-hidden bg-brand-dark">
      {properties.map((property, index) => (
        <div
          key={property.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={property.coverImage}
            alt={t(property.type)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      ))}
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-4">
        <h2 className="text-4xl md:text-6xl font-bold drop-shadow-lg mb-4 animate-fade-in-down">
          {t(currentProperty.type)}
        </h2>
        <p className="text-xl md:text-2xl drop-shadow-lg animate-fade-in-up">
          {currentProperty.address.en}
        </p>
      </div>

      <div className="absolute z-20 bottom-5 left-1/2 -translate-x-1/2 flex space-x-3 rtl:space-x-reverse">
        {properties.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-brand-secondary scale-125' : 'bg-white opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
