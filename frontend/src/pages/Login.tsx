import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { LoginDto } from '../types';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: LoginDto) => {
        try {
            setLoading(true);
            setError('');
            const response = await authAPI.login(data);

            if (response.userId && response.token) {
                login(response.userId, response.isPilot, response.token);
                navigate(response.isPilot ? '/pilot/dashboard' : '/customer/dashboard');
            }
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            setError(errorObj.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
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
                    <h1 className="text-4xl font-bold font-heading text-white mb-2">
                        Tekrar <span className="text-gradient">Hoşgeldiniz</span>
                    </h1>
                    <p className="text-slate-400">Hesabınıza giriş yaparak devam edin</p>
                </div>

                <div className="glass-card p-8 shadow-2xl shadow-blue-900/10 backdrop-blur-xl border border-slate-700/50">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Adresi</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        {...register('email', { required: 'Email gerekli' })}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="ornek@email.com"
                                    />
                                </div>
                                {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Şifre</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        {...register('password', { required: 'Şifre gerekli' })}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    {errors.password ? <span className="text-red-400 text-xs">{errors.password.message}</span> : <span></span>}
                                    <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">Şifremi Unuttum?</Link>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 group transition-all hover:scale-[1.02]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Giriş Yap</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-6 text-slate-400">
                    Hesabınız yok mu?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all">
                        Hemen Kayıt Olun
                    </Link>
                </p>
            </div>
        </div>
    );
}
