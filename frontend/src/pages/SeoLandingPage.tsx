import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { usePreferences } from '../context/preferences';
import type { SeoLandingPageEntry } from '../content/seoLandingPages';
import { getDistrictCoverageContent } from '../content/seoDistrictCoverage';

void React;

interface SeoLandingPageProps {
    page: SeoLandingPageEntry;
}

export default function SeoLandingPage({ page }: SeoLandingPageProps) {
    const { language, theme } = usePreferences();
    const isLight = theme === 'light';
    const copy = page.copy[language];
    const primaryHref = copy.ctaPrimaryHref ?? '/browse-services';
    const secondaryHref = copy.ctaSecondaryHref ?? '/register';
    const isCityPage = Boolean(page.areaServed);
    const breadcrumbIndexHref = isCityPage ? '/drone-cekimi-sehirleri' : '/browse-services';
    const breadcrumbIndexLabel = isCityPage
        ? (language === 'tr' ? 'Sehirler' : 'Cities')
        : (language === 'tr' ? 'Hizmetler' : 'Services');
    const districtCoverage = getDistrictCoverageContent(page, language);

    return (
        <div className={`min-h-screen pt-24 pb-20 ${isLight ? 'bg-slate-50 text-slate-950' : 'bg-[#020617] text-slate-50'}`}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <nav className={`mb-8 flex flex-wrap items-center gap-2 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Link to="/" className="transition-colors hover:text-blue-500">DronePazar</Link>
                    <span>/</span>
                    <Link to={breadcrumbIndexHref} className="transition-colors hover:text-blue-500">
                        {breadcrumbIndexLabel}
                    </Link>
                    <span>/</span>
                    <span>{copy.title}</span>
                </nav>

                <section className="mb-14 text-center">
                    <div className="mb-5 inline-flex items-center rounded-full border border-blue-500/15 bg-blue-600/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
                        {copy.badge}
                    </div>
                    <h1 className={`mx-auto mb-5 max-w-4xl text-3xl font-bold tracking-tight md:text-4xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                        {copy.title}
                    </h1>
                    <p className={`mx-auto max-w-3xl text-lg leading-relaxed md:text-xl ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {copy.description}
                    </p>
                </section>

                <section className="mb-16 grid gap-6">
                    {copy.sections.map((section) => (
                        <article
                            key={section.title}
                            className={`rounded-2xl border p-7 md:p-9 ${isLight
                                ? 'border-slate-200/80 bg-white/90 shadow-sm'
                                : 'border-slate-800/80 bg-slate-900/45 backdrop-blur-sm'
                                }`}
                        >
                            <h2 className={`mb-4 text-2xl font-bold tracking-tight md:text-3xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                                {section.title}
                            </h2>

                            {section.paragraphs?.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className={`mb-4 text-base leading-8 last:mb-0 md:text-lg ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                                >
                                    {paragraph}
                                </p>
                            ))}

                            {section.bullets && section.bullets.length > 0 && (
                                <ul className="mt-4 space-y-3">
                                    {section.bullets.map((bullet) => (
                                        <li key={bullet} className={`flex items-start gap-3 text-base leading-7 md:text-lg ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                                            <span className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isLight ? 'border-emerald-200 bg-emerald-50' : 'border-emerald-500/20 bg-emerald-500/10'}`}>
                                                <CheckCircle className="h-4 w-4 text-emerald-400" />
                                            </span>
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </article>
                    ))}
                </section>

                {districtCoverage && (
                    <section className="mb-14">
                        <div className={`rounded-2xl border p-6 md:p-7 ${isLight
                            ? 'border-slate-200/80 bg-white/90 shadow-sm'
                            : 'border-slate-800/80 bg-slate-900/45'
                            }`}>
                            <h2 className={`text-2xl font-bold tracking-tight md:text-3xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                                {districtCoverage.title}
                            </h2>
                            <p className={`mt-4 text-base leading-8 md:text-lg ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                                {districtCoverage.description}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                {districtCoverage.districts.map((district) => (
                                    <span
                                        key={district}
                                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${isLight
                                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                                            : 'border-blue-500/20 bg-blue-500/10 text-blue-200'
                                            }`}
                                    >
                                        {district}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {copy.relatedLinks && copy.relatedLinks.length > 0 && (
                    <section className="mb-14">
                        <div className={`rounded-2xl border p-6 md:p-7 ${isLight
                            ? 'border-slate-200/80 bg-white/90 shadow-sm'
                            : 'border-slate-800/80 bg-slate-900/45'
                            }`}>
                            <h2 className={`text-2xl font-bold tracking-tight md:text-3xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                                {language === 'tr' ? 'Ilgili sayfalar' : 'Related pages'}
                            </h2>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {copy.relatedLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${isLight
                                            ? 'border-slate-200/80 bg-slate-50 text-slate-700 hover:border-blue-300 hover:text-blue-600'
                                            : 'border-slate-800/80 bg-slate-950/40 text-slate-200 hover:border-blue-500/40 hover:text-blue-400'
                                            }`}
                                    >
                                        <span>{item.label}</span>
                                        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {copy.faqItems && copy.faqItems.length > 0 && (
                    <section className="mb-16">
                        <div className="mb-6">
                            <h2 className={`text-2xl font-bold tracking-tight md:text-3xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                                {language === 'tr' ? 'Sikca sorulan sorular' : 'Frequently asked questions'}
                            </h2>
                        </div>
                        <div className="grid gap-4">
                            {copy.faqItems.map((item) => (
                                <article
                                    key={item.question}
                                    className={`rounded-2xl border p-6 md:p-7 ${isLight
                                        ? 'border-slate-200/80 bg-white/90 shadow-sm'
                                        : 'border-slate-800/80 bg-slate-900/45'
                                        }`}
                                >
                                    <h3 className={`text-lg font-bold md:text-xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                                        {item.question}
                                    </h3>
                                    <p className={`mt-3 text-base leading-8 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                                        {item.answer}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                <section
                    className={`rounded-2xl border px-6 py-10 text-center md:px-10 md:py-14 ${isLight
                        ? 'border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_58%,#ecfdf5_100%)] shadow-sm'
                        : 'border-slate-700/80 bg-gradient-to-br from-slate-950 via-slate-900 to-[#061224]'
                        }`}
                >
                    <h2 className={`mb-4 text-3xl font-bold tracking-tight md:text-4xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                        {copy.ctaTitle}
                    </h2>
                    <p className={`mx-auto mb-8 max-w-3xl text-lg leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {copy.ctaDescription}
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            to={primaryHref}
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-blue-500"
                        >
                            <span>{copy.ctaPrimary}</span>
                            <ArrowRight size={18} className="opacity-80 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to={secondaryHref}
                            className={`inline-flex items-center justify-center rounded-xl px-8 py-4 font-semibold transition-colors ${isLight
                                ? 'border border-slate-200/80 bg-slate-950 text-white hover:bg-slate-900'
                                : 'border border-slate-200/80 bg-slate-100 text-slate-950 hover:bg-white'
                                }`}
                        >
                            {copy.ctaSecondary}
                        </Link>
                    </div>

                    <div className={`mt-8 rounded-2xl border px-5 py-4 text-sm leading-7 ${isLight
                        ? 'border-amber-200/80 bg-amber-50 text-amber-900'
                        : 'border-amber-500/20 bg-amber-500/10 text-amber-200'
                        }`}>
                        {copy.footerNote}
                    </div>
                </section>
            </div>
        </div>
    );
}
