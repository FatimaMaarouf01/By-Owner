
import React from 'react';
import { TFunction } from '../types';

interface FooterProps {
  t: TFunction;
  onShowAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ t, onShowAdmin }) => {
  return (
    <footer className="bg-brand-dark text-white mt-auto">
      <div className="container mx-auto py-6 px-4 text-center">
        <p className="text-white font-medium mb-1">{t('footer_text')}</p>
        <p className="text-sm text-gray-400">{t('powered_by')}</p>
        <div className="mt-4">
            <button onClick={onShowAdmin} className="text-sm text-gray-400 hover:text-white transition-colors">
                {t('admin')}
            </button>
        </div>
      </div>
    </footer>
  );
};
