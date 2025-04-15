import { Language, languageCodes, LanguageCode } from "@shared/schema";

// Get the first character of the native language name for display
export function getLanguageChar(language: Language): string {
  return language.nativeName.charAt(0);
}

// Map language code to full name
export function getLanguageFullName(code: LanguageCode): string {
  const languageMap: Record<LanguageCode, string> = {
    hi: 'Hindi',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    kn: 'Kannada',
    ml: 'Malayalam',
    pa: 'Punjabi',
    mr: 'Marathi',
    gu: 'Gujarati',
    ur: 'Urdu',
    or: 'Odia'
  };
  
  return languageMap[code] || code;
}

// Get language support text for product
export function getLanguageSupportText(languageCodes: string[]): string {
  if (languageCodes.length === 0) {
    return 'No language support';
  }
  
  if (languageCodes.length > 3) {
    return `Supports ${languageCodes.length} languages`;
  }
  
  return languageCodes.map(code => {
    if (code === 'en') return 'English';
    return getLanguageFullName(code as LanguageCode);
  }).join(', ');
}
