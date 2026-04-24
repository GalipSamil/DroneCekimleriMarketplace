import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { usePreferences } from '../../context/preferences';
import { popularCitySeoLandingPages } from '../../content/seoCityLandingPages';

export function CitySeoSection() {
    const { language, theme } = usePreferences();
    const isLight = theme === 'light';
    const copy = language === 'tr'
        ? {
            eyebrow: 'Sehir Bazli Hizmetler',
            title: 'Sehir sehir drone cekimi arayanlar icin landing page yapisi',
            description: 'Ankara drone cekimi, Istanbul drone cekimi, Izmir drone cekimi ve benzeri sehir bazli aramalarda dogru sayfaya hizli ulasin.',
            viewAll: 'Tum sehirleri gor',
        }
        : {
            eyebrow: 'City-Based Services',
            title: 'Landing pages for city-by-city drone filming searches',
            description: 'Jump directly to city-specific pages for Istanbul, Ankara, Izmir, Antalya, and more.',
            viewAll: 'View all cities',
        };

    return (
        <section className={`relative border-y ${isLight ? 'border-slate-200/70 bg-white/85' : 'border-slate-900 bg-slate-950/40'}`}>
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                            <MapPin size={14} />
                            {copy.eyebrow}
                        </div>
                        <h2 className={`mt-4 text-3xl font-bold tracking-tight md:text-4xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                            {copy.title}
                        </h2>
                        <p className={`mt-4 text-base leading-8 md:text-lg ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                            {copy.description}
                        </p>
                    </div>
                    <div>
                        <Link
                            to="/drone-cekimi-sehirleri"
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 font-semibold text-blue-500 transition-colors hover:border-blue-400/40 hover:bg-blue-500/15"
                        >
                            {copy.viewAll}
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {popularCitySeoLandingPages.map((page) => (
                        <Link
                            key={page.slug}
                            to={page.path}
                            className={`group rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 ${isLight
                                ? 'border-slate-200/80 bg-slate-50 shadow-sm hover:border-blue-300'
                                : 'border-slate-800/80 bg-slate-900/55 hover:border-blue-500/40'
                                }`}
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                                {page.areaServed?.[language]}
                            </p>
                            <h3 className={`mt-3 text-lg font-bold transition-colors group-hover:text-blue-500 ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                                {page.seoTitle[language]}
                            </h3>
                            <p className={`mt-3 text-sm leading-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                {page.seoDescription[language]}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
