import { Shield, Video, Clock } from 'lucide-react';
import type { ReactNode } from 'react';

interface Feature {
    icon: ReactNode;
    title: string;
    desc: string;
    color: string;
}

const FEATURES: Feature[] = [
    {
        icon: <Shield className="w-7 h-7 text-emerald-400" />,
        title: 'Lisanslı Pilotlar',
        desc: 'Tüm pilotlarımız SHGM onaylı ve sigortalıdır. Güvenle uçuş yapın.',
        color: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
        icon: <Video className="w-7 h-7 text-blue-400" />,
        title: '4K & 8K Kalite',
        desc: 'Sinematik kalitede, yüksek çözünürlüklü ve RAW formatında çekimler.',
        color: 'bg-blue-500/10 border-blue-500/20',
    },
    {
        icon: <Clock className="w-7 h-7 text-violet-400" />,
        title: 'Hızlı Teslimat',
        desc: 'Çekim sonrası 24 saatte ham görüntü, 48 saatte kurgu teslimi.',
        color: 'bg-violet-500/10 border-violet-500/20',
    },
];

export const FeaturesSection: React.FC = () => (
    <section className="py-28 md:py-36 relative">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
                    Neden{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Biz?</span>
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed font-light">
                    Güvenli, hızlı ve profesyonel sonuçlar için en iyi teknolojiyi ve yeteneği bir araya getiriyoruz.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {FEATURES.map((f) => (
                    <div
                        key={f.title}
                        className="bg-slate-900/40 p-10 rounded-3xl border border-slate-800/60 group hover:-translate-y-2 hover:bg-slate-800/40 transition-all duration-300 shadow-lg"
                    >
                        <div className={`w-14 h-14 rounded-2xl ${f.color} border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                            {f.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-3">{f.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
