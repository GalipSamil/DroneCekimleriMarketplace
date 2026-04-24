/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { getAuthFlagsFromToken } from '../utils/authToken';

interface AuthContextType {
    userId: string | null;
    isPilot: boolean;
    isAdmin: boolean;
    token: string | null;
    isAuthenticated: boolean;
    login: (userId: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const storedToken = localStorage.getItem('token');
    const storedAuthFlags = getAuthFlagsFromToken(storedToken);

    const [userId, setUserId] = useState<string | null>(
        localStorage.getItem('userId')
    );
    const [isPilot, setIsPilot] = useState<boolean>(
        storedAuthFlags.isPilot
    );
    const [isAdmin, setIsAdmin] = useState<boolean>(
        storedAuthFlags.isAdmin
    );
    const [token, setToken] = useState<string | null>(
        storedToken
    );

    const login = (id: string, accessToken: string) => {
        const authFlags = getAuthFlagsFromToken(accessToken);

        setUserId(id);
        setIsPilot(authFlags.isPilot);
        setIsAdmin(authFlags.isAdmin);
        setToken(accessToken);
        
        localStorage.setItem('userId', id);
        localStorage.setItem('isPilot', authFlags.isPilot.toString());
        localStorage.setItem('isAdmin', authFlags.isAdmin.toString());
        localStorage.setItem('token', accessToken);
    };

    const logout = () => {
        setUserId(null);
        setIsPilot(false);
        setIsAdmin(false);
        setToken(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('isPilot');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                userId,
                isPilot,
                isAdmin,
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
