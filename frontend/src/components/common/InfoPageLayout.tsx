import type { ReactNode } from 'react';
import { usePreferences } from '../../context/preferences';

export interface InfoSection {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
}

interface InfoPageLayoutProps {
    badge: string;
    title: string;
    description: string;
    sections: InfoSection[];
    footerNote?: ReactNode;
}

export default function InfoPageLayout({
    badge,
    title,
    description,
    sections,
    footerNote,
}: InfoPageLayoutProps) {
    const { theme } = usePreferences();
    const isLight = theme === 'light';

    return (
        <div className={`min-h-screen pt-24 pb-20 ${isLight ? 'bg-slate-50 text-slate-950' : 'bg-[#020617] text-slate-50'}`}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 text-center">
                    <div className="mb-5 inline-flex items-center rounded-full border border-blue-500/15 bg-blue-600/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
                        {badge}
                    </div>
                    <h1 className={`mb-5 text-3xl font-bold tracking-tight md:text-4xl ${isLight ? 'text-slate-950' : 'text-slate-50'}`}>
                        {title}
                    </h1>
                    <p className={`mx-auto max-w-3xl text-lg leading-relaxed md:text-xl ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {description}
                    </p>
                </div>

                <div className="space-y-6">
                    {sections.map((section) => (
                        <section
                            key={section.title}
                            className={`rounded-2xl border p-7 md:p-9 ${isLight
                                ? 'border-slate-200/80 bg-white/85 shadow-sm'
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
                                <ul className={`mt-4 space-y-3 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                                    {section.bullets.map((bullet) => (
                                        <li key={bullet} className="flex items-start gap-3 text-base leading-7">
                                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>

                {footerNote && (
                    <div className={`mt-8 rounded-2xl border px-5 py-4 text-sm leading-7 ${isLight
                        ? 'border-amber-200/80 bg-amber-50 text-amber-900'
                        : 'border-amber-500/20 bg-amber-500/10 text-amber-200'
                        }`}>
                        {footerNote}
                    </div>
                )}
            </div>
        </div>
    );
}
