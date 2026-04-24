import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usePreferences } from '../../context/preferences';

interface HeroSectionProps {
    onSearch: (q: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
    const { language } = usePreferences();
    const [query, setQuery] = useState('');
    const copy = language === 'tr'
        ? {
            badge: 'Drone çekimleri için pazaryeri',
            titleLead: 'Dünyayı',
            titleAccent: 'Yukarıdan',
            titleTail: 'Keşfet',
            description: 'Profesyonel drone pilotlarıyla projelerinizi gökyüzüne taşıyın. Sinematik çekimler, haritalama ve daha fazlası.',
            searchPlaceholder: 'Pilot, hizmet veya konum ara...',
            search: 'Ara',
            stats: [
                { value: 'Türkiye', label: 'Şehir Bazlı Talepler' },
                { value: 'Uzman', label: 'Pilota Göre Seçim' },
                { value: 'Tek Platform', label: 'Talep ve Rezervasyon' },
            ],
        }
        : {
            badge: 'Marketplace for drone services',
            titleLead: 'Explore The World',
            titleAccent: 'From Above',
            titleTail: '',
            description: 'Take your projects to the sky with professional drone pilots. Cinematic shoots, mapping, and more.',
            searchPlaceholder: 'Search pilots, services, or locations...',
            search: 'Search',
            stats: [
                { value: 'Turkey', label: 'City-Based Requests' },
                { value: 'Expert', label: 'Pilot Selection' },
                { value: 'One Platform', label: 'Request and Booking' },
            ],
        };

    return (
        <section className="relative min-h-[78vh] w-full flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1506947411487-a56738267384?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover opacity-15 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/92 via-[#020617]/65 to-[#020617]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center pt-28 pb-16">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/15 text-blue-500 mb-7">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-semibold tracking-widest uppercase">{copy.badge}</span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5 text-white">
                    <span>{copy.titleLead}</span>{' '}
                    <span className="text-blue-500">
                        {copy.titleAccent}
                    </span>{' '}
                    <span>{copy.titleTail}</span>
                </h1>

                <p className="text-base md:text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
                    {copy.description}
                </p>

                {/* Search Bar */}
                <form
                    className="max-w-2xl mx-auto"
                    onSubmit={(e) => { e.preventDefault(); onSearch(query); }}
                >
                    <div className="flex items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-xl p-1.5 shadow-xl focus-within:border-blue-500/40 transition-colors">
                        <Search className="w-4 h-4 text-slate-500 ml-3 shrink-0" />
                        <input
                            type="text"
                            placeholder={copy.searchPlaceholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 px-3 py-2.5 text-sm outline-none"
                        />
                        <Link
                            to={`/browse-services?search=${encodeURIComponent(query)}`}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shrink-0 text-sm"
                        >
                            {copy.search}
                        </Link>
                    </div>
                </form>

                {/* Stats */}
                <div className="mt-12 flex flex-wrap justify-center divide-x divide-slate-800/60">
                    {copy.stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex flex-col items-center px-8 md:px-12 py-2"
                        >
                            <span className="text-2xl font-bold text-slate-50 tracking-tight">
                                {stat.value}
                            </span>
                            <span className="text-xs uppercase tracking-widest text-slate-500 font-medium mt-1">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
