import { useState, useEffect, useCallback } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { translateText, translateBatch } from '@/services/translateService';

/**
 * Hook for translating text based on current language setting
 */
export function useTranslation() {
  const { language } = useThemeStore();
  const [isTranslating, setIsTranslating] = useState(false);

  const t = useCallback(
    async (text: string): Promise<string> => {
      if (!text || language === 'en') return text;
      if (isTranslating) return text;

      setIsTranslating(true);
      try {
        const translated = await translateText(text, language);
        return translated;
      } catch (error) {
        console.error('Translation error:', error);
        return text;
      } finally {
        setIsTranslating(false);
      }
    },
    [language, isTranslating]
  );

  const translateMultiple = useCallback(
    async (texts: string[]): Promise<string[]> => {
      if (!texts.length || language === 'en') return texts;

      setIsTranslating(true);
      try {
        const translated = await translateBatch(texts, language);
        return translated;
      } catch (error) {
        console.error('Translation error:', error);
        return texts;
      } finally {
        setIsTranslating(false);
      }
    },
    [language]
  );

  return { t, translateMultiple, isTranslating, currentLanguage: language };
}

/**
 * Hook for translating component text with caching
 */
export function useTranslatedText(originalText: string): string {
  const { language } = useThemeStore();
  const [translatedText, setTranslatedText] = useState(originalText);

  useEffect(() => {
    if (!originalText || language === 'en') {
      setTranslatedText(originalText);
      return;
    }

    let cancelled = false;

    translateText(originalText, language)
      .then((translated) => {
        if (!cancelled) {
          setTranslatedText(translated);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTranslatedText(originalText);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [originalText, language]);

  return translatedText;
}

