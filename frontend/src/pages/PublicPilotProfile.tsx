import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle, Eye, LayoutDashboard, MapPin, MessageSquare, ShieldCheck, Star, UserCircle2, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/preferences';
import { extractApiErrorMessage, listingAPI, pilotAPI, reviewAPI } from '../services/api';
import type { Listing, PilotProfile, Review } from '../types';
import { getLocaleForLanguage } from '../utils/serviceCategory';
import { buildPilotProfileIdPath, buildPilotProfilePath, buildPilotServicesIdPath, buildPilotServicesPath, buildServicePath, isExpectedSlug } from '../utils/seoPaths';
import { findTurkishCityByCoordinates } from '../utils/turkishCities';
import { PublicPilotServiceCard } from '../components/services/PublicPilotServiceCard';
import Seo from '../components/seo/Seo';
import { buildBreadcrumbSchema, toAbsoluteAssetUrl, toAbsoluteUrl, trimMetaDescription } from '../config/seo';

type DisplayPilotProfile = PilotProfile & { coverImageUrl?: string };

const splitList = (value?: string) => value?.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean) ?? [];
const toInitials = (value: string) => value.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');

export default function PublicPilotProfile() {
    const { id, slug } = useParams<{ id: string; slug?: string }>();
    const navigate = useNavigate();
    const { language, theme } = usePreferences();
    const { isAuthenticated, isPilot, userId } = useAuth();
    const isLight = theme === 'light';
    const locale = getLocaleForLanguage(language);
    const [pilot, setPilot] = useState<DisplayPilotProfile | null>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);

    const copy = language === 'tr'
        ? {
            status: 'Durum',
            verified: 'Doğrulanmış pilot',
            pending: 'İnceleme bekliyor',
            noLocation: 'Konum paylaşılmadı',
            services: 'Aktif Hizmetler',
            about: 'Hakkında',
            equipment: 'Ekipmanlar',
            reviews: 'Müşteri Değerlendirmeleri',
            noBio: 'Bu pilot henüz biyografi eklemedi.',
            noEquipment: 'Ekipman bilgisi paylaşılmadı.',
            noServices: 'Henüz aktif hizmet bulunmuyor.',
            noReviews: 'Henüz değerlendirme bulunmuyor.',
            profileNotFound: 'Pilot profili bulunamadı.',
            profileLoadError: 'Pilot profili yüklenemedi.',
            back: 'Hizmetlere Dön',
            browse: 'İlanları Gör',
            browseAll: 'Tüm hizmetler',
            viewAllActiveServices: 'Tüm aktif hizmetleri gör',
            edit: 'Profili Düzenle',
            dashboard: 'Panele Dön',
            reviewsLabel: (count: number) => `(${count} değerlendirme)`,
            hourly: 'Saatlik',
            daily: 'Günlük',
        }
        : {
            status: 'Status',
            verified: 'Verified pilot',
            pending: 'Pending review',
            noLocation: 'Location not shared',
            services: 'Active Services',
            about: 'About',
            equipment: 'Equipment',
            reviews: 'Customer Reviews',
            noBio: 'This pilot has not added a bio yet.',
            noEquipment: 'No equipment information was shared.',
            noServices: 'No active services yet.',
            noReviews: 'No reviews yet.',
            profileNotFound: 'Pilot profile not found.',
            profileLoadError: 'The pilot profile could not be loaded.',
            back: 'Back to Services',
            browse: 'View Services',
            browseAll: 'Browse All',
            viewAllActiveServices: 'View all active services',
            edit: 'Edit Profile',
            dashboard: 'Back to Dashboard',
            reviewsLabel: (count: number) => `(${count} reviews)`,
            hourly: 'Hourly',
            daily: 'Daily',
        };

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!id) {
                if (mounted) {
                    setNotFound(true);
                    setLoading(false);
                }
                return;
            }

            try {
                setLoading(true);
                setError('');
                setNotFound(false);
                const [profileData, listingData] = await Promise.all([pilotAPI.getProfile(id), listingAPI.getByPilot(id)]);
                if (!mounted) return;
                setPilot({
                    ...profileData,
                    coverImageUrl: listingData[0]?.coverImageUrl,
                });
                setListings(listingData);
                try {
                    const reviewData = await reviewAPI.getByPilot(profileData.id);
                    if (mounted) setReviews(reviewData);
                } catch (reviewError) {
                    console.error('Could not fetch pilot reviews:', reviewError);
                    if (mounted) setReviews([]);
                }
            } catch (err) {
                if (!mounted) return;
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setNotFound(true);
                } else {
                    console.error('Error loading pilot profile:', err);
                    setError(extractApiErrorMessage(err, copy.profileLoadError));
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [copy.profileLoadError, id]);

    useEffect(() => {
        if (!pilot) {
            return;
        }

        if (isExpectedSlug(slug, pilot.fullName)) {
            return;
        }

        navigate(buildPilotProfilePath({ userId: pilot.userId, fullName: pilot.fullName }), { replace: true });
    }, [navigate, pilot, slug]);

    const rating = useMemo(() => {
        if (reviews.length > 0) {
            return Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1));
        }
        return listings[0]?.averageRating ?? 0;
    }, [listings, reviews]);

    const ratingCount = reviews.length > 0 ? reviews.length : (listings[0]?.reviewCount ?? 0);
    const equipmentItems = splitList(pilot?.equipmentList);
    const locationText = listings.find((listing) => listing.pilotLocation)
        ?.pilotLocation
        || findTurkishCityByCoordinates(pilot?.latitude, pilot?.longitude)?.label[language]
        || copy.noLocation;
    const isOwnProfile = Boolean(pilot?.userId && isAuthenticated && isPilot && userId === pilot.userId);
    const firstListing = listings[0];
    const visibleListings = listings.slice(0, 2);
    const hasMoreListings = listings.length > 2;
    const pilotServicesPath = pilot
        ? buildPilotServicesPath({ userId: pilot.userId, fullName: pilot.fullName })
        : (id ? buildPilotServicesIdPath(id) : '/browse-services');
    const profilePath = pilot
        ? buildPilotProfilePath({ userId: pilot.userId, fullName: pilot.fullName })
        : (id ? buildPilotProfileIdPath(id) : '/browse-services');
    const seoDescription = trimMetaDescription(
        pilot?.bio?.trim()
            || (language === 'tr'
                ? `${pilot?.fullName} icin DronePazar uzerindeki herkese acik pilot profili ve hizmetleri.`
                : `Public DronePazar pilot profile and services for ${pilot?.fullName}.`)
    );
    const pilotImageUrl = toAbsoluteAssetUrl(pilot?.profileImageUrl || pilot?.coverImageUrl);
    const pilotSchema = pilot ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: pilot.fullName,
        description: seoDescription,
        url: toAbsoluteUrl(profilePath),
        image: pilotImageUrl ? [pilotImageUrl] : undefined,
        homeLocation: locationText !== copy.noLocation
            ? {
                '@type': 'Place',
                name: locationText,
            }
            : undefined,
        knowsAbout: equipmentItems.length > 0 ? equipmentItems : undefined,
        aggregateRating: ratingCount > 0 && rating > 0
            ? {
                '@type': 'AggregateRating',
                ratingValue: rating,
                reviewCount: ratingCount,
            }
            : undefined,
    } : undefined;
    const pilotBreadcrumbSchema = pilot ? buildBreadcrumbSchema([
        { name: 'DronePazar', path: '/' },
        { name: language === 'tr' ? 'Hizmetler' : 'Services', path: '/browse-services' },
        { name: pilot.fullName, path: profilePath },
    ]) : undefined;

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-slate-50' : 'bg-[#020617]'}`}>
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
            </div>
        );
    }

    if (notFound || !pilot) {
        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isLight ? 'bg-slate-50' : 'bg-[#020617]'}`}>
                <div className="max-w-xl rounded-[32px] border border-white/[0.08] bg-slate-950/84 p-8 text-center shadow-[0_30px_80px_-52px_rgba(15,23,42,1)]">
                    <h1 className="text-3xl font-bold text-white">{copy.profileNotFound}</h1>
                    {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
                    <Link to="/browse-services" className="btn-secondary mt-6">{copy.back}</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen overflow-hidden pt-20 ${isLight ? 'bg-slate-50 text-slate-950' : 'bg-[#020617] text-slate-50'}`}>
            <Seo
                title={language === 'tr' ? `${pilot.fullName} pilot profili` : `${pilot.fullName} pilot profile`}
                description={seoDescription}
                path={profilePath}
                type="profile"
                image={pilot?.profileImageUrl || pilot?.coverImageUrl}
                imageAlt={pilot.fullName}
                schema={pilotSchema && pilotBreadcrumbSchema ? [pilotSchema, pilotBreadcrumbSchema] : pilotSchema}
            />


            <div className="h-72 md:h-96 relative overflow-hidden bg-slate-900">
                {pilot.coverImageUrl ? (
                    <img src={pilot.coverImageUrl} alt={pilot.fullName} className="w-full h-full object-cover scale-105" />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.2),_transparent_28%),#020617]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
            </div>

            <div className="container mx-auto max-w-7xl px-4 relative z-20 -mt-32 pb-20">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                    <aside className="w-full lg:w-1/3 xl:w-1/4">
                        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-xl backdrop-blur-xl">
                            <div className="relative mx-auto mb-6 h-40 w-40">
                                <div className="absolute inset-0 rounded-full bg-blue-500 blur-lg opacity-20" />
                                {pilot.profileImageUrl ? (
                                    <img src={pilot.profileImageUrl} alt={pilot.fullName} className="relative z-10 h-full w-full rounded-full border-4 border-[#020617] object-cover shadow-lg" />
                                ) : (
                                    <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full border-4 border-[#020617] bg-gradient-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white shadow-lg">
                                        {toInitials(pilot.fullName)}
                                    </div>
                                )}
                                {pilot.isVerified ? (
                                    <div className="absolute bottom-1 right-1 z-20 rounded-full border-4 border-[#020617] bg-emerald-500 p-2 text-[#020617]" title={copy.verified}>
                                        <ShieldCheck size={20} />
                                    </div>
                                ) : (
                                    <div className="absolute bottom-1 right-1 z-20 rounded-full border-4 border-[#020617] bg-amber-500 p-2 text-[#020617]" title={copy.pending}>
                                        <AlertCircle size={20} />
                                    </div>
                                )}
                            </div>

                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-slate-50">{pilot.fullName}</h1>
                            </div>

                            <div className="mb-8 flex items-center justify-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/50 py-3 shadow-inner">
                                <Star className="text-amber-400 fill-amber-400" size={20} />
                                <span className="text-lg font-extrabold text-white">{rating > 0 ? rating.toFixed(1) : '-'}</span>
                                <span className="font-medium text-slate-500">{copy.reviewsLabel(ratingCount)}</span>
                            </div>

                            <div className="mb-10 space-y-5 text-sm font-medium text-slate-300">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-slate-800/50 p-2 text-blue-500"><MapPin size={18} /></div>
                                    <span>{locationText}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`rounded-lg bg-slate-800/50 p-2 ${pilot.isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {pilot.isVerified ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                                    </div>
                                    <span>{copy.status}: {pilot.isVerified ? copy.verified : copy.pending}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-slate-800/50 p-2 text-purple-400"><CheckCircle size={18} /></div>
                                    <span>{listings.length} {copy.services.toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {isOwnProfile ? (
                                    <>
                                        <Link to="/pilot/profile" className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-500 flex items-center justify-center gap-2">
                                            <Eye size={18} />{copy.edit}
                                        </Link>
                                        <Link to="/pilot/dashboard" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-base font-medium text-slate-300 transition-all duration-300 hover:bg-slate-700 hover:text-white flex items-center justify-center gap-2">
                                            <LayoutDashboard size={18} />{copy.dashboard}
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to={firstListing ? buildServicePath({ id: firstListing.id, title: firstListing.title }) : '/browse-services'} className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-500 flex items-center justify-center gap-2">
                                            <ArrowRight size={18} />{copy.browse}
                                        </Link>
                                        <Link to="/browse-services" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-base font-medium text-slate-300 transition-all duration-300 hover:bg-slate-700 hover:text-white flex items-center justify-center gap-2">
                                            <ArrowRight size={18} />{copy.browseAll}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 shadow-lg backdrop-blur-md">
                            <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-slate-50"><div className="rounded-lg bg-blue-500/10 p-2"><Video size={20} className="text-blue-500" /></div>{copy.equipment}</h3>
                            {equipmentItems.length === 0 ? (
                                <p className="text-sm text-slate-400">{copy.noEquipment}</p>
                            ) : (
                                <ul className="space-y-4">
                                    {equipmentItems.map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </aside>

                    <div className="flex-1 lg:pt-8">
                        <section className="mb-10 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 shadow-lg backdrop-blur-xl md:p-12">
                            <h2 className="mb-6 text-2xl font-bold text-slate-50 md:text-3xl">{copy.about}</h2>
                            <p className="text-lg leading-relaxed text-slate-300">{pilot.bio?.trim() || copy.noBio}</p>
                        </section>

                        <section className="mb-10">
                            <div className="mb-8 flex items-center justify-between px-2">
                                <h2 className="text-2xl font-bold text-slate-50 md:text-3xl">{copy.services}</h2>
                                {hasMoreListings ? (
                                    <Link to={pilotServicesPath} className="group flex items-center gap-1 text-sm font-bold text-blue-500 transition-colors hover:text-blue-400">
                                        {copy.viewAllActiveServices} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                ) : (
                                    <Link to="/browse-services" className="group flex items-center gap-1 text-sm font-bold text-blue-500 transition-colors hover:text-blue-400">
                                        {copy.browseAll} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                )}
                            </div>
                            {listings.length === 0 ? (
                                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-12 text-center backdrop-blur-md">
                                    <p className="text-lg font-medium text-slate-300">{copy.noServices}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {visibleListings.map((listing) => (
                                        <PublicPilotServiceCard
                                            key={listing.id}
                                            listing={listing}
                                            language={language}
                                            copy={{ hourly: copy.hourly, daily: copy.daily }}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>

                        <section>
                            <div className="mb-8 px-2">
                                <h2 className="text-2xl font-bold text-slate-50 md:text-3xl">{copy.reviews} <span className="ml-2 text-lg font-medium text-slate-500">({ratingCount})</span></h2>
                            </div>
                            {reviews.length === 0 ? (
                                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-12 text-center backdrop-blur-md">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/50"><MessageSquare size={32} className="text-slate-500" /></div>
                                    <p className="text-lg font-medium text-slate-300">{copy.noReviews}</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 shadow-lg backdrop-blur-md transition-all hover:bg-slate-900/60 hover:border-slate-700">
                                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex items-center gap-4">
                                                    {review.customerProfilePictureUrl ? (
                                                        <img src={review.customerProfilePictureUrl} alt={review.customerName} className="h-12 w-12 rounded-full border border-slate-700 object-cover" />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400"><UserCircle2 size={22} /></div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-bold text-slate-50">{review.customerName}</h4>
                                                        <span className="text-xs font-medium text-slate-500">{new Date(review.createdAt).toLocaleDateString(locale)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 rounded-xl border border-slate-800/50 bg-slate-950/50 p-2">
                                                    {[...Array(5)].map((_, index) => <Star key={index} size={16} className={index < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />)}
                                                </div>
                                            </div>
                                            {review.comment && <p className="whitespace-pre-line text-base font-light leading-relaxed text-slate-300">"{review.comment}"</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
