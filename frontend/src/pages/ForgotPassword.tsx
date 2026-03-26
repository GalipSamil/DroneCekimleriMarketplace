import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, ArrowRight, CheckCircle, Lock, KeyRound } from 'lucide-react';
import { authAPI } from '../services/api';
import type { ForgotPasswordDto, ResetPasswordDto } from '../types';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [email, setEmail] = useState('');

    const {
        register: registerRequest,
        handleSubmit: handleSubmitRequest,
        formState: { errors: errorsRequest }
    } = useForm<ForgotPasswordDto>();

    const {
        register: registerReset,
        handleSubmit: handleSubmitReset,
        formState: { errors: errorsReset }
    } = useForm<Omit<ResetPasswordDto, 'email'>>();

    const onRequestSubmit = async (data: ForgotPasswordDto) => {
        try {
            setLoading(true);
            setMessage(null);
            await authAPI.forgotPassword(data);
            setEmail(data.email);
            setStep('reset');
            setMessage({ type: 'success', text: 'Sıfırlama kodu email adresinize gönderildi.' });
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            setMessage({ type: 'error', text: errorObj.response?.data?.message || 'Bir hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    const onResetSubmit = async (data: Omit<ResetPasswordDto, 'email'>) => {
        try {
            setLoading(true);
            setMessage(null);
            await authAPI.resetPassword({ ...data, email });
            setMessage({ type: 'success', text: 'Şifreniz başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz...' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            setMessage({ type: 'error', text: errorObj.response?.data?.message || 'Bir hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -z-10 animate-pulse-slow delay-1000"></div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-heading text-white mb-2">
                        {step === 'request' ? 'Şifremi Unuttum' : 'Şifre Sıfırlama'}
                    </h1>
                    <p className="text-slate-400">
                        {step === 'request'
                            ? 'Email adresinizi girerek şifre sıfırlama bağlantısı alabilirsiniz.'
                            : 'Emailinize gelen kodu ve yeni şifrenizi girin.'
                        }
                    </p>
                </div>

                <div className="glass-card p-8 shadow-2xl shadow-blue-900/10 backdrop-blur-xl border border-slate-700/50">
                    {message && (
                        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm ${message.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}>
                            {message.type === 'success' ? <CheckCircle size={18} /> : <CheckCircle size={18} className="rotate-45" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {step === 'request' ? (
                        <form onSubmit={handleSubmitRequest(onRequestSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Adresi</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        {...registerRequest('email', { required: 'Email gerekli' })}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="ornek@email.com"
                                    />
                                </div>
                                {errorsRequest.email && <span className="text-red-400 text-xs mt-1 block">{errorsRequest.email.message}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 group transition-all hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Kod Gönder</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmitReset(onResetSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Sıfırlama Kodu</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        {...registerReset('token', { required: 'Kod gerekli' })}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="Emailinize gelen kod"
                                    />
                                </div>
                                {errorsReset.token && <span className="text-red-400 text-xs mt-1 block">{errorsReset.token.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Yeni Şifre</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        {...registerReset('newPassword', { required: 'Yeni şifre gerekli', minLength: { value: 6, message: 'En az 6 karakter olmalı' } })}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errorsReset.newPassword && <span className="text-red-400 text-xs mt-1 block">{errorsReset.newPassword.message}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 group transition-all hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Şifreyi Sıfırla</span>
                                        <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center mt-6 text-slate-400">
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all">
                        Giriş Sayfasına Dön
                    </Link>
                </p>
            </div>
        </div>
    );
}
