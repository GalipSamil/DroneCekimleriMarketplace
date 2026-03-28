import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listingAPI, bookingAPI, pilotAPI } from '../services/api';
import type { Listing, Booking, ServiceCategory, PilotProfile, BookingStatus } from '../types';
import {
    LayoutDashboard, Plus, X, Package, CheckCircle, Clock,
    TrendingUp, Briefcase, Settings, Search, Trash2
} from 'lucide-react';
import { StatCard, EmptyState, StatusBadge } from '../components/dashboard/DashboardComponents';
import { TagInput } from '../components/common/TagInput';
import { CreateListingModal } from '../components/dashboard/CreateListingModal';
import { EditListingModal } from '../components/dashboard/EditListingModal';

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
    { value: 0, label: 'Emlak' },         { value: 1, label: 'Düğün' },
    { value: 2, label: 'İnceleme' },       { value: 3, label: 'Ticari' },
    { value: 4, label: 'Haritacılık' },    { value: 5, label: 'Tarım' },
    { value: 6, label: 'İnşaat' },         { value: 7, label: 'Etkinlik' },
    { value: 8, label: 'Sinematografi' },
];

export default function PilotDashboard() {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listingFilter, setListingFilter] = useState<'active' | 'inactive'>('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingListing, setEditingListing] = useState<Listing | null>(null);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [profileForm, setProfileForm] = useState<Partial<PilotProfile>>({});
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    const loadListings = useCallback(async () => {
        try { setListingsLoading(true); setListings(await listingAPI.getByPilot(userId!)); }
        catch (err) { console.error('Error loading listings:', err); }
        finally { setListingsLoading(false); }
    }, [userId]);

    const loadBookings = useCallback(async () => {
        try { setBookings(await bookingAPI.getPilotBookings(userId!)); }
        catch (err) { console.error('Error loading bookings:', err); }
    }, [userId]);

    useEffect(() => { if (userId) { loadListings(); loadBookings(); } }, [userId, loadListings, loadBookings]);

    const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingStatus, customNotes?: string) => {
        let notes = customNotes;
        if (newStatus === 5 && !customNotes) {
            const reason = window.prompt('Lütfen reddetme sebebinizi belirtin:');
            if (!reason) return;
            notes = reason;
        }
        try { await bookingAPI.updateStatus(bookingId, newStatus, notes); loadBookings(); }
        catch { alert('Rezervasyon durumu güncellenirken bir hata oluştu'); }
    };

    const openSettings = async () => {
        setIsSettingsOpen(true);
        setIsProfileLoading(true);
        try { const p = await pilotAPI.getProfile(userId!); if (p) setProfileForm(p); }
        catch (err) { console.error('Error loading profile:', err); }
        finally { setIsProfileLoading(false); }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try { await pilotAPI.createOrUpdateProfile(profileForm); setIsSettingsOpen(false); }
        catch { alert('Profil kaydedilirken bir hata oluştu.'); }
        finally { setIsSavingProfile(false); }
    };

    const totalEarnings = bookings.filter(b => b.status === 3).reduce((a, b) => a + b.totalPrice, 0);
    const activeCount = bookings.filter(b => [0, 1, 2, 6].includes(b.status)).length;
    const completedCount = bookings.filter(b => b.status === 3).length;

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden pt-24 pb-16">
            <div className="fixed top-0 right-[-5%] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[130px] -z-10 pointer-events-none animate-pulse-slow" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[130px] -z-10 pointer-events-none animate-pulse-slow delay-1000" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1.5 flex items-center gap-3">
                            <Briefcase className="text-blue-500" size={30} />
                            Pilot Paneli
                        </h1>
                        <p className="text-slate-400 font-light">Hizmetlerinizi yönetin ve kazancınızı takip edin.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={openSettings}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5 active:scale-95"
                        >
                            <Settings size={16} />
                            <span className="hidden sm:inline">Ayarlar</span>
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
                        >
                            <Plus size={16} />
                            Yeni Hizmet
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <StatCard icon={<TrendingUp size={20} />} label="Toplam Kazanç" value={totalEarnings} suffix="₺" color="bg-blue-500/10 text-blue-400" />
                    <StatCard icon={<Clock size={20} />} label="Aktif Siparişler" value={activeCount} color="bg-indigo-500/10 text-indigo-400" />
                    <StatCard icon={<Package size={20} />} label="Toplam Hizmet" value={listings.length} color="bg-purple-500/10 text-purple-400" />
                    <StatCard icon={<CheckCircle size={20} />} label="Tamamlanan" value={completedCount} color="bg-emerald-500/10 text-emerald-400" />
                </div>

                {/* Bookings */}
                <div className="mb-10 space-y-5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock size={20} className="text-blue-400" />
                        Gelen Rezervasyonlar
                    </h2>

                    {bookings.length === 0 ? (
                        <EmptyState
                            icon={<Clock size={22} />}
                            title="Henüz rezervasyon talebi yok"
                            description="Hizmet ekledikten sonra müşterilerden rezervasyon talepleri burada görünecek."
                        />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {bookings.map(booking => (
                                <div
                                    key={booking.id}
                                    className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4 transition-all duration-200 hover:border-blue-500/20 hover:bg-slate-800/30 hover:shadow-lg hover:shadow-blue-500/5"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                                            <h3 className="text-base font-bold text-white line-clamp-1">{booking.title}</h3>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                        <p className="text-slate-400 text-sm mb-0.5">
                                            <span className="font-medium text-slate-300">Müşteri: </span>{booking.customerName}
                                        </p>
                                        <p className="text-slate-500 text-xs">
                                            {new Date(booking.startDate).toLocaleString('tr-TR')} — {new Date(booking.endDate).toLocaleString('tr-TR')}
                                        </p>
                                        {booking.customerNotes && (
                                            <p className="text-slate-300 text-xs mt-2 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700 whitespace-pre-line">
                                                <strong>Müşteri Notu: </strong>{booking.customerNotes}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-white">{booking.totalPrice.toLocaleString('tr-TR')}₺</div>
                                            <div className="text-slate-500 text-xs">{booking.hours} Saat</div>
                                        </div>

                                        {booking.status === 0 && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdateBookingStatus(booking.id, 1)}
                                                    className="text-xs px-3 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-semibold transition-colors">
                                                    Onayla
                                                </button>
                                                <button onClick={() => handleUpdateBookingStatus(booking.id, 5)}
                                                    className="text-xs px-3 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 font-semibold transition-colors">
                                                    Reddet
                                                </button>
                                            </div>
                                        )}
                                        {booking.status === 1 && (
                                            <button onClick={() => handleUpdateBookingStatus(booking.id, 2 as BookingStatus)}
                                                className="text-xs px-3 py-2 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 font-semibold transition-colors">
                                                İşe Başla
                                            </button>
                                        )}
                                        {booking.status === 2 && (
                                            <button onClick={() => { const n = window.prompt('Teslimat notu (isteğe bağlı):'); handleUpdateBookingStatus(booking.id, 6 as BookingStatus, n || undefined); }}
                                                className="text-xs px-3 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 font-semibold transition-colors">
                                                Teslim Et
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Listings */}
                <div className="space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <LayoutDashboard size={20} className="text-blue-400" />
                                Hizmetlerim
                            </h2>
                            <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
                                <button
                                    onClick={() => setListingFilter('active')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${listingFilter === 'active' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    Aktif ({listings.filter(l => l.isActive).length})
                                </button>
                                <button
                                    onClick={() => setListingFilter('inactive')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${listingFilter === 'inactive' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    Pasif ({listings.filter(l => !l.isActive).length})
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Hizmetlerde ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all w-full md:w-64"
                            />
                            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {listingsLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden animate-pulse">
                                    <div className="h-44 bg-slate-800/60 animate-shimmer" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 bg-slate-800/60 rounded w-3/4" />
                                        <div className="h-3 bg-slate-800/60 rounded w-full" />
                                        <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                                    </div>
                                </div>
                            ))
                        ) : listings.filter(l => (listingFilter === 'active' ? l.isActive : !l.isActive) && l.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                            <div className="col-span-full">
                                <EmptyState
                                    icon={<Package size={22} />}
                                    title={listingFilter === 'active' ? "Aktif hizmetiniz bulunmuyor" : "Pasif hizmetiniz bulunmuyor"}
                                    description={searchQuery ? "Aramanıza uygun sonuç bulunamadı." : (listingFilter === 'active' ? "Müşterilere ulaşmak için ilk drone hizmetinizi oluşturun." : "Şu anda pasife aldığınız bir hizmetiniz bulunmuyor.")}
                                    cta={listingFilter === 'active' ? { label: 'İlk Hizmeti Ekle', to: '#' } : undefined}
                                />
                            </div>
                        ) : (
                            listings
                                .filter(l => (listingFilter === 'active' ? l.isActive : !l.isActive))
                                .filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((listing) => (
                                <div
                                    key={listing.id}
                                    className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl group overflow-hidden hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/8 transition-all duration-200"
                                >
                                    <div className="h-44 overflow-hidden relative bg-slate-800/50">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                                            <Package size={40} className="text-slate-700" />
                                        </div>
                                        {listing.coverImageUrl && (
                                            <img
                                                src={listing.coverImageUrl}
                                                alt={listing.title}
                                                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out z-0 relative"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        )}
                                        <div className="absolute top-3 right-3 z-20">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm border ${listing.isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                                                {listing.isActive ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 z-20">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600/80 text-white backdrop-blur-sm border border-blue-400/30">
                                                {CATEGORIES.find(c => c.value === listing.category)?.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-base font-bold text-white mb-1.5 line-clamp-1 group-hover:text-blue-400 transition-colors">{listing.title}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">{listing.description}</p>

                                        <div className="flex justify-between text-sm pt-3 border-t border-slate-800/60 mb-4">
                                            <div>
                                                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Saatlik</p>
                                                <p className="font-bold text-white">{listing.hourlyRate?.toLocaleString('tr-TR')}₺</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Günlük</p>
                                                <p className="font-bold text-white">{listing.dailyRate?.toLocaleString('tr-TR')}₺</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full">
                                            <button
                                                onClick={() => navigate(`/service/${listing.id}`)}
                                                className="flex-1 py-2.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 border border-slate-700/50 hover:border-blue-500"
                                                title="Hizmeti Görüntüle"
                                            >
                                                Görüntüle
                                            </button>
                                            <button
                                                onClick={() => setEditingListing(listing)}
                                                className="flex-1 py-2.5 bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-900 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 border border-slate-700/50 hover:border-amber-400"
                                                title="Hizmeti Düzenle"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) {
                                                        try {
                                                            await listingAPI.delete(listing.id);
                                                            loadListings();
                                                        } catch {
                                                            alert('İlan silinirken bir hata oluştu');
                                                        }
                                                    }
                                                }}
                                                className="py-2.5 px-3 bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center border border-slate-700/50 hover:border-red-500"
                                                title="Hizmeti Sil"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Create Listing Modal */}
            <CreateListingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => { setIsModalOpen(false); loadListings(); }} 
            />

            {/* Edit Listing Modal */}
            <EditListingModal 
                isOpen={!!editingListing} 
                listing={editingListing}
                onClose={() => setEditingListing(null)} 
                onSuccess={() => { setEditingListing(null); loadListings(); }} 
            />

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md animate-fade-in overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-700/80 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-slide-up p-8">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-800/60 pb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-xl">
                                    <Settings className="text-slate-300" size={20} />
                                </div>
                                Profil Ayarları
                            </h2>
                            <button 
                                type="button"
                                onClick={() => setIsSettingsOpen(false)} 
                                className="p-2.5 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white border border-transparent hover:border-slate-700 active:scale-95"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {isProfileLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Biyografi <span className="text-red-400">*</span></label>
                                        <textarea className="input-field min-h-[100px] shadow-inner resize-y" value={profileForm.bio || ''} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Kendinizden ve tecrübelerinizden bahsedin..." required />
                                    </div>
                                    <div className="col-span-2">
                                        <TagInput
                                            label="Ekipmanlar (Envanter)"
                                            placeholder="DJI Mavic 3, FPV Drone..."
                                            value={profileForm.equipmentList || ''}
                                            onChange={(val) => setProfileForm({ ...profileForm, equipmentList: val })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">SHGM Lisans No</label>
                                        <input type="text" className="input-field shadow-inner font-mono text-sm" value={profileForm.shgmLicenseNumber || ''} onChange={e => setProfileForm({ ...profileForm, shgmLicenseNumber: e.target.value })} placeholder="TR-..." />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Enlem</label>
                                        <input type="number" step="any" className="input-field shadow-inner" value={profileForm.latitude || ''} onChange={e => setProfileForm({ ...profileForm, latitude: parseFloat(e.target.value) })} placeholder="41.0082" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Boylam</label>
                                        <input type="number" step="any" className="input-field shadow-inner" value={profileForm.longitude || ''} onChange={e => setProfileForm({ ...profileForm, longitude: parseFloat(e.target.value) })} placeholder="28.9784" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-6 border-t border-slate-800/60 mt-8">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsSettingsOpen(false)} 
                                        className="py-3 px-6 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all"
                                    >
                                        İptal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSavingProfile} 
                                        className="py-3 px-8 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
                                    >
                                        {isSavingProfile && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        {isSavingProfile ? 'Kaydediliyor...' : 'Kaydet'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
