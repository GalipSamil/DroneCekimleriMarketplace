import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import type { LoginDto } from '../types';
import { Input } from '../components/common/Input';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useLogin } from '../hooks/useLogin';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>();
    const { submit, loading, error } = useLogin();

    return (
        <AuthLayout>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
                    Tekrar{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                        Hoşgeldiniz
                    </span>
                </h1>
                <p className="text-slate-400 font-light">Hesabınıza giriş yaparak devam edin</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 md:p-10 shadow-2xl">
                <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
                    <Input
                        label="Email Adresi"
                        type="email"
                        icon={Mail}
                        placeholder="ornek@email.com"
                        error={errors.email}
                        {...register('email', {
                            required: 'Email adresi zorunludur',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Geçerli bir email girin' }
                        })}
                    />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <span className="text-sm font-semibold text-slate-300">Şifre</span>
                            <Link
                                to="/forgot-password"
                                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                Şifremi Unuttum?
                            </Link>
                        </div>
                        <Input
                            label=""
                            type="password"
                            icon={Lock}
                            placeholder="••••••••"
                            error={errors.password}
                            {...register('password', {
                                required: 'Şifre zorunludur',
                                minLength: { value: 6, message: 'En az 6 karakter olmalı' }
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
                        className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-200 text-base mt-2 ${
                            loading
                                ? 'bg-blue-600/50 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/30 hover:-translate-y-0.5'
                        }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Giriş Yap</span>
                                <ArrowRight size={18} className="opacity-80 group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <p className="text-center mt-8 text-slate-400 text-sm">
                Hesabınız yok mu?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Hemen Kayıt Olun
                </Link>
            </p>
        </AuthLayout>
    );
}
