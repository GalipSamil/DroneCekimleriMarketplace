import React from 'react';
import { Rocket, Shield, Users, CheckCircle, ArrowRight, Compass, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../context/preferences';

interface ProcessItemProps {
    icon: React.ReactNode;
    step: string;
    title: string;
    description: string;
    label: string;
    theme: 'dark' | 'light';
}

const ProcessItem: React.FC<ProcessItemProps> = ({ icon, step, title, description, label, theme }) => {
    const isLight = theme === 'light';

    return (
        <div
            className={`group rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5 ${isLight
                ? 'border border-slate-200 bg-white shadow-sm hover:border-slate-300'
                : 'border border-slate-800/80 bg-slate-900/50 hover:border-slate-700/80'
                }`}
        >
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>
                    <div className={`text-xs font-semibold tracking-widest ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{step}</div>
                </div>
                <div
                    className={`inline-flex rounded-xl border p-3 ${isLight
                        ? 'border-blue-100 bg-blue-50 text-blue-600'
                        : 'border-blue-500/15 bg-blue-600/10 text-blue-500'
                        }`}
                >
                    {icon}
                </div>
            </div>
            <div className={`mb-2 text-xl font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                {title}
            </div>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {description}
            </p>
        </div>
    );
};

const Feature: React.FC<{ text: string; delay: number; theme: 'dark' | 'light' }> = ({ text, delay, theme }) => (
    <li
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm animate-fade-in-up ${theme === 'light'
            ? 'border border-slate-200 bg-white text-slate-700'
            : 'border border-slate-800/50 bg-slate-900/40 text-slate-300'
            }`}
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
        <span className="font-medium">{text}</span>
    </li>
);

export default function About() {
    const { language, theme } = usePreferences();
    const isLight = theme === 'light';

    const copy = language === 'tr'
        ? {
            badge: 'Hikayemiz & Vizyonumuz',
            heroLead: 'Gökyüzündeki',
            heroAccent: 'Çözüm Ortağınız',
            heroDescription: 'DronePazar, drone çekimi arayan kullanıcılarla pilot profillerini aynı platformda buluşturan dijital bir pazaryeridir.',
            missionTitle: 'Misyonumuz',
            missionDescription: 'Drone teknolojisine erişimi daha kolay hale getirmek ve kullanıcıların ihtiyaçlarına uygun pilot profillerine daha hızlı ulaşmasını sağlamak.',
            whyTitle: 'Neden DronePazar?',
            features: [
                'Pilot profilleri ve hizmet detaylarını tek yerde görme',
                'Şehir ve hizmet türüne göre uygun çekim arama',
                'Talep, rezervasyon ve iletişim adımlarını aynı platformda görüntüleme',
                'Hem müşteri hem pilot için sade ve anlaşılır deneyim',
            ],
            processBadge: 'NASIL ÇALIŞIR',
            processTitle: 'Talep ve rezervasyon akışını tek yerden yönetin',
            processDescription: 'İhtiyacına uygun pilotu bul, detayları netleştir ve rezervasyon adımlarını aynı platformda ilerlet.',
            process: [
                {
                    icon: <Compass size={24} />,
                    step: '01',
                    title: 'Doğru pilotu bul',
                    description: 'Şehir, hizmet türü ve çekim ihtiyacına göre uygun pilotları kolayca filtrele.',
                    label: 'Eşleşme',
                },
                {
                    icon: <MessageSquare size={24} />,
                    step: '02',
                    title: 'Detayları netleştir',
                    description: 'Çekim kapsamını, teslim beklentilerini ve önemli notları pilotla doğrudan konuş.',
                    label: 'İletişim',
                },
                {
                    icon: <Shield size={24} />,
                    step: '03',
                    title: 'Akışı tek yerde takip et',
                    description: 'Talep, rezervasyon ve iletişim adımlarını tek akış içinde görüntüle ve takip et.',
                    label: 'Takip',
                },
            ],
            ctaLead: 'Bize',
            ctaAccent: 'Katılın',
            ctaDescription: 'Geleceğin teknolojisiyle bugünden tanışın. İster hizmet alın, ister hizmet verin.',
            ctaPrimary: 'Hemen Başlayın',
            ctaSecondary: 'Hizmetleri Keşfet',
            imageAlt: 'Drone ekibi',
        }
        : {
            badge: 'Our Story & Vision',
            heroLead: 'Your Partner',
            heroAccent: 'In The Sky',
            heroDescription: 'DronePazar is a digital marketplace that brings together users looking for drone shoots and pilot profiles on one platform.',
            missionTitle: 'Our Mission',
            missionDescription: 'Make access to drone technology easier and help users reach suitable pilot profiles more quickly.',
            whyTitle: 'Why DronePazar?',
            features: [
                'See pilot profiles and service details in one place',
                'Search by city and service type for the right shoot',
                'View requests, bookings, and communication steps on the same platform',
                'A clear experience for both customers and pilots',
            ],
            processBadge: 'How it works',
            processTitle: 'Manage requests and bookings in one place',
            processDescription: 'Find the right pilot, align on the details, and continue the booking steps on the same platform.',
            process: [
                {
                    icon: <Compass size={24} />,
                    step: '01',
                    title: 'Find the right pilot',
                    description: 'Filter pilots easily by city, service type, and the type of shoot you need.',
                    label: 'Matching',
                },
                {
                    icon: <MessageSquare size={24} />,
                    step: '02',
                    title: 'Clarify the details',
                    description: 'Align on scope, delivery expectations, and important notes directly with the pilot.',
                    label: 'Communication',
                },
                {
                    icon: <Shield size={24} />,
                    step: '03',
                    title: 'Track the flow in one place',
                    description: 'View and follow requests, bookings, and communication steps in a single flow.',
                    label: 'Tracking',
                },
            ],
            ctaLead: 'Join',
            ctaAccent: 'Us',
            ctaDescription: 'Meet the technology of the future today. Whether you need a service or want to offer one, you can do both here.',
            ctaPrimary: 'Get Started',
            ctaSecondary: 'Explore Services',
            imageAlt: 'Drone team',
        };

    return (
        <div className={`relative min-h-screen overflow-x-hidden pt-20 ${isLight ? 'bg-slate-50 text-slate-950' : 'bg-[#020617] text-slate-50'}`}>

            <section className="relative py-16 text-center md:py-24">
                <div className="container mx-auto max-w-4xl px-4">
                    <div className="mb-6 inline-flex cursor-default items-center gap-2 rounded-full border border-blue-500/15 bg-blue-600/10 px-3.5 py-1.5 text-blue-500">
                        <Rocket size={13} />
                        <span className="text-xs font-semibold uppercase tracking-widest">{copy.badge}</span>
                    </div>
                    <h1 className={`mb-5 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                        {copy.heroLead}{' '}
                        <span className="text-blue-500">
                            {copy.heroAccent}
                        </span>
                    </h1>
                    <p className={`mx-auto max-w-xl text-base leading-relaxed md:text-lg ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {copy.heroDescription}
                    </p>
                </div>
            </section>

            <section className="relative z-10 py-16 md:py-24">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt={copy.imageAlt}
                                className={`aspect-[4/3] w-full rounded-2xl object-cover shadow-lg ${isLight ? 'border border-slate-200' : 'border border-slate-800/60'}`}
                            />
                        </div>

                        <div className="w-full lg:w-1/2">
                            <h2 className={`mb-4 text-2xl font-bold tracking-tight md:text-3xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>{copy.missionTitle}</h2>
                            <p className={`mb-10 text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                {copy.missionDescription}
                            </p>
                            <h2 className={`mb-5 text-2xl font-bold tracking-tight md:text-3xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>{copy.whyTitle}</h2>
                            <ul className="space-y-2.5">
                                {copy.features.map((item, i) => (
                                    <Feature key={item} text={item} delay={i * 60} theme={theme} />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-10 py-14 md:py-18">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="mb-8 max-w-2xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-blue-600/10 px-3.5 py-1.5 text-blue-500">
                            <Users size={13} />
                            <span className="text-xs font-semibold uppercase tracking-widest">{copy.processBadge}</span>
                        </div>
                        <h2 className={`text-2xl font-bold tracking-tight md:text-3xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                            {copy.processTitle}
                        </h2>
                        <p className={`mt-3 text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            {copy.processDescription}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
                        {copy.process.map((item) => (
                            <ProcessItem
                                key={item.step}
                                icon={item.icon}
                                step={item.step}
                                title={item.title}
                                description={item.description}
                                label={item.label}
                                theme={theme}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden py-16 md:py-24">
                <div className="container relative z-10 mx-auto max-w-4xl px-4">
                    <div
                        className={`relative overflow-hidden rounded-2xl border p-10 text-center md:p-16 ${isLight
                            ? 'border-slate-200 bg-white shadow-sm'
                            : 'border-slate-800/80 bg-slate-900/50'
                            }`}
                    >
                        <h2 className={`mb-4 text-2xl font-bold tracking-tight md:text-4xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                            {copy.ctaLead}{' '}
                            <span className="text-blue-500">{copy.ctaAccent}</span>
                        </h2>
                        <p className={`mx-auto mb-8 max-w-xl text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            {copy.ctaDescription}
                        </p>

                        <div className="flex flex-col justify-center gap-3 sm:flex-row">
                            <Link
                                to="/register"
                                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
                            >
                                <span>{copy.ctaPrimary}</span>
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/browse-services"
                                className={`flex items-center justify-center rounded-lg px-8 py-3 font-semibold transition-colors ${isLight
                                    ? 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                                    : 'border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800'
                                    }`}
                            >
                                {copy.ctaSecondary}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
