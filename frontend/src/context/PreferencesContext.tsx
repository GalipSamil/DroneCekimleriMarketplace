import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { PreferencesContext, type AppLanguage, type AppTheme } from './preferences';

const LANGUAGE_STORAGE_KEY = 'app-language';
const THEME_STORAGE_KEY = 'app-theme';

const getInitialLanguage = (): AppLanguage => {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedLanguage === 'en' ? 'en' : 'tr';
};

const getInitialTheme = (): AppTheme => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};
export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<AppLanguage>(getInitialLanguage);
    const [theme, setTheme] = useState<AppTheme>(getInitialTheme);

    useEffect(() => {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        document.documentElement.lang = language;
    }, [language]);

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
    }, [theme]);

    const value = useMemo(() => ({
        language,
        theme,
        setLanguage,
        setTheme,
        toggleTheme: () => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark'),
    }), [language, theme]);

    return (
        <PreferencesContext.Provider value={value}>
            {children}
        </PreferencesContext.Provider>
    );
};
