import React from 'react';
import { Rocket, Shield, Users, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCountUp, useInView } from '../hooks/useCountUp';

// ── Stat Card with count-up ──────────────────────────────────────────
interface StatItemProps {
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
    inView: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, suffix, label, inView }) => {
    const count = useCountUp(value, 1400, inView);
    return (
        <div className="text-center p-8 bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-[2rem] group hover:-translate-y-1.5 hover:bg-slate-800/40 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/8">
            <div className="inline-flex p-3.5 rounded-2xl bg-slate-800/80 text-blue-400 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-slate-700/50 group-hover:border-blue-500 shadow-md">
                {icon}
            </div>
            <div className="text-4xl font-extrabold text-white mb-2 tabular-nums">
                {count}{suffix}
            </div>
            <div className="text-slate-500 uppercase text-xs tracking-widest font-semibold">{label}</div>
        </div>
    );
};

// ── USP list item ────────────────────────────────────────────────────
const Feature: React.FC<{ text: string; delay: number }> = ({ text, delay }) => (
    <li
        className="flex items-center gap-4 text-slate-300 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 hover:border-blue-500/20 hover:bg-slate-800/40 transition-all duration-200 cursor-default group animate-fade-in-up"
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors duration-200">
            <CheckCircle className="text-emerald-400 w-4 h-4" />
        </div>
        <span className="text-base font-medium">{text}</span>
    </li>
);

// ── Page ─────────────────────────────────────────────────────────────
const STATS = [
    { icon: <Users size={24} />, value: 500, suffix: '+', label: 'Kayıtlı Pilot' },
    { icon: <CheckCircle size={24} />, value: 1000, suffix: '+', label: 'Tamamlanan Proje' },
    { icon: <Globe size={24} />, value: 81, suffix: '', label: 'İl Kapsamı' },
    { icon: <Shield size={24} />, value: 100, suffix: '%', label: 'Müşteri Memnuniyeti' },
];

const FEATURES = [
    'SHGM Onaylı ve Lisanslı Pilot Ağı',
    'Güvenli Ödeme ve Sözleşme Altyapısı',
    '7/24 Operasyonel Destek',
    'Gelişmiş Filtreleme ve Rezervasyon Sistemi',
];

export default function About() {
    const [statsRef, statsInView] = useInView();

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 relative overflow-x-hidden pt-20">
            {/* Ambient */}
            <div className="fixed top-0 right-[-5%] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[130px] -z-10 animate-pulse-slow pointer-events-none" />
            <div className="fixed top-[40%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[130px] -z-10 animate-pulse-slow delay-1000 pointer-events-none" />

            {/* Hero */}
            <section className="relative py-24 md:py-32 text-center">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 hover:bg-blue-500/15 transition-colors cursor-default">
                        <Rocket size={15} className="animate-pulse" />
                        <span className="text-sm font-semibold tracking-widest uppercase">Hikayemiz & Vizyonumuz</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
                        Gökyüzündeki{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            Çözüm Ortağınız
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                        SkyMarket, Türkiye'nin en yetenekli drone pilotlarını projesine değer katmak isteyen müşterilerle buluşturan öncü pazaryeridir.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 md:py-28 relative z-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-center">
                        {/* Image */}
                        <div className="w-full lg:w-1/2 relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-3xl blur-3xl opacity-15 group-hover:opacity-25 transition-opacity duration-500" />
                            <img
                                src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Drone Team"
                                className="relative rounded-[2.5rem] border border-slate-800/80 shadow-2xl z-10 w-full object-cover aspect-[4/3] group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                            />
                        </div>

                        {/* Text */}
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5 text-white">Misyonumuz</h2>
                            <p className="text-slate-400 text-lg mb-12 leading-relaxed font-light">
                                Drone teknolojisinin sunduğu sınırsız olanakları herkes için erişilebilir kılmak.
                                İster emlak ilanı, ister tarımsal analiz, ister sinematik reklam için doğru pilotu en hızlı şekilde bulun.
                            </p>
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-7 text-white">Neden SkyMarket?</h2>
                            <ul className="space-y-3">
                                {FEATURES.map((item, i) => (
                                    <Feature key={item} text={item} delay={i * 60} />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats — count-up triggers on scroll */}
            <section className="py-20 md:py-28 relative z-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-8">
                        {STATS.map((stat) => (
                            <StatItem
                                key={stat.label}
                                icon={stat.icon}
                                value={stat.value}
                                suffix={stat.suffix}
                                label={stat.label}
                                inView={statsInView}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-28 relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <div className="rounded-[3rem] bg-gradient-to-br from-slate-900 to-[#020617] border border-slate-800/80 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-white relative z-10">
                            Bize{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                Katılın
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light relative z-10">
                            Geleceğin teknolojisiyle bugünden tanışın. İster hizmet alın, ister hizmet verin.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link
                                to="/register"
                                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-10 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-95"
                            >
                                <span>Hemen Başlayın</span>
                                <ArrowRight size={18} className="opacity-80 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                            <Link
                                to="/browse-services"
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold py-4 px-10 rounded-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center active:scale-95"
                            >
                                Hizmetleri Keşfet
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
