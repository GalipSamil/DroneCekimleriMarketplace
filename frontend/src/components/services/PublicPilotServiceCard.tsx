import { Link } from 'react-router-dom';
import { ArrowRight, Video } from 'lucide-react';
import type { Listing } from '../../types';
import { formatTryCurrency, getServiceCategoryLabel } from '../../utils/serviceCategory';
import { buildServicePath } from '../../utils/seoPaths';

interface PublicPilotServiceCardProps {
    listing: Listing;
    language: 'tr' | 'en';
    copy: {
        hourly: string;
        daily: string;
    };
}

export function PublicPilotServiceCard({ listing, language, copy }: PublicPilotServiceCardProps) {
    return (
        <Link
            to={buildServicePath({ id: listing.id, title: listing.title })}
            className="group overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/45 shadow-lg transition-all duration-300 hover:border-blue-500/30 hover:shadow-blue-500/10"
        >
            <div className="relative aspect-video overflow-hidden bg-slate-800">
                {listing.coverImageUrl ? (
                    <img
                        src={listing.coverImageUrl}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_35%),#0f172a]">
                        <Video size={36} className="text-slate-500" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/72 px-3 py-1 text-xs font-bold tracking-wide text-white">
                    {getServiceCategoryLabel(listing.category, language)}
                </span>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-white transition-colors group-hover:text-blue-500">{listing.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{listing.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-800/70 pt-4">
                    <div className="flex gap-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">{copy.hourly}</p>
                            <p className="text-sm font-bold text-slate-100">{formatTryCurrency(listing.hourlyRate, language)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">{copy.daily}</p>
                            <p className="text-sm font-bold text-slate-100">{formatTryCurrency(listing.dailyRate, language)}</p>
                        </div>
                    </div>
                    <div className="rounded-full border border-slate-700/60 bg-slate-800/60 p-2.5 transition-all duration-200 group-hover:border-blue-500 group-hover:bg-blue-600">
                        <ArrowRight size={16} className="text-slate-400 transition-colors group-hover:text-white" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
