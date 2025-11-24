
import React from 'react';
import LanguageIcon from './icons/LanguageIcon';
import CloseIcon from './icons/CloseIcon';
import BurgerIcon from './icons/BurgerIcon';
import { PropertyCategory, TFunction } from '../types';

const Logo = ({ language, ...props }: { language: string } & React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="155" height="42" viewBox="0 0 155 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ direction: 'ltr' }} {...props}>
      <g className="text-brand-secondary" transform="translate(0, 0)">
        <path d="M44.5 13.134L22.5 2.5L0.5 13.134V41.5H44V13.134Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M10.5 25.5L19.5 33.5L32.5 19.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <g className="text-brand-primary" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="800">
        <text x="55" y="20" fill="currentColor" textAnchor="start">BY</text>
        <text x="55" y="40" fill="currentColor" textAnchor="start">OWNER</text>
      </g>
    </svg>
  );
};

interface HeaderProps {
    language: 'en' | 'ar';
    onLanguageToggle: () => void;
    t: TFunction;
    onShowForm: () => void;
    onShowHome: () => void;
    activeCategory: PropertyCategory;
    onSelectCategory: (category: PropertyCategory) => void;
}

const Header = ({
  language,
  onLanguageToggle,
  t,
  onShowForm,
  onShowHome,
  activeCategory,
  onSelectCategory,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks: { labelKey: string, category: PropertyCategory }[] = [
    { labelKey: 'all', category: 'all' },
    { labelKey: 'villas', category: 'villa' },
    { labelKey: 'apartments', category: 'apartment' },
    { labelKey: 'commercial', category: 'commercial' },
    { labelKey: 'land', category: 'land' },
  ];
  
  const handleSelectCategoryAndCloseMenu = (category: PropertyCategory) => {
    onSelectCategory(category);
    setIsMenuOpen(false);
  }

  const handleShowFormAndCloseMenu = () => {
    onShowForm();
    setIsMenuOpen(false);
  }
  
  const handleShowHomeAndCloseMenu = () => {
    onShowHome();
    setIsMenuOpen(false);
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button onClick={handleShowHomeAndCloseMenu} className="flex-shrink-0">
              <Logo className="h-10 w-auto" language={language} />
            </button>
          </div>

          <nav className="hidden md:flex md:space-x-8 rtl:md:space-x-reverse">
            {navLinks.map(({ labelKey, category }) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`font-medium transition-colors pb-1 ${
                  activeCategory === category
                    ? 'text-brand-secondary border-b-2 border-brand-secondary'
                    : 'text-gray-600 hover:text-brand-secondary'
                }`}
              >
                {t(labelKey as any)}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={onShowForm}
              className="hidden sm:inline-block bg-brand-secondary text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-opacity-90 transition-all transform hover:scale-105"
            >
              {t('submit_your_property')}
            </button>
            <button
              onClick={onLanguageToggle}
              className="flex items-center p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary"
              aria-label="Toggle language"
            >
              <LanguageIcon className="h-6 w-6" />
              <span className="ms-2 font-semibold uppercase">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
             <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                    {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <BurgerIcon className="w-6 h-6" />}
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg z-40 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
        <nav className="flex flex-col items-center space-y-4 p-6">
           {navLinks.map(({ labelKey, category }) => (
              <button
                key={category}
                onClick={() => handleSelectCategoryAndCloseMenu(category)}
                className={`font-medium text-lg w-full text-center py-2 rounded-md ${
                  activeCategory === category
                    ? 'text-white bg-brand-secondary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t(labelKey as any)}
              </button>
            ))}
            <button
              onClick={handleShowFormAndCloseMenu}
              className="w-full bg-brand-secondary text-white font-bold py-3 px-5 rounded-lg shadow-md hover:bg-opacity-90 transition-all text-lg mt-4"
            >
              {t('submit_your_property')}
            </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
