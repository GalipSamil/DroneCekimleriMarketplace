import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import type { LoginDto } from '../types';
import { Input } from '../components/common/Input';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useLogin } from '../hooks/useLogin';
import { usePreferences } from '../context/preferences';
import { PASSWORD_RESET_ENABLED } from '../config/runtime';

export default function Login() {
    const { language } = usePreferences();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>();
    const { submit, loading, error } = useLogin();
    const copy = language === 'tr'
        ? {
            titleLead: 'Tekrar',
            titleAccent: 'Hoşgeldiniz',
            description: 'Hesabınıza giriş yaparak devam edin',
            emailLabel: 'Email Adresi',
            emailPlaceholder: 'ornek@email.com',
            emailRequired: 'Email adresi zorunludur',
            emailInvalid: 'Geçerli bir email girin',
            passwordLabel: 'Şifre',
            forgotPassword: 'Şifremi Unuttum?',
            passwordRequired: 'Şifre zorunludur',
            passwordMin: 'En az 6 karakter olmalı',
            submit: 'Giriş Yap',
            noAccount: 'Hesabınız yok mu?',
            register: 'Hemen Kayıt Olun',
        }
        : {
            titleLead: 'Welcome',
            titleAccent: 'Back',
            description: 'Sign in to continue to your account',
            emailLabel: 'Email Address',
            emailPlaceholder: 'name@example.com',
            emailRequired: 'Email address is required',
            emailInvalid: 'Enter a valid email address',
            passwordLabel: 'Password',
            forgotPassword: 'Forgot Password?',
            passwordRequired: 'Password is required',
            passwordMin: 'Must be at least 6 characters',
            submit: 'Log In',
            noAccount: "Don't have an account?",
            register: 'Create One Now',
        };

    return (
        <AuthLayout>
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-slate-50 mb-3">
                    {copy.titleLead}{' '}
                    <span className="text-blue-500">{copy.titleAccent}</span>
                </h1>
                <p className="text-slate-400 font-light">{copy.description}</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 md:p-10 shadow-lg">
                <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
                    <Input
                        label={copy.emailLabel}
                        type="email"
                        icon={Mail}
                        placeholder={copy.emailPlaceholder}
                        error={errors.email}
                        {...register('email', {
                            required: copy.emailRequired,
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: copy.emailInvalid }
                        })}
                    />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <span className="text-sm font-semibold text-slate-300">{copy.passwordLabel}</span>
                            {PASSWORD_RESET_ENABLED && (
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors"
                                >
                                    {copy.forgotPassword}
                                </Link>
                            )}
                        </div>
                        <Input
                            label=""
                            type="password"
                            icon={Lock}
                            placeholder="••••••••"
                            error={errors.password}
                            {...register('password', {
                                required: copy.passwordRequired,
                                minLength: { value: 6, message: copy.passwordMin }
                            })}
                        />
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-colors duration-200 text-base mt-2 ${
                            loading
                                ? 'bg-blue-600/50 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500'
                        }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>{copy.submit}</span>
                                <ArrowRight size={18} className="opacity-80 group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <p className="text-center mt-8 text-slate-400 text-sm">
                {copy.noAccount}{' '}
                <Link to="/register" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                    {copy.register}
                </Link>
            </p>
        </AuthLayout>
    );
}
