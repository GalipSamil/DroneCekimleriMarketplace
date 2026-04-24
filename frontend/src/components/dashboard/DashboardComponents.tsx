import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCountUp, useInView } from '../../hooks/useCountUp';
import { usePreferences } from '../../context/preferences';

const SHARED_FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)]';

// ── StatCard ─────────────────────────────────────────────────────────
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    suffix?: string;
    color: string; // Tailwind bg + text classes for the icon pill
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, suffix = '', color }) => {
    const [ref, inView] = useInView(0.1);
    const count = useCountUp(value, 900, inView);

    return (
        <div
            ref={ref}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex items-center gap-4 group hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-default"
        >
            <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-200`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-400 text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-extrabold text-white tabular-nums">{count}{suffix}</h3>
            </div>
        </div>
    );
};

// ── EmptyState ───────────────────────────────────────────────────────
interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    cta?: { label: string; to: string };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, cta }) => (
    <div className="rounded-[28px] border border-dashed border-white/[0.08] bg-slate-950/72 p-10 text-center shadow-[0_25px_70px_-52px_rgba(15,23,42,1)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-slate-900/85 text-slate-500">
            {icon}
        </div>
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        {description && <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">{description}</p>}
        {cta && (
            <Link
                to={cta.to}
                className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500 active:scale-95 group ${SHARED_FOCUS_RING}`}
            >
                {cta.label}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
        )}
    </div>
);

// ── Status Badge ─────────────────────────────────────────────────────
const STATUS_COLORS = [
    'bg-amber-500/15 text-amber-300 border-amber-500/25',
    'bg-blue-500/15 text-blue-300 border-blue-500/25',
    'bg-purple-500/15 text-purple-300 border-purple-500/25',
    'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    'bg-red-500/15 text-red-300 border-red-500/25',
    'bg-red-500/15 text-red-300 border-red-500/25',
    'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
];

export const StatusBadge: React.FC<{ status: number }> = ({ status }) => {
    const { language } = usePreferences();
    const statusLabels = language === 'tr'
        ? ['Beklemede', 'Kabul Edildi', 'Devam Ediyor', 'Tamamlandı', 'İptal Edildi', 'Reddedildi', 'Teslim Edildi']
        : ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled', 'Rejected', 'Delivered'];

    return (
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border ${STATUS_COLORS[status] ?? STATUS_COLORS[0]}`}>
            {statusLabels[status] ?? (language === 'tr' ? 'Bilinmiyor' : 'Unknown')}
        </span>
    );
};

// ── Workspace Chips / Tiles ─────────────────────────────────────────
export const DashboardMetricPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="inline-flex min-w-[164px] items-center gap-3 rounded-2xl border border-white/[0.08] bg-slate-900/90 px-4 py-3 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.9)]">
        <div className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_16px_rgba(96,165,250,0.85)]" />
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-50">{value}</p>
        </div>
    </div>
);

export const DashboardInfoTile: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex min-h-[86px] items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-slate-950/78">
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
            <p className="mt-1 break-words text-sm leading-5 text-slate-100">{value}</p>
        </div>
    </div>
);

export const DashboardNoteTile: React.FC<{ label: string; content: string; tone: string; icon?: React.ReactNode }> = ({
    label,
    content,
    tone,
    icon,
}) => (
    <div className={`rounded-2xl border px-4 py-3 ${tone}`}>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            {icon}
            {label}
        </div>
        <p className="mt-2 whitespace-pre-line break-words text-sm leading-6">{content}</p>
    </div>
);

export const DashboardProgressRow: React.FC<{ label: string; value: number; tone: string }> = ({ label, value, tone }) => (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-900/90 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-200">{label}</span>
            <span className="text-sm font-semibold text-white">{value}</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-800/90">
            <div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.min(100, Math.max(value * 18, value > 0 ? 14 : 0))}%` }} />
        </div>
    </div>
);

export const DashboardSummaryCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    helper: string;
    tone: string;
}> = ({ icon, label, value, helper, tone }) => (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-slate-950/88 p-5 shadow-[0_25px_70px_-52px_rgba(15,23,42,1)]">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
                <p className="mt-3 text-[2.1rem] font-semibold tracking-tight text-white">{value}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-[18px] border bg-slate-900/88 ${tone}`}>
                {icon}
            </div>
        </div>
        <p className="mt-3 max-w-[24ch] text-[13px] leading-5 text-slate-400">{helper}</p>
    </div>
);

// ── Pagination ───────────────────────────────────────────────────────
interface DashboardPaginationProps {
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    itemLabel?: string;
}

const buildPageNumbers = (page: number, totalPages: number) => {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 3) {
        return [1, 2, 3, 4, '...', totalPages] as const;
    }

    if (page >= totalPages - 2) {
        return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const;
    }

    return [1, '...', page - 1, page, page + 1, '...', totalPages] as const;
};

export const DashboardPagination: React.FC<DashboardPaginationProps> = ({
    page,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    itemLabel = 'kayıt',
}) => {
    const { language } = usePreferences();

    if (totalPages <= 1) return null;

    const copy = language === 'tr'
        ? {
            page: 'Sayfa',
            previous: 'Önceki',
            next: 'Sonraki',
        }
        : {
            page: 'Page',
            previous: 'Previous',
            next: 'Next',
        };

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);
    const pageNumbers = buildPageNumbers(page, totalPages);

    return (
        <div className="flex flex-col gap-2 rounded-[1.25rem] border border-white/[0.08] bg-slate-950/55 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-slate-900/88 px-2.5 py-1 font-semibold text-slate-200">
                    {start}-{end}
                </span>
                <span>{totalItems} {itemLabel}</span>
                <span className="text-slate-600">•</span>
                <span>{copy.page} {page}/{totalPages}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-slate-900/88 px-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-500/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 ${SHARED_FOCUS_RING}`}
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">{copy.previous}</span>
                </button>

                {pageNumbers.map((value, index) => (
                    value === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-1 text-xs text-slate-600">
                            ...
                        </span>
                    ) : (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onPageChange(value)}
                            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold transition-colors ${value === page ? 'border-blue-400/30 bg-blue-500/12 text-white shadow-sm shadow-blue-500/10' : 'border-white/[0.08] bg-slate-900/88 text-slate-300 hover:border-slate-500/60 hover:text-white'} ${SHARED_FOCUS_RING}`}
                        >
                            {value}
                        </button>
                    )
                ))}

                <button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-slate-900/88 px-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-500/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 ${SHARED_FOCUS_RING}`}
                >
                    <span className="hidden sm:inline">{copy.next}</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
