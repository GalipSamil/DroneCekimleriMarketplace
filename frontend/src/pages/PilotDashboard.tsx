import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, MapPin, Plus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/preferences';
import { bookingAPI, listingAPI } from '../services/api';
import type { Booking, BookingStatus, Listing } from '../types';
import {
    DashboardPagination,
    EmptyState,
    StatusBadge,
} from '../components/dashboard/DashboardComponents';
import { CreateListingModal } from '../components/dashboard/CreateListingModal';
import { formatTryCurrency, getLocaleForLanguage } from '../utils/serviceCategory';

type BookingFilterKey = 'today' | 'current';

const BOOKING_STATUS_PRIORITY: Record<number, number> = { 0: 0, 1: 1, 2: 2, 6: 3, 3: 4, 4: 5, 5: 6 };
const BOOKINGS_PER_PAGE = 2;
const LISTINGS_PER_PAGE = 2;
const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]';

const createDateFormatter = (locale: string) => new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

const formatSchedule = (startDate: string, endDate: string, locale: string) => {
    const formatter = createDateFormatter(locale);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const sameDay = start.toDateString() === end.toDateString();

    return sameDay
        ? `${formatter.format(start)} - ${end.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`
        : `${formatter.format(start)} - ${formatter.format(end)}`;
};

const formatDuration = (booking: Booking, labels: { dayUnit: string; hourUnit: string; projectBased: string }) => {
    if (booking.days > 0) return `${booking.days} ${labels.dayUnit}`;
    if (booking.hours > 0) return `${booking.hours} ${labels.hourUnit}`;
    return labels.projectBased;
};

const isSameLocalDate = (value: string, compareDate = new Date()) => {
    const date = new Date(value);
    return date.getFullYear() === compareDate.getFullYear()
        && date.getMonth() === compareDate.getMonth()
        && date.getDate() === compareDate.getDate();
};

const matchesBookingFilter = (filterKey: BookingFilterKey, booking: Booking) => {
    if (filterKey === 'today') return isSameLocalDate(booking.startDate) && ![4, 5].includes(booking.status);
    return [0, 1, 2, 6].includes(booking.status);
};

const getBookingActionNote = (
    booking: Booking | undefined,
    labels: {
        noPriorityAction: string;
        requestWaiting: string;
        readyToStart: string;
        shootInProgress: string;
        deliveryWaiting: string;
        bookingUpToDate: string;
    }
) => {
    if (!booking) return labels.noPriorityAction;
    if (booking.status === 0) return labels.requestWaiting;
    if (booking.status === 1) return labels.readyToStart;
    if (booking.status === 2) return labels.shootInProgress;
    if (booking.status === 6) return labels.deliveryWaiting;
    return labels.bookingUpToDate;
};

