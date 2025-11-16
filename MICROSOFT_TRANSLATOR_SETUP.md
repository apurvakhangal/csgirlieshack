# Microsoft Translator API Setup Guide

## Setup Steps

### 1. Get RapidAPI Key

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up or log in
3. Search for "Microsoft Translator Text" API
4. Subscribe to the API (there's a free tier available)
5. Copy your RapidAPI Key from the dashboard

### 2. Add API Key to Environment

Create or update `.env.local` file in the root directory:

```env
VITE_RAPIDAPI_KEY=your-rapidapi-key-here
```

### 3. Restart Dev Server

```bash
npm run dev
```

## API Endpoints Used

The service uses these Microsoft Translator endpoints via RapidAPI:

- **Translate**: `POST https://microsoft-translator-text.p.rapidapi.com/translate`
- **Detect Language**: `POST https://microsoft-translator-text.p.rapidapi.com/detect`
- **Get Languages**: `GET https://microsoft-translator-text.p.rapidapi.com/languages`

## Features

- ✅ **100+ Languages Supported** - Microsoft Translator supports more languages than Google
- ✅ **Automatic Language Detection** - Detects source language automatically
- ✅ **Batch Translation** - Translate multiple texts at once
- ✅ **Language Selector** - Available in navbar and settings
- ✅ **Real-time Translation** - Translates UI text based on selected language

## Usage

The translation service is automatically integrated throughout the app:

1. **Language Selector in Navbar**: Click the language dropdown to change language
2. **Settings Page**: Set your preferred language (saved to localStorage)
3. **Automatic Translation**: UI text will be translated when language changes

## Code Usage

```typescript
import { translateText } from '@/services/translateService';

// Translate a single text
const translated = await translateText('Hello World', 'es'); // Spanish

// Translate multiple texts
import { translateBatch } from '@/services/translateService';
const translated = await translateBatch(['Hello', 'World'], 'fr'); // French

// Detect language
import { detectLanguage } from '@/services/translateService';
const lang = await detectLanguage('Bonjour'); // Returns 'fr'
```

## Using the Hook

```typescript
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { t, currentLanguage } = useTranslation();
  
  useEffect(() => {
    t('Hello World').then(translated => {
      console.log(translated);
    });
  }, [currentLanguage]);
}
```

## Language Codes

Microsoft Translator uses standard language codes:
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `zh-Hans` - Chinese Simplified
- `zh-Hant` - Chinese Traditional
- And 100+ more...

## Pricing

RapidAPI offers a free tier for Microsoft Translator:
- Free tier: Limited requests per month
- Paid plans: More requests available

Check RapidAPI pricing for current rates.

## Troubleshooting

### Error: "RapidAPI key not configured"
- Make sure you've added `VITE_RAPIDAPI_KEY` to your `.env.local` file
- Restart the dev server after adding the key

### Error: "Translation failed"
- Check if your RapidAPI subscription is active
- Verify you have remaining API calls in your quota
- Check browser console for detailed error messages

### Translations not working
- Ensure the language code matches Microsoft Translator format
- Some language codes differ from Google Translate (e.g., `zh-Hans` instead of `zh`)

