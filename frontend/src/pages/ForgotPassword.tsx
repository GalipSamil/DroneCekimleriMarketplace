import { useForm } from 'react-hook-form';
import { Mail, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import type { ForgotPasswordDto, ResetPasswordDto } from '../types';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { usePreferences } from '../context/preferences';
import { PASSWORD_RESET_ENABLED } from '../config/runtime';

export default function ForgotPassword() {
    const { language } = usePreferences();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const isResetRoute = location.pathname === '/reset-password';
    const resetToken = searchParams.get('token')?.trim() ?? '';
    const resetEmail = searchParams.get('email')?.trim() ?? '';
    const hasResetParams = resetToken.length > 0 && resetEmail.length > 0;
    const { loading, message, requestReset, confirmReset } = useForgotPassword(() => navigate('/login'));
    const copy = language === 'tr'
        ? {
            disabledTitle: 'Şifre Sıfırlama Kapalı',
            disabledDescription: 'Bu özellik henüz canlı ortamda aktif değil.',
            disabledBody: 'Şifre sıfırlama kullanıma açılmadan önce email servisi ve backend feature flag tamamlanmalı.',
            backToLogin: 'Giriş Sayfasına Dön',
            requestTitle: 'Şifremi Unuttum',
            resetTitle: 'Şifre Sıfırlama',
            requestDescription: 'Email adresinizi girerek şifre sıfırlama bağlantısı alabilirsiniz.',
            resetDescription: 'Emailinize gelen bağlantı üzerinden yeni şifrenizi belirleyin.',
            invalidLinkDescription: 'Şifre sıfırlama bağlantısı eksik veya geçersiz görünüyor.',
            requestNewLink: 'Yeni Sıfırlama Bağlantısı İste',
            emailLabel: 'Email Adresi',
            emailPlaceholder: 'ornek@email.com',
            emailRequired: 'Email gerekli',
            sendCode: 'Bağlantı Gönder',
            passwordLabel: 'Yeni Şifre',
            passwordRequired: 'Yeni şifre gerekli',
            passwordMin: 'En az 6 karakter olmalı',
            resetPassword: 'Şifreyi Sıfırla',
        }
        : {
            disabledTitle: 'Password Reset Disabled',
            disabledDescription: 'This feature is not active in production yet.',
            disabledBody: 'Email delivery and the backend feature flag must be fully configured before enabling password reset.',
            backToLogin: 'Back to Login',
            requestTitle: 'Forgot Password',
            resetTitle: 'Reset Password',
            requestDescription: 'Enter your email address to receive a password reset link.',
            resetDescription: 'Use the link from your email to choose a new password.',
            invalidLinkDescription: 'This password reset link is missing required information or is invalid.',
            requestNewLink: 'Request a New Reset Link',
            emailLabel: 'Email Address',
            emailPlaceholder: 'name@example.com',
            emailRequired: 'Email is required',
            sendCode: 'Send Link',
            passwordLabel: 'New Password',
            passwordRequired: 'New password is required',
            passwordMin: 'Must be at least 6 characters',
            resetPassword: 'Reset Password',
        };

    const { register: reqReg, handleSubmit: reqSubmit, formState: { errors: reqErr } } = useForm<ForgotPasswordDto>();
    const { register: resReg, handleSubmit: resSubmit, formState: { errors: resErr } } = useForm<Pick<ResetPasswordDto, 'newPassword'>>();

    if (!PASSWORD_RESET_ENABLED) {
        return (
            <AuthLayout>
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-50 mb-3">
                        {copy.disabledTitle}
                    </h1>
                    <p className="text-slate-400 text-lg font-light leading-relaxed px-4">
                        {copy.disabledDescription}
                    </p>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 md:p-10 shadow-lg text-center">
                    <p className="text-slate-300 leading-relaxed">
                        {copy.disabledBody}
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-500 font-medium transition-colors group px-4 py-2">
                        <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> {copy.backToLogin}
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    const handleResetSubmit = (data: Pick<ResetPasswordDto, 'newPassword'>) => confirmReset({
        email: resetEmail,
        token: resetToken,
        newPassword: data.newPassword,
    });

    return (
        <AuthLayout>
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-slate-50 mb-3">
                    {isResetRoute ? copy.resetTitle : copy.requestTitle}
                </h1>
                <p className="text-slate-400 text-lg font-light leading-relaxed px-4">
                    {isResetRoute
                        ? (hasResetParams ? copy.resetDescription : copy.invalidLinkDescription)
                        : copy.requestDescription}
                </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 md:p-10 shadow-lg">
                {message && (
                    <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 text-sm font-medium ${
                        message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                        <CheckCircle size={20} className={`shrink-0 ${message.type === 'error' && 'rotate-45'}`} />
                        <span className="leading-snug">{message.text}</span>
                    </div>
                )}

                {!isResetRoute ? (
                    <form onSubmit={reqSubmit(requestReset)} className="space-y-6">
                        <Input
                            label={copy.emailLabel}
                            type="email"
                            icon={Mail}
                            placeholder={copy.emailPlaceholder}
                            error={reqErr.email}
                            {...reqReg('email', { required: copy.emailRequired })}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group mt-4"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>
                                <span className="text-base font-semibold">{copy.sendCode}</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 opacity-80" />
                            </>}
                        </button>
                    </form>
                ) : !hasResetParams ? (
                    <div className="space-y-6 text-center">
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                            {copy.invalidLinkDescription}
                        </div>
                        <Link to="/forgot-password" className="inline-flex items-center gap-2 text-slate-300 hover:text-blue-500 font-medium transition-colors group px-4 py-2">
                            <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> {copy.requestNewLink}
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={resSubmit(handleResetSubmit)} className="space-y-6">
                        <Input
                            label={copy.passwordLabel}
                            type="password"
                            icon={Lock}
                            placeholder="••••••••"
                            error={resErr.newPassword}
                            {...resReg('newPassword', { required: copy.passwordRequired, minLength: { value: 6, message: copy.passwordMin } })}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group mt-4"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>
                                <span className="text-base font-semibold">{copy.resetPassword}</span>
                                <CheckCircle size={20} className="opacity-90" />
                            </>}
                        </button>
                    </form>
                )}
            </div>

            <div className="mt-8 text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-500 font-medium transition-colors group px-4 py-2">
                    <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> {copy.backToLogin}
                </Link>
            </div>
        </AuthLayout>
    );
}
