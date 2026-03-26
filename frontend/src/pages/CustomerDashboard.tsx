import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI, listingAPI, reviewAPI } from '../services/api';
import type { Booking, Listing, BookingStatus } from '../types';
import {
    LayoutDashboard,
    Calendar,
    Clock,
    CreditCard,
    ChevronRight,
    MapPin,
    Star,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
    const { userId } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Review Modal States
    const [reviewModal, setReviewModal] = useState<{isOpen: boolean, bookingId: string | null}>({isOpen: false, bookingId: null});
    const [reviewForm, setReviewForm] = useState({rating: 5, comment: ''});
    const [reviewLoading, setReviewLoading] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [bookingsData, listingsData] = await Promise.all([
                bookingAPI.getCustomerBookings(userId!),
                listingAPI.search()
            ]);
            setBookings(bookingsData);
            setListings(listingsData.slice(0, 3)); // Show top 3 recommendations
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            loadData();
        }
    }, [userId, loadData]);

    const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus, notes?: string) => {
        try {
            await bookingAPI.updateStatus(bookingId, newStatus, notes);
            loadData();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Durum güncellenirken bir hata oluştu');
        }
    };

    const handleCancelBooking = async (bookingId: string, reason: string) => {
        try {
            await bookingAPI.cancel(bookingId, reason);
            loadData();
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Sipariş iptal edilirken bir hata oluştu');
        }
    };

    const handleSubmitReview = async () => {
        if (!reviewModal.bookingId) return;
        try {
            setReviewLoading(true);
            await reviewAPI.create({
                bookingId: reviewModal.bookingId,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            alert('Değerlendirmeniz başarıyla gönderildi! Teşekkür ederiz.');
            setReviewModal({isOpen: false, bookingId: null});
            setReviewForm({rating: 5, comment: ''});
            loadData(); // Refresh to update hasReview flag
        } catch (error: any) {
            console.error('Error submitting review:', error);
            alert(error.response?.data?.message || 'Değerlendirme gönderilirken bir hata oluştu');
        } finally {
            setReviewLoading(false);
        }
    };

    const getStatusBadge = (status: number) => {
        const statuses = ['Beklemede', 'Kabul Edildi', 'Devam Ediyor', 'Tamamlandı', 'İptal', 'Reddedildi', 'Teslim Edildi'];
        const colors = [
            'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', // Pending
            'bg-blue-500/20 text-blue-300 border-blue-500/30',     // Accepted
            'bg-purple-500/20 text-purple-300 border-purple-500/30', // InProgress
            'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', // Completed
            'bg-red-500/20 text-red-300 border-red-500/30',        // Cancelled
            'bg-red-500/20 text-red-300 border-red-500/30',         // Rejected
            'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'         // Delivered
        ];

        return (
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md border ${colors[status] || colors[0]}`}>
                {statuses[status]}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden pt-24 pb-12">
            {/* Loading State */}
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
                    <Loader2 className="text-blue-500 animate-spin" size={48} />
                </div>
            )}
            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <LayoutDashboard className="text-blue-500" size={32} />
                            Müşteri Paneli
                        </h1>
                        <p className="text-slate-400">Randevularınızı takip edin ve yeni hizmetler keşfedin.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Calendar className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Toplam Randevu</p>
                            <h3 className="text-2xl font-bold text-white">{bookings.length}</h3>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Clock className="text-purple-500" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Aktif Süreçler</p>
                            <h3 className="text-2xl font-bold text-white">{bookings.filter(b => b.status === 1 || b.status === 2).length}</h3>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                            <CreditCard className="text-emerald-500" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Toplam Harcama</p>
                            <h3 className="text-2xl font-bold text-white">
                                {bookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)}₺
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Bookings */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Son Randevularım</h2>
                            <Link to="/bookings" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                                Tümünü Gör <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {bookings.length === 0 ? (
                                <div className="glass-card p-8 text-center border-dashed">
                                    <Calendar className="mx-auto text-slate-600 mb-4" size={32} />
                                    <h3 className="text-white font-medium mb-1">Henüz randevunuz yok</h3>
                                    <p className="text-slate-400 text-sm mb-4">İhtiyacınız olan drone hizmetini bulmak için kataloğa göz atın.</p>
                                    <Link to="/browse-services" className="btn btn-primary inline-flex text-sm py-2">
                                        Hizmet Ara
                                    </Link>
                                </div>
                            ) : (
                                bookings.map((booking) => (
                                    <div key={booking.id} className="glass-card p-6 transition-colors hover:border-blue-500/30">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-white">{booking.title}</h3>
                                                    {getStatusBadge(booking.status)}
                                                </div>
                                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                                    <span className="text-blue-400">@ {booking.pilotName}</span>
                                                    <span>•</span>
                                                    <span>{(new Date(booking.startDate)).toLocaleDateString('tr-TR')}</span>
                                                </p>
                                                {booking.customerNotes && <p className="text-slate-300 text-sm mt-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700 whitespace-pre-line"><strong>Kendi Notunuz:</strong><br/>{booking.customerNotes}</p>}
                                                {booking.pilotNotes && <p className="text-amber-200 text-sm mt-2 bg-amber-900/20 p-3 rounded-lg border border-amber-900/40 whitespace-pre-line"><strong>Pilot Notu:</strong><br/>{booking.pilotNotes}</p>}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-white">{booking.totalPrice}₺</div>
                                                    <div className="text-slate-500 text-xs">{booking.hours} Saat</div>
                                                </div>
                                                {booking.status === 6 && (
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                const reason = window.prompt("Siparişi tamamen İPTAL etmek istediğinize emin misiniz? (Lütfen sadece pilotla anlaşamıyorsanız iptal edin ve şikayetinizi yazın)");
                                                                if (reason) handleCancelBooking(booking.id, reason);
                                                            }}
                                                            className="btn-secondary border-red-500/50 text-red-500 hover:bg-red-500/10 text-[11px] py-1.5 px-2 whitespace-nowrap"
                                                        >
                                                            İptal Et
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                const reason = window.prompt("Teslimatı neden reddediyorsunuz? (Lütfen açıklama girin)");
                                                                if (reason) handleUpdateStatus(booking.id, 2 as BookingStatus, reason);
                                                            }}
                                                            className="btn-secondary border-orange-500/50 text-orange-400 hover:bg-orange-500/10 text-[11px] py-1.5 px-2 text-center leading-tight"
                                                        >
                                                            Revize İste<br/>(Reddet)
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(booking.id, 3 as BookingStatus)}
                                                            className="btn-primary text-[11px] py-1.5 px-3 whitespace-nowrap"
                                                        >
                                                            İşi Onayla
                                                        </button>
                                                    </div>
                                                )}
                                                {booking.status === 3 && !booking.hasReview && (
                                                    <button 
                                                        onClick={() => setReviewModal({isOpen: true, bookingId: booking.id})}
                                                        className="py-1.5 px-3 rounded-lg text-xs font-medium border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 transition-colors"
                                                    >
                                                        Değerlendir
                                                    </button>
                                                )}
                                                <Link 
                                                    to={`/service/${booking.listingId}`}
                                                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-2 flex items-center justify-center"
                                                >
                                                    <ChevronRight size={20} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recommended Services */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Önerilen Hizmetler</h2>
                        </div>

                        <div className="space-y-4">
                            {listings.map((listing) => (
                                <Link key={listing.id} to={`/service/${listing.id}`} className="glass-card p-4 flex gap-4 group hover:bg-slate-800/80 transition-all">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                        <img src={listing.coverImageUrl || 'https://images.unsplash.com/photo-1473968512647-3e447244af8f'} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium truncate mb-1 group-hover:text-blue-400 transition-colors">{listing.title}</h4>
                                        <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
                                            <MapPin size={12} />
                                            <span className="truncate">{listing.pilotLocation || 'İstanbul'}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-blue-400 font-bold text-sm">{listing.hourlyRate}₺<span className="text-slate-500 text-xs font-normal">/saat</span></span>
                                            <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                                                <Star size={12} fill="currentColor" />
                                                <span>4.9</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link to="/browse-services" className="block w-full py-3 text-center text-sm text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl transition-all">
                            Daha Fazla Keşfet
                        </Link>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {reviewModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Hizmeti Değerlendir</h2>
                        <p className="text-slate-400 text-sm mb-6">Puanınız ve yorumunuz, diğer müşterilerin karar vermesine yardımcı olacaktır.</p>
                        
                        <div className="mb-6 flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star 
                                        size={40} 
                                        className={`${star <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} 
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Yorumunuz (İsteğe bağlı)</label>
                            <textarea
                                className="input-field min-h-[100px]"
                                placeholder="Hizmetten ne kadar memnun kaldınız? Pilotun iletişimi nasıldı?"
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button 
                                className="flex-1 btn-secondary"
                                onClick={() => setReviewModal({isOpen: false, bookingId: null})}
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
        </div>
    );
}
