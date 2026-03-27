import { useForm } from 'react-hook-form';
import { Mail, ArrowRight, CheckCircle, Lock, KeyRound } from 'lucide-react';
import type { ForgotPasswordDto, ResetPasswordDto } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useForgotPassword } from '../hooks/useForgotPassword';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { step, loading, message, requestReset, confirmReset } = useForgotPassword(() => navigate('/login'));

    const { register: reqReg, handleSubmit: reqSubmit, formState: { errors: reqErr } } = useForm<ForgotPasswordDto>();
    const { register: resReg, handleSubmit: resSubmit, formState: { errors: resErr } } = useForm<Omit<ResetPasswordDto, 'email'>>();

    return (
        <AuthLayout>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
                    {step === 'request' ? 'Şifremi Unuttum' : 'Şifre Sıfırlama'}
                </h1>
                <p className="text-slate-400 text-lg font-light leading-relaxed px-4">
                    {step === 'request'
                        ? 'Email adresinizi girerek şifre sıfırlama bağlantısı alabilirsiniz.'
                        : 'Emailinize gelen kodu ve yeni şifrenizi girin.'}
                </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 md:p-10 shadow-2xl">
                {message && (
                    <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 text-sm font-medium ${
                        message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                        <CheckCircle size={20} className={`shrink-0 ${message.type === 'error' && 'rotate-45'}`} />
                        <span className="leading-snug">{message.text}</span>
                    </div>
                )}

                {step === 'request' ? (
                    <form onSubmit={reqSubmit(requestReset)} className="space-y-6">
                        <Input
                            label="Email Adresi"
                            type="email"
                            icon={Mail}
                            placeholder="ornek@email.com"
                            error={reqErr.email}
                            {...reqReg('email', { required: 'Email gerekli' })}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group mt-4"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>
                                <span className="text-base font-semibold">Kod Gönder</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 opacity-80" />
                            </>}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={resSubmit(confirmReset)} className="space-y-6">
                        <Input
                            label="Sıfırlama Kodu"
                            icon={KeyRound}
                            placeholder="Emailinize gelen kod"
                            error={resErr.token}
                            {...resReg('token', { required: 'Kod gerekli' })}
                        />
                        <Input
                            label="Yeni Şifre"
                            type="password"
                            icon={Lock}
                            placeholder="••••••••"
                            error={resErr.newPassword}
                            {...resReg('newPassword', { required: 'Yeni şifre gerekli', minLength: { value: 6, message: 'En az 6 karakter olmalı' } })}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group mt-4"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>
                                <span className="text-base font-semibold">Şifreyi Sıfırla</span>
                                <CheckCircle size={20} className="group-hover:scale-110 opacity-90" />
                            </>}
                        </button>
                    </form>
                )}
            </div>

            <div className="mt-8 text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 font-medium transition-colors group px-4 py-2">
                    <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Giriş Sayfasına Dön
                </Link>
            </div>
        </AuthLayout>
    );
}
