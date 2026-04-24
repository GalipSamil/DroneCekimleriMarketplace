import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareText, Instagram, Twitter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { usePreferences } from '../context/preferences';
import { contactAPI, extractApiErrorMessage } from '../services/api';

type ContactForm = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export default function Contact() {
    const { language, theme } = usePreferences();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactForm>();
    const isLight = theme === 'light';
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const clearSubmissionState = () => {
        if (submissionMessage) setSubmissionMessage(null);
        if (submissionError) setSubmissionError(null);
    };
    const copy = language === 'tr'
        ? {
            alertSuccess: 'Mesajınız alındı! En kısa sürede size dönüş yapacağız.',
            alertError: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
            badge: 'İletişim',
            titleLead: 'Bize',
            titleAccent: 'Ulaşın',
            description: 'Sorularınız, önerileriniz veya kurumsal iş birliği talepleriniz için her zaman buradayız.',
            infoTitle: 'İletişim Bilgileri',
            addressTitle: 'Adres',
            addressValue: 'Maslak Mah. Büyükdere Cad. No:123\nSarıyer/İstanbul',
            phoneTitle: 'Telefon',
            emailTitle: 'Email',
            xTitle: 'X',
            instagramTitle: 'Instagram',
            mapCta: 'Haritada Gör',
            mapAlt: 'Map Location',
            formTitle: 'Mesaj Gönder',
            nameLabel: 'Ad Soyad',
            nameRequired: 'Ad Soyad gerekli',
            emailRequired: 'Email gerekli',
            subjectLabel: 'Konu',
            subjectRequired: 'Konu gerekli',
            subjectPlaceholder: 'Mesajınızın konusu',
            messageLabel: 'Mesaj',
            messageRequired: 'Mesaj gerekli',
            messagePlaceholder: 'Mesajınızı detaylı şekilde buraya yazın...',
            sending: 'Gönderiliyor...',
            submit: 'Gönder',
        }
        : {
            alertSuccess: 'Your message has been received. We will get back to you shortly.',
            alertError: 'Your message could not be sent. Please try again.',
            badge: 'Contact',
            titleLead: 'Get In',
            titleAccent: 'Touch',
            description: 'We are here for your questions, suggestions, and partnership requests.',
            infoTitle: 'Contact Details',
            addressTitle: 'Address',
            addressValue: 'Maslak District, Buyukdere Avenue No:123\nSariyer/Istanbul',
            phoneTitle: 'Phone',
            emailTitle: 'Email',
            xTitle: 'X',
            instagramTitle: 'Instagram',
            mapCta: 'View on Map',
            mapAlt: 'Map location',
            formTitle: 'Send a Message',
            nameLabel: 'Full Name',
            nameRequired: 'Full name is required',
            emailRequired: 'Email is required',
            subjectLabel: 'Subject',
            subjectRequired: 'Subject is required',
            subjectPlaceholder: 'Subject of your message',
            messageLabel: 'Message',
            messageRequired: 'Message is required',
            messagePlaceholder: 'Write your message here with as much detail as possible...',
            sending: 'Sending...',
            submit: 'Send',
        };

    const onSubmit = async (data: ContactForm) => {
        try {
            setSubmissionError(null);
            const response = await contactAPI.sendMessage(data);
            setSubmissionMessage(response.message || copy.alertSuccess);
            reset();
        } catch (error) {
            setSubmissionMessage(null);
            setSubmissionError(extractApiErrorMessage(error, copy.alertError));
        }
    };

    return (
        <div className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 ${isLight ? 'bg-slate-50' : 'bg-[#020617]'}`}>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/15 text-blue-500 mb-5">
                        <MessageSquareText size={16} />
                        <span className="text-sm font-semibold tracking-wide uppercase">{copy.badge}</span>
                    </div>
                    <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                        {copy.titleLead} <span className="text-blue-500">{copy.titleAccent}</span>
                    </h1>
                    <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {copy.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column: Contact Info & Map */}
                    <div className="space-y-8 flex flex-col">
                        <div className={`border rounded-2xl p-8 md:p-10 shadow-lg ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800/80'}`}>
                            <h3 className={`text-xl font-bold mb-8 tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>{copy.infoTitle}</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-5 group">
                                    <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/15">
                                        <MapPin className="text-blue-500" size={20} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-lg font-bold text-slate-200 mb-1">{copy.addressTitle}</h4>
                                        <p className="text-slate-400 leading-relaxed whitespace-pre-line">{copy.addressValue}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/15">
                                        <Phone className="text-blue-500" size={20} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-lg font-bold text-slate-200 mb-1">{copy.phoneTitle}</h4>
                                        <p className="text-slate-400 leading-relaxed">+90 (212) 555 0000</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/15">
                                        <Mail className="text-blue-500" size={20} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-lg font-bold text-slate-200 mb-1">{copy.emailTitle}</h4>
                                        <p className="text-slate-400 leading-relaxed">info@dronepazar.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/15">
                                        <Twitter className="text-blue-500" size={20} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-lg font-bold text-slate-200 mb-1">{copy.xTitle}</h4>
                                        <a
                                            href="https://x.com/DronePazar"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-slate-400 leading-relaxed hover:text-blue-500 transition-colors"
                                        >
                                            @DronePazar
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/15">
                                        <Instagram className="text-blue-500" size={20} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-lg font-bold text-slate-200 mb-1">{copy.instagramTitle}</h4>
                                        <a
                                            href="https://www.instagram.com/dronepazartr/"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-slate-400 leading-relaxed hover:text-blue-500 transition-colors"
                                        >
                                            @dronepazartr
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Area */}
                        <div className={`border rounded-2xl p-2 flex-1 min-h-[250px] overflow-hidden group ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/40 border-slate-800/80'}`}>
                            <div className="absolute inset-0 bg-[#020617]/50 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                                <span className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 tracking-wide">
                                    {copy.mapCta}
                                </span>
                            </div>
                            <img 
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt={copy.mapAlt} 
                                className="w-full h-full object-cover rounded-[1.5rem] opacity-70 grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className={`border rounded-2xl p-8 md:p-10 shadow-lg h-fit ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800/80'}`}>
                        <h3 className={`text-xl font-bold mb-8 tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>{copy.formTitle}</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {submissionMessage && (
                                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                                    {submissionMessage}
                                </div>
                            )}
                            {submissionError && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                    {submissionError}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-300 ml-1">{copy.nameLabel}</label>
                                    <input
                                        type="text"
                                        {...register('name', { required: copy.nameRequired, onChange: clearSubmissionState })}
                                        className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <span className="text-red-400 text-xs font-medium ml-1 block">{errors.name.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-300 ml-1">{copy.emailTitle}</label>
                                    <input
                                        type="email"
                                        {...register('email', { required: copy.emailRequired, onChange: clearSubmissionState })}
                                        className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                                        placeholder={language === 'tr' ? 'ornek@email.com' : 'name@example.com'}
                                    />
                                    {errors.email && <span className="text-red-400 text-xs font-medium ml-1 block">{errors.email.message}</span>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300 ml-1">{copy.subjectLabel}</label>
                                <input
                                    type="text"
                                    {...register('subject', { required: copy.subjectRequired, onChange: clearSubmissionState })}
                                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                                    placeholder={copy.subjectPlaceholder}
                                />
                                {errors.subject && <span className="text-red-400 text-xs font-medium ml-1 block">{errors.subject.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300 ml-1">{copy.messageLabel}</label>
                                <textarea
                                    rows={5}
                                    {...register('message', { required: copy.messageRequired, onChange: clearSubmissionState })}
                                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60 resize-none"
                                    placeholder={copy.messagePlaceholder}
                                />
                                {errors.message && <span className="text-red-400 text-xs font-medium ml-1 block">{errors.message.message}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 group mt-2"
                            >
                                <span className="text-base font-semibold">{isSubmitting ? copy.sending : copy.submit}</span>
                                <Send size={18} className={`transition-transform opacity-90 ${isSubmitting ? '' : 'group-hover:translate-x-1 group-hover:-translate-y-0.5'}`} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
