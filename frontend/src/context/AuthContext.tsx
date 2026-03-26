/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
    userId: string | null;
    isPilot: boolean;
    token: string | null;
    isAuthenticated: boolean;
    login: (userId: string, isPilot: boolean, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<string | null>(
        localStorage.getItem('userId')
    );
    const [isPilot, setIsPilot] = useState<boolean>(
        localStorage.getItem('isPilot') === 'true'
    );
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    );

    const login = (id: string, pilot: boolean, accessToken: string) => {
        setUserId(id);
        setIsPilot(pilot);
        setToken(accessToken);
        localStorage.setItem('userId', id);
        localStorage.setItem('isPilot', pilot.toString());
        localStorage.setItem('token', accessToken);
    };

    const logout = () => {
        setUserId(null);
        setIsPilot(false);
        setToken(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('isPilot');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                userId,
                isPilot,
                token,
                isAuthenticated: !!userId,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
