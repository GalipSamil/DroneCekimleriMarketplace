import { useState } from 'react';
import { authAPI } from '../services/api';
import type { ForgotPasswordDto, ResetPasswordDto } from '../types';

export const useForgotPassword = (onSuccessReset: () => void) => {
    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [email, setEmail] = useState('');

    const requestReset = async (data: ForgotPasswordDto) => {
        try {
            setLoading(true);
            setMessage(null);
            await authAPI.forgotPassword(data);
            setEmail(data.email);
            setStep('reset');
            setMessage({ type: 'success', text: 'Sıfırlama kodu email adresinize gönderildi.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Bir hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    const confirmReset = async (data: Omit<ResetPasswordDto, 'email'>) => {
        try {
            setLoading(true);
            setMessage(null);
            await authAPI.resetPassword({ ...data, email });
            setMessage({ type: 'success', text: 'Şifreniz başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz...' });
            setTimeout(onSuccessReset, 3000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Bir hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    return { step, loading, message, requestReset, confirmReset };
};
