import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

interface HeroSectionProps {
    onSearch: (q: string) => void;
}

const STATS = [
    { value: '500+', label: 'Lisanslı Pilot' },
    { value: '1.000+', label: 'Başarılı Uçuş' },
    { value: '81', label: 'İl Kapsamı' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1506947411487-a56738267384?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover opacity-20 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/60 to-[#020617]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center pt-24 pb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-sm font-semibold tracking-wide">Türkiye'nin #1 Drone Pazaryeri</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-tight mb-6 text-white">
                    Dünyayı{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        Yukarıdan
                    </span>{' '}
                    Keşfet
                </h1>

                <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    Profesyonel drone pilotlarıyla projelerinizi gökyüzüne taşıyın. Sinematik çekimler, haritalama ve daha fazlası.
                </p>

                {/* Search Bar */}
                <form
                    className="max-w-2xl mx-auto relative group"
                    onSubmit={(e) => { e.preventDefault(); onSearch(query); }}
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-full p-2 shadow-2xl focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500/40 transition-all">
                        <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
                        <input
                            type="text"
                            placeholder="Pilot, hizmet veya konum ara..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 px-4 py-3 text-base outline-none"
                        />
                        <Link
                            to={`/browse-services?search=${encodeURIComponent(query)}`}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all shrink-0"
                        >
                            Ara
                        </Link>
                    </div>
                </form>

                {/* Stats */}
                <div className="mt-16 flex flex-wrap justify-center divide-x divide-slate-800">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center px-8 md:px-16 py-2">
                            <span className="text-4xl font-extrabold text-white tracking-tight">{stat.value}</span>
                            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
