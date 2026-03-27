import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PERKS = [
    { label: 'Komisyonsuz Başlangıç', color: 'text-emerald-400' },
    { label: 'Güvenli Ödeme', color: 'text-blue-400' },
    { label: 'Anlık Rezervasyon', color: 'text-violet-400' },
];

export const CTASection: React.FC = () => (
    <section className="py-28 md:py-36 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-[#020617] border border-slate-800/80 p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
                {/* Decorative blurs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-white relative z-10">
                    Pilot Olmaya{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        Hazır Mısın?
                    </span>
                </h2>
                <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light relative z-10">
                    Yeteneklerini kazanca dönüştür. Türkiye'nin en büyük drone pilotu ağına katıl ve projeler almaya başla.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                    <Link
                        to="/register"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-10 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Hemen Başvur
                    </Link>
                    <Link
                        to="/login"
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-4 px-10 rounded-xl hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Giriş Yap
                    </Link>
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-slate-400 font-medium relative z-10">
                    {PERKS.map((p) => (
                        <div key={p.label} className="flex items-center gap-2">
                            <CheckCircle size={16} className={p.color} />
                            {p.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);
