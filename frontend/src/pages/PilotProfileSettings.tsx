import { type FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Compass, Eye, Save, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/preferences';
import { buildPilotProfilePath } from '../utils/seoPaths';
import { extractApiErrorMessage, pilotAPI } from '../services/api';
import type { PilotProfile, UpdatePilotProfileDto } from '../types';
import { findTurkishCityByCoordinates, getTurkishCityCoordinates, getTurkishCityOptions } from '../utils/turkishCities';

type ProfileFormState = {
    bio: string;
    equipmentList: string;
    shgmLicenseNumber: string;
    profileImageUrl: string;
    city: string;
};

const createEmptyForm = (): ProfileFormState => ({
    bio: '',
    equipmentList: '',
    shgmLicenseNumber: '',
    profileImageUrl: '',
    city: '',
});

const mapProfileToForm = (profile: PilotProfile | null): ProfileFormState => ({
    bio: profile?.bio ?? '',
    equipmentList: profile?.equipmentList ?? '',
    shgmLicenseNumber: profile?.shgmLicenseNumber ?? '',
    profileImageUrl: profile?.profileImageUrl ?? '',
    city: findTurkishCityByCoordinates(profile?.latitude, profile?.longitude)?.value ?? '',
});

export default function PilotProfileSettings() {
    const { userId } = useAuth();
    const { language, theme } = usePreferences();
    const isLight = theme === 'light';
    const [profile, setProfile] = useState<PilotProfile | null>(null);
    const [form, setForm] = useState<ProfileFormState>(createEmptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const copy = language === 'tr'
        ? {
            badge: 'Pilot profili',
            title: 'Herkese açık profilini yönet',
            subtitle: 'Müşterilerin göreceği biyografi, ekipman ve konum bilgilerini burada düzenleyebilirsin.',
            fallbackName: 'Pilot hesabı',
            saveError: 'Pilot profili kaydedilemedi.',
            loadError: 'Pilot profili yüklenemedi.',
            emptyProfile: 'Henüz oluşturulmuş bir pilot profilin yok. Bilgilerini kaydettikten sonra herkese açık profilin oluşur.',
            profileSaved: 'Pilot profili güncellendi.',
            verified: 'Doğrulanmış pilot',
            unverified: 'İnceleme bekliyor',
            rejected: 'İnceleme reddedildi',
            rejectionReason: 'Reddetme notu',
            preview: 'Public profili gör',
            dashboard: 'Panele dön',
            save: 'Profili kaydet',
            saving: 'Kaydediliyor...',
            personalInfo: 'Profil özeti',
            fullName: 'Ad Soyad',
            profileStatus: 'Durum',
            bio: 'Biyografi',
            bioPlaceholder: 'Deneyimini, uzmanlık alanlarını ve müşteriye sunduğun değeri anlat.',
            equipment: 'Ekipman listesi',
            equipmentPlaceholder: 'Örn: DJI Mavic 3 Pro, DJI Mini 4 Pro, Sony A7S III',
            license: 'SHGM lisans numarası',
            profileImage: 'Profil fotoğrafı URL',
            profileImagePlaceholder: 'https://ornek.com/pilot-fotografi.png',
            location: 'Sehir',
            city: 'Bulundugun sehir',
            selectCity: 'Sehir sec',
            locationHint: 'Profilinde gorunmesini istedigin sehri sec. Paylasmak istemiyorsan bos birakabilirsin.',
            noCitySelected: 'Sehir secilmedi',
        }
        : {
            badge: 'Pilot profile',
            title: 'Manage your public profile',
            subtitle: 'Edit the bio, equipment, and location details that customers will see.',
            fallbackName: 'Pilot account',
            saveError: 'The pilot profile could not be saved.',
            loadError: 'The pilot profile could not be loaded.',
            emptyProfile: 'You do not have a public pilot profile yet. Save your details to create it.',
            profileSaved: 'Pilot profile updated.',
            verified: 'Verified pilot',
            unverified: 'Pending review',
            rejected: 'Review rejected',
            rejectionReason: 'Rejection note',
            preview: 'View public profile',
            dashboard: 'Back to dashboard',
            save: 'Save profile',
            saving: 'Saving...',
            personalInfo: 'Profile summary',
            fullName: 'Full name',
            profileStatus: 'Status',
            bio: 'Bio',
            bioPlaceholder: 'Describe your experience, specialties, and the value you bring to clients.',
            equipment: 'Equipment list',
            equipmentPlaceholder: 'Example: DJI Mavic 3 Pro, DJI Mini 4 Pro, Sony A7S III',
            license: 'SHGM license number',
            profileImage: 'Profile photo URL',
            profileImagePlaceholder: 'https://example.com/pilot-photo.png',
            location: 'City',
            city: 'Your city',
            selectCity: 'Select a city',
            locationHint: 'Choose the city you want to show on your profile. Leave it empty if you prefer not to share it.',
            noCitySelected: 'No city selected',
        };

    const cityOptions = getTurkishCityOptions(language);
    const selectedCityLabel = cityOptions.find((city) => city.value === form.city)?.label ?? copy.noCitySelected;
    const rejectionReason = profile?.verificationRejectionReason?.trim();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await pilotAPI.getMyProfile();
                setProfile(data);
                setForm(mapProfileToForm(data));
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setProfile(null);
                    setForm(createEmptyForm());
                } else {
                    console.error('Error loading pilot profile:', err);
                    setError(extractApiErrorMessage(err, copy.loadError));
                }
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [copy.loadError]);

    const handleChange = (field: keyof ProfileFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!userId) {
            return;
        }

        const cityCoordinates = getTurkishCityCoordinates(form.city);
        const payload: UpdatePilotProfileDto = {
            bio: form.bio.trim() || undefined,
            equipmentList: form.equipmentList.trim() || undefined,
            shgmLicenseNumber: form.shgmLicenseNumber.trim() || undefined,
            profileImageUrl: form.profileImageUrl.trim() || undefined,
            latitude: cityCoordinates?.latitude ?? 0,
            longitude: cityCoordinates?.longitude ?? 0,
        };

        try {
            setSaving(true);
            setError('');
            setSuccess('');
            const savedProfile = await pilotAPI.createOrUpdateProfile(userId, payload);
            setProfile(savedProfile);
            setForm(mapProfileToForm(savedProfile));
            setSuccess(copy.profileSaved);
        } catch (err) {
            console.error('Error saving pilot profile:', err);
            setError(extractApiErrorMessage(err, copy.saveError));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={`flex min-h-screen items-center justify-center ${isLight ? 'bg-slate-50' : 'bg-[#050816]'}`}>
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
            </div>
        );
    }

    return (
        <div className={`relative min-h-screen overflow-x-hidden pt-20 pb-12 ${isLight ? 'bg-slate-50 text-slate-950' : 'bg-[#050816] text-slate-100'}`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.08),_transparent_28%)]" />
            <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col gap-5 px-4 sm:px-6 lg:px-8">
                <section className="rounded-[30px] border border-white/[0.08] bg-slate-950/84 px-5 py-5 shadow-[0_30px_80px_-52px_rgba(15,23,42,1)] sm:px-6 lg:px-7">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-100">
                                <UserRound size={14} />
                                {copy.badge}
                            </div>
                            <h1 className="mt-3 text-[28px] font-semibold tracking-tight text-white sm:text-[32px]">{copy.title}</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{copy.subtitle}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {profile?.userId && (
                                <Link to={buildPilotProfilePath({ userId: profile.userId, fullName: profile.fullName })} className="btn-secondary">
                                    <Eye size={16} />
                                    {copy.preview}
                                </Link>
                            )}
                            <Link to="/pilot/dashboard" className="btn-secondary">
                                {copy.dashboard}
                            </Link>
                        </div>
                    </div>
                </section>

                {error && (
                    <section className="rounded-[24px] border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
                        {error}
                    </section>
                )}

                {success && (
                    <section className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
                        {success}
                    </section>
                )}

                <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
                    <aside className="rounded-[28px] border border-white/[0.08] bg-slate-950/80 p-5 shadow-[0_28px_72px_-50px_rgba(15,23,42,1)]">
                        <h2 className="text-lg font-semibold text-white">{copy.personalInfo}</h2>
                        <div className="mt-5 space-y-4">
                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.fullName}</p>
                                <p className="mt-2 text-base font-semibold text-white">{profile?.fullName || copy.fallbackName}</p>
                            </div>
                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.profileStatus}</p>
                                <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${profile?.isVerified ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : rejectionReason ? 'border-rose-500/20 bg-rose-500/10 text-rose-100' : 'border-amber-500/20 bg-amber-500/10 text-amber-100'}`}>
                                    <ShieldCheck size={15} />
                                    {profile?.isVerified ? copy.verified : rejectionReason ? copy.rejected : copy.unverified}
                                </div>
                                {rejectionReason && (
                                    <p className="mt-3 text-sm leading-6 text-rose-200">
                                        <span className="font-semibold">{copy.rejectionReason}:</span> {rejectionReason}
                                    </p>
                                )}
                            </div>
                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.location}</p>
                                <div className="mt-3 flex items-start gap-3 text-sm text-slate-300">
                                    <Compass size={17} className="mt-0.5 shrink-0 text-blue-400" />
                                    <div>
                                        <p className="font-semibold text-white">{selectedCityLabel}</p>
                                        <p className="mt-1">{copy.locationHint}</p>
                                    </div>
                                </div>
                            </div>
                            {!profile && (
                                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm leading-6 text-blue-100">
                                    {copy.emptyProfile}
                                </div>
                            )}
                        </div>
                    </aside>

                    <section className="rounded-[28px] border border-white/[0.08] bg-slate-950/80 p-5 shadow-[0_28px_72px_-50px_rgba(15,23,42,1)] sm:p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-300">{copy.bio}</label>
                                <textarea
                                    className="input-field min-h-[180px] resize-y"
                                    placeholder={copy.bioPlaceholder}
                                    value={form.bio}
                                    onChange={(event) => handleChange('bio', event.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-300">{copy.equipment}</label>
                                <textarea
                                    className="input-field min-h-[130px] resize-y"
                                    placeholder={copy.equipmentPlaceholder}
                                    value={form.equipmentList}
                                    onChange={(event) => handleChange('equipmentList', event.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-300">{copy.city}</label>
                                <select
                                    className="input-field cursor-pointer appearance-none"
                                    value={form.city}
                                    onChange={(event) => handleChange('city', event.target.value)}
                                >
                                    <option value="">{copy.selectCity}</option>
                                    {cityOptions.map((city) => (
                                        <option key={city.value} value={city.value}>
                                            {city.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-300">{copy.license}</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={form.shgmLicenseNumber}
                                        onChange={(event) => handleChange('shgmLicenseNumber', event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-300">{copy.profileImage}</label>
                                    <input
                                        type="url"
                                        className="input-field"
                                        placeholder={copy.profileImagePlaceholder}
                                        value={form.profileImageUrl}
                                        onChange={(event) => handleChange('profileImageUrl', event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button type="submit" className="btn-primary min-w-[190px]" disabled={saving}>
                                    <Save size={16} />
                                    {saving ? copy.saving : copy.save}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
