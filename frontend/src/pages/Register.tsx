import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, AlertCircle, ArrowRight, Plane } from 'lucide-react';
import { authAPI, extractApiErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/preferences';
import type { RegisterDto } from '../types';
import { getAuthFlagsFromToken } from '../utils/authToken';

type RegisterFormValues = RegisterDto & {
    confirmPassword: string;
};

export default function Register() {
    const { language } = usePreferences();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const copy = language === 'tr'
        ? {
            titleLead: 'Aramıza',
            titleAccent: 'Katılın',
            description: 'Hızlıca bir hesap oluşturarak başlayın',
            roleTitle: 'Pilot Hesabı Oluştur',
            roleDescription: 'Drone pilotu olarak hizmet vermek istiyorum',
            fullName: 'Ad Soyad',
            fullNameRequired: 'Ad Soyad alanı zorunludur',
            fullNamePlaceholder: 'Ahmet Yılmaz',
            email: 'Email Adresi',
            emailRequired: 'Email adresi zorunludur',
            emailPlaceholder: 'ornek@email.com',
            password: 'Şifre',
            passwordRequired: 'Şifre zorunludur',
            confirmPassword: 'Şifre Tekrar',
            confirmPasswordRequired: 'Şifre tekrarı zorunludur',
            passwordMismatch: 'Şifreler uyuşmuyor',
            passwordMin: 'Şifreniz en az 6 karakter olmalıdır',
            passwordUppercase: 'Şifreniz en az 1 büyük harf içermelidir',
            passwordLowercase: 'Şifreniz en az 1 küçük harf içermelidir',
            passwordDigit: 'Şifreniz en az 1 rakam içermelidir',
            register: 'Kayıt Ol',
            loginPrompt: 'Zaten bir hesabınız var mı?',
            login: 'Giriş Yapın',
            invalidResponse: 'Invalid response from server',
            registerFailed: 'Kayıt işlemi başarısız oldu.',
        }
        : {
            titleLead: 'Join',
            titleAccent: 'Us',
            description: 'Create your account and get started quickly',
            roleTitle: 'Create a Pilot Account',
            roleDescription: 'I want to offer services as a drone pilot',
            fullName: 'Full Name',
            fullNameRequired: 'Full name is required',
            fullNamePlaceholder: 'John Doe',
            email: 'Email Address',
            emailRequired: 'Email address is required',
            emailPlaceholder: 'name@example.com',
            password: 'Password',
            passwordRequired: 'Password is required',
            confirmPassword: 'Confirm Password',
            confirmPasswordRequired: 'Password confirmation is required',
            passwordMismatch: 'Passwords do not match',
            passwordMin: 'Your password must be at least 6 characters',
            passwordUppercase: 'Your password must contain at least 1 uppercase letter',
            passwordLowercase: 'Your password must contain at least 1 lowercase letter',
            passwordDigit: 'Your password must contain at least 1 number',
            register: 'Create Account',
            loginPrompt: 'Already have an account?',
            login: 'Log In',
            invalidResponse: 'Invalid response from server',
            registerFailed: 'Registration failed.',
        };

    const passwordValue = watch('password', '');

    // Watch the pilot checkbox to dynamically change active styles
    const isPilotSelected = watch('isPilot', false);

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setLoading(true);
            setError('');
            const { confirmPassword: _confirmPassword, ...registerData } = data;
            const response = await authAPI.register(registerData);
            const userId = response.UserId || response.userId;

            if (userId) {
                const loginResponse = await authAPI.login({
                    email: registerData.email,
                    password: registerData.password
                });

                if (loginResponse && loginResponse.token) {
                    const authFlags = getAuthFlagsFromToken(loginResponse.token);
                    login(loginResponse.userId, loginResponse.token);
                    navigate(authFlags.isAdmin ? '/admin' : (authFlags.isPilot ? '/pilot/dashboard' : '/customer/dashboard'));
                } else {
                    navigate('/login');
                }
            } else {
                throw new Error(copy.invalidResponse);
            }
        } catch (err: unknown) {
            setError(extractApiErrorMessage(err, copy.registerFailed));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-50 mb-3">
                        {copy.titleLead} <span className="text-blue-500">{copy.titleAccent}</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">{copy.description}</p>
                </div>

                <div className="bg-slate-900/60 p-8 sm:p-10 rounded-2xl shadow-2xl backdrop-blur-xl border border-slate-800/60">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* Custom Role Selector (Pilot Toggle) */}
                        <label 
                            className={`relative flex items-center p-4 cursor-pointer rounded-xl border transition-all duration-200 ${
                                isPilotSelected 
                                ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                                : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
                            }`}
                        >
                            <input
                                type="checkbox"
                                {...register('isPilot')}
                                className="sr-only"
                            />
                            <div className={`p-2 rounded-lg mr-4 transition-colors ${isPilotSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                                <Plane size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-medium transition-colors ${isPilotSelected ? 'text-blue-100' : 'text-slate-200'}`}>
                                    {copy.roleTitle}
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">{copy.roleDescription}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isPilotSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                            }`}>
                                {isPilotSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                        </label>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">{copy.fullName}</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        {...register('fullName', { required: copy.fullNameRequired })}
                                        className={`block w-full pl-11 pr-4 py-3 bg-slate-800/50 border rounded-xl text-slate-200 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:bg-slate-800/80 ${
                                            errors.fullName ? 'border-red-500/50 focus:border-red-500/50' : 'border-slate-700 focus:border-blue-500/50'
                                        }`}
                                        placeholder={copy.fullNamePlaceholder}
                                    />
                                </div>
                                {errors.fullName && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.fullName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">{copy.email}</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        {...register('email', { required: copy.emailRequired })}
                                        className={`block w-full pl-11 pr-4 py-3 bg-slate-800/50 border rounded-xl text-slate-200 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:bg-slate-800/80 ${
                                            errors.email ? 'border-red-500/50 focus:border-red-500/50' : 'border-slate-700 focus:border-blue-500/50'
                                        }`}
                                        placeholder={copy.emailPlaceholder}
                                    />
                                </div>
                                {errors.email && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">{copy.password}</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        {...register('password', {
                                            required: copy.passwordRequired,
                                            minLength: { value: 6, message: copy.passwordMin },
                                            validate: {
                                                hasUppercase: (value) => /[A-Z]/.test(value) || copy.passwordUppercase,
                                                hasLowercase: (value) => /[a-z]/.test(value) || copy.passwordLowercase,
                                                hasDigit: (value) => /\d/.test(value) || copy.passwordDigit,
                                            }
                                        })}
                                        className={`block w-full pl-11 pr-4 py-3 bg-slate-800/50 border rounded-xl text-slate-200 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:bg-slate-800/80 ${
                                            errors.password ? 'border-red-500/50 focus:border-red-500/50' : 'border-slate-700 focus:border-blue-500/50'
                                        }`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">{copy.confirmPassword}</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        {...register('confirmPassword', {
                                            required: copy.confirmPasswordRequired,
                                            validate: (value) => value === passwordValue || copy.passwordMismatch
                                        })}
                                        className={`block w-full pl-11 pr-4 py-3 bg-slate-800/50 border rounded-xl text-slate-200 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:bg-slate-800/80 ${
                                            errors.confirmPassword ? 'border-red-500/50 focus:border-red-500/50' : 'border-slate-700 focus:border-blue-500/50'
                                        }`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-bottom-2">
                                <AlertCircle size={18} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-colors duration-200 ${
                                loading 
                                ? 'bg-blue-600/50 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-500'
                            }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{copy.register}</span>
                                    <ArrowRight size={18} className="opacity-80" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-400 text-sm">
                    {copy.loginPrompt}{' '}
                    <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium hover:underline transition-all">
                        {copy.login}
                    </Link>
                </p>
            </div>
        </div>
    );
}
