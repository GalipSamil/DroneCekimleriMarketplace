import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, ChevronRight, Clock, CreditCard, LayoutDashboard, MapPin, Search, Star, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/preferences';
import { bookingAPI, extractApiErrorMessage, reviewAPI } from '../services/api';
import type { Booking, BookingStatus } from '../types';
import {
    DashboardPagination,
    DashboardSummaryCard,
    EmptyState,
    StatusBadge,
} from '../components/dashboard/DashboardComponents';

type FilterKey = 'pipeline' | 'delivery' | 'history';

const PRIORITY: Record<number, number> = { 6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };
const BOOKINGS_PER_PAGE = 2;
const PLACEHOLDER_PATTERN = /(asd|qwe|zxc|test|deneme|ornek|örnek|lorem|ipsum|xxx|1234|demo)/i;
const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)]';

const normalizeText = (value?: string) => value?.trim() ?? '';

const isPlaceholderText = (value?: string) => {
    const normalized = normalizeText(value);
    return !normalized || PLACEHOLDER_PATTERN.test(normalized);
};

export default function CustomerDashboard() {
    const { userId } = useAuth();
    const { language } = usePreferences();
    const isTurkish = language === 'tr';
    const locale = isTurkish ? 'tr-TR' : 'en-US';

    const currencyFormatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
    });
    const dateFormatter = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatter = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' });

    const copy = {
        badge: isTurkish ? 'Müşteri paneli' : 'Customer workspace',
        title: isTurkish ? 'Rezervasyon durumunuz' : 'Your booking status',
        searchServices: isTurkish ? 'Hizmet Ara' : 'Search Services',
        bookings: isTurkish ? 'Rezervasyonlar' : 'Bookings',
        nextStep: isTurkish ? 'Durum ve sonraki adım' : 'Status and next step',
        pendingDecision: isTurkish ? 'Karar Bekliyor' : 'Awaiting Decision',
        reviewOpen: isTurkish ? 'Yorum Açık' : 'Review Open',
        booking: isTurkish ? 'Rezervasyon' : 'Booking',
        yourNote: isTurkish ? 'Notunuz' : 'Your note',
        pilotNote: isTurkish ? 'Pilot notu' : 'Pilot note',
        budget: isTurkish ? 'Bütçe' : 'Budget',
        approveDelivery: isTurkish ? 'Teslimatı Onayla' : 'Approve Delivery',
        requestRevision: isTurkish ? 'Revize İsteği' : 'Request Revision',
        revisionPrompt: isTurkish ? 'Revize nedeni:' : 'Revision reason:',
        ratePilot: isTurkish ? 'Pilotu Değerlendir' : 'Rate the Pilot',
        serviceDetail: isTurkish ? 'Hizmet Detayı' : 'Service Details',
        findSimilar: isTurkish ? 'Benzer Hizmet Bul' : 'Find Similar Services',
        overview: isTurkish ? 'Özet' : 'Overview',
        nextAction: isTurkish ? 'Sıradaki aksiyon' : 'Next action',
        activeProcess: isTurkish ? 'Aktif süreç' : 'Active flow',
        deliveryDecision: isTurkish ? 'Teslim kararı' : 'Delivery decision',
        totalSpend: isTurkish ? 'Toplam harcama' : 'Total spend',
        lastCompleted: isTurkish ? 'Son tamamlanan' : 'Last completed',
        summary: isTurkish ? 'Kısa özet' : 'Quick summary',
        rateService: isTurkish ? 'Hizmeti Değerlendir' : 'Rate the Service',
        reviewDescription: isTurkish ? 'Puanınız ve yorumunuz diğer müşterilerin kararını kolaylaştırır.' : 'Your rating and comment help other customers decide faster.',
        reviewPlaceholder: isTurkish ? 'Hizmetten memnun kaldınız mı? Pilotun iletişimi nasıldı?' : 'Were you satisfied with the service? How was the pilot’s communication?',
        cancel: isTurkish ? 'Vazgeç' : 'Cancel',
        sending: isTurkish ? 'Gönderiliyor...' : 'Sending...',
        send: isTurkish ? 'Gönder' : 'Send',
        statusUpdateError: isTurkish ? 'Durum güncellenirken bir hata oluştu' : 'An error occurred while updating the status',
        reviewError: isTurkish ? 'Değerlendirme gönderilemedi' : 'The review could not be submitted',
        placeholderTitle: isTurkish ? 'Profesyonel hava çekimi rezervasyonu' : 'Professional aerial shoot booking',
        placeholderPilot: isTurkish ? 'Atanan profesyonel pilot' : 'Assigned professional pilot',
        placeholderLocation: isTurkish ? 'İstanbul / Beşiktaş' : 'Istanbul / Besiktas',
        placeholderCustomerNote: isTurkish ? 'Çekimde geniş açı planların yanı sıra sosyal medya için dikey kesitler de istiyorum.' : 'I would like wide shots as well as vertical cuts for social media.',
        placeholderPilotNote: isTurkish ? 'Çekim öncesi son lokasyon ve hava durumu teyidi bir gün önce sizinle paylaşılacak.' : 'Final location and weather confirmation will be shared one day before the shoot.',
        itemLabel: isTurkish ? 'rezervasyon' : 'bookings',
    };

    const formatCurrency = (value: number) => currencyFormatter.format(value);
    const formatSchedule = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const sameDay = startDate.toDateString() === endDate.toDateString();

        return sameDay
            ? `${dateFormatter.format(startDate)} • ${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`
            : `${dateFormatter.format(startDate)} - ${dateFormatter.format(endDate)}`;
    };

    const formatDuration = (booking: Booking) => booking.days > 0
        ? `${booking.days} ${isTurkish ? 'gün' : 'days'}`
        : booking.hours > 0
            ? `${booking.hours} ${isTurkish ? 'saat' : 'hours'}`
            : (isTurkish ? 'Proje bazlı' : 'Project based');

    const formatBookingType = (booking: Booking) => booking.days > 0
        ? (isTurkish ? 'Günlük çekim' : 'Daily shoot')
        : booking.hours > 0
            ? (isTurkish ? 'Saatlik çekim' : 'Hourly shoot')
            : (isTurkish ? 'Proje bazlı hizmet' : 'Project-based service');

    const statusNote = (booking: Booking) => {
        switch (booking.status) {
            case 0: return isTurkish ? 'Pilot onayı bekleniyor.' : 'Waiting for pilot approval.';
            case 1: return isTurkish ? 'Rezervasyon planı netleşti.' : 'The booking plan is confirmed.';
            case 2: return isTurkish ? 'Pilot çekim hazırlığı ve üretim sürecinde.' : 'The pilot is preparing and producing the shoot.';
            case 6: return isTurkish ? 'Teslim dosyaları için onay veya revize kararı gerekiyor.' : 'A delivery approval or revision decision is required.';
            case 3: return booking.hasReview
                ? (isTurkish ? 'Değerlendirmeniz tamamlandı.' : 'Your review has been completed.')
                : (isTurkish ? 'Bu hizmet için yorum bırakabilirsiniz.' : 'You can leave a review for this service.');
            case 4: return isTurkish ? 'Rezervasyon iptal edildi.' : 'The booking has been cancelled.';
            default: return isTurkish ? 'Rezervasyon pilot tarafından reddedildi.' : 'The booking was rejected by the pilot.';
        }
    };

    const getBookingTitle = (booking: Booking) => isPlaceholderText(booking.title) ? copy.placeholderTitle : booking.title;
    const getBookingPilotName = (booking: Booking) => isPlaceholderText(booking.pilotName) ? copy.placeholderPilot : booking.pilotName;
    const getBookingLocation = (booking: Booking) => normalizeText(booking.location) || copy.placeholderLocation;
    const getCustomerNote = (booking: Booking) => {
        const note = normalizeText(booking.customerNotes);
        if (!note) return '';
        return isPlaceholderText(note) ? copy.placeholderCustomerNote : note;
    };
    const getPilotNote = (booking: Booking) => {
        const note = normalizeText(booking.pilotNotes);
        if (!note) return '';
        return isPlaceholderText(note) ? copy.placeholderPilotNote : note;
    };

    const filters = [
        {
            key: 'pipeline' as FilterKey,
            label: isTurkish ? 'Aktif' : 'Active',
            short: isTurkish ? 'Aktif' : 'Live',
            statuses: [0, 1, 2],
            active: 'border-blue-400/35 bg-blue-500/14 text-white shadow-[0_14px_34px_-24px_rgba(59,130,246,0.85)]',
            chip: 'border-blue-500/20 bg-blue-500/10 text-blue-100',
            empty: isTurkish
                ? ['Aktif süreç yok', 'Acil durum gerektiren bir rezervasyon olmadığında bu alan boş kalır.']
                : ['No active workflows', 'This area stays empty when no booking requires immediate attention.'],
        },
        {
            key: 'delivery' as FilterKey,
            label: isTurkish ? 'Aksiyon' : 'Action',
            short: isTurkish ? 'Aksiyon' : 'Action',
            statuses: [6],
            active: 'border-cyan-400/35 bg-cyan-500/14 text-white shadow-[0_14px_34px_-24px_rgba(34,211,238,0.8)]',
            chip: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-100',
            empty: isTurkish
                ? ['Bekleyen aksiyon yok', 'Teslim kararı gerektiren bir rezervasyon olduğunda burada listelenir.']
                : ['No pending action', 'Bookings that require a delivery decision appear here.'],
        },
        {
            key: 'history' as FilterKey,
            label: isTurkish ? 'Geçmiş' : 'History',
            short: isTurkish ? 'Geçmiş' : 'History',
            statuses: [3, 4, 5],
            active: 'border-slate-500/35 bg-slate-800/90 text-white shadow-[0_14px_34px_-24px_rgba(15,23,42,0.55)]',
            chip: 'border-slate-700/80 bg-slate-900/80 text-slate-100',
            empty: isTurkish
                ? ['Geçmiş kayıt yok', 'Tamamlanan ve kapanan rezervasyonlar burada görünür.']
                : ['No history yet', 'Completed and closed bookings appear here.'],
        },
    ];

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterKey>('pipeline');
    const [bookingPage, setBookingPage] = useState(1);
    const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; bookingId: string | null }>({ isOpen: false, bookingId: null });
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [reviewLoading, setReviewLoading] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const bookingsData = await bookingAPI.getCustomerBookings(userId!);
            setBookings(bookingsData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { if (userId) loadData(); }, [userId, loadData]);

    const updateStatus = async (bookingId: string, nextStatus: BookingStatus, notes?: string) => {
        try {
            await bookingAPI.updateStatus(bookingId, nextStatus, notes);
            loadData();
        } catch (error) {
            alert(extractApiErrorMessage(error, copy.statusUpdateError));
        }
    };

    const submitReview = async () => {
        if (!reviewModal.bookingId) return;
        try {
            setReviewLoading(true);
            await reviewAPI.create({ bookingId: reviewModal.bookingId, rating: reviewForm.rating, comment: reviewForm.comment });
            setReviewModal({ isOpen: false, bookingId: null });
            setReviewForm({ rating: 5, comment: '' });
            loadData();
        } catch (error) {
            alert(extractApiErrorMessage(error, copy.reviewError));
        } finally {
            setReviewLoading(false);
        }
    };

    const pendingCount = bookings.filter((item) => item.status === 0).length;
    const acceptedCount = bookings.filter((item) => item.status === 1).length;
    const inProgressCount = bookings.filter((item) => item.status === 2).length;
    const deliveryCount = bookings.filter((item) => item.status === 6).length;
    const openCount = pendingCount + acceptedCount + inProgressCount;
    const liveCount = openCount + deliveryCount;
    const totalSpend = bookings.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const averageSpend = bookings.length > 0 ? totalSpend / bookings.length : 0;

    const filterOptions = filters.map((item) => ({
        ...item,
        count: bookings.filter((booking) => item.statuses.includes(booking.status)).length,
    }));
    const selectedFilter = filterOptions.find((item) => item.key === filter) ?? filterOptions[0];

    const filteredBookings = [...bookings]
        .filter((booking) => selectedFilter.statuses.includes(booking.status))
        .sort((a, b) => {
            const timeA = new Date(a.startDate).getTime();
            const timeB = new Date(b.startDate).getTime();
            return selectedFilter.key === 'history' ? timeB - timeA : timeA - timeB;
        });

    const nextFocus = [...bookings]
        .filter((booking) => [0, 1, 2, 6].includes(booking.status))
        .sort((a, b) => {
            const diff = (PRIORITY[a.status] ?? 99) - (PRIORITY[b.status] ?? 99);
            return diff !== 0 ? diff : new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        })[0];

    const lastCompletedBooking = [...bookings]
        .filter((booking) => booking.status === 3)
        .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0];

    const totalBookingPages = Math.max(1, Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE));
    const paginatedBookings = filteredBookings.slice((bookingPage - 1) * BOOKINGS_PER_PAGE, bookingPage * BOOKINGS_PER_PAGE);

    useEffect(() => { setBookingPage(1); }, [filter]);
    useEffect(() => { if (bookingPage > totalBookingPages) setBookingPage(totalBookingPages); }, [bookingPage, totalBookingPages]);
    useEffect(() => {
        if (filter === 'pipeline' && openCount === 0 && bookings.length > 0) {
            setFilter(deliveryCount > 0 ? 'delivery' : 'history');
        }
    }, [filter, openCount, deliveryCount, bookings.length]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050816] flex items-center justify-center">
                <div className="h-11 w-11 rounded-full border-2 border-blue-500/20 border-t-blue-400 animate-spin" />
            </div>
        );
    }

    const heroSummary = deliveryCount > 0
        ? (isTurkish ? `${deliveryCount} teslim kararı sizi bekliyor.` : `${deliveryCount} delivery decisions are waiting for you.`)
        : liveCount > 0
            ? (isTurkish ? `${liveCount} aktif rezervasyonunuz var.` : `You have ${liveCount} active bookings.`)
            : bookings.length > 0
                ? (isTurkish ? 'Bugün açık aksiyon yok.' : 'There is no open action today.')
                : (isTurkish ? 'İlk rezervasyonunuzu başlatın.' : 'Start your first booking.');

    const summaryActiveHelper = liveCount > 0
        ? (isTurkish ? `${pendingCount} bekleyen, ${acceptedCount + inProgressCount} ilerleyen` : `${pendingCount} pending, ${acceptedCount + inProgressCount} in progress`)
        : (isTurkish ? 'Bugün açık süreç yok' : 'No open workflow today');

    const summaryDecisionHelper = deliveryCount > 0
        ? (isTurkish ? 'Onay veya revize bekliyor' : 'Approval or revision is pending')
        : (isTurkish ? 'Bekleyen karar yok' : 'No decision waiting');

    const summarySpendHelper = bookings.length > 0
        ? (isTurkish ? `Ort. ${formatCurrency(averageSpend)} / rezervasyon` : `Avg. ${formatCurrency(averageSpend)} / booking`)
        : (isTurkish ? 'Henüz harcama yok' : 'No spend yet');

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#050816] pt-20 pb-12 text-slate-100">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.09),_transparent_28%)]" />
            <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-5 px-4 sm:px-6 lg:px-8">
                <section className="rounded-[30px] border border-white/[0.08] bg-slate-950/84 px-5 py-4 shadow-[0_30px_80px_-52px_rgba(15,23,42,1)] sm:px-6 sm:py-5 lg:px-7">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                        <div className="min-w-0">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-100">
                                <LayoutDashboard size={14} />
                                {copy.badge}
                            </div>
                            <h1 className="mt-3 text-[28px] font-semibold tracking-tight text-white sm:text-[32px]">{copy.title}</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{heroSummary}</p>
                        </div>
                        <Link to="/browse-services" className={`inline-flex h-11 items-center gap-2 self-start rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_20px_45px_-28px_rgba(59,130,246,0.9)] transition-colors hover:bg-blue-500 ${FOCUS_RING}`}>
                            <Search size={15} />
                            {copy.searchServices}
                        </Link>
                    </div>
                </section>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1.72fr)_360px]">
                    <div id="customer-bookings" className="scroll-mt-24 rounded-[30px] border border-white/[0.08] bg-slate-950/80 px-5 py-5 shadow-[0_28px_72px_-50px_rgba(15,23,42,1)] sm:px-6 lg:px-7">
                        <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                <div className="max-w-2xl">
                                    <p className="text-sm font-medium text-slate-400">{copy.bookings}</p>
                                    <h2 className="mt-1 text-[1.75rem] font-semibold tracking-tight text-white">{copy.nextStep}</h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div className="rounded-2xl border border-white/[0.08] bg-slate-900/85 px-3.5 py-2.5 text-sm font-semibold text-white">
                                        {deliveryCount > 0
                                            ? (isTurkish ? `${deliveryCount} aksiyon bekliyor` : `${deliveryCount} actions waiting`)
                                            : (isTurkish ? `${openCount} aktif rezervasyon` : `${openCount} active bookings`)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {filterOptions.map((item) => (
                                    <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={`inline-flex h-11 items-center gap-2 rounded-2xl border px-3.5 text-sm font-medium transition-all ${filter === item.key ? item.active : 'border-white/[0.08] bg-slate-900/78 text-slate-300 hover:border-white/15 hover:text-white'} ${FOCUS_RING}`}>
                                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${item.chip}`}>{item.short}</span>
                                        <span>{item.label}</span>
                                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs font-semibold text-slate-200">{item.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-5">
                            {filteredBookings.length === 0 ? (
                                <EmptyState icon={<Calendar size={28} className="text-slate-500" />} title={selectedFilter.empty[0]} description={selectedFilter.empty[1]} cta={{ label: copy.searchServices, to: '/browse-services' }} />
                            ) : (
                                <div className="space-y-4">
                                    {paginatedBookings.map((booking) => {
                                        const customerNote = getCustomerNote(booking);
                                        const pilotNote = getPilotNote(booking);

                                        return (
                                            <article key={booking.id} className="rounded-[26px] border border-white/[0.08] bg-slate-900/82 p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.95)] hover:border-white/15 sm:p-5">
                                                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px]">
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <StatusBadge status={booking.status} />
                                                            {booking.status === 6 && <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-100">{copy.pendingDecision}</span>}
                                                            {booking.status === 3 && !booking.hasReview && <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-100">{copy.reviewOpen}</span>}
                                                        </div>
                                                        <div className="mt-4">
                                                            <h3 className="text-[1.55rem] font-semibold tracking-tight text-white break-words">{getBookingTitle(booking)}</h3>
                                                            <p className="mt-1 text-sm text-slate-500">{formatBookingType(booking)} • {formatDuration(booking)}</p>
                                                        </div>
                                                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                                            <div className="flex items-start gap-2 text-sm text-slate-300">
                                                                <Calendar size={15} className="mt-0.5 shrink-0 text-slate-500" />
                                                                <span>{formatSchedule(booking.startDate, booking.endDate)}</span>
                                                            </div>
                                                            <div className="flex items-start gap-2 text-sm text-slate-300">
                                                                <User size={15} className="mt-0.5 shrink-0 text-slate-500" />
                                                                <span>{getBookingPilotName(booking)}</span>
                                                            </div>
                                                            <div className="flex items-start gap-2 text-sm text-slate-300 sm:col-span-2">
                                                                <MapPin size={15} className="mt-0.5 shrink-0 text-slate-500" />
                                                                <span>{getBookingLocation(booking)}</span>
                                                            </div>
                                                        </div>
                                                        {(customerNote || pilotNote) && (
                                                            <div className="mt-4 border-t border-white/[0.07] pt-3 text-sm leading-6 text-slate-300">
                                                                {customerNote && <p><span className="text-slate-500">{copy.yourNote}:</span> {customerNote}</p>}
                                                                {pilotNote && <p><span className="text-slate-500">{copy.pilotNote}:</span> {pilotNote}</p>}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <aside className="shrink-0 border-t border-white/[0.07] pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="text-sm text-slate-500">{copy.budget}</p>
                                                                <div className="mt-2 text-3xl font-semibold tracking-tight text-white">{formatCurrency(booking.totalPrice)}</div>
                                                                <p className="mt-2 text-sm leading-6 text-slate-400">{statusNote(booking)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-5 flex flex-col gap-2.5">
                                                            {booking.status === 6 ? (
                                                                <>
                                                                    <button type="button" onClick={() => updateStatus(booking.id, 3 as BookingStatus)} className={`w-full rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 ${FOCUS_RING}`}>{copy.approveDelivery}</button>
                                                                    <button type="button" onClick={() => { const reason = window.prompt(copy.revisionPrompt); if (reason) updateStatus(booking.id, 2 as BookingStatus, reason); }} className={`w-full rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-500/15 ${FOCUS_RING}`}>{copy.requestRevision}</button>
                                                                </>
                                                            ) : booking.status === 3 && !booking.hasReview ? (
                                                                <button type="button" onClick={() => setReviewModal({ isOpen: true, bookingId: booking.id })} className={`w-full rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-500/15 ${FOCUS_RING}`}>{copy.ratePilot}</button>
                                                            ) : (
                                                                <Link to={`/service/${booking.listingId}`} className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-slate-900/92 px-4 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-blue-400/30 ${FOCUS_RING}`}>{copy.serviceDetail}<ChevronRight size={16} /></Link>
                                                            )}
                                                            {booking.status !== 6 && <Link to="/browse-services" className={`inline-flex w-full items-center justify-center rounded-2xl border border-white/[0.08] bg-slate-950/78 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-white/15 hover:text-white ${FOCUS_RING}`}>{copy.findSimilar}</Link>}
                                                        </div>
                                                    </aside>
                                                </div>
                                            </article>
                                        );
                                    })}
                                    <DashboardPagination page={bookingPage} totalPages={totalBookingPages} totalItems={filteredBookings.length} pageSize={BOOKINGS_PER_PAGE} onPageChange={setBookingPage} itemLabel={copy.itemLabel} />
                                </div>
                            )}
                        </div>
                    </div>
                    <aside className="self-start xl:sticky xl:top-24">
                        <section className="rounded-[30px] border border-white/[0.08] bg-slate-950/80 p-5 shadow-[0_28px_70px_-48px_rgba(15,23,42,1)]">
                            <p className="text-sm font-medium text-slate-400">{copy.overview}</p>
                            <h2 className="mt-1 text-xl font-semibold text-white">{copy.nextAction}</h2>
                            <div className="mt-4">
                                <p className="text-base font-semibold text-white">{nextFocus ? getBookingTitle(nextFocus) : (isTurkish ? 'Bekleyen aksiyon yok' : 'No pending action')}</p>
                                <p className="mt-2 text-sm leading-6 text-slate-300">{nextFocus ? formatSchedule(nextFocus.startDate, nextFocus.endDate) : (isTurkish ? 'Açık rezervasyon olmadığında burada ek işlem görünmez.' : 'When there is no active booking, no extra action appears here.')}</p>
                                {nextFocus && <p className="mt-1 text-sm text-slate-400">{getBookingPilotName(nextFocus)} • {getBookingLocation(nextFocus)}</p>}
                            </div>
                            <div className="mt-5 space-y-3 border-t border-white/[0.07] pt-4 text-sm">
                                <div className="flex items-center justify-between gap-3"><span className="text-slate-400">{copy.activeProcess}</span><span className="font-semibold text-white">{liveCount}</span></div>
                                <div className="flex items-center justify-between gap-3"><span className="text-slate-400">{copy.deliveryDecision}</span><span className="font-semibold text-white">{deliveryCount}</span></div>
                                <div className="flex items-center justify-between gap-3"><span className="text-slate-400">{copy.totalSpend}</span><span className="font-semibold text-white">{formatCurrency(totalSpend)}</span></div>
                                <div className="flex items-center justify-between gap-3"><span className="text-slate-400">{copy.lastCompleted}</span><span className="font-semibold text-white">{lastCompletedBooking ? formatCurrency(lastCompletedBooking.totalPrice) : '-'}</span></div>
                            </div>
                        </section>
                    </aside>
                </section>
                <section>
                    <div className="mb-4"><p className="text-sm font-medium text-slate-400">{copy.summary}</p></div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <DashboardSummaryCard icon={<Clock size={18} />} label={copy.activeProcess} value={String(liveCount)} helper={summaryActiveHelper} tone="border-blue-500/20 text-blue-200" />
                        <DashboardSummaryCard icon={<CheckCircle size={18} />} label={copy.deliveryDecision} value={String(deliveryCount)} helper={summaryDecisionHelper} tone="border-cyan-500/20 text-cyan-200" />
                        <DashboardSummaryCard icon={<CreditCard size={18} />} label={copy.totalSpend} value={formatCurrency(totalSpend)} helper={summarySpendHelper} tone="border-emerald-500/20 text-emerald-200" />
                    </div>
                </section>
            </div>
            {reviewModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/82 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-slate-900 p-8 shadow-[0_40px_100px_-50px_rgba(15,23,42,1)]">
                        <h2 className="text-xl font-semibold text-white">{copy.rateService}</h2>
                        <p className="mt-2 text-sm text-slate-400">{copy.reviewDescription}</p>
                        <div className="mb-6 mt-6 flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))} className={`transition-transform hover:scale-110 active:scale-95 ${FOCUS_RING}`}>
                                    <Star size={36} className={star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'} />
                                </button>
                            ))}
                        </div>
                        <textarea className="input-field mb-6 min-h-[96px]" placeholder={copy.reviewPlaceholder} value={reviewForm.comment} onChange={(event) => setReviewForm((prev) => ({ ...prev, comment: event.target.value }))} />
                        <div className="flex gap-3">
                            <button type="button" className={`btn-secondary flex-1 ${FOCUS_RING}`} onClick={() => setReviewModal({ isOpen: false, bookingId: null })}>{copy.cancel}</button>
                            <button type="button" className={`btn-primary flex-1 ${FOCUS_RING}`} onClick={submitReview} disabled={reviewLoading}>{reviewLoading ? copy.sending : copy.send}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
