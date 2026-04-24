import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePreferences } from '../context/preferences';
import { extractApiErrorMessage, listingAPI, pilotAPI } from '../services/api';
import type { Listing, PilotProfile } from '../types';
import { PublicPilotServiceCard } from '../components/services/PublicPilotServiceCard';
import Seo from '../components/seo/Seo';
import { buildBreadcrumbSchema, toAbsoluteUrl, trimMetaDescription } from '../config/seo';
import { buildPilotProfileIdPath, buildPilotProfilePath, buildPilotServicesIdPath, buildPilotServicesPath, buildServicePath, isExpectedSlug } from '../utils/seoPaths';

export default function PublicPilotServices() {
    const { id, slug } = useParams<{ id: string; slug?: string }>();
    const navigate = useNavigate();
    const { language, theme } = usePreferences();
    const isLight = theme === 'light';
    const [pilot, setPilot] = useState<PilotProfile | null>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);

    const copy = language === 'tr'
        ? {
            services: 'Aktif Hizmetler',
            allServices: 'Tüm aktif hizmetler',
            backToProfile: 'Profile dön',
            noServices: 'Henüz aktif hizmet bulunmuyor.',
            profileNotFound: 'Pilot profili bulunamadı.',
            profileLoadError: 'Pilot profili yüklenemedi.',
            backToBrowse: 'Hizmetlere Dön',
            hourly: 'Saatlik',
            daily: 'Günlük',
        }
        : {
            services: 'Active Services',
            allServices: 'All active services',
            backToProfile: 'Back to profile',
            noServices: 'No active services yet.',
            profileNotFound: 'Pilot profile not found.',
            profileLoadError: 'The pilot profile could not be loaded.',
            backToBrowse: 'Back to Services',
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
                const [profileData, listingData] = await Promise.all([
                    pilotAPI.getProfile(id),
                    listingAPI.getByPilot(id),
                ]);
                if (!mounted) return;
                setPilot(profileData);
                setListings(listingData);
            } catch (err) {
                if (!mounted) return;
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setNotFound(true);
                } else {
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

        navigate(buildPilotServicesPath({ userId: pilot.userId, fullName: pilot.fullName }), { replace: true });
    }, [navigate, pilot, slug]);

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
                    <Link to="/browse-services" className="btn-secondary mt-6">{copy.backToBrowse}</Link>
                </div>
            </div>
        );
    }

    const servicesPath = pilot
        ? buildPilotServicesPath({ userId: pilot.userId, fullName: pilot.fullName })
        : (id ? buildPilotServicesIdPath(id) : '/browse-services');
    const profilePath = pilot
        ? buildPilotProfilePath({ userId: pilot.userId, fullName: pilot.fullName })
        : (id ? buildPilotProfileIdPath(id) : '/browse-services');
    const seoDescription = trimMetaDescription(
        language === 'tr'
            ? `${pilot?.fullName} tarafindan sunulan aktif drone hizmetlerini kesfedin.`
            : `Browse active drone services offered by ${pilot?.fullName}.`
    );
    const servicesSchema = pilot ? {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: language === 'tr' ? `${pilot.fullName} hizmetleri` : `${pilot.fullName} services`,
        description: seoDescription,
        url: toAbsoluteUrl(servicesPath),
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: listings.map((listing, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: toAbsoluteUrl(buildServicePath({ id: listing.id, title: listing.title })),
                name: listing.title,
            })),
        },
    } : undefined;
    const servicesBreadcrumbSchema = pilot ? buildBreadcrumbSchema([
        { name: 'DronePazar', path: '/' },
        { name: pilot.fullName, path: profilePath },
        { name: language === 'tr' ? 'Hizmetler' : 'Services', path: servicesPath },
    ]) : undefined;

    return (
        <div className={`min-h-screen overflow-hidden pt-20 ${isLight ? 'bg-slate-50 text-slate-950' : 'bg-[#020617] text-slate-50'}`}>
            <Seo
                title={language === 'tr' ? `${pilot.fullName} hizmetleri` : `${pilot.fullName} services`}
                description={seoDescription}
                path={servicesPath}
                image={listings[0]?.coverImageUrl || pilot.profileImageUrl}
                imageAlt={pilot.fullName}
                schema={servicesSchema && servicesBreadcrumbSchema ? [servicesSchema, servicesBreadcrumbSchema] : servicesSchema}
            />
            <div className="container mx-auto max-w-7xl px-4 pb-20 pt-10">
                <section className="mb-10">
                    <div className="mb-8 flex items-center justify-between px-2">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{pilot.fullName}</p>
                            <h1 className="text-2xl font-bold text-slate-50 md:text-3xl">{copy.allServices}</h1>
                        </div>
                        <Link
                            to={profilePath}
                            className="group flex items-center gap-1 text-sm font-bold text-blue-500 transition-colors hover:text-blue-400"
                        >
                            {copy.backToProfile}
                            <ArrowRight size={16} className="rotate-180 transition-transform group-hover:-translate-x-1" />
                        </Link>
                    </div>

                    {listings.length === 0 ? (
                        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-12 text-center">
                            <p className="text-lg font-medium text-slate-300">{copy.noServices}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {listings.map((listing) => (
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
            </div>
        </div>
    );
}
