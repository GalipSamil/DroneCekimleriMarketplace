import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';

interface Pilot {
    id: number;
    name: string;
    rating: number;
    rate: number;
    image: string;
    specialty: string;
}

const FEATURED_PILOTS: Pilot[] = [
    { id: 1, name: 'Ahmet Yılmaz', rating: 4.9, rate: 1500, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', specialty: 'Sinematik Çekim' },
    { id: 2, name: 'Ayşe Demir', rating: 5.0, rate: 2000, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', specialty: 'Emlak Çekimi' },
    { id: 3, name: 'Mehmet Kaya', rating: 4.8, rate: 1200, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', specialty: 'Haritalama' },
    { id: 4, name: 'Zeynep Çelik', rating: 4.9, rate: 1800, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', specialty: 'Etkinlik' },
];

const PilotCard: React.FC<{ pilot: Pilot }> = ({ pilot }) => (
    <div className="group bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-800/80 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden flex flex-col">
        <div className="relative h-52 overflow-hidden">
            <img
                src={pilot.image}
                alt={pilot.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-90" />
            <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/5">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-white text-xs font-bold">{pilot.rating}</span>
            </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
            <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate">{pilot.name}</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{pilot.specialty}</p>

            <div className="mt-auto pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5">Başlangıç</p>
                    <p className="text-sm font-bold text-slate-200">
                        {pilot.rate.toLocaleString('tr-TR')}₺{' '}
                        <span className="text-xs text-slate-500 font-normal">/ saat</span>
                    </p>
                </div>
                <Link
                    to={`/pilot/${pilot.id}`}
                    aria-label={`${pilot.name} profiline git`}
                    className="w-9 h-9 rounded-full bg-slate-800/50 border border-slate-700/50 hover:bg-blue-600 hover:border-blue-500 flex items-center justify-center transition-all duration-300 text-slate-400 hover:text-white"
                >
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    </div>
);

export const PilotsSection: React.FC = () => (
    <section className="py-28 md:py-36 bg-slate-900/20 border-y border-slate-800/50 relative">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-4">
                <div>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white">
                        Öne Çıkan <span className="text-blue-400">Pilotlar</span>
                    </h2>
                    <p className="text-slate-400 text-base">En yüksek puanlı profesyonellerimizle tanışın.</p>
                </div>
                <Link to="/browse-services" className="group flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors shrink-0">
                    Tümünü Gör <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {FEATURED_PILOTS.map((pilot) => (
                    <PilotCard key={pilot.id} pilot={pilot} />
                ))}
            </div>
        </div>
    </section>
);
