import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, ShieldCheck, Star } from 'lucide-react';
import { usePreferences } from '../../context/preferences';
import { listingAPI, pilotAPI } from '../../services/api';
import type { Listing, PilotProfile } from '../../types';
import { getServiceCategoryLabel } from '../../utils/serviceCategory';
import { buildPilotProfilePath } from '../../utils/seoPaths';
import { findTurkishCityByCoordinates } from '../../utils/turkishCities';

type FeaturedPilot = {
    userId: string;
    fullName: string;
    profileImageUrl?: string;
    isVerified: boolean;
    cityLabel: string;
    primaryCategoryLabel: string;
    listingCount: number;
    averageRating: number;
    reviewCount: number;
};

const toInitials = (value: string) => value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const buildFeaturedPilots = (
    pilots: PilotProfile[],
    listings: Listing[],
    language: 'tr' | 'en',
): FeaturedPilot[] => {
    const listingsByPilot = listings.reduce<Map<string, Listing[]>>((map, listing) => {
        const current = map.get(listing.pilotUserId) ?? [];
        current.push(listing);
        map.set(listing.pilotUserId, current);
        return map;
    }, new Map());

    return pilots
        .flatMap((pilot) => {
            const pilotListings = listingsByPilot.get(pilot.userId) ?? [];
            if (pilotListings.length === 0) {
                return [];
            }

            const cityLabel = findTurkishCityByCoordinates(pilot.latitude, pilot.longitude)?.label[language]
                ?? (language === 'tr' ? 'Konum paylaşılmadı' : 'Location not shared');

            const topListing = [...pilotListings].sort((left, right) => {
                const reviewDiff = (right.reviewCount ?? 0) - (left.reviewCount ?? 0);
                if (reviewDiff !== 0) {
                    return reviewDiff;
                }

                const ratingDiff = (right.averageRating ?? 0) - (left.averageRating ?? 0);
                if (ratingDiff !== 0) {
                    return ratingDiff;
                }

                return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
            })[0];

            return [{
                userId: pilot.userId,
                fullName: pilot.fullName,
                profileImageUrl: pilot.profileImageUrl,
                isVerified: pilot.isVerified ?? false,
                cityLabel,
                primaryCategoryLabel: getServiceCategoryLabel(topListing.category, language),
                listingCount: pilotListings.length,
                averageRating: topListing.averageRating ?? 0,
                reviewCount: topListing.reviewCount ?? 0,
            } satisfies FeaturedPilot];
        })
        .sort((left, right) => {
            if (left.isVerified !== right.isVerified) {
                return left.isVerified ? -1 : 1;
            }

            if (left.reviewCount !== right.reviewCount) {
                return right.reviewCount - left.reviewCount;
            }

            if (left.listingCount !== right.listingCount) {
                return right.listingCount - left.listingCount;
            }

            return left.fullName.localeCompare(right.fullName, language === 'tr' ? 'tr' : 'en');
        })
        .slice(0, 4);
};

