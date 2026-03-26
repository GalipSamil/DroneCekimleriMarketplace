import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Shield, CheckCircle, Video, Calendar, ArrowRight, MessageSquare } from 'lucide-react';
import { reviewAPI } from '../services/api';
import type { Review } from '../types';

// Mock data generator for demo purposes if API fails or ID is dummy
const getMockPilot = (id: string) => ({
    id: id,
    name: ['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya', 'Zeynep Çelik'][Math.floor(Math.random() * 4)] || "Pilot Kullanıcı",
    title: "Profesyonel Drone Operatörü",
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
    reviewCount: Math.floor(Math.random() * 100) + 10,
    location: "İstanbul, Türkiye",
    bio: "5 yılı aşkın süredir profesyonel drone çekimleri yapıyorum. Emlak, düğün ve ticari tanıtım filmlerinde uzmanlaştım. SHGM onaylı İHA-1 ehliyetine sahibim. Projelerinizde en iyi açıyı yakalamak için buradayım.",
    skills: ["Havadan Görüntüleme", "Haritalama", "360° Panaroma", "Video Kurgu", "Post Prodüksiyon"],
    equipment: ["DJI Mavic 3 Pro", "DJI Mini 3 Pro", "Sony A7S III (Yerde)"],
    completedResearches: Math.floor(Math.random() * 50) + 5,
    joinedDate: "Mart 2023",
    coverImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
});

interface PilotProfileData {
    id: string;
    name: string;
    title: string;
    rating: string;
    reviewCount: number;
    location: string;
    bio: string;
    skills: string[];
    equipment: string[];
    completedResearches: number;
    joinedDate: string;
    coverImage: string;
    profileImage: string;
}

export default function PublicPilotProfile() {
    const { id } = useParams<{ id: string }>();
    const [pilot, setPilot] = useState<PilotProfileData | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we would fetch from API using the ID
        // const fetchPilot = async () => { ... }

        // Simulating API call
        setTimeout(() => {
            setPilot(getMockPilot(id || "1"));
            setLoading(false);
        }, 500);

        // Fetch Read Reviews
        if (id) {
            reviewAPI.getByPilot(id)
                .then((data: Review[]) => setReviews(data))
                .catch((err: any) => console.error("Could not fetch reviews", err));
        }
    }, [id]);

    if (loading || !pilot) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 pt-20">
            {/* Cover Image */}
            <div className="h-64 md:h-80 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
                <img
                    src={pilot.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="container mx-auto px-4 relative z-20 -mt-24">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Sidebar - Profile Card */}
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                            {/* Profile Image */}
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <img
                                    src={pilot.profileImage}
                                    alt={pilot.name}
                                    className="w-full h-full object-cover rounded-full border-4 border-slate-900 relative z-10"
                                />
                                <div className="absolute bottom-0 right-0 bg-emerald-500 text-slate-950 p-1.5 rounded-full z-20 border-4 border-slate-900">
                                    <Shield size={16} fill="currentColor" />
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-white mb-1">{pilot.name}</h1>
                                <p className="text-blue-400 font-medium text-sm">{pilot.title}</p>
                            </div>

                            <div className="flex items-center justify-center gap-2 mb-6 bg-slate-950/50 py-2 rounded-xl border border-slate-800">
                                <Star className="text-yellow-400 fill-yellow-400" size={18} />
                                <span className="font-bold text-white">{pilot.rating}</span>
                                <span className="text-slate-500 text-sm">({pilot.reviewCount} değerlendirme)</span>
                            </div>

                            <div className="space-y-4 text-sm text-slate-400 mb-8">
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-slate-500" />
                                    {pilot.location}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="text-slate-500" />
                                    Katılım: {pilot.joinedDate}
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={18} className="text-slate-500" />
                                    {pilot.completedResearches} Tamamlanan İş
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button className="btn-primary w-full justify-center py-3">
                                    Teklif İste
                                </button>
                                <button className="btn-secondary w-full justify-center py-3 flex items-center gap-2">
                                    <MessageSquare size={18} />
                                    Mesaj Gönder
                                </button>
                            </div>
                        </div>

                        {/* Equipment */}
                        <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Video size={18} className="text-blue-500" />
                                Ekipmanlar
                            </h3>
                            <ul className="space-y-2">
                                {pilot.equipment.map((item, idx) => (
                                    <li key={idx} className="text-slate-400 text-sm flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 pb-20">
                        {/* Bio */}
                        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 mb-8 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-white mb-4">Hakkında</h2>
                            <p className="text-slate-400 leading-relaxed text-lg">
                                {pilot.bio}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {pilot.skills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Recent Work / Portfolio */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                                Portfolyo
                                <Link to="/browse-services" className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                    Tümünü Gör <ArrowRight size={16} />
                                </Link>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="group relative aspect-video rounded-2xl overflow-hidden bg-slate-800 cursor-pointer">
                                        <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                                <Video size={24} />
                                            </div>
                                        </div>
                                        <img
                                            src={`https://images.unsplash.com/photo-${1500000000000 + item}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                                            alt="Portfolio Item"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Public Reviews */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                                Değerlendirmeler ({reviews.length})
                            </h2>
                            {reviews.length === 0 ? (
                                <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center">
                                    <MessageSquare size={32} className="text-slate-600 mb-3" />
                                    <p className="text-slate-500">Henüz değerlendirme bulunmuyor.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map(review => (
                                        <div key={review.id} className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 transition-all hover:bg-slate-800/40">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800">
                                                        <img 
                                                            src={review.customerProfilePictureUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'} 
                                                            alt={review.customerName}
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-sm">{review.customerName}</h4>
                                                        <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString('tr-TR')}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={14} 
                                                            className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                                                    {review.comment}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
