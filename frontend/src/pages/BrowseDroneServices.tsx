import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, Grid } from 'lucide-react';
import { listingAPI } from '../services/api';
import type { Listing } from '../types';
import { ServiceCategory } from '../types';

const BrowseDroneServices: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [services, setServices] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>();
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('price');

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listingAPI.search(searchQuery, selectedCategory);
      // Client-side sorting for now since API might not support it yet
      const sortedData = [...data].sort((a, b) => {
        if (sortBy === 'price') return a.hourlyRate - b.hourlyRate;
        return 0; // consistent default
      });
      setServices(sortedData);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const getCategoryName = (category: ServiceCategory): string => {
    const categoryNames = {
      [ServiceCategory.RealEstate]: 'Emlak',
      [ServiceCategory.Wedding]: 'Düğün',
      [ServiceCategory.Inspection]: 'İnceleme',
      [ServiceCategory.Commercial]: 'Ticari',
      [ServiceCategory.Mapping]: 'Haritacılık',
      [ServiceCategory.Agriculture]: 'Tarım',
      [ServiceCategory.Construction]: 'İnşaat',
      [ServiceCategory.Events]: 'Etkinlik',
      [ServiceCategory.Cinematography]: 'Sinematografi'
    };
    return categoryNames[category] || 'Diğer';
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white">
            Drone <span className="text-gradient">Hizmetleri</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Projeniz için en iyi drone pilotlarını ve hizmetlerini keşfedin.
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="glass-card p-4 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-30 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">

          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Hizmet, pilot veya konum ara..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder-slate-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                className="w-full appearance-none bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-8 text-slate-200 focus:outline-none focus:border-blue-500/50 cursor-pointer"
                value={selectedCategory ?? ''}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) as ServiceCategory : undefined)}
              >
                <option value="">Tüm Kategoriler</option>
                {Object.values(ServiceCategory).filter(v => typeof v === 'number').map((category) => (
                  <option key={category} value={category}>
                    {getCategoryName(category as ServiceCategory)}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative min-w-[180px]">
              <Grid className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                className="w-full appearance-none bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-8 text-slate-200 focus:outline-none focus:border-blue-500/50 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'distance')}
              >
                <option value="price">Fiyata Göre</option>
                <option value="rating">Puana Göre</option>
                <option value="distance">Mesafeye Göre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-slate-800/50 rounded-2xl h-96"></div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">Sonuç Bulunamadı</h3>
            <p className="text-slate-500">Aramanızla eşleşen hizmet bulunamadı. Lütfen filtreleri temizleyip tekrar deneyin.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory(undefined); }}
              className="mt-6 text-blue-400 font-medium hover:text-blue-300 underline"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group glass-card overflow-hidden hover:shadow-blue-500/20 hover:border-blue-500/30">
                {/* Image Area */}
                <div className="relative h-56 overflow-hidden">
                  {service.coverImageUrl ? (
                    <img
                      src={service.coverImageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <MapPin className="text-slate-600 w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-white">
                      {getCategoryName(service.category)}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                </div>

                {/* Content Area */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 min-h-[2.5em]">
                      {service.description}
                    </p>
                  </div>

                  {/* Pilot Info */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      {service.pilotName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate flex items-center gap-1">
                        {service.pilotName}
                        {service.pilotIsVerified && (
                          <span className="text-blue-400" title="Doğrulanmış Pilot">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" /></svg>
                          </span>
                        )}
                      </p>
                      {service.pilotLocation && (
                        <p className="text-xs text-slate-500 truncate">{service.pilotLocation}</p>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="bg-slate-800/30 rounded-lg p-2 border border-slate-700/50 text-center">
                      <p className="text-slate-500 text-xs mb-1">Saatlik</p>
                      <p className="text-white font-semibold">{formatPrice(service.hourlyRate)}</p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-2 border border-slate-700/50 text-center">
                      <p className="text-slate-500 text-xs mb-1">Günlük</p>
                      <p className="text-white font-semibold">{formatPrice(service.dailyRate)}</p>
                    </div>
                  </div>

                  <Link
                    to={`/service/${service.id}`}
                    className="w-full btn-primary py-3 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25"
                  >
                    Detayları Gör
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseDroneServices;