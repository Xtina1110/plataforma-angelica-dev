import { useLanguage as useLanguageContext } from '../contexts/LanguageContext';

// Re-exportar el hook del contexto para facilitar el uso
export const useLanguage = useLanguageContext;

export default useLanguage;