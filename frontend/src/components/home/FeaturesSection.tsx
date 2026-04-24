import { Shield, Video, Clock } from 'lucide-react';
import type { ReactNode } from 'react';
import { usePreferences } from '../../context/preferences';

interface Feature {
    icon: ReactNode;
    title: string;
    desc: string;
    color: string;
}

export const FeaturesSection: React.FC = () => {
    const { language } = usePreferences();
    const copy = language === 'tr'
        ? {
            titleLead: 'Neden',
            titleAccent: 'Biz?',
            description: 'Drone çekimi arayan kullanıcılarla pilot profillerini aynı platformda buluşturan sade bir deneyim sunuyoruz.',
            features: [
                {
                    icon: <Shield className="w-7 h-7 text-emerald-400" />,
                    title: 'Pilot Profilleri',
                    desc: 'Pilotlar, profil bilgileri ve hizmet detaylarıyla platformda listelenir.',
                    color: 'bg-emerald-500/10 border-emerald-500/20',
                },
                {
                    icon: <Video className="w-7 h-7 text-blue-400" />,
                    title: 'Hizmet Detayları',
                    desc: 'Çekim türü, ekipman bilgisi ve teslim formatı gibi detayları tek yerde inceleyin.',
                    color: 'bg-blue-500/10 border-blue-500/20',
                },
                {
                    icon: <Clock className="w-7 h-7 text-violet-400" />,
                    title: 'Rezervasyon Akışı',
                    desc: 'Talep oluşturun, detayları konuşun ve rezervasyon akışını platform üzerinden ilerletin.',
                    color: 'bg-violet-500/10 border-violet-500/20',
                },
            ] satisfies Feature[],
        }
        : {
            titleLead: 'Why',
            titleAccent: 'Us?',
            description: 'We provide a simple platform experience that brings together people looking for drone shoots and pilot profiles.',
            features: [
                {
                    icon: <Shield className="w-7 h-7 text-emerald-400" />,
                    title: 'Pilot Profiles',
                    desc: 'Pilots are listed on the platform with their profile information and service details.',
                    color: 'bg-emerald-500/10 border-emerald-500/20',
                },
                {
                    icon: <Video className="w-7 h-7 text-blue-400" />,
                    title: 'Service Details',
                    desc: 'Review service type, equipment information, and delivery format details in one place.',
                    color: 'bg-blue-500/10 border-blue-500/20',
                },
                {
                    icon: <Clock className="w-7 h-7 text-violet-400" />,
                    title: 'Booking Flow',
                    desc: 'Create a request, discuss the details, and continue the booking flow through the platform.',
                    color: 'bg-violet-500/10 border-violet-500/20',
                },
            ] satisfies Feature[],
        };

    return (
        <section className="py-20 md:py-28 relative">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-14">
                    <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
                        {copy.titleLead}{' '}
                        <span className="text-blue-500">{copy.titleAccent}</span>
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto text-base leading-relaxed">
                        {copy.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
                    {copy.features.map((f) => (
                        <div
                            key={f.title}
                            className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/60 hover:-translate-y-1 hover:border-slate-700/80 transition-all duration-200"
                        >
                            <div className={`w-12 h-12 rounded-xl ${f.color} border flex items-center justify-center mb-6`}>
                                {f.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-50 mb-2">{f.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
