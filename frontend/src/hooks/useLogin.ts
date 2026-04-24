import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, extractApiErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/preferences';
import type { LoginDto } from '../types';
import { getAuthFlagsFromToken } from '../utils/authToken';

export const useLogin = () => {
    const { login } = useAuth();
    const { language } = usePreferences();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fallbackError = language === 'tr'
        ? 'Giriş başarısız. Bilgilerinizi kontrol edin.'
        : 'Login failed. Check your credentials and try again.';

    const submit = async (data: LoginDto) => {
        try {
            setLoading(true);
            setError('');
            const response = await authAPI.login(data);
            const payload = response.data;

            if (payload?.userId && payload.token) {
                const authFlags = getAuthFlagsFromToken(payload.token);
                login(payload.userId, payload.token);
                navigate(authFlags.isAdmin ? '/admin' : (authFlags.isPilot ? '/pilot/dashboard' : '/customer/dashboard'));
                return;
            }

            setError(response.message || fallbackError);
        } catch (err: unknown) {
            setError(extractApiErrorMessage(err, fallbackError));
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, error };
};
