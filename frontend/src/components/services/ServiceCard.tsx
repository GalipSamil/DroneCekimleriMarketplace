import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, CheckCircle, Star } from 'lucide-react';
import type { Listing } from '../../types';
import { ServiceCategory } from '../../types';

const CATEGORY_NAMES: Record<ServiceCategory, string> = {
    [ServiceCategory.RealEstate]: 'Emlak',
    [ServiceCategory.Wedding]: 'Düğün',
    [ServiceCategory.Inspection]: 'İnceleme',
    [ServiceCategory.Commercial]: 'Ticari',
    [ServiceCategory.Mapping]: 'Haritacılık',
    [ServiceCategory.Agriculture]: 'Tarım',
    [ServiceCategory.Construction]: 'İnşaat',
    [ServiceCategory.Events]: 'Etkinlik',
    [ServiceCategory.Cinematography]: 'Sinematografi',
};

const fmt = (n: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(n);

interface ServiceCardProps {
    service: Listing;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    return (
        <Link
            to={`/service/${service.id}`}
            className={[
                'group block rounded-3xl border overflow-hidden',
                'bg-slate-900/80 backdrop-blur-sm',
                'border-slate-800/80',
                // Hover: lift + border color + shadow
                'transition-all duration-300 ease-out',
                'hover:-translate-y-1.5 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/8',
                // Focus
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                // Entrance
                'animate-fade-in-up',
                // GPU hint
                'will-change-transform',
            ].join(' ')}
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
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-sm border border-white/10 text-xs font-bold text-white tracking-wide">
                    {CATEGORY_NAMES[service.category] ?? 'Diğer'}
                </span>

                {/* Inactive badge */}
                {!service.isActive && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-950/80 backdrop-blur-sm border border-red-500/30 text-xs font-bold text-red-300">
                        Pasif
                    </span>
                )}
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col gap-4">
                {/* Title & Description */}
                <div>
                    <h3 className="text-base font-bold text-slate-100 line-clamp-1 mb-1 transition-colors duration-200 group-hover:text-blue-400">
                        {service.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                        {service.description}
                    </p>
                </div>

                {/* Pilot Row */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 border border-white/10">
                        {service.pilotName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate flex items-center gap-1">
                            {service.pilotName}
                            {service.pilotIsVerified && (
                                <span title="Doğrulanmış Pilot">
                                    <CheckCircle size={12} className="text-blue-400 shrink-0" />
                                </span>
                            )}
                        </p>
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
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Saatlik</p>
                            <p className="text-sm font-bold text-slate-100">{fmt(service.hourlyRate)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Günlük</p>
                            <p className="text-sm font-bold text-slate-100">{fmt(service.dailyRate)}</p>
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
        </Link>
    );
};
