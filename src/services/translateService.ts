/**
 * Microsoft Translator API Service via RapidAPI
 * Uses Microsoft Translator REST API for frontend translation
 */

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '90c67853ddmshb5725593a51d0adp1bcebbjsn6b98793a34aa';
const RAPIDAPI_HOST = 'microsoft-translator-text-api3.p.rapidapi.com';
const TRANSLATE_API_URL = `https://${RAPIDAPI_HOST}/largetranslate`;

interface TranslateResponse {
  translations: Array<{
    text: string;
    to: string;
  }>;
}

interface DetectResponse {
  language: string;
  score: number;
}

/**
 * Translate text using Microsoft Translator API via RapidAPI
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<string> {
  if (!text || !targetLanguage) return text;
  if (targetLanguage === 'en' && sourceLanguage === 'en') return text;
  if (!RAPIDAPI_KEY) {
    console.warn('RapidAPI key not configured. Please set VITE_RAPIDAPI_KEY in your .env file');
    return text;
  }

  try {
    const url = new URL(TRANSLATE_API_URL);
    url.searchParams.append('to', targetLanguage);
    if (sourceLanguage !== 'auto') {
      url.searchParams.append('from', sourceLanguage);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
      body: JSON.stringify({
        sep: '|',
        text: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Translation failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    // The API response format may vary - handle different possible formats
    console.log('Translation API response:', data); // Debug log
    
    // Handle different response formats
    if (typeof data === 'string') {
      return data;
    }
    // Check for common response formats
    if (data.translatedText) {
      return data.translatedText;
    }
    if (data.text) {
      return data.text;
    }
    if (data.result) {
      return data.result;
    }
    if (data.translation) {
      return data.translation;
    }
    // If response is an array (some APIs return arrays)
    if (Array.isArray(data) && data.length > 0) {
      if (typeof data[0] === 'string') {
        return data[0];
      }
      if (data[0].text) {
        return data[0].text;
      }
      if (data[0].translatedText) {
        return data[0].translatedText;
      }
    }
    // Fallback: return original text if format is unknown
    console.warn('Unknown translation response format:', data);
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

/**
 * Translate multiple texts at once
 */
export async function translateBatch(
  texts: string[],
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<string[]> {
  if (!texts.length || !targetLanguage) return texts;
  if (targetLanguage === 'en' && sourceLanguage === 'en') return texts;
  if (!RAPIDAPI_KEY) {
    console.warn('RapidAPI key not configured');
    return texts;
  }

  try {
    // Join texts with separator for batch translation
    const combinedText = texts.join(' | ');
    
    const url = new URL(TRANSLATE_API_URL);
    url.searchParams.append('to', targetLanguage);
    if (sourceLanguage !== 'auto') {
      url.searchParams.append('from', sourceLanguage);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
      body: JSON.stringify({
        sep: '|',
        text: combinedText,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Split the translated text back into array
    let translatedText = '';
    if (typeof data === 'string') {
      translatedText = data;
    } else if (data.translatedText) {
      translatedText = data.translatedText;
    } else if (data.text) {
      translatedText = data.text;
    } else {
      return texts;
    }

    // Split by separator and trim
    return translatedText.split('|').map((t: string) => t.trim());
  } catch (error) {
    console.error('Translation error:', error);
    return texts; // Return original texts on error
  }
}

/**
 * Detect the language of a text
 * Note: This endpoint might not be available in the RapidAPI version
 * Falls back to 'en' if detection fails
 */
export async function detectLanguage(text: string): Promise<string> {
  if (!text || !RAPIDAPI_KEY) return 'en';

  try {
    // Try to use detect endpoint if available
    const url = new URL(`https://${RAPIDAPI_HOST}/detect`);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
      body: JSON.stringify({
        text: text,
      }),
    });

    if (!response.ok) {
      // If detect endpoint doesn't exist, return 'en' as default
      return 'en';
    }

    const data = await response.json();
    if (Array.isArray(data) && data[0]?.language) {
      return data[0].language;
    }
    if (data.language) {
      return data.language;
    }
    return 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
}

/**
 * Get list of supported languages from Microsoft Translator API
 */
export async function getSupportedLanguages(): Promise<Array<{ code: string; name: string }>> {
  if (!RAPIDAPI_KEY) {
    return SUPPORTED_LANGUAGES;
  }

  try {
    const url = new URL(`https://${RAPIDAPI_HOST}/languages`);
    url.searchParams.append('api-version', '3.0');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      return SUPPORTED_LANGUAGES;
    }

    const data = await response.json();
    const languages: Array<{ code: string; name: string }> = [];
    
    if (data.translation) {
      Object.entries(data.translation).forEach(([code, info]: [string, any]) => {
        languages.push({
          code,
          name: info.name || code,
        });
      });
    }

    return languages.length > 0 ? languages : SUPPORTED_LANGUAGES;
  } catch (error) {
    console.error('Error fetching languages:', error);
    return SUPPORTED_LANGUAGES;
  }
}

/**
 * Default list of supported languages (Microsoft Translator supports 100+)
 * The getSupportedLanguages() function will fetch the full list from the API
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh-Hans', name: 'Chinese (Simplified)' },
  { code: 'zh-Hant', name: 'Chinese (Traditional)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'cs', name: 'Czech' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'he', name: 'Hebrew' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'el', name: 'Greek' },
  { code: 'hu', name: 'Hungarian' },
];
