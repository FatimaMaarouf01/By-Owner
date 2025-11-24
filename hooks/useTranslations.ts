
import { useState, useCallback } from 'react';
import { translations } from '../constants/translations';
import { Language, TranslationKey } from '../types';

export const useTranslations = () => {
  const [lang, setLang] = useState<Language>('en');

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[lang][key] || key;
    },
    [lang]
  );

  return { t, setLang, lang };
};
