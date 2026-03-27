import { Mail, Phone, MapPin, Send, MessageSquareText } from 'lucide-react';
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
        <div className="min-h-screen bg-[#020617] pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow delay-1000"></div>

            <div className="max-w-7xl mx-auto z-10 relative">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6 transition-transform hover:scale-105">
                        <MessageSquareText size={16} />
                        <span className="text-sm font-semibold tracking-wide uppercase">İletişim</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
                        Bize <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Ulaşın</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Sorularınız, önerileriniz veya kurumsal iş birliği talepleriniz için her zaman buradayız.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column: Contact Info & Map */}
                    <div className="space-y-8 flex flex-col">
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 md:p-10 shadow-2xl">
                            <h3 className="text-2xl font-extrabold text-white mb-8 tracking-tight">İletişim Bilgileri</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-5 group">
                                    <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                                        <MapPin className="text-blue-400" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-lg font-bold text-slate-200 mb-1">Adres</h4>
                                        <p className="text-slate-400 leading-relaxed">Maslak Mah. Büyükdere Cad. No:123<br />Sarıyer/İstanbul</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                                        <Phone className="text-emerald-400" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-lg font-bold text-slate-200 mb-1">Telefon</h4>
                                        <p className="text-slate-400 leading-relaxed">+90 (212) 555 0000</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                                        <Mail className="text-purple-400" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-lg font-bold text-slate-200 mb-1">Email</h4>
                                        <p className="text-slate-400 leading-relaxed">info@skymarket.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Area */}
                        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-2 flex-1 min-h-[250px] shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#020617]/50 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                                <span className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 tracking-wide">
                                    Haritada Gör
                                </span>
                            </div>
                            <img 
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Map Location" 
                                className="w-full h-full object-cover rounded-[1.5rem] opacity-70 grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 md:p-10 shadow-2xl h-fit">
                        <h3 className="text-2xl font-extrabold text-white mb-8 tracking-tight">Mesaj Gönder</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-300 ml-1">Ad Soyad</label>
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Ad Soyad gerekli' })}
                                        className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <span className="text-red-400 text-xs font-medium ml-1 block">{errors.name.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-300 ml-1">Email</label>
                                    <input
                                        type="email"
                                        {...register('email', { required: 'Email gerekli' })}
                                        className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                                        placeholder="ornek@email.com"
                                    />
                                    {errors.email && <span className="text-red-400 text-xs font-medium ml-1 block">{errors.email.message}</span>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300 ml-1">Konu</label>
                                <input
                                    type="text"
                                    {...register('subject', { required: 'Konu gerekli' })}
                                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                                    placeholder="Mesajınızın konusu"
                                />
                                {errors.subject && <span className="text-red-400 text-xs font-medium ml-1 block">{errors.subject.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300 ml-1">Mesaj</label>
                                <textarea
                                    rows={5}
                                    {...register('message', { required: 'Mesaj gerekli' })}
                                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60 resize-none"
                                    placeholder="Mesajınızı detaylı şekilde buraya yazın..."
                                />
                                {errors.message && <span className="text-red-400 text-xs font-medium ml-1 block">{errors.message.message}</span>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 px-6 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 group hover:-translate-y-0.5 mt-2"
                            >
                                <span className="text-base font-semibold">Gönder</span>
                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform opacity-90" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
