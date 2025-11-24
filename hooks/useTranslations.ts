
import React from 'react';
import { translations } from '../constants/translations';
import { TranslationKey } from '../types';

const useTranslations = () => {
  const [lang, setLang] = React.useState<'en' | 'ar'>('en');

  const t = React.useCallback(
    (key: TranslationKey | string) => {
      // @ts-ignore
      return translations[lang][key] || key;
    },
    [lang]
  );

  return { t, setLang, lang };
};

export { useTranslations };
