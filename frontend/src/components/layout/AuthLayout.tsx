import React from 'react';
import { usePreferences } from '../../context/preferences';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const { theme } = usePreferences();
    const isLight = theme === 'light';

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${isLight ? 'bg-slate-50' : 'bg-[#020617]'}`}>
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
};
