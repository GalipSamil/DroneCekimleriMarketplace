import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCountUp, useInView } from '../../hooks/useCountUp';

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
    <div className="bg-slate-900/40 backdrop-blur-md border border-dashed border-slate-800/80 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 bg-slate-800/60 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
            {icon}
        </div>
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">{description}</p>
        {cta && (
            <Link
                to={cta.to}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-2.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95 group"
            >
                {cta.label}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
        )}
    </div>
);

// ── Status Badge ─────────────────────────────────────────────────────
const STATUS_LABELS = ['Beklemede', 'Kabul Edildi', 'Devam Ediyor', 'Tamamlandı', 'İptal', 'Reddedildi', 'Teslim Edildi'];
const STATUS_COLORS = [
    'bg-amber-500/15 text-amber-300 border-amber-500/25',
    'bg-blue-500/15 text-blue-300 border-blue-500/25',
    'bg-purple-500/15 text-purple-300 border-purple-500/25',
    'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    'bg-red-500/15 text-red-300 border-red-500/25',
    'bg-red-500/15 text-red-300 border-red-500/25',
    'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
];

export const StatusBadge: React.FC<{ status: number }> = ({ status }) => (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${STATUS_COLORS[status] ?? STATUS_COLORS[0]}`}>
        {STATUS_LABELS[status] ?? 'Bilinmiyor'}
    </span>
);
