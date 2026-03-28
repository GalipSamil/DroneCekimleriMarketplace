import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
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
            if (response.userId && response.token) {
                login(response.userId, response.isPilot, response.token, data.email);
                
                const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
                if (adminEmail && data.email === adminEmail) {
                    navigate('/admin');
                } else {
                    navigate(response.isPilot ? '/pilot/dashboard' : '/customer/dashboard');
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, error };
};
