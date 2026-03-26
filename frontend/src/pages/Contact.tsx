import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';

type ContactForm = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export default function Contact() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>();

    const onSubmit = (data: ContactForm) => {
        console.log(data);
        // Here you would typically send the data to your backend
        alert('Mesajınız alındı! En kısa sürede size dönüş yapacağız.');
        reset();
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background - reusing the same style as other pages for consistency */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -z-10 animate-pulse-slow delay-1000"></div>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">
                        İletişime <span className="text-gradient">Geç</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Sorularınız, önerileriniz veya iş birliği talepleriniz için bize ulaşın.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="glass-card p-8 rounded-2xl border border-slate-700/50">
                            <h3 className="text-2xl font-bold text-white mb-6">İletişim Bilgileri</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                        <MapPin className="text-blue-400" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-200 mb-1">Adres</h4>
                                        <p className="text-slate-400">Maslak Mah. Büyükdere Cad. No:123<br />Sarıyer/İstanbul</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                        <Phone className="text-blue-400" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-200 mb-1">Telefon</h4>
                                        <p className="text-slate-400">+90 (212) 555 0000</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                        <Mail className="text-blue-400" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-200 mb-1">Email</h4>
                                        <p className="text-slate-400">info@skymarket.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map or other info can go here */}
                        <div className="glass-card p-8 rounded-2xl border border-slate-700/50 h-64 flex items-center justify-center">
                            <p className="text-slate-500">Harita Alanı</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="glass-card p-8 rounded-2xl border border-slate-700/50">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Ad Soyad</label>
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Ad Soyad gerekli' })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        {...register('email', { required: 'Email gerekli' })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="ornek@email.com"
                                    />
                                    {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Konu</label>
                                <input
                                    type="text"
                                    {...register('subject', { required: 'Konu gerekli' })}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="Mesajınızın konusu"
                                />
                                {errors.subject && <span className="text-red-400 text-xs mt-1 block">{errors.subject.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Mesaj</label>
                                <textarea
                                    rows={5}
                                    {...register('message', { required: 'Mesaj gerekli' })}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                                    placeholder="Mesajınızı buraya yazın..."
                                />
                                {errors.message && <span className="text-red-400 text-xs mt-1 block">{errors.message.message}</span>}
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary py-4 flex items-center justify-center gap-2 group"
                            >
                                <span>Gönder</span>
                                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
