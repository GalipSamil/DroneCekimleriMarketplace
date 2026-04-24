import { createContext, useContext } from 'react';

export type AppLanguage = 'tr' | 'en';
export type AppTheme = 'dark' | 'light';

export interface PreferencesContextType {
    language: AppLanguage;
    theme: AppTheme;
    setLanguage: (language: AppLanguage) => void;
    setTheme: (theme: AppTheme) => void;
    toggleTheme: () => void;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferences = () => {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within PreferencesProvider');
    }

    return context;
};
