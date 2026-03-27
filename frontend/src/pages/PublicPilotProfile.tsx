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
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 relative overflow-hidden pt-20">
            {/* Ambient Background */}
            <div className="fixed top-[0%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow delay-1000"></div>

            {/* Cover Image */}
            <div className="h-72 md:h-96 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent z-10"></div>
                <img
                    src={pilot.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover scale-105"
                />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-20 -mt-32 pb-20">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Sidebar - Profile Card */}
                    <div className="w-full lg:w-1/3 xl:w-1/4">
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                            {/* Profile Image */}
                            <div className="relative w-40 h-40 mx-auto mb-6">
                                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                                <img
                                    src={pilot.profileImage}
                                    alt={pilot.name}
                                    className="w-full h-full object-cover rounded-full border-4 border-[#020617] relative z-10 shadow-lg"
                                />
                                <div className="absolute bottom-1 right-1 bg-emerald-500 text-[#020617] p-2 rounded-full z-20 border-4 border-[#020617] drop-shadow-md">
                                    <Shield size={20} fill="currentColor" />
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">{pilot.name}</h1>
                                <p className="text-blue-400 font-medium">{pilot.title}</p>
                            </div>

                            <div className="flex items-center justify-center gap-2 mb-8 bg-slate-950/50 py-3 rounded-2xl border border-slate-800/80 shadow-inner">
                                <Star className="text-amber-400 fill-amber-400" size={20} />
                                <span className="font-extrabold text-white text-lg">{pilot.rating}</span>
                                <span className="text-slate-500 font-medium">({pilot.reviewCount} inceleme)</span>
                            </div>

                            <div className="space-y-5 text-sm font-medium text-slate-300 mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-800/50 rounded-lg text-blue-400"><MapPin size={18} /></div>
                                    {pilot.location}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-800/50 rounded-lg text-emerald-400"><Calendar size={18} /></div>
                                    Üyelik: {pilot.joinedDate}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-800/50 rounded-lg text-purple-400"><CheckCircle size={18} /></div>
                                    {pilot.completedResearches} Başarılı İş
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 text-base">
                                    Teklif İste
                                </button>
                                <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium py-3.5 px-6 rounded-xl border border-slate-700 transition-all duration-300 flex items-center justify-center gap-2 text-base">
                                    <MessageSquare size={18} />
                                    Mesaj Gönder
                                </button>
                            </div>
                        </div>

                        {/* Equipment */}
                        <div className="mt-8 bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-8 shadow-xl">
                            <h3 className="font-extrabold text-white mb-6 flex items-center gap-3 text-lg">
                                <div className="p-2 bg-blue-500/10 rounded-lg"><Video size={20} className="text-blue-400" /></div>
                                Ekipmanlar
                            </h3>
                            <ul className="space-y-4">
                                {pilot.equipment.map((item, idx) => (
                                    <li key={idx} className="text-slate-300 text-sm font-medium flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 lg:pt-8">
                        {/* Bio */}
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-[2.5rem] p-8 md:p-12 mb-10 shadow-xl">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight">Hakkında</h2>
                            <p className="text-slate-300 leading-relaxed text-lg font-light">
                                {pilot.bio}
                            </p>

                            <div className="mt-10 flex flex-wrap gap-3">
                                {pilot.skills.map((skill, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-xl text-sm font-bold tracking-wide">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Recent Work / Portfolio */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Portfolyo Örnekleri</h2>
                                <Link to="/browse-services" className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group transition-colors">
                                    Tümünü Gör <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="group relative aspect-video rounded-[2rem] overflow-hidden bg-slate-800 border border-slate-700/50 cursor-pointer shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
                                        <div className="absolute inset-0 bg-[#020617]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="w-16 h-16 rounded-full bg-blue-500/20 backdrop-blur-md flex items-center justify-center text-white border border-blue-500/30 scale-90 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                                <Video size={28} className="ml-1" />
                                            </div>
                                        </div>
                                        <img
                                            src={`https://images.unsplash.com/photo-${1500000000000 + item}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                                            alt="Portfolio Item"
                                            className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Public Reviews */}
                        <div>
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                    Müşteri Değerlendirmeleri <span className="text-slate-500 font-medium text-lg ml-2">({reviews.length})</span>
                                </h2>
                            </div>
                            
                            {reviews.length === 0 ? (
                                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-[2.5rem] p-12 text-center flex flex-col items-center shadow-xl">
                                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                                        <MessageSquare size={32} className="text-slate-500" />
                                    </div>
                                    <p className="text-slate-300 font-medium text-lg">Henüz değerlendirme bulunmuyor.</p>
                                    <p className="text-slate-500 mt-2">Bu pilot hakkında ilk değerlendirmeyi yapan siz olabilirsiniz.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map(review => (
                                        <div key={review.id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-8 transition-all hover:bg-slate-900/60 hover:border-slate-700 shadow-lg">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                                                        <img 
                                                            src={review.customerProfilePictureUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'} 
                                                            alt={review.customerName}
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white tracking-wide">{review.customerName}</h4>
                                                        <span className="text-xs font-medium text-slate-500">{new Date(review.createdAt).toLocaleDateString('tr-TR')}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 p-2 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={16} 
                                                            className={i < review.rating ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]' : 'text-slate-700'} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <p className="text-slate-300 text-base font-light leading-relaxed whitespace-pre-line">
                                                    "{review.comment}"
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
