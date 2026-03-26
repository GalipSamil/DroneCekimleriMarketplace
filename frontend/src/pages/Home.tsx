import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Shield, Video, Clock, ArrowRight, CheckCircle } from 'lucide-react';

// Dummy Data for Pilot Showcase
const pilots = [
    {
        id: 1,
        name: "Ahmet Yılmaz",
        rating: 4.9,
        rate: 1500,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
        specialty: "Sinematik Çekim"
    },
    {
        id: 2,
        name: "Ayşe Demir",
        rating: 5.0,
        rate: 2000,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
        specialty: "Emlak Çekimi"
    },
    {
        id: 3,
        name: "Mehmet Kaya",
        rating: 4.8,
        rate: 1200,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
        specialty: "Haritalama"
    },
    {
        id: 4,
        name: "Zeynep Çelik",
        rating: 4.9,
        rate: 1800,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
        specialty: "Etkinlik"
    }
];

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-x-hidden">

            {/* Ambient Background Effects */}
            {/* Ambient Background Effects */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -z-10 animate-pulse-glow will-change-transform" style={{ animationDuration: '4s' }}></div>
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -z-10 animate-pulse-glow will-change-transform" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>

            {/* Hero Section */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Background Image/Video */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1506947411487-a56738267384?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Drone Landscape"
                        className="w-full h-full object-cover opacity-30 scale-105 animate-float" // animate-float is a bit funky on bg, maybe remove or use something else. Keeping subtle.
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 text-center mt-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 animate-float">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-sm font-semibold tracking-wide uppercase">Türkiye'nin #1 Drone Pazaryeri</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-heading mb-8 tracking-tight leading-tight">
                        Dünyayı <br className="hidden md:block" />
                        <span className="text-gradient">Yukarıdan</span> Keşfet
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Profesyonel drone pilotlarıyla projelerinizi gökyüzüne taşıyın. Sinematik çekimler, haritalama ve daha fazlası.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-400 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
                        <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-full p-2 shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/50">
                            <Search className="w-6 h-6 text-slate-400 ml-4 shrink-0" />
                            <input
                                type="text"
                                placeholder="Pilot, hizmet veya konum ara..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 px-4 py-3 text-lg outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Link
                                to={`/browse-services?search=${searchQuery}`}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 shrink-0"
                            >
                                Ara
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-400">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">500+</span>
                            <span className="text-sm uppercase tracking-wider">Lisanslı Pilot</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">1000+</span>
                            <span className="text-sm uppercase tracking-wider">Başarılı Uçuş</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">81</span>
                            <span className="text-sm uppercase tracking-wider">İl Kapsamı</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section (Glassmorphism Cards) */}
            <section className="py-32 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold font-heading mb-6">
                            Neden <span className="text-gradient">Biz?</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
                            En iyi sonuçlar için en iyi teknolojiyi ve yeteneği bir araya getiriyoruz. Güvenli, hızlı ve profesyonel.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Shield className="w-10 h-10 text-emerald-400" />, title: "Lisanslı Pilotlar", desc: "Tüm pilotlarımız SHGM onaylı ve lisanslıdır. Güvenle uçuş yapın." },
                            { icon: <Video className="w-10 h-10 text-blue-400" />, title: "4K & 8K Kalite", desc: "Sinematik kalitede, yüksek çözünürlüklü ve RAW formatında çekimler." },
                            { icon: <Clock className="w-10 h-10 text-violet-400" />, title: "Hızlı Teslimat", desc: "Çekim sonrası 24 saat içinde ham görüntü, 48 saatte kurgu teslimi." }
                        ].map((feature, idx) => (
                            <div key={idx} className="glass-card p-10 group hover:-translate-y-2">
                                <div className="w-20 h-20 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500 border border-slate-700/50">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pilot Showcase Section */}
            <section className="py-32 bg-slate-900/30 border-y border-slate-800/50 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold font-heading mb-4">
                                Öne Çıkan <span className="text-gradient">Pilotlar</span>
                            </h2>
                            <p className="text-slate-400 text-lg">En yüksek puanlı profesyonellerimizle tanışın.</p>
                        </div>
                        <Link to="/browse-services" className="group flex items-center gap-2 text-blue-400 font-bold text-lg hover:text-blue-300 transition-colors">
                            Tümünü Gör <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pilots.map((pilot) => (
                            <div key={pilot.id} className="group bg-slate-900 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden flex flex-col">
                                <div className="relative h-64 overflow-hidden">
                                    <img src={pilot.image} alt={pilot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-white font-bold">{pilot.rating}</span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{pilot.name}</h3>
                                        <p className="text-sm text-slate-400 font-medium">{pilot.specialty}</p>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Başlangıç</p>
                                            <p className="text-lg font-bold text-white">{pilot.rate}₺ <span className="text-sm text-slate-500 font-normal">/ saat</span></p>
                                        </div>
                                        <Link to={`/pilot/${pilot.id}`} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-300 text-blue-400">
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-emerald-900/20 blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                        <h2 className="text-4xl md:text-6xl font-extrabold font-heading mb-8 text-white relative z-10">
                            Pilot Olmaya <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Hazır Mısın?</span>
                        </h2>
                        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed relative z-10">
                            Yeteneklerini kazanca dönüştür. Türkiye'nin en büyük drone pilotu ağına katıl ve projeler almaya başla.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                            <Link to="/register" className="btn-primary py-4 px-10 text-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                                Hemen Başvur
                            </Link>
                            <Link to="/login" className="btn-secondary py-4 px-10 text-lg">
                                Giriş Yap
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-emerald-500" /> Komisyonsuz Başlangıç
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-emerald-500" /> Hızlı Ödeme
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