export default function PilotDashboard() {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const { language } = usePreferences();
    const locale = getLocaleForLanguage(language);
    const isTurkish = language === 'tr';

    const copy = isTurkish
        ? {
            today: 'Bugün',
            active: 'Aktif',
            dayUnit: 'gün',
            hourUnit: 'saat',
            projectBased: 'Proje bazlı',
            noPriorityAction: 'Bugün öne çıkan bir aksiyon görünmüyor.',
            requestWaiting: 'Bu talep pilot yanıtı bekliyor.',
            readyToStart: 'Plan net. Çekim başlatılabilir.',
            shootInProgress: 'Çekim sürüyor. Teslim hazırlığı yapılabilir.',
            deliveryWaiting: 'Teslim gönderildi. Müşteri kararı bekleniyor.',
            bookingUpToDate: 'Rezervasyon güncel durumda.',
            bookingsLoadError: 'Rezervasyonlar yüklenemedi. Sayfayı yenileyip tekrar deneyin.',
            listingsLoadError: 'Hizmetler yüklenemedi.',
            listingStatusError: 'Hizmet durumu güncellenemedi.',
            rejectPrompt: 'Reddetme sebebi:',
            statusUpdateError: 'Rezervasyon durumu güncellenirken bir hata oluştu.',
            deliveryPrompt: 'Teslim notu (isteğe bağlı):',
            deliveryError: 'Teslimat gönderilirken bir hata oluştu.',
            heroTitle: 'Bugün',
            heroEmpty: 'Rezervasyon yok.',
            createService: 'Yeni hizmet',
            bookingsTitle: 'Rezervasyonlar',
            records: 'rezervasyon',
            noTodayTaskTitle: 'Bugün için rezervasyon yok',
            noTodayTaskDescription: '',
            noActiveTaskTitle: 'Aktif rezervasyon yok',
            noActiveTaskDescription: '',
            bookingItemLabel: 'rezervasyon',
            nextAction: 'Sıradaki rezervasyon',
            calmDay: 'Özet',
            noUrgentTask: 'Yaklaşan rezervasyon yok',
            noActiveTaskHelper: '',
            locationPending: 'Konum bekleniyor',
            todayCountLabel: 'Bugün',
            pendingApproval: 'Bekleyen',
            openNewService: 'Yeni hizmet',
            services: 'Hizmetler',
            total: 'toplam',
            noServices: 'Kayıtlı hizmet yok.',
            noLocationInfo: 'Konum bilgisi bekleniyor',
            acceptRequest: 'Talebi kabul et',
            reject: 'Reddet',
            startJob: 'İşi başlat',
            sendDelivery: 'Teslim gönder',
            serviceDetail: 'Hizmet detayı',
            activeServices: 'Aktif',
            passiveServices: 'Pasif',
            noActiveServices: 'Aktif hizmet yok.',
            noPassiveServices: 'Pasif hizmet yok.',
            setPassive: 'Pasif yap',
            setActive: 'Aktif yap',
            activeListingItemLabel: 'aktif ilan',
            passiveListingItemLabel: 'pasif ilan',
        }
        : {
            today: 'Today',
            active: 'Active',
            dayUnit: 'days',
            hourUnit: 'hours',
            projectBased: 'Project-based',
            noPriorityAction: 'There is no priority action for today.',
            requestWaiting: 'This request is waiting for the pilot response.',
            readyToStart: 'The plan is clear. The shoot can start.',
            shootInProgress: 'The shoot is in progress. Delivery can be prepared.',
            deliveryWaiting: 'Delivery was sent. Waiting for the customer response.',
            bookingUpToDate: 'The booking is currently up to date.',
            bookingsLoadError: 'Bookings could not be loaded. Refresh the page and try again.',
            listingsLoadError: 'Services could not be loaded.',
            listingStatusError: 'Service status could not be updated.',
            rejectPrompt: 'Reason for rejection:',
            statusUpdateError: 'An error occurred while updating the booking status.',
            deliveryPrompt: 'Delivery note (optional):',
            deliveryError: 'An error occurred while sending the delivery.',
            heroTitle: 'Today',
            heroEmpty: 'No bookings.',
            createService: 'New service',
            bookingsTitle: 'Bookings',
            records: 'bookings',
            noTodayTaskTitle: 'No booking for today',
            noTodayTaskDescription: '',
            noActiveTaskTitle: 'No active booking',
            noActiveTaskDescription: '',
            bookingItemLabel: 'booking',
            nextAction: 'Next booking',
            calmDay: 'Overview',
            noUrgentTask: 'No upcoming booking',
            noActiveTaskHelper: '',
            locationPending: 'Location pending',
            todayCountLabel: 'Today',
            pendingApproval: 'Pending',
            openNewService: 'New service',
            services: 'Services',
            total: 'total',
            noServices: 'No services yet.',
            noLocationInfo: 'Location details pending',
            acceptRequest: 'Accept request',
            reject: 'Reject',
            startJob: 'Start job',
            sendDelivery: 'Send delivery',
            serviceDetail: 'Service details',
            activeServices: 'Active',
            passiveServices: 'Inactive',
            noActiveServices: 'No active services.',
            noPassiveServices: 'No inactive services.',
            setPassive: 'Set inactive',
            setActive: 'Set active',
            activeListingItemLabel: 'active listing',
            passiveListingItemLabel: 'inactive listing',
        };

    const bookingFilters = [
        { key: 'today' as const, label: copy.today, empty: [copy.noTodayTaskTitle, copy.noTodayTaskDescription] },
        { key: 'current' as const, label: copy.active, empty: [copy.noActiveTaskTitle, copy.noActiveTaskDescription] },
    ];

    const [listings, setListings] = useState<Listing[]>([]);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [listingError, setListingError] = useState('');
    const [updatingListingId, setUpdatingListingId] = useState<string | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [bookingError, setBookingError] = useState('');
    const [bookingFilter, setBookingFilter] = useState<BookingFilterKey>('today');
    const [bookingPage, setBookingPage] = useState(1);
    const [activeListingPage, setActiveListingPage] = useState(1);
    const [passiveListingPage, setPassiveListingPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasAutoSelectedBookingFilter, setHasAutoSelectedBookingFilter] = useState(false);

    const loadBookings = useCallback(async () => {
        try {
            setBookingsLoading(true);
            setBookingError('');
            setBookings(await bookingAPI.getPilotBookings(userId!));
        } catch (err) {
            console.error('Error loading bookings:', err);
            setBookingError(copy.bookingsLoadError);
        } finally {
            setBookingsLoading(false);
        }
    }, [copy.bookingsLoadError, userId]);

    const loadListings = useCallback(async () => {
        try {
            setListingsLoading(true);
            setListingError('');
            setListings(await listingAPI.getMine());
        } catch (err) {
            console.error('Error loading listings:', err);
            setListingError(copy.listingsLoadError);
        } finally {
            setListingsLoading(false);
        }
    }, [copy.listingsLoadError]);

    const handleToggleListingStatus = useCallback(async (listing: Listing) => {
        try {
            setUpdatingListingId(listing.id);
            setListingError('');

            await listingAPI.update(listing.id, {
                title: listing.title,
                description: listing.description,
                hourlyRate: listing.hourlyRate,
                dailyRate: listing.dailyRate,
                projectRate: listing.projectRate,
                coverImageUrl: listing.coverImageUrl || '',
                category: listing.category,
                isActive: !listing.isActive,
                maxDistance: listing.maxDistance,
                requiredEquipment: listing.requiredEquipment || '',
                deliverableFormat: listing.deliverableFormat || '',
            });

            setListings((current) => current.map((item) => (
                item.id === listing.id
                    ? { ...item, isActive: !item.isActive }
                    : item
            )));
        } catch (err) {
            console.error('Error updating listing status:', err);
            setListingError(copy.listingStatusError);
        } finally {
            setUpdatingListingId(null);
        }
    }, [copy.listingStatusError]);

    useEffect(() => {
        if (!userId) return;

        loadBookings();
        loadListings();
    }, [userId, loadBookings, loadListings]);

    const handleUpdateBookingStatus = useCallback(async (bookingId: string, newStatus: BookingStatus, notes?: string) => {
        let nextNotes = notes;
        if (newStatus === 5 && !nextNotes) {
            const reason = window.prompt(copy.rejectPrompt);
            if (!reason) return;
            nextNotes = reason;
        }

        try {
            await bookingAPI.updateStatus(bookingId, newStatus, nextNotes);
            loadBookings();
        } catch {
            alert(copy.statusUpdateError);
        }
    }, [copy.rejectPrompt, copy.statusUpdateError, loadBookings]);

    const handleDeliverBooking = useCallback(async (bookingId: string) => {
        const notes = window.prompt(copy.deliveryPrompt) || undefined;
        try {
            await bookingAPI.updateStatus(bookingId, 6 as BookingStatus, notes);
            loadBookings();
        } catch {
            alert(copy.deliveryError);
        }
    }, [copy.deliveryError, copy.deliveryPrompt, loadBookings]);

    const todayCount = bookings.filter((booking) => matchesBookingFilter('today', booking)).length;
    const pendingCount = bookings.filter((booking) => booking.status === 0).length;
    const activeListings = listings.filter((listing) => listing.isActive);
    const passiveListings = listings.filter((listing) => !listing.isActive);
    const totalActiveListingPages = Math.max(1, Math.ceil(activeListings.length / LISTINGS_PER_PAGE));
    const totalPassiveListingPages = Math.max(1, Math.ceil(passiveListings.length / LISTINGS_PER_PAGE));
    const paginatedActiveListings = activeListings.slice((activeListingPage - 1) * LISTINGS_PER_PAGE, activeListingPage * LISTINGS_PER_PAGE);
    const paginatedPassiveListings = passiveListings.slice((passiveListingPage - 1) * LISTINGS_PER_PAGE, passiveListingPage * LISTINGS_PER_PAGE);

    const bookingFilterOptions = bookingFilters.map((filter) => ({
        ...filter,
        count: bookings.filter((booking) => matchesBookingFilter(filter.key, booking)).length,
    }));
    const selectedBookingFilter = bookingFilterOptions.find((filter) => filter.key === bookingFilter) ?? bookingFilterOptions[0];

    const filteredBookings = [...bookings]
        .filter((booking) => matchesBookingFilter(bookingFilter, booking))
        .sort((a, b) => {
            const timeA = new Date(a.startDate).getTime();
            const timeB = new Date(b.startDate).getTime();

            const priorityDiff = (BOOKING_STATUS_PRIORITY[a.status] ?? 99) - (BOOKING_STATUS_PRIORITY[b.status] ?? 99);
            return priorityDiff !== 0 ? priorityDiff : timeA - timeB;
        });

    const nextTask = [...bookings]
        .filter((booking) => [0, 1, 2, 6].includes(booking.status))
        .sort((a, b) => {
            const priorityDiff = (BOOKING_STATUS_PRIORITY[a.status] ?? 99) - (BOOKING_STATUS_PRIORITY[b.status] ?? 99);
            return priorityDiff !== 0 ? priorityDiff : new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        })[0];

    const totalBookingPages = Math.max(1, Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE));
    const paginatedBookings = filteredBookings.slice((bookingPage - 1) * BOOKINGS_PER_PAGE, bookingPage * BOOKINGS_PER_PAGE);

    useEffect(() => { setBookingPage(1); }, [bookingFilter]);
    useEffect(() => { if (bookingPage > totalBookingPages) setBookingPage(totalBookingPages); }, [bookingPage, totalBookingPages]);
    useEffect(() => { if (activeListingPage > totalActiveListingPages) setActiveListingPage(totalActiveListingPages); }, [activeListingPage, totalActiveListingPages]);
    useEffect(() => { if (passiveListingPage > totalPassiveListingPages) setPassiveListingPage(totalPassiveListingPages); }, [passiveListingPage, totalPassiveListingPages]);
    useEffect(() => {
        if (hasAutoSelectedBookingFilter || bookings.length === 0 || todayCount > 0) return;

        setBookingFilter('current');
        setHasAutoSelectedBookingFilter(true);
    }, [hasAutoSelectedBookingFilter, bookings.length, todayCount]);

    if (bookingsLoading && bookings.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050816]">
                <div className="h-11 w-11 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-400" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#050816] pt-20 pb-12 text-slate-100">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.08),_transparent_28%)]" />
            <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-5 px-4 sm:px-6 lg:px-8">
                <section className="rounded-[30px] border border-white/[0.08] bg-slate-950/84 px-5 py-4 shadow-[0_30px_80px_-52px_rgba(15,23,42,1)] sm:px-6 sm:py-5 lg:px-7">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                        <div className="min-w-0">
                            <h1 className="text-[28px] font-semibold tracking-tight text-white sm:text-[32px]">{copy.heroTitle}</h1>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                                {nextTask
                                    ? getBookingActionNote(nextTask, copy)
                                    : copy.heroEmpty}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className={`inline-flex h-11 items-center gap-2 self-start rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_20px_45px_-28px_rgba(59,130,246,0.9)] transition-colors hover:bg-blue-500 ${FOCUS_RING}`}
                        >
                            <Plus size={15} />
                            {copy.createService}
                        </button>
                    </div>
                </section>

                {bookingError && (
                    <section className="rounded-[24px] border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
                        {bookingError}
                    </section>
                )}

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1.72fr)_360px]">
                    <div className="rounded-[30px] border border-white/[0.08] bg-slate-950/80 px-5 py-5 shadow-[0_28px_72px_-50px_rgba(15,23,42,1)] sm:px-6 lg:px-7">
                        <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                <div className="max-w-2xl min-w-0">
                                    <h2 className="text-[1.55rem] font-semibold tracking-tight text-white">{copy.bookingsTitle}</h2>
                                </div>
                                <p className="text-sm text-slate-400">{filteredBookings.length} {copy.records}</p>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {bookingFilterOptions.map((filter) => (
                                    <button
                                        key={filter.key}
                                        type="button"
                                        onClick={() => setBookingFilter(filter.key)}
                                        className={`inline-flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-medium transition-all ${bookingFilter === filter.key ? 'border-blue-400/30 bg-blue-500/12 text-white' : 'border-white/[0.08] bg-slate-900/78 text-slate-300 hover:border-white/15 hover:text-white'} ${FOCUS_RING}`}
                                    >
                                        <span>{filter.label}</span>
                                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs font-semibold text-slate-200">{filter.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5">
                            {bookingsLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 2 }).map((_, index) => (
                                        <div key={index} className="animate-pulse rounded-[26px] border border-white/[0.08] bg-slate-900/82 p-5">
                                            <div className="h-5 w-40 rounded bg-slate-800/80" />
                                            <div className="mt-4 h-4 w-56 rounded bg-slate-800/70" />
                                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                                <div className="h-4 rounded bg-slate-800/70" />
                                                <div className="h-4 rounded bg-slate-800/70" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredBookings.length === 0 ? (
                                <EmptyState
                                    icon={<Calendar size={28} className="text-slate-500" />}
                                    title={selectedBookingFilter.empty[0]}
                                    description={selectedBookingFilter.empty[1]}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {paginatedBookings.map((booking) => (
                                        <article key={booking.id} className="rounded-[26px] border border-white/[0.08] bg-slate-900/82 p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.95)] hover:border-white/15 sm:p-5">
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <StatusBadge status={booking.status} />
                                                </div>
                                                <div className="text-sm font-semibold text-white">{formatTryCurrency(booking.totalPrice, language)}</div>
                                            </div>

                                            <div className="mt-4">
                                                <h3 className="text-[1.35rem] font-semibold tracking-tight text-white break-words">{booking.title}</h3>
                                                <p className="mt-1 text-sm text-slate-500">{formatDuration(booking, copy)}</p>
                                            </div>

                                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                <div className="flex items-start gap-2 text-sm text-slate-300">
                                                    <User size={15} className="mt-0.5 shrink-0 text-slate-500" />
                                                    <span>{booking.customerName}</span>
                                                </div>
                                                <div className="flex items-start gap-2 text-sm text-slate-300">
                                                    <Calendar size={15} className="mt-0.5 shrink-0 text-slate-500" />
                                                    <span>{formatSchedule(booking.startDate, booking.endDate, locale)}</span>
                                                </div>
                                                <div className="flex items-start gap-2 text-sm text-slate-300 sm:col-span-2">
                                                    <MapPin size={15} className="mt-0.5 shrink-0 text-slate-500" />
                                                    <span>{booking.location || copy.noLocationInfo}</span>
                                                </div>
                                            </div>

                                            {booking.customerNotes && (
                                                <p className="mt-4 border-t border-white/[0.07] pt-3 text-sm leading-6 text-slate-300">
                                                    {booking.customerNotes}
                                                </p>
                                            )}

                                            <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm text-slate-400">{getBookingActionNote(booking, copy)}</p>
                                                <div className="flex flex-col gap-2 sm:min-w-[220px]">
                                                    {booking.status === 0 && (
                                                        <>
                                                            <button type="button" onClick={() => handleUpdateBookingStatus(booking.id, 1 as BookingStatus)} className={`w-full rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 ${FOCUS_RING}`}>{copy.acceptRequest}</button>
                                                            <button type="button" onClick={() => handleUpdateBookingStatus(booking.id, 5 as BookingStatus)} className={`w-full rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-500/15 ${FOCUS_RING}`}>{copy.reject}</button>
                                                        </>
                                                    )}
                                                    {booking.status === 1 && (
                                                        <button type="button" onClick={() => handleUpdateBookingStatus(booking.id, 2 as BookingStatus)} className={`w-full rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 ${FOCUS_RING}`}>{copy.startJob}</button>
                                                    )}
                                                    {booking.status === 2 && (
                                                        <button type="button" onClick={() => handleDeliverBooking(booking.id)} className={`w-full rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 ${FOCUS_RING}`}>{copy.sendDelivery}</button>
                                                    )}
                                                    {(booking.status === 6 || booking.status === 3 || booking.status === 4 || booking.status === 5) && (
                                                        <button type="button" onClick={() => navigate(`/service/${booking.listingId}`)} className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-slate-900/92 px-4 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-blue-400/30 ${FOCUS_RING}`}>{copy.serviceDetail}<ChevronRight size={16} /></button>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    ))}

                                    <DashboardPagination
                                        page={bookingPage}
                                        totalPages={totalBookingPages}
                                        totalItems={filteredBookings.length}
                                        pageSize={BOOKINGS_PER_PAGE}
                                        onPageChange={setBookingPage}
                                        itemLabel={copy.bookingItemLabel}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="self-start xl:sticky xl:top-24">
                        <section className="rounded-[26px] border border-white/[0.07] bg-slate-950/58 p-5 shadow-[0_22px_55px_-48px_rgba(15,23,42,1)]">
                            <h2 className="text-lg font-semibold text-white">{nextTask ? copy.nextAction : copy.calmDay}</h2>

                            <div className="mt-4 rounded-[22px] border border-white/[0.07] bg-white/[0.03] px-4 py-4">
                                <p className="text-base font-semibold text-white">{nextTask ? nextTask.title : copy.noUrgentTask}</p>
                                {nextTask && <p className="mt-2 text-sm leading-6 text-slate-300">{formatSchedule(nextTask.startDate, nextTask.endDate, locale)}</p>}
                                {nextTask && <p className="mt-1 text-sm text-slate-400">{nextTask.customerName} • {nextTask.location || copy.locationPending}</p>}
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-[20px] border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                                    <p className="text-slate-400">{copy.todayCountLabel}</p>
                                    <p className="mt-1 text-xl font-semibold text-white">{todayCount}</p>
                                </div>
                                <div className="rounded-[20px] border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                                    <p className="text-slate-400">{copy.pendingApproval}</p>
                                    <p className="mt-1 text-xl font-semibold text-white">{pendingCount}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className={`mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-slate-900/88 px-4 text-sm font-semibold text-slate-100 transition-colors hover:border-blue-400/30 hover:text-white ${FOCUS_RING}`}
                            >
                                <Plus size={15} />
                                {copy.openNewService}
                            </button>

                            <div className="mt-5 border-t border-white/[0.07] pt-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-sm font-semibold text-white">{copy.services}</h3>
                                    <span className="text-xs text-slate-500">{listings.length} {copy.total}</span>
                                </div>

                                <div className="mt-3 space-y-2.5">
                                    {listingsLoading ? (
                                        <>
                                            <div className="h-10 animate-pulse rounded-2xl bg-white/[0.04]" />
                                            <div className="h-10 animate-pulse rounded-2xl bg-white/[0.04]" />
                                        </>
                                    ) : listingError ? (
                                        <p className="text-sm text-rose-200">{listingError}</p>
                                    ) : listings.length === 0 ? (
                                        <p className="text-sm text-slate-400">{copy.noServices}</p>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <div className="mb-2 flex items-center justify-between gap-3">
                                                    <span className="text-sm font-medium text-white">{copy.activeServices}</span>
                                                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
                                                        {activeListings.length}
                                                    </span>
                                                </div>

                                                <div className="space-y-2.5">
                                                    {paginatedActiveListings.length === 0 ? (
                                                        <p className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-slate-400">{copy.noActiveServices}</p>
                                                    ) : (
                                                        paginatedActiveListings.map((listing) => (
                                                            <div key={listing.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => navigate(`/service/${listing.id}`)}
                                                                    className={`min-w-0 flex-1 text-left ${FOCUS_RING}`}
                                                                >
                                                                    <p className="truncate text-sm font-medium text-slate-100 transition-colors hover:text-white">{listing.title}</p>
                                                                </button>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="shrink-0 rounded-full bg-emerald-500/12 px-2 py-1 text-[11px] font-semibold text-emerald-200">
                                                                        {copy.activeServices}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleToggleListingStatus(listing)}
                                                                        disabled={updatingListingId === listing.id}
                                                                        className={`shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-slate-200 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
                                                                    >
                                                                        {updatingListingId === listing.id ? '...' : copy.setPassive}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                <div className="mt-2">
                                                    <DashboardPagination
                                                        page={activeListingPage}
                                                        totalPages={totalActiveListingPages}
                                                        totalItems={activeListings.length}
                                                        pageSize={LISTINGS_PER_PAGE}
                                                        onPageChange={setActiveListingPage}
                                                        itemLabel={copy.activeListingItemLabel}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="mb-2 flex items-center justify-between gap-3">
                                                    <span className="text-sm font-medium text-white">{copy.passiveServices}</span>
                                                    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300">
                                                        {passiveListings.length}
                                                    </span>
                                                </div>

                                                <div className="space-y-2.5">
                                                    {paginatedPassiveListings.length === 0 ? (
                                                        <p className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-slate-400">{copy.noPassiveServices}</p>
                                                    ) : (
                                                        paginatedPassiveListings.map((listing) => (
                                                            <div key={listing.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => navigate(`/service/${listing.id}`)}
                                                                    className={`min-w-0 flex-1 text-left ${FOCUS_RING}`}
                                                                >
                                                                    <p className="truncate text-sm font-medium text-slate-100 transition-colors hover:text-white">{listing.title}</p>
                                                                </button>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-1 text-[11px] font-semibold text-slate-300">
                                                                        {copy.passiveServices}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleToggleListingStatus(listing)}
                                                                        disabled={updatingListingId === listing.id}
                                                                        className={`shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-slate-200 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
                                                                    >
                                                                        {updatingListingId === listing.id ? '...' : copy.setActive}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                <div className="mt-2">
                                                    <DashboardPagination
                                                        page={passiveListingPage}
                                                        totalPages={totalPassiveListingPages}
                                                        totalItems={passiveListings.length}
                                                        pageSize={LISTINGS_PER_PAGE}
                                                        onPageChange={setPassiveListingPage}
                                                        itemLabel={copy.passiveListingItemLabel}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </aside>
                </section>
            </div>

            <CreateListingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    loadListings();
                }}
            />
        </div>
    );
}
