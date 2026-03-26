import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listingAPI, bookingAPI, pilotAPI } from '../services/api';
import type { Listing, Booking, CreateListingDto, ServiceCategory, PilotProfile, BookingStatus } from '../types';
import {
    LayoutDashboard,
    Plus,
    X,
    // MapPin, 
    // DollarSign, 
    Package,
    CheckCircle,
    Clock,
    // AlertCircle,
    TrendingUp,
    Briefcase,
    Settings,
    ChevronRight,
    Search
} from 'lucide-react';

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
    { value: 0, label: 'Emlak' },
    { value: 1, label: 'Düğün' },
    { value: 2, label: 'İnceleme' },
    { value: 3, label: 'Ticari' },
    { value: 4, label: 'Haritacılık' },
    { value: 5, label: 'Tarım' },
    { value: 6, label: 'İnşaat' },
    { value: 7, label: 'Etkinlik' },
    { value: 8, label: 'Sinematografi' },
];

export default function PilotDashboard() {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Profile Settings State
    const [profileForm, setProfileForm] = useState<Partial<PilotProfile>>({});
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    // Form state
    const [newListing, setNewListing] = useState<CreateListingDto>({
        title: '',
        description: '',
        category: 0 as ServiceCategory,
        hourlyRate: 0,
        dailyRate: 0,
        projectRate: 0,
        coverImageUrl: 'https://images.unsplash.com/photo-1506947411487-a56738267384',
        maxDistance: 50,
        requiredEquipment: '',
        deliverableFormat: ''
    });

    const loadListings = useCallback(async () => {
        try {
            setListingsLoading(true);
            const data = await listingAPI.getByPilot(userId!);
            setListings(data);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setListingsLoading(false);
        }
    }, [userId]);

    const loadBookings = useCallback(async () => {
        try {
            const data = await bookingAPI.getPilotBookings(userId!);
            setBookings(data);
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            loadListings();
            loadBookings();
        }
    }, [userId, loadListings, loadBookings]);

    const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingStatus, customNotes?: string) => {
        let notes = customNotes;
        if (newStatus === 5 && !customNotes) { // Rejected
            const reason = window.prompt("Lütfen reddetme sebebinizi kısaca belirtin:");
            if (!reason) return; // cancelled or empty
            notes = reason;
        }

        try {
            await bookingAPI.updateStatus(bookingId, newStatus, notes);
            loadBookings();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Rezervasyon durumu güncellenirken bir hata oluştu');
        }
    };

    const handleCreateListing = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await listingAPI.create(newListing);
            setNewListing({
                title: '',
                description: '',
                category: 0 as ServiceCategory,
                hourlyRate: 0,
                dailyRate: 0,
                projectRate: 0,
                coverImageUrl: 'https://images.unsplash.com/photo-1506947411487-a56738267384',
                maxDistance: 50,
                requiredEquipment: '',
                deliverableFormat: ''
            });
            setIsModalOpen(false);
            loadListings();
        } catch (error: unknown) {
            console.error('Error creating listing:', error);
            const errorObj = error as { response?: { data?: { message?: string } | string } };
            const errorMessage = typeof errorObj.response?.data === 'string' 
                ? errorObj.response?.data 
                : errorObj.response?.data?.message || 'Hizmet oluşturulurken bir hata oluştu.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const totalEarnings = bookings
        .filter(b => b.status === 3) // Completed
        .reduce((acc, curr) => acc + curr.totalPrice, 0);

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden pt-24 pb-12">
            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <Briefcase className="text-blue-500" size={32} />
                            Pilot Paneli
                        </h1>
                        <p className="text-slate-400">Hizmetlerinizi yönetin ve kazancınızı takip edin.</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={async () => {
                                setIsSettingsOpen(true);
                                setIsProfileLoading(true);
                                try {
                                    const profile = await pilotAPI.getProfile(userId!);
                                    if (profile) setProfileForm(profile);
                                } catch (error) {
                                    console.error('Error loading profile:', error);
                                } finally {
                                    setIsProfileLoading(false);
                                }
                            }}
                            className="btn btn-secondary flex-1 md:flex-none"
                        >
                            <Settings size={18} />
                            <span className="hidden sm:inline">Ayarlar</span>
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn btn-primary flex-1 md:flex-none whitespace-nowrap z-20 relative cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                        >
                            <Plus size={18} />
                            Yeni Hizmet Ekle
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="glass-card p-6 flex flex-col justify-between group hover:bg-slate-800/80 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <TrendingUp className="text-blue-500" size={24} />
                            </div>
                            <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium mb-1">Toplam Kazanç</h3>
                            <div className="text-2xl font-bold text-white tracking-tight">{totalEarnings.toLocaleString()}₺</div>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex flex-col justify-between group hover:bg-slate-800/80 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl">
                                <Clock className="text-indigo-500" size={24} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium mb-1">Aktif Siparişler</h3>
                            <div className="text-2xl font-bold text-white tracking-tight">{bookings.filter(b => [0,1,2,6].includes(b.status)).length}</div>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex flex-col justify-between group hover:bg-slate-800/80 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl">
                                <Package className="text-purple-500" size={24} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium mb-1">Toplam Hizmet</h3>
                            <div className="text-2xl font-bold text-white tracking-tight">{listings.length}</div>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex flex-col justify-between group hover:bg-slate-800/80 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl">
                                <CheckCircle className="text-emerald-500" size={24} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium mb-1">Tamamlanan İşler</h3>
                            <div className="text-2xl font-bold text-white tracking-tight">{bookings.filter(b => b.status === 3).length}</div>
                        </div>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="space-y-6 mb-12">
                     <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock className="text-blue-400" />
                            Gelen Rezervasyonlar
                        </h2>
                    </div>
                    {bookings.length === 0 ? (
                        <div className="glass-card p-8 text-center border-dashed">
                             <p className="text-slate-400">Henüz bir rezervasyon talebi almadınız.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                             {bookings.map(booking => (
                                 <div key={booking.id} className="glass-card p-6 flex flex-col md:flex-row justify-between gap-4">
                                     <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-white line-clamp-1">{booking.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium 
                                                ${booking.status === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                                                  booking.status === 1 ? 'bg-blue-500/20 text-blue-400' :
                                                  booking.status === 2 ? 'bg-purple-500/20 text-purple-400' :
                                                  booking.status === 3 ? 'bg-emerald-500/20 text-emerald-500' :
                                                  booking.status === 6 ? 'bg-cyan-500/20 text-cyan-400' :
                                                  'bg-red-500/20 text-red-500'}`}>
                                                {booking.status === 0 ? 'Bekliyor' :
                                                 booking.status === 1 ? 'Onaylandı' :
                                                 booking.status === 2 ? 'Devam Ediyor' :
                                                 booking.status === 3 ? 'Tamamlandı' : 
                                                 booking.status === 6 ? 'Müşteri Onayı Bekliyor' :
                                                 booking.status === 4 ? 'İptal Edildi' : 'Reddedildi'}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-1"><strong>Müşteri:</strong> {booking.customerName}</p>
                                        <p className="text-slate-400 text-sm mb-1"><strong>Tarih:</strong> {new Date(booking.startDate).toLocaleString('tr-TR')} - {new Date(booking.endDate).toLocaleString('tr-TR')}</p>
                                        {booking.customerNotes && <p className="text-slate-300 text-sm mt-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700 whitespace-pre-line"><strong>Müşteri Notu:</strong><br/>{booking.customerNotes}</p>}
                                        {booking.pilotNotes && <p className="text-blue-300 text-sm mt-2 bg-blue-900/20 p-3 rounded-lg border border-blue-900/30 whitespace-pre-line"><strong>Sizin Notunuz (Red):</strong><br/>{booking.pilotNotes}</p>}
                                     </div>
                                     <div className="flex flex-col items-end justify-between gap-4 min-w-[150px]">
                                         <div className="text-2xl font-bold text-white text-gradient">{booking.totalPrice.toLocaleString()}₺</div>
                                         {booking.status === 0 && (
                                             <div className="flex gap-2 w-full mt-2">
                                                 <button 
                                                     onClick={() => handleUpdateBookingStatus(booking.id, 1)}
                                                     className="flex-1 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded border border-emerald-500/30 transition-colors text-sm font-medium"
                                                 >
                                                    Onayla
                                                 </button>
                                                 <button 
                                                     onClick={() => handleUpdateBookingStatus(booking.id, 5)}
                                                     className="flex-1 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded border border-red-500/30 transition-colors text-sm font-medium"
                                                 >
                                                    Reddet
                                                 </button>
                                             </div>
                                         )}
                                         {booking.status === 1 && (
                                             <button 
                                                 onClick={() => handleUpdateBookingStatus(booking.id, 2 as BookingStatus)}
                                                 className="w-full mt-2 py-1.5 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded border border-purple-500/30 transition-colors text-sm font-medium"
                                             >
                                                İşe Başla
                                             </button>
                                         )}
                                         {booking.status === 2 && (
                                             <button 
                                                 onClick={() => {
                                                     const note = window.prompt("İsteğe bağlı: Müşteriye bir teslimat notu/mesajı bırakın (Boş bırakabilirsiniz)");
                                                     handleUpdateBookingStatus(booking.id, 6 as BookingStatus, note || undefined);
                                                 }}
                                                 className="w-full mt-2 py-1.5 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded border border-cyan-500/30 transition-colors text-sm font-medium"
                                             >
                                                Teslim Edildi İşaretle
                                             </button>
                                         )}
                                     </div>
                                 </div>
                             ))}
                        </div>
                    )}
                </div>

                {/* Listings Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <LayoutDashboard className="text-blue-400" />
                            Aktif Hizmetlerim
                        </h2>

                        {/* Search Bar - Visual only for now */}
                        <div className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Hizmetlerde ara..."
                                className="bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 w-64"
                            />
                            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listingsLoading ? (
                            // Loading Skeletons
                            [1, 2, 3].map(i => (
                                <div key={i} className="glass-card h-[380px] animate-pulse">
                                    <div className="h-48 bg-slate-800/50 rounded-t-2xl"></div>
                                    <div className="p-5 space-y-3">
                                        <div className="h-6 bg-slate-800/50 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-800/50 rounded w-full"></div>
                                        <div className="h-4 bg-slate-800/50 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))
                        ) : listings.length === 0 ? (
                            <div className="col-span-full py-16 text-center glass-card border-dashed">
                                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="text-slate-600" size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Henüz hizmet bulunmuyor</h3>
                                <p className="text-slate-400 max-w-sm mx-auto mb-6">Müşterilere ulaşmak için hemen ilk drone hizmetinizi oluşturun.</p>
                                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary inline-flex">
                                    <Plus size={18} />
                                    İlk Hizmeti Ekle
                                </button>
                            </div>
                        ) : (
                            listings.map((listing) => (
                                <div key={listing.id} className="glass-card group overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-80"></div>
                                        <img
                                            src={listing.coverImageUrl}
                                            alt={listing.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-3 right-3 z-10 flex gap-2">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md border ${listing.isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                                                {listing.isActive ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 z-10">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/80 text-white backdrop-blur-md border border-blue-400/30 flex items-center gap-1">
                                                <Briefcase size={12} />
                                                {CATEGORIES.find(c => c.value === listing.category)?.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                                            {listing.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                                            {listing.description}
                                        </p>

                                        <div className="flex flex-col gap-2 pt-4 border-t border-slate-700/50">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 flex items-center gap-1"><Clock size={14} /> Saatlik</span>
                                                <span className="text-white font-semibold">{listing.hourlyRate}₺</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 flex items-center gap-1"><CheckCircle size={14} /> Günlük</span>
                                                <span className="text-white font-semibold">{listing.dailyRate}₺</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => navigate(`/service/${listing.id}`)}
                                            className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700/50 flex items-center justify-center gap-2 group-hover:border-blue-500/30"
                                        >
                                            Hizmeti Görüntüle <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Create Listing Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-slide-up">
                        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-700 p-6 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Plus className="text-blue-500" />
                                Yeni Hizmet Oluştur
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleCreateListing} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Hizmet Başlığı</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Örn: Profesyonel Gayrimenkul Çekimi"
                                            value={newListing.title}
                                            onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                                            required
                                            minLength={5}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Açıklama</label>
                                        <textarea
                                            className="input-field min-h-[120px]"
                                            placeholder="Hizmetinizin detaylarını, deneyiminizi ve ekipmanlarınızı açıklayın..."
                                            value={newListing.description}
                                            onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                                            required
                                            minLength={20}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Kategori</label>
                                        <div className="relative">
                                            <select
                                                className="input-field appearance-none"
                                                value={newListing.category}
                                                onChange={(e) => setNewListing({ ...newListing, category: Number(e.target.value) as ServiceCategory })}
                                            >
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat.value} value={cat.value} className="bg-slate-900 text-slate-200">
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Kapak Görseli URL</label>
                                        <input
                                            type="url"
                                            className="input-field"
                                            value={newListing.coverImageUrl}
                                            onChange={(e) => setNewListing({ ...newListing, coverImageUrl: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Saatlik Ücret (₺)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">₺</span>
                                            <input
                                                type="number"
                                                className="input-field pl-10"
                                                value={newListing.hourlyRate}
                                                onChange={(e) => setNewListing({ ...newListing, hourlyRate: Number(e.target.value) })}
                                                required
                                                min={0}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Günlük Ücret (₺)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">₺</span>
                                            <input
                                                type="number"
                                                className="input-field pl-10"
                                                value={newListing.dailyRate}
                                                onChange={(e) => setNewListing({ ...newListing, dailyRate: Number(e.target.value) })}
                                                required
                                                min={0}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Maksimum Mesafe (km)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="input-field pr-12"
                                                value={newListing.maxDistance}
                                                onChange={(e) => setNewListing({ ...newListing, maxDistance: Number(e.target.value) })}
                                                required
                                                min={1}
                                                max={1000}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">km</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Gerekli Ekipman</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Örn: DJI Mavic 3 Pro"
                                            value={newListing.requiredEquipment}
                                            onChange={(e) => setNewListing({ ...newListing, requiredEquipment: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Teslimat Formatı</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Örn: 4K 60fps MOV, RAW DNG Photos"
                                            value={newListing.deliverableFormat}
                                            onChange={(e) => setNewListing({ ...newListing, deliverableFormat: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-700/50 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="btn btn-secondary px-8"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary px-8"
                                    >
                                        {loading ? 'Yayınlanıyor...' : 'Hizmeti Yayınla'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-slide-up p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Settings className="text-blue-500" /> Profil Ayarları
                            </h2>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {isProfileLoading ? (
                            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>
                        ) : (
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                setIsSavingProfile(true);
                                try {
                                    await pilotAPI.createOrUpdateProfile(profileForm);
                                    alert('Profil başarıyla güncellendi!');
                                    setIsSettingsOpen(false);
                                } catch (error) {
                                    console.error('Error saving profile:', error);
                                    alert('Profil kaydedilirken bir hata oluştu.');
                                } finally {
                                    setIsSavingProfile(false);
                                }
                            }} className="space-y-4 text-left">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Biyografi</label>
                                        <textarea className="input-field min-h-[100px]" value={profileForm.bio || ''} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} placeholder="Kendinizden ve tecrübelerinizden bahsedin..." required />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Ekipmanlar (Virgülle ayırın)</label>
                                        <input type="text" className="input-field" value={profileForm.equipmentList || ''} onChange={e => setProfileForm({...profileForm, equipmentList: e.target.value})} placeholder="DJI Mavic 3, FPV Drone..." />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-1">SHGM Lisans Numarası</label>
                                        <input type="text" className="input-field" value={profileForm.shgmLicenseNumber || ''} onChange={e => setProfileForm({...profileForm, shgmLicenseNumber: e.target.value})} placeholder="TR-..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Enlem (Latitude)</label>
                                        <input type="number" step="any" className="input-field" value={profileForm.latitude || ''} onChange={e => setProfileForm({...profileForm, latitude: parseFloat(e.target.value)})} placeholder="Örn: 41.0082" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Boylam (Longitude)</label>
                                        <input type="number" step="any" className="input-field" value={profileForm.longitude || ''} onChange={e => setProfileForm({...profileForm, longitude: parseFloat(e.target.value)})} placeholder="Örn: 28.9784" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setIsSettingsOpen(false)} className="btn btn-secondary">İptal</button>
                                    <button type="submit" disabled={isSavingProfile} className="btn btn-primary">
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