const PilotCard: React.FC<{ pilot: FeaturedPilot; language: 'tr' | 'en' }> = ({ pilot, language }) => {
    const copy = language === 'tr'
        ? {
            verified: 'Doğrulandı',
            unverified: 'Profil aktif',
            activeListings: 'aktif hizmet',
            ratingLabel: 'değerlendirme',
            profileAria: `${pilot.fullName} profiline git`,
        }
        : {
            verified: 'Verified',
            unverified: 'Profile live',
            activeListings: 'active services',
            ratingLabel: 'reviews',
            profileAria: `Go to ${pilot.fullName} profile`,
        };

    return (
        <div className="group flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/75 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700/80">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    {pilot.profileImageUrl ? (
                        <img
                            src={pilot.profileImageUrl}
                            alt={pilot.fullName}
                            className="h-14 w-14 rounded-xl border border-slate-700/70 object-cover"
                        />
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700/70 bg-blue-600 text-base font-bold text-white">
                            {toInitials(pilot.fullName)}
                        </div>
                    )}

                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-slate-100 group-hover:text-blue-500 transition-colors">
                            {pilot.fullName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">{pilot.primaryCategoryLabel}</p>
                    </div>
                </div>

                <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${pilot.isVerified
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
                    : 'border-slate-700/70 bg-slate-800/80 text-slate-300'
                    }`}
                >
                    <ShieldCheck size={12} />
                    <span>{pilot.isVerified ? copy.verified : copy.unverified}</span>
                </div>
            </div>

            <div className="mt-6 grid gap-3 border-t border-slate-800/60 pt-5 text-sm text-slate-300">
                <div className="flex items-center gap-2.5">
                    <MapPin size={15} className="shrink-0 text-blue-500" />
                    <span>{pilot.cityLabel}</span>
                </div>

                <div className="flex items-center gap-2.5">
                    <ShieldCheck size={15} className="shrink-0 text-emerald-400" />
                    <span>{pilot.listingCount} {copy.activeListings}</span>
                </div>

                <div className="flex items-center gap-2.5">
                    <Star size={15} className="shrink-0 text-amber-400 fill-amber-400" />
                    <span>
                        {pilot.reviewCount > 0
                            ? `${pilot.averageRating.toFixed(1)} · ${pilot.reviewCount} ${copy.ratingLabel}`
                            : (language === 'tr' ? 'Henüz değerlendirme yok' : 'No reviews yet')}
                    </span>
                </div>
            </div>

            <div className="mt-auto pt-6">
                <Link
                    to={buildPilotProfilePath({ userId: pilot.userId, fullName: pilot.fullName })}
                    aria-label={copy.profileAria}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/70 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
                >
                    <span>{language === 'tr' ? 'Profili Gör' : 'View Profile'}</span>
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export const PilotsSection: React.FC = () => {
    const { language } = usePreferences();
    const [pilots, setPilots] = useState<FeaturedPilot[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);

    const copy = language === 'tr'
        ? {
            titleLead: 'Platformdaki',
            titleAccent: 'Pilotlar',
            description: 'Aktif hizmeti olan pilot profillerinden bazılarını keşfet.',
            viewAll: 'Hizmetleri Keşfet',
            loading: 'Pilotlar yükleniyor...',
        }
        : {
            titleLead: 'Pilots',
            titleAccent: 'On The Platform',
            description: 'Explore a few pilot profiles that currently have active services.',
            viewAll: 'Explore Services',
            loading: 'Loading pilots...',
        };

    useEffect(() => {
        let mounted = true;

        const loadPilots = async () => {
            try {
                setLoading(true);
                setLoadFailed(false);

                const [pilotProfiles, activeListings] = await Promise.all([
                    pilotAPI.searchPilots(),
                    listingAPI.search(),
                ]);

                if (!mounted) {
                    return;
                }

                setPilots(buildFeaturedPilots(pilotProfiles, activeListings, language));
            } catch (error) {
                console.error('Error loading pilots section:', error);
                if (mounted) {
                    setLoadFailed(true);
                    setPilots([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadPilots();
        return () => { mounted = false; };
    }, [language]);

    const skeletons = useMemo(() => Array.from({ length: 4 }, (_, index) => index), []);

    if (!loading && (loadFailed || pilots.length === 0)) {
        return null;
    }

    return (
        <section className="relative border-y border-slate-800/50 bg-slate-900/20 py-20 md:py-24">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center sm:gap-6 md:mb-12 md:gap-8">
                    <div>
                        <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
                            {copy.titleLead} <span className="text-blue-500">{copy.titleAccent}</span>
                        </h2>
                        <p className="text-base text-slate-400">{copy.description}</p>
                    </div>
                    <Link to="/browse-services" className="group inline-flex shrink-0 items-center gap-2 pt-1 font-semibold text-blue-500 transition-colors hover:text-blue-400 sm:pt-0">
                        {copy.viewAll}
                        <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {skeletons.map((item) => (
                            <div key={item} className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 animate-pulse">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-2xl bg-slate-800" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-24 rounded bg-slate-800" />
                                            <div className="h-3 w-20 rounded bg-slate-800" />
                                        </div>
                                    </div>
                                    <div className="h-6 w-20 rounded-full bg-slate-800" />
                                </div>
                                <div className="mt-6 space-y-3 border-t border-slate-800/60 pt-5">
                                    <div className="h-3 w-28 rounded bg-slate-800" />
                                    <div className="h-3 w-24 rounded bg-slate-800" />
                                    <div className="h-3 w-32 rounded bg-slate-800" />
                                </div>
                                <div className="mt-6 h-10 w-32 rounded-full bg-slate-800" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {pilots.map((pilot) => (
                            <PilotCard key={pilot.userId} pilot={pilot} language={language} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
