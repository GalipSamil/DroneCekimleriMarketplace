import { Rocket, Shield, Users, Globe, CheckCircle } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 pt-20">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 z-0"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8">
                        <Rocket size={16} />
                        <span className="text-sm font-semibold tracking-wide uppercase">Hikayemiz & Vizyonumuz</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
                        Gökyüzündeki <span className="text-gradient">Çözüm Ortağınız</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        SkyMarket, Türkiye'nin en yetenekli drone pilotlarını, projesine değer katmak isteyen müşterilerle buluşturan öncü bir pazaryeridir.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <div className="relative pr-6 lg:pr-12">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-3xl blur-2xl opacity-20"></div>
                            <img
                                src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Drone Team"
                                className="relative rounded-3xl border border-slate-800 shadow-2xl z-10"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold font-heading mb-6">Misyonumuz</h2>
                            <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                                Drone teknolojisinin sunduğu sınırsız olanakları herkes için erişilebilir kılmak.
                                İster bir emlak ilanı için havadan görüntüleme, ister tarımsal analiz, ister sinematik bir reklam filmi olsun;
                                doğru pilotu doğru proje ile en güvenli ve hızlı şekilde buluşturuyoruz.
                            </p>

                            <h2 className="text-3xl font-bold font-heading mb-6 mt-12 md:mt-0">Neden SkyMarket?</h2>
                            <ul className="space-y-4">
                                {[
                                    "SHGM Onaylı ve Lisanslı Pilot Ağı",
                                    "Güvenli Ödeme ve Sözleşme Altyapısı",
                                    "7/24 Operasyonel Destek",
                                    "Gelişmiş Filtreleme ve Rezervasyon Sistemi"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <CheckCircle className="text-emerald-500 min-w-[20px]" size={20} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-slate-900/50 border-y border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: <Users size={32} />, value: "500+", label: "Kayıtlı Pilot" },
                            { icon: <CheckCircle size={32} />, value: "1000+", label: "Tamamlanan Proje" },
                            { icon: <Globe size={32} />, value: "81", label: "İl Kapsamı" },
                            { icon: <Shield size={32} />, value: "%100", label: "Müşteri Memnuniyeti" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 glass-card group hover:-translate-y-2 transition-transform">
                                <div className="inline-flex p-4 rounded-2xl bg-slate-800 text-blue-500 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-slate-500 uppercase text-xs tracking-wider font-semibold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold font-heading mb-8">Bize Katılın</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg">
                        Geleceğin teknolojisiyle bugünden tanışın. İster hizmet alın, ister hizmet verin; gökyüzünde yeriniz hazır.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/register" className="btn-primary py-4 px-10 text-lg">Hemen Başlayın</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
