import { useState } from 'react';
import { authAPI, extractApiErrorMessage } from '../services/api';
import { usePreferences } from '../context/preferences';
import type { ForgotPasswordDto, ResetPasswordDto } from '../types';

export const useForgotPassword = (onSuccessReset: () => void) => {
    const { language } = usePreferences();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const copy = language === 'tr'
        ? {
            emailMessage: 'Eğer bu email kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.',
            genericError: 'Bir hata oluştu.',
            successReset: 'Şifreniz başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz...',
        }
        : {
            emailMessage: 'If your email is registered, a password reset link has been sent.',
            genericError: 'Something went wrong.',
            successReset: 'Your password has been reset successfully. Redirecting you to the login page...',
        };

    const requestReset = async (data: ForgotPasswordDto) => {
        try {
            setLoading(true);
            setMessage(null);
            const response = await authAPI.forgotPassword(data);
            setMessage({
                type: 'success',
                text: response.message || copy.emailMessage
            });
        } catch (err: unknown) {
            setMessage({ type: 'error', text: extractApiErrorMessage(err, copy.genericError) });
        } finally {
            setLoading(false);
        }
    };

    const confirmReset = async (data: ResetPasswordDto) => {
        try {
            setLoading(true);
            setMessage(null);
            const response = await authAPI.resetPassword(data);
            setMessage({ type: 'success', text: response.message || copy.successReset });
            setTimeout(onSuccessReset, 3000);
        } catch (err: unknown) {
            setMessage({ type: 'error', text: extractApiErrorMessage(err, copy.genericError) });
        } finally {
            setLoading(false);
        }
    };

    return { loading, message, requestReset, confirmReset };
};
