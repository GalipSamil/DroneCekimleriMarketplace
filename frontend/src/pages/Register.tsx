import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, AlertCircle, ArrowRight, Plane } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { RegisterDto } from '../types';

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterDto>();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: RegisterDto) => {
        try {
            setLoading(true);
            setError('');
            const response = await authAPI.register(data);
            const userId = response.UserId || response.userId || response;

            if (userId) {
                // Auto login after register
                const loginResponse = await authAPI.login({
                    email: data.email,
                    password: data.password
                });

                if (loginResponse && loginResponse.token) {
                    login(loginResponse.userId, loginResponse.isPilot, loginResponse.token);
                    navigate(data.isPilot ? '/pilot/dashboard' : '/customer/dashboard');
                } else {
                    // Fallback if auto-login returns weird data, though unlikely
                    navigate('/login');
                }
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: string } };
            setError(errorObj.response?.data || 'Kayıt işlemi başarısız oldu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] -z-10 animate-pulse-slow delay-1000"></div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-heading text-white mb-2">
                        Aramıza <span className="text-gradient">Katılın</span>
                    </h1>
                    <p className="text-slate-400">Yeni bir hesap oluşturarak başlayın</p>
                </div>

                <div className="glass-card p-8 shadow-2xl shadow-blue-900/10 backdrop-blur-xl border border-slate-700/50">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Ad Soyad</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    {...register('fullName', { required: 'Ad soyad gerekli' })}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    placeholder="Ahmet Yılmaz"
                                />
                            </div>
                            {errors.fullName && <span className="text-red-400 text-xs mt-1 block">{errors.fullName.message}</span>}
                        </div>

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
                                    {...register('password', {
                                        required: 'Şifre gerekli',
                                        minLength: { value: 6, message: 'En az 6 karakter olmalı' }
                                    })}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>}
                        </div>

                        {/* Custom Checkbox for Pilot Option */}
                        <div className="relative flex items-start py-2">
                            <div className="flex h-6 items-center">
                                <input
                                    id="isPilot"
                                    type="checkbox"
                                    {...register('isPilot')}
                                    className="h-5 w-5 rounded border-slate-700 bg-slate-800/50 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-0"
                                />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                                <label htmlFor="isPilot" className="font-medium text-slate-200 flex items-center gap-2 cursor-pointer select-none">
                                    <Plane size={16} className="text-blue-400" />
                                    Pilot Hesabı Oluştur
                                </label>
                                <p className="text-slate-500">Drone pilotu olarak hizmet vermek istiyorum.</p>
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
                                    <span>Kayıt Ol</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-6 text-slate-400">
                    Zaten bir hesabınız var mı?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all">
                        Giriş Yapın
                    </Link>
                </p>
            </div>
        </div>
    );
}
