import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    LayoutDashboard, Users, MessageSquare, Calendar, TrendingUp, 
    ShieldCheck, Activity, Search, Trash2, CheckCircle, Eye, FileSearch, MapPin
} from 'lucide-react';
import { StatCard, StatusBadge } from '../components/dashboard/DashboardComponents';
import { adminAPI, customRequestAPI, extractApiErrorMessage, pilotAPI } from '../services/api';
import type { AdminOverviewDto, AdminUserDto, AdminBookingDto, CustomRequest, PilotProfile, ServiceCategory } from '../types';
import { findTurkishCityByCoordinates } from '../utils/turkishCities';

const CATEGORY_NAMES: Record<ServiceCategory, string> = {
    0: 'Emlak',
    1: 'Dugun',
    2: 'Inceleme',
    3: 'Ticari',
    4: 'Haritacilik',
    5: 'Tarim',
    6: 'Insaat',
    7: 'Etkinlik',
    8: 'Sinematografi',
};

type TabType = 'overview' | 'requests' | 'users' | 'bookings';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [overview, setOverview] = useState<AdminOverviewDto | null>(null);
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [bookings, setBookings] = useState<AdminBookingDto[]>([]);
    const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<AdminBookingDto | null>(null);
    const [selectedPilotReviewUser, setSelectedPilotReviewUser] = useState<AdminUserDto | null>(null);
    const [selectedPilotProfile, setSelectedPilotProfile] = useState<PilotProfile | null>(null);
    const [pilotReviewLoading, setPilotReviewLoading] = useState(false);
    const [pilotReviewError, setPilotReviewError] = useState('');
    const [approveLoading, setApproveLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (activeTab !== 'requests') {
            return;
        }

        customRequestAPI.list()
            .then(setCustomRequests)
            .catch((error) => console.error('Failed to load custom requests', error));
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [overviewData, usersData, bookingsData, customRequestsData] = await Promise.all([
                adminAPI.getOverview(),
                adminAPI.getUsers(),
                adminAPI.getBookings(),
                customRequestAPI.list()
            ]);
            setOverview(overviewData);
            setUsers(usersData);
            setBookings(bookingsData);
            setCustomRequests(customRequestsData);
        } catch (error) {
            console.error("Failed to load admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprovePilot = async (pilotProfileId?: string) => {
        if (!pilotProfileId) {
            alert("Bu kullanıcı için pilot profili bulunamadı.");
            return;
        }

        try {
            setApproveLoading(true);
            await adminAPI.approvePilot(pilotProfileId);
            setSelectedPilotReviewUser(null);
            setSelectedPilotProfile(null);
            setPilotReviewError('');
            await loadData();
        } catch (error) {
            console.error("Approval failed", error);
            alert(extractApiErrorMessage(error, "Pilot onaylanırken bir hata oluştu."));
        } finally {
            setApproveLoading(false);
        }
    };

    const handleRevokePilotVerification = async (pilotProfileId?: string) => {
        if (!pilotProfileId) {
            alert("Bu kullanıcı için pilot profili bulunamadı.");
            return;
        }

        try {
            setApproveLoading(true);
            await adminAPI.revokePilotVerification(pilotProfileId, "Admin manuel inceleme sonucu doğrulamayı geri aldı.");
            setSelectedPilotReviewUser(null);
            setSelectedPilotProfile(null);
            setPilotReviewError('');
            await loadData();
        } catch (error) {
            console.error("Revoke failed", error);
            alert(extractApiErrorMessage(error, "Pilot doğrulaması geri alınırken bir hata oluştu."));
        } finally {
            setApproveLoading(false);
        }
    };

    const handleRejectPilot = async (pilotProfileId?: string) => {
        if (!pilotProfileId) {
            alert("Bu kullanıcı için pilot profili bulunamadı.");
            return;
        }

        const reason = window.prompt(
            "Reddetme sebebi:",
            selectedPilotProfile?.verificationRejectionReason?.trim() || "Lisans bilgisi doğrulanamadı."
        );

        if (!reason?.trim()) {
            return;
        }

        try {
            setApproveLoading(true);
            await adminAPI.revokePilotVerification(pilotProfileId, reason.trim());
            setSelectedPilotReviewUser(null);
            setSelectedPilotProfile(null);
            setPilotReviewError('');
            await loadData();
        } catch (error) {
            console.error("Reject failed", error);
            alert(extractApiErrorMessage(error, "Pilot reddedilirken bir hata oluştu."));
        } finally {
            setApproveLoading(false);
        }
    };

    const handleOpenPilotReview = async (user: AdminUserDto) => {
        setSelectedPilotReviewUser(user);
        setSelectedPilotProfile(null);
        setPilotReviewError('');
        setPilotReviewLoading(true);

        try {
            const profile = await pilotAPI.getManagedProfile(user.id);
            setSelectedPilotProfile(profile);
        } catch (error) {
            console.error("Pilot review load failed", error);
            setPilotReviewError(extractApiErrorMessage(error, "Pilot profili yüklenemedi."));
        } finally {
            setPilotReviewLoading(false);
        }
    };

    const handleClosePilotReview = () => {
        setSelectedPilotReviewUser(null);
        setSelectedPilotProfile(null);
        setPilotReviewError('');
        setPilotReviewLoading(false);
        setApproveLoading(false);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
        try {
            await adminAPI.deleteUser(userId);
            await loadData();
        } catch (error: unknown) {
            alert(extractApiErrorMessage(error, "Kullanıcı silinemedi."));
        }
    };

    const selectedPilotProfileId = selectedPilotProfile?.id || selectedPilotReviewUser?.pilotProfileId;
    const selectedPilotHasLicense = Boolean(selectedPilotProfile?.shgmLicenseNumber?.trim());
    const selectedPilotIsVerified = Boolean(selectedPilotProfile?.isVerified);
    const selectedPilotRejectionReason = selectedPilotProfile?.verificationRejectionReason?.trim() || '';
    const selectedPilotIsRejected = !selectedPilotIsVerified && selectedPilotRejectionReason.length > 0;

    const renderOverview = () => {
        if (!overview) return null;
        
        return (
            <div className="space-y-8 animate-fade-in">
                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={<TrendingUp size={22} />} label="Toplam Ciro" value={overview.totalRevenue} suffix="₺" color="bg-emerald-500/10 text-emerald-400" />
                    <StatCard icon={<Users size={22} />} label="Toplam Kullanıcı" value={overview.totalUsers} color="bg-blue-500/10 text-blue-400" />
                    <StatCard icon={<ShieldCheck size={22} />} label="Aktif Pilot" value={overview.activePilots} color="bg-purple-500/10 text-purple-400" />
                    <StatCard icon={<MessageSquare size={22} />} label="Bekleyen Rezervasyon" value={overview.newRequests} color="bg-amber-500/10 text-amber-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activity Mini-Feed */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-blue-400" /> Son Aktiviteler
                        </h3>
                        {overview.recentActivities.length > 0 ? (
                            <div className="space-y-4">
                                {overview.recentActivities.map((activity, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                        <span className="text-slate-300 text-sm font-medium">{activity.text}</span>
                                        <span className="text-slate-500 text-xs mt-1 sm:mt-0">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-slate-400 text-sm italic">Henüz bir aktivite yok.</div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-6">Hızlı İşlemler</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setActiveTab('users')} className="p-6 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl transition-all group flex flex-col items-center justify-center gap-3">
                                <Users size={28} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                                <span className="text-slate-300 font-semibold text-center group-hover:text-white">Kullanıcıları Yönet</span>
                            </button>
                            <button onClick={() => setActiveTab('requests')} className="p-6 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/50 rounded-2xl transition-all group flex flex-col items-center justify-center gap-3">
                                <MessageSquare size={28} className="text-slate-400 group-hover:text-amber-400 transition-colors" />
                                <span className="text-slate-300 font-semibold group-hover:text-white">Sistem Mesajları</span>
                            </button>
                            <button onClick={() => setActiveTab('bookings')} className="p-6 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-purple-500/50 rounded-2xl transition-all group flex flex-col items-center justify-center gap-3 col-span-2">
                                <Calendar size={28} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
                                <span className="text-slate-300 font-semibold group-hover:text-white">Tüm Rezervasyonları Görüntüle</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderRequests = () => (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 shadow-xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare size={20} className="text-amber-400" /> Ozel Talepler
                </h3>
            </div>
            {customRequests.length === 0 ? (
                <div className="text-slate-400 text-center py-8">
                    Su an icin yeni bir ozel talep bulunmamaktadir.
                </div>
            ) : (
                <div className="space-y-4">
                    {customRequests.map((request) => (
                        <div key={request.id} className="rounded-2xl border border-slate-700/60 bg-slate-800/35 p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                                            {CATEGORY_NAMES[request.category]}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {new Date(request.createdAt).toLocaleString('tr-TR')}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-base font-semibold text-white">{request.location}</p>
                                </div>
                                <div className="text-right text-sm text-slate-400">
                                    <p>{request.date}</p>
                                    <p className="mt-1">{request.contactPhone}</p>
                                </div>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-slate-300">{request.details}</p>

                            {request.budget && (
                                <p className="mt-3 text-sm text-slate-400">
                                    Butce: <span className="font-medium text-white">{request.budget}</span>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderUsers = () => (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 shadow-xl animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users size={20} className="text-blue-400" /> Platform Kullanıcıları
                </h3>
                <div className="relative">
                    <input type="text" placeholder="Kullanıcı ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 w-full md:w-64" />
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-700/80 text-slate-400 text-sm">
                            <th className="py-4 px-4 font-semibold">Kullanıcı (Ad Soyad)</th>
                            <th className="py-4 px-4 font-semibold">Email</th>
                            <th className="py-4 px-4 font-semibold">Rol</th>
                            <th className="py-4 px-4 font-semibold">Pilot Durumu</th>
                            <th className="py-4 px-4 font-semibold">Inceleme</th>
                            <th className="py-4 px-4 font-semibold text-right">Kaldır</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-300 text-sm">
                        {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                            <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                                <td className="py-4 px-4 font-bold text-white">{user.name}</td>
                                <td className="py-4 px-4">{user.email}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'Pilot' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    {user.role === 'Pilot' ? (
                                        user.verified ? (
                                            <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle size={16} /> Doğrulandı</span>
                                        ) : user.status === 'Reddedildi' ? (
                                            <span className="flex items-center gap-1.5 text-rose-300">Reddedildi</span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-amber-300">İnceleme bekliyor</span>
                                        )
                                    ) : (
                                        <span className="text-slate-600">-</span>
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    {user.role === 'Pilot' ? (
                                        <button
                                            onClick={() => handleOpenPilotReview(user)}
                                            className="flex items-center gap-1.5 text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-all font-semibold text-xs"
                                        >
                                            <FileSearch size={14} />
                                            Incele
                                        </button>
                                    ) : (
                                        <span className="text-slate-600">-</span>
                                    )}
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderBookings = () => (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 shadow-xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar size={20} className="text-emerald-400" /> Platform Rezervasyonları
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-700/80 text-slate-400 text-sm">
                            <th className="py-4 px-4 font-semibold">Sipariş ID</th>
                            <th className="py-4 px-4 font-semibold">Tarih</th>
                            <th className="py-4 px-4 font-semibold">Müşteri</th>
                            <th className="py-4 px-4 font-semibold">Pilot</th>
                            <th className="py-4 px-4 font-semibold">Tutar</th>
                            <th className="py-4 px-4 font-semibold">Durum</th>
                            <th className="py-4 px-4 font-semibold text-right">Detaylar</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-300 text-sm">
                        {bookings.map(bk => (
                            <tr key={bk.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                                <td className="py-4 px-4 font-mono text-slate-400">#{bk.id.substring(0,8)}</td>
                                <td className="py-4 px-4">{bk.date}</td>
                                <td className="py-4 px-4 font-medium">{bk.customer}</td>
                                <td className="py-4 px-4 font-medium text-blue-400">{bk.pilot}</td>
                                <td className="py-4 px-4 font-bold text-white">{bk.amount}₺</td>
                                <td className="py-4 px-4"><StatusBadge status={bk.status} /></td>
                                <td className="py-4 px-4 text-right">
                                    <button 
                                        onClick={() => setSelectedBooking(bk)}
                                        className="text-slate-400 hover:text-white p-2 text-sm flex items-center gap-1 ml-auto rounded-lg hover:bg-slate-800 transition-colors"
                                    >
                                        İncele {/* Change from MoreVertical to textual button for better UX */}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden pt-24 pb-16">
            {/* Ambient Backgrounds */}
            <div className="fixed top-0 right-[-5%] w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[130px] -z-10 pointer-events-none animate-pulse-slow" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[130px] -z-10 pointer-events-none animate-pulse-slow delay-1000" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1.5 flex items-center gap-3">
                            <ShieldCheck className="text-emerald-500" size={34} />
                            Yönetici Paneli
                        </h1>
                        <p className="text-slate-400 font-light">Platform genelindeki tüm süreçleri, kullanıcıları ve talepleri yönetin.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 w-fit">
                    <button 
                        onClick={() => setActiveTab('overview')} 
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                    >
                        <LayoutDashboard size={16} /> Özet
                    </button>
                    <button 
                        onClick={() => setActiveTab('requests')} 
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${activeTab === 'requests' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                    >
                        <MessageSquare size={16} /> Özel Talepler & Mesajlar
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')} 
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${activeTab === 'users' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                    >
                        <Users size={16} /> Kullanıcılar
                    </button>
                    <button 
                        onClick={() => setActiveTab('bookings')} 
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${activeTab === 'bookings' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                    >
                        <Calendar size={16} /> Rezervasyonlar
                    </button>
                </div>

                {/* Tab Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'requests' && renderRequests()}
                        {activeTab === 'users' && renderUsers()}
                        {activeTab === 'bookings' && renderBookings()}
                    </>
                )}

            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700/80 rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative animate-slide-up">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-800/60 pb-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Calendar className="text-emerald-400" size={24} />
                                Sipariş Detayı
                            </h2>
                            <button 
                                onClick={() => setSelectedBooking(null)} 
                                className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white"
                            >
                                <Trash2 className="hidden" /> {/* Dummy to keep imports happy but we'll use an X or just text */}
                                <span className="font-bold text-xl leading-none">&times;</span>
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                <span className="text-slate-400 text-sm">Sipariş ID</span>
                                <span className="text-white font-mono">{selectedBooking.id}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                <span className="text-slate-400 text-sm">Tarih</span>
                                <span className="text-white">{selectedBooking.date}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                <span className="text-slate-400 text-sm">Müşteri</span>
                                <span className="text-white font-medium">{selectedBooking.customer}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                <span className="text-slate-400 text-sm">Pilot</span>
                                <span className="text-blue-400 font-medium">{selectedBooking.pilot}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                <span className="text-slate-400 text-sm">Tutar</span>
                                <span className="text-emerald-400 font-bold text-lg">{selectedBooking.amount}₺</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                <span className="text-slate-400 text-sm">Durum</span>
                                <StatusBadge status={selectedBooking.status} />
                            </div>
                        </div>

                        <div className="mt-8">
                            <button 
                                onClick={() => setSelectedBooking(null)} 
                                className="w-full py-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all border border-slate-700 border-b-4 active:border-b-0 active:translate-y-1"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedPilotReviewUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700/80 rounded-[2rem] w-full max-w-2xl p-8 shadow-2xl relative animate-slide-up">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-800/60 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <ShieldCheck className="text-amber-400" size={24} />
                                    Pilot Incelemesi
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Bu ekranda sadece manuel inceleme yapiliyor. SHGM/e-Devlet dogrulamasi otomatik degil.
                                </p>
                            </div>
                            <button
                                onClick={handleClosePilotReview}
                                className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white"
                            >
                                <span className="font-bold text-xl leading-none">&times;</span>
                            </button>
                        </div>

                        {pilotReviewLoading ? (
                            <div className="flex justify-center items-center py-16">
                                <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                        ) : pilotReviewError ? (
                            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-100">
                                {pilotReviewError}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/35 p-4">
                                        <p className="text-xs text-slate-500 uppercase tracking-[0.16em]">Pilot</p>
                                        <p className="mt-2 text-lg font-semibold text-white">{selectedPilotReviewUser.name}</p>
                                        <p className="mt-1 text-sm text-slate-400">{selectedPilotReviewUser.email}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/35 p-4">
                                        <p className="text-xs text-slate-500 uppercase tracking-[0.16em]">SHGM Lisans No</p>
                                        <p className="mt-2 text-lg font-semibold text-white">
                                            {selectedPilotProfile?.shgmLicenseNumber?.trim() || 'Girilmemis'}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Onay vermeden once bu numarayi SHGM/e-Devlet uzerinden manuel teyit et.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/35 p-4">
                                        <p className="text-xs text-slate-500 uppercase tracking-[0.16em]">Sehir</p>
                                        <div className="mt-2 flex items-center gap-2 text-white">
                                            <MapPin size={16} className="text-blue-400" />
                                            <span>
                                                {findTurkishCityByCoordinates(selectedPilotProfile?.latitude, selectedPilotProfile?.longitude)?.label.tr || 'Paylasilmadi'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/35 p-4">
                                        <p className="text-xs text-slate-500 uppercase tracking-[0.16em]">Public Profil</p>
                                        <div className="mt-2">
                                            <Link
                                                to={`/pilot/${selectedPilotReviewUser.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/20"
                                            >
                                                <Eye size={15} />
                                                Profili yeni sekmede ac
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 rounded-2xl border border-slate-700/50 bg-slate-800/35 p-4">
                                    <p className="text-xs text-slate-500 uppercase tracking-[0.16em]">Biyografi</p>
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-300">
                                        {selectedPilotProfile?.bio?.trim() || 'Biyografi girilmemis.'}
                                    </p>
                                </div>

                                <div className="mt-4 rounded-2xl border border-slate-700/50 bg-slate-800/35 p-4">
                                    <p className="text-xs text-slate-500 uppercase tracking-[0.16em]">Ekipman</p>
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-300">
                                        {selectedPilotProfile?.equipmentList?.trim() || 'Ekipman bilgisi girilmemis.'}
                                    </p>
                                </div>

                                <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
                                    Bu islem sistem icindeki verified rozetini etkiler. Lisans dogrulamasini sistem otomatik yapmaz; admin manuel kontrol ederek onay vermelidir.
                                </div>

                                {!selectedPilotHasLicense && !selectedPilotIsVerified && (
                                    <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100">
                                        Lisans numarasi girilmeden onay verilemez.
                                    </div>
                                )}

                                {selectedPilotIsRejected && (
                                    <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100">
                                        Reddetme notu: {selectedPilotRejectionReason}
                                    </div>
                                )}

                                <div className="mt-8 flex flex-col md:flex-row gap-3">
                                    <button
                                        onClick={handleClosePilotReview}
                                        className="w-full md:flex-1 py-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all border border-slate-700"
                                    >
                                        Kapat
                                    </button>
                                    {!selectedPilotIsVerified && (
                                        <button
                                            onClick={() => handleRejectPilot(selectedPilotProfileId)}
                                            disabled={approveLoading || !selectedPilotProfileId}
                                            className="w-full md:flex-1 py-4 rounded-xl font-bold text-white transition-all bg-rose-600 hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-rose-600"
                                        >
                                            {approveLoading ? 'Isleniyor...' : 'Reddet'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => selectedPilotIsVerified
                                            ? handleRevokePilotVerification(selectedPilotProfileId)
                                            : handleApprovePilot(selectedPilotProfileId)}
                                        disabled={approveLoading || !selectedPilotProfileId || (!selectedPilotIsVerified && !selectedPilotHasLicense)}
                                        className={`w-full md:flex-1 py-4 rounded-xl font-bold text-white transition-all disabled:cursor-not-allowed ${
                                            selectedPilotIsVerified
                                                ? 'bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900/50'
                                                : 'bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900/50 disabled:hover:bg-emerald-900/50'
                                        }`}
                                    >
                                        {approveLoading
                                            ? (selectedPilotIsVerified ? 'Geri aliniyor...' : 'Onaylaniyor...')
                                            : (selectedPilotIsVerified ? 'Dogrulamayi Kaldir' : 'Pilotu Onayla')}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
