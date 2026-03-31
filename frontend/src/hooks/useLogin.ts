import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, extractApiErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { LoginDto } from '../types';

export const useLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (data: LoginDto) => {
        try {
            setLoading(true);
            setError('');
            const response = await authAPI.login(data);
            const payload = response.data;

            if (payload?.userId && payload.token) {
                login(payload.userId, payload.isPilot, payload.token, data.email);
                
                const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
                if (adminEmail && data.email === adminEmail) {
                    navigate('/admin');
                } else {
                    navigate(payload.isPilot ? '/pilot/dashboard' : '/customer/dashboard');
                }
                return;
            }

            setError(response.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
        } catch (err: unknown) {
            setError(extractApiErrorMessage(err, 'Giriş başarısız. Bilgilerinizi kontrol edin.'));
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, error };
};
