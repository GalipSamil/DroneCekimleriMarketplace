import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { usePreferences } from '../context/preferences';
import { citySeoLandingPages, popularCitySeoLandingPages } from '../content/seoCityLandingPages';
import { featuredServiceCitySeoPages } from '../content/seoServiceCityLandingPages';

void React;

export default function CityDirectory() {
    const { language, theme } = usePreferences();
    const isLight = theme === 'light';
    const highlightedCities = popularCitySeoLandingPages.slice(0, 8);
    const featuredSearches = featuredServiceCitySeoPages.slice(0, 6);
    const copy = language === 'tr'
        ? {
            eyebrow: 'Sehir Bazli Aramalar',
            title: 'Sehirlere Gore Drone Cekimi',
            description: 'Google uzerinden gelen sehir bazli aramalari tek sayfada topluyoruz. Sehrinizi secip dogrudan ilgili drone cekimi sayfasina gecin.',
            guideNote: 'Bu rehber sayfa SEO icin acik tutulur, ancak ana deneyim browse-services ve servis detaylari uzerinden ilerler.',
            popularTitle: 'Populer sehirler',
            featuredServiceTitle: 'Populer sehir + hizmet aramalari',
            allCitiesTitle: 'Tum sehirler',
            browseAll: 'Tum hizmetleri kesfet',
            allCitiesDescription: 'Tum sehir sayfalari burada listelenir. Dogrudan aradiginiz sehir sonucuna gecmek icin asagidaki linkleri kullanin.',
        }
        : {
            eyebrow: 'City-Based Search',
            title: 'Drone Filming by City',
            description: 'This page collects city-based search landing pages in one place so visitors can jump directly to the right location page.',
            guideNote: 'This guide stays public for SEO, while the main user flow continues through browse-services and service detail pages.',
            popularTitle: 'Popular cities',
            featuredServiceTitle: 'Popular city + service searches',
            allCitiesTitle: 'All cities',
            browseAll: 'Browse all services',
            allCitiesDescription: 'Every city page is listed below for direct access to the relevant location landing page.',
        };

    return (
        <div className={`min-h-screen pt-24 pb-20 ${isLight ? 'bg-slate-50 text-slate-950' : 'bg-[#020617] text-slate-50'}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <section className="mb-12">
                    <div className={`rounded-[2rem] border px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14 ${isLight
                        ? 'border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_58%,#ecfeff_100%)] shadow-sm'
                        : 'border-slate-800/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_58%,#071226_100%)]'
                        }`}>
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                            <MapPin size={14} />
                            {copy.eyebrow}
                        </div>
                        <h1 className={`mt-5 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                            {copy.title}
                        </h1>
                        <p className={`mt-4 max-w-3xl text-base leading-8 md:text-lg ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                            {copy.description}
                        </p>
                        <p className={`mt-4 max-w-3xl text-sm leading-7 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {copy.guideNote}
                        </p>
                        <div className="mt-8">
                            <Link
                                to="/browse-services"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
                            >
                                {copy.browseAll}
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="mb-14">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h2 className={`text-2xl font-bold tracking-tight md:text-3xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                            {copy.popularTitle}
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {highlightedCities.map((page) => (
                            <Link
                                key={page.slug}
                                to={page.path}
                                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${isLight
                                    ? 'border-slate-200/80 bg-white/90 text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-600'
                                    : 'border-slate-800/80 bg-slate-900/45 text-slate-200 hover:border-blue-500/40 hover:text-blue-400'
                                    }`}
                            >
                                {language === 'tr'
                                    ? `${page.areaServed?.tr} drone cekimi`
                                    : `${page.areaServed?.en} drone filming`}
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mb-14">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h2 className={`text-2xl font-bold tracking-tight md:text-3xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                            {copy.featuredServiceTitle}
                        </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {featuredSearches.map((page) => (
                            <Link
                                key={page.slug}
                                to={page.path}
                                className={`group rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 ${isLight
                                    ? 'border-slate-200/80 bg-white/90 shadow-sm hover:border-blue-300'
                                    : 'border-slate-800/80 bg-slate-900/45 hover:border-blue-500/40'
                                    }`}
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">{page.copy[language].badge}</p>
                                <h3 className={`mt-3 text-lg font-bold transition-colors group-hover:text-blue-500 ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                                    {page.seoTitle[language]}
                                </h3>
                                <p className={`mt-3 text-sm leading-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {page.seoDescription[language]}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h2 className={`text-2xl font-bold tracking-tight md:text-3xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                            {copy.allCitiesTitle}
                        </h2>
                    </div>
                    <div className={`rounded-[2rem] border p-5 md:p-7 ${isLight ? 'border-slate-200/80 bg-white/90 shadow-sm' : 'border-slate-800/80 bg-slate-900/45'}`}>
                        <p className={`mb-5 text-sm leading-7 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            {copy.allCitiesDescription}
                        </p>
                        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                            {citySeoLandingPages.map((page) => (
                                <Link
                                    key={page.slug}
                                    to={page.path}
                                    className={`group inline-flex items-center gap-2 text-sm font-semibold transition-colors ${isLight
                                        ? 'text-slate-700 hover:text-blue-600'
                                        : 'text-slate-200 hover:text-blue-400'
                                        }`}
                                >
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                    <span>{language === 'tr' ? `${page.areaServed?.tr} drone cekimi` : `${page.areaServed?.en} drone filming`}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
