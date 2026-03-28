import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI, listingAPI, reviewAPI } from '../services/api';
import type { Booking, Listing, BookingStatus } from '../types';
import { LayoutDashboard, Calendar, Clock, CreditCard, ChevronRight, MapPin, Star, Search, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard, EmptyState, StatusBadge } from '../components/dashboard/DashboardComponents';
import { CustomRequestModal } from '../components/dashboard/CustomRequestModal';

export default function CustomerDashboard() {
    const { userId } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; bookingId: string | null }>({ isOpen: false, bookingId: null });
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [reviewLoading, setReviewLoading] = useState(false);
    const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [bookingsData, listingsData] = await Promise.all([
                bookingAPI.getCustomerBookings(userId!),
                listingAPI.search()
            ]);
            setBookings(bookingsData);
            setListings(listingsData.slice(0, 3));
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { if (userId) loadData(); }, [userId, loadData]);

    const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus, notes?: string) => {
        try { await bookingAPI.updateStatus(bookingId, newStatus, notes); loadData(); }
        catch { alert('Durum güncellenirken bir hata oluştu'); }
    };

    const handleCancelBooking = async (bookingId: string, reason: string) => {
        try { await bookingAPI.cancel(bookingId, reason); loadData(); }
        catch { alert('Sipariş iptal edilirken bir hata oluştu'); }
    };

    const handleSubmitReview = async () => {
        if (!reviewModal.bookingId) return;
        try {
            setReviewLoading(true);
            await reviewAPI.create({ bookingId: reviewModal.bookingId, rating: reviewForm.rating, comment: reviewForm.comment });
            setReviewModal({ isOpen: false, bookingId: null });
            setReviewForm({ rating: 5, comment: '' });
            loadData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Değerlendirme gönderilemedi');
        } finally {
            setReviewLoading(false);
        }
    };

    const activeCount = bookings.filter(b => b.status === 1 || b.status === 2).length;
    const totalSpend = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden pt-24 pb-16">
            <div className="fixed top-0 right-[-5%] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[130px] -z-10 pointer-events-none animate-pulse-slow" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[130px] -z-10 pointer-events-none animate-pulse-slow delay-1000" />

            <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1.5 flex items-center gap-3">
                            <LayoutDashboard className="text-blue-500" size={30} />
                            Müşteri Paneli
                        </h1>
                        <p className="text-slate-400 font-light">Randevularınızı takip edin ve yeni hizmetler keşfedin.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsCustomRequestOpen(true)}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 text-white font-semibold text-sm py-2.5 px-5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
                        >
                            <Send size={15} className="text-blue-400" />
                            Özel Talep
                        </button>
                        <Link
                            to="/browse-services"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-2.5 px-5 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
                        >
                            <Search size={15} />
                            Hizmet Ara
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard icon={<Calendar size={22} />} label="Toplam Randevu" value={bookings.length} color="bg-blue-500/10 text-blue-400" />
                    <StatCard icon={<Clock size={22} />} label="Aktif Süreçler" value={activeCount} color="bg-purple-500/10 text-purple-400" />
                    <StatCard icon={<CreditCard size={22} />} label="Toplam Harcama" value={totalSpend} suffix="₺" color="bg-emerald-500/10 text-emerald-400" />
                </div>

                <div 
                    className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start w-full relative z-10" 
                    style={{ gap: '2.5rem' }}
                >
                    {/* Bookings */}
                    <div className="flex flex-col w-full" style={{ gap: '1.5rem' }}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white tracking-tight">Son Randevularım</h2>
                            <Link to="/bookings" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors font-semibold">
                                Tümü <ChevronRight size={16} />
                            </Link>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="py-4">
                                <EmptyState
                                    icon={<Calendar size={28} className="text-slate-500" />}
                                    title="Henüz randevunuz yok"
                                    description="İhtiyacınız olan drone hizmetini bulmak için kataloğa göz atın."
                                    cta={{ label: 'Hizmetleri Keşfet', to: '/browse-services' }}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-xl hover:shadow-slate-900/50"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                                                    <h3 className="text-base font-bold text-white truncate">{booking.title}</h3>
                                                    <StatusBadge status={booking.status} />
                                                </div>
                                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                                    <span className="text-blue-400 font-medium">@ {booking.pilotName}</span>
                                                    <span className="text-slate-600">·</span>
                                                    <span>{new Date(booking.startDate).toLocaleDateString('tr-TR')}</span>
                                                </p>
                                                {booking.pilotNotes && (
                                                    <p className="text-amber-200 text-sm mt-3 bg-amber-900/10 px-4 py-3 rounded-xl border border-amber-900/20 whitespace-pre-line leading-relaxed">
                                                        <strong className="font-semibold text-amber-300">Pilot Notu: </strong>{booking.pilotNotes}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 shrink-0 md:mt-0 mt-2">
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-white tracking-tight">{booking.totalPrice?.toLocaleString('tr-TR')}₺</div>
                                                    <div className="text-slate-500 text-xs">{booking.hours} Saat</div>
                                                </div>

                                                {/* Delivered actions */}
                                                {booking.status === 6 && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => { const r = window.prompt('İptal sebebi:'); if (r) handleCancelBooking(booking.id, r); }}
                                                            className="text-xs px-2.5 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                                                        >
                                                            İptal
                                                        </button>
                                                        <button
                                                            onClick={() => { const r = window.prompt('Revize sebebi:'); if (r) handleUpdateStatus(booking.id, 2 as BookingStatus, r); }}
                                                            className="text-xs px-2.5 py-1.5 rounded-lg border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-colors font-medium"
                                                        >
                                                            Revize
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking.id, 3 as BookingStatus)}
                                                            className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
                                                        >
                                                            Onayla
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Review */}
                                                {booking.status === 3 && !booking.hasReview && (
                                                    <button
                                                        onClick={() => setReviewModal({ isOpen: true, bookingId: booking.id })}
                                                        className="text-xs px-2.5 py-1.5 rounded-lg border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-colors font-medium"
                                                    >
                                                        Değerlendir
                                                    </button>
                                                )}

                                                <Link
                                                    to={`/service/${booking.listingId}`}
                                                    className="w-8 h-8 bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all"
                                                >
                                                    <ChevronRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recommendations */}
                    <div className="flex flex-col w-full" style={{ gap: '1.5rem' }}>
                        <h2 className="text-xl font-bold text-white tracking-tight">Önerilen Hizmetler</h2>

                        <div className="flex flex-col gap-4">
                            {listings.map((listing) => (
                                <Link
                                    key={listing.id}
                                    to={`/service/${listing.id}`}
                                    className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 flex gap-5 group hover:bg-slate-800/60 hover:border-slate-700 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-800 shadow-inner">
                                        <img
                                            src={listing.coverImageUrl || 'https://images.unsplash.com/photo-1473968512647-3e447244af8f'}
                                            alt={listing.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-semibold truncate mb-1 group-hover:text-blue-400 transition-colors text-sm">{listing.title}</h4>
                                        <p className="text-slate-500 text-xs flex items-center gap-1 mb-2">
                                            <MapPin size={11} />{listing.pilotLocation || 'İstanbul'}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-400 font-bold text-sm">{listing.hourlyRate?.toLocaleString('tr-TR')}₺<span className="text-slate-500 text-xs font-normal">/saat</span></span>
                                            <div className="flex items-center gap-1 text-amber-400 text-xs">
                                                <Star size={11} fill="currentColor" /><span>{listing.averageRating > 0 ? listing.averageRating.toFixed(1) : 'Yeni'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link
                            to="/browse-services"
                            className="flex items-center justify-center gap-2 w-full py-3 text-sm text-slate-400 hover:text-white border border-slate-800 hover:border-blue-500/30 hover:bg-slate-800/30 rounded-xl transition-all duration-200 font-medium group"
                        >
                            Daha Fazla Keşfet
                            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {reviewModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800/80 rounded-[2rem] shadow-2xl w-full max-w-lg p-8">
                        <h2 className="text-xl font-bold text-white mb-2">Hizmeti Değerlendir</h2>
                        <p className="text-slate-400 text-sm mb-6">Puanınız diğer kullanıcıların karar vermesine yardımcı olur.</p>

                        <div className="mb-6 flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                    className="focus:outline-none hover:scale-110 transition-transform active:scale-95"
                                >
                                    <Star size={36} className={star <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                                </button>
                            ))}
                        </div>

                        <textarea
                            className="input-field min-h-[90px] mb-6"
                            placeholder="Hizmetten memnun kaldınız mı? Pilotun iletişimi nasıldı?"
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        />

                        <div className="flex gap-3">
                            <button
                                className="flex-1 btn-secondary"
                                onClick={() => setReviewModal({ isOpen: false, bookingId: null })}
                            >
                                İptal
                            </button>
                            <button
                                className="flex-1 btn-primary"
                                onClick={handleSubmitReview}
                                disabled={reviewLoading}
                            >
                                {reviewLoading ? 'Gönderiliyor...' : 'Gönder'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Request Modal */}
            <CustomRequestModal 
                isOpen={isCustomRequestOpen} 
                onClose={() => setIsCustomRequestOpen(false)} 
            />
        </div>
    );
}
