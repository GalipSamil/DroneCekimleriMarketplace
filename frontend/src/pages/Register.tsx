import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, AlertCircle, ArrowRight, Plane } from 'lucide-react';
import { authAPI, extractApiErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { RegisterDto } from '../types';

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterDto>();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Watch the pilot checkbox to dynamically change active styles
    const isPilotSelected = watch('isPilot', false);

    const onSubmit = async (data: RegisterDto) => {
        try {
            setLoading(true);
            setError('');
            const response = await authAPI.register(data);
            const userId = response.UserId || response.userId;

            if (userId) {
                const loginResponse = await authAPI.login({
                    email: data.email,
                    password: data.password
                });

                if (loginResponse && loginResponse.token) {
                    login(loginResponse.userId, loginResponse.isPilot, loginResponse.token);
                    navigate(data.isPilot ? '/pilot/dashboard' : '/customer/dashboard');
                } else {
                    navigate('/login');
                }
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err: unknown) {
            setError(extractApiErrorMessage(err, 'Kayıt işlemi başarısız oldu.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background with smoother blur */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow delay-1000"></div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
                        Aramıza <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Katılın</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">Hızlıca bir hesap oluşturarak başlayın</p>
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
                                <Plane size={20} className={isPilotSelected ? "animate-pulse" : ""} />
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-medium transition-colors ${isPilotSelected ? 'text-blue-100' : 'text-slate-200'}`}>
                                    Pilot Hesabı Oluştur
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">Drone pilotu olarak hizmet vermek istiyorum</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isPilotSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                            }`}>
                                {isPilotSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                        </label>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Ad Soyad</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        {...register('fullName', { required: 'Ad Soyad alanı zorunludur' })}
                                        className={`block w-full pl-11 pr-4 py-3 bg-slate-800/50 border rounded-xl text-slate-200 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:bg-slate-800/80 ${
                                            errors.fullName ? 'border-red-500/50 focus:border-red-500/50' : 'border-slate-700 focus:border-blue-500/50'
                                        }`}
                                        placeholder="Ahmet Yılmaz"
                                    />
                                </div>
                                {errors.fullName && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.fullName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email Adresi</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        {...register('email', { required: 'Email adresi zorunludur' })}
                                        className={`block w-full pl-11 pr-4 py-3 bg-slate-800/50 border rounded-xl text-slate-200 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:bg-slate-800/80 ${
                                            errors.email ? 'border-red-500/50 focus:border-red-500/50' : 'border-slate-700 focus:border-blue-500/50'
                                        }`}
                                        placeholder="ornek@email.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Şifre</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        {...register('password', {
                                            required: 'Şifre zorunludur',
                                            minLength: { value: 6, message: 'Şifreniz en az 6 karakter olmalıdır' }
                                        })}
                                        className={`block w-full pl-11 pr-4 py-3 bg-slate-800/50 border rounded-xl text-slate-200 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:bg-slate-800/80 ${
                                            errors.password ? 'border-red-500/50 focus:border-red-500/50' : 'border-slate-700 focus:border-blue-500/50'
                                        }`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.password.message}</p>}
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
                            className={`w-full py-3.5 rounded-xl font-medium text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                                loading 
                                ? 'bg-blue-600/50 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/25 hover:-translate-y-0.5'
                            }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Kayıt Ol</span>
                                    <ArrowRight size={18} className="opacity-80" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-400 text-sm">
                    Zaten bir hesabınız var mı?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all">
                        Giriş Yapın
                    </Link>
                </p>
            </div>
        </div>
    );
}
