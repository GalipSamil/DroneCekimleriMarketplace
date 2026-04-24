import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, CheckCircle, Star } from 'lucide-react';
import type { Listing } from '../../types';
import { usePreferences } from '../../context/preferences';
import { formatTryCurrency, getServiceCategoryLabel } from '../../utils/serviceCategory';
import { buildPilotProfilePath, buildServicePath } from '../../utils/seoPaths';

interface ServiceCardProps {
    service: Listing;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    const navigate = useNavigate();
    const { language, theme } = usePreferences();
    const copy = language === 'tr'
        ? {
            inactive: 'Pasif',
            verifiedPilot: 'Doğrulanmış Pilot',
            hourly: 'Saatlik',
            daily: 'Günlük',
            pilotProfileAria: `${service.pilotName} profiline git`,
        }
        : {
            inactive: 'Inactive',
            verifiedPilot: 'Verified Pilot',
            hourly: 'Hourly',
            daily: 'Daily',
            pilotProfileAria: `Go to ${service.pilotName} profile`,
        };

    const categoryBadgeClass = theme === 'light'
        ? 'bg-white/92 border border-slate-200/90 text-slate-900 shadow-lg shadow-slate-300/20'
        : 'bg-slate-950/72 backdrop-blur-sm border border-white/10 text-white';

    const inactiveBadgeClass = theme === 'light'
        ? 'bg-red-50/95 border border-red-200 text-red-700'
        : 'bg-red-950/80 backdrop-blur-sm border border-red-500/30 text-red-300';

    const openService = () => {
        navigate(buildServicePath({ id: service.id, title: service.title }));
    };

    return (
        <article
            className={[
                'group block rounded-2xl border overflow-hidden',
                'bg-slate-900/80',
                'border-slate-800/80',
                // Hover: lift + border color
                'transition-all duration-200 ease-out',
                'hover:-translate-y-1 hover:border-slate-700/80',
                // Focus
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                // Entrance
                'animate-fade-in-up',
            ].join(' ')}
            role="link"
            tabIndex={0}
            onClick={openService}
            onKeyDown={(event) => {
                if (event.target !== event.currentTarget) {
                    return;
                }

                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openService();
                }
            }}
        >
            {/* Cover Image */}
            <div className="relative h-52 overflow-hidden bg-slate-800/50">
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <MapPin className="text-slate-700 w-10 h-10" />
                </div>
                {service.coverImageUrl && (
                    <img
                        src={service.coverImageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] relative z-0"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                )}

                {/* Gradient overlay — heavier at bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Category badge */}
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${categoryBadgeClass}`}>
                    {getServiceCategoryLabel(service.category, language)}
                </span>

                {/* Inactive badge */}
                {!service.isActive && (
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${inactiveBadgeClass}`}>
                        {copy.inactive}
                    </span>
                )}
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col gap-4">
                {/* Title & Description */}
                <div>
                    <h3 className="text-base font-bold text-slate-100 line-clamp-1 mb-1 transition-colors duration-200 group-hover:text-blue-500">
                        {service.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                        {service.description}
                    </p>
                </div>

                {/* Pilot Row */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0 border border-white/10">
                        {service.pilotName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <Link
                            to={buildPilotProfilePath({ userId: service.pilotUserId, fullName: service.pilotName })}
                            aria-label={copy.pilotProfileAria}
                            className="inline-flex max-w-full items-center gap-1 truncate text-sm font-semibold text-slate-200 transition-colors hover:text-blue-500"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <span className="truncate">{service.pilotName}</span>
                            {service.pilotIsVerified && (
                                <span title={copy.verifiedPilot}>
                                    <CheckCircle size={12} className="text-blue-500 shrink-0" />
                                </span>
                            )}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                            {service.averageRating > 0 ? (
                                <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                                    <Star size={11} fill="currentColor" />
                                    {service.averageRating.toFixed(1)}
                                    <span className="text-slate-500 font-normal">({service.reviewCount})</span>
                                </span>
                            ) : service.pilotLocation ? (
                                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                                    <MapPin size={10} className="shrink-0" />
                                    {service.pilotLocation}
                                </p>
                            ) : null}
                            {service.averageRating > 0 && service.pilotLocation && (
                                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                                    <MapPin size={10} className="shrink-0" />
                                    {service.pilotLocation}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pricing + Arrow */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                    <div className="flex gap-4">
                        <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">{copy.hourly}</p>
                            <p className="text-sm font-bold text-slate-100">{formatTryCurrency(service.hourlyRate, language)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">{copy.daily}</p>
                            <p className="text-sm font-bold text-slate-100">{formatTryCurrency(service.dailyRate, language)}</p>
                        </div>
                    </div>

                    {/* Arrow button — transitions color and arrow position on group hover */}
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-slate-700/60 bg-slate-800/60 transition-all duration-200 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:shadow-md group-hover:shadow-blue-500/20">
                        <ArrowRight
                            size={15}
                            className="text-slate-400 transition-all duration-200 group-hover:text-white group-hover:translate-x-0.5"
                        />
                    </div>
                </div>
            </div>
        </article>
    );
};
