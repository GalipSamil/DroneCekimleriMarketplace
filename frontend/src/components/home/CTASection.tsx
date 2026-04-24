import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { usePreferences } from '../../context/preferences';

export const CTASection: React.FC = () => {
    const { language, theme } = usePreferences();
    const isLight = theme === 'light';
    const copy = language === 'tr'
        ? {
            titleLead: 'Pilot Olmaya',
            titleAccent: 'Hazır Mısın?',
            description: 'Profilini oluştur, hizmetlerini listele ve uygun rezervasyon talepleriyle buluş.',
            primary: 'Hemen Başvur',
            secondary: 'Giriş Yap',
            perks: [
                { label: 'Komisyonsuz Başlangıç', color: 'text-[#059669]' },
                { label: 'Doğrudan İletişim', color: 'text-[#2563eb]' },
                { label: 'Rezervasyon Talepleri', color: 'text-[#7c3aed]' },
            ],
        }
        : {
            titleLead: 'Ready To Become',
            titleAccent: 'A Pilot?',
            description: 'Create your profile, list your services, and connect with relevant booking requests.',
            primary: 'Apply Now',
            secondary: 'Log In',
            perks: [
                { label: 'Zero-Commission Start', color: 'text-[#059669]' },
                { label: 'Direct Communication', color: 'text-[#2563eb]' },
                { label: 'Booking Requests', color: 'text-[#7c3aed]' },
            ],
        };

    return (
        <section className="relative overflow-hidden py-20 md:py-28">
            <div className="container relative z-10 mx-auto max-w-4xl px-4">
                <div
                    className={`relative overflow-hidden rounded-2xl border p-10 text-center md:p-16 ${isLight
                        ? 'border-slate-200 bg-white shadow-sm'
                        : 'border-slate-800/80 bg-slate-900/50'
                        }`}
                >
                    <h2 className={`relative z-10 mb-4 text-2xl font-bold tracking-tight md:text-4xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                        {copy.titleLead}{' '}
                        <span className="text-blue-500">{copy.titleAccent}</span>
                    </h2>
                    <p className={`relative z-10 mx-auto mb-8 max-w-xl text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {copy.description}
                    </p>

                    <div className="relative z-10 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            to="/register"
                            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
                        >
                            {copy.primary}
                        </Link>
                        <Link
                            to="/login"
                            className={`rounded-lg px-8 py-3 font-semibold transition-colors ${isLight
                                ? 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                                : 'border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800'
                                }`}
                        >
                            {copy.secondary}
                        </Link>
                    </div>

                    <div className={`relative z-10 mt-8 flex flex-wrap items-center justify-center gap-6 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {copy.perks.map((perk) => (
                            <div key={perk.label} className="flex items-center gap-2">
                                <CheckCircle size={15} className={perk.color} />
                                <span>{perk.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
