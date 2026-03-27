import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid } from 'lucide-react';
import { listingAPI } from '../services/api';
import type { Listing } from '../types';
import { ServiceCategory } from '../types';
import { ServiceCard } from '../components/services/ServiceCard';

const CATEGORIES = Object.values(ServiceCategory).filter((v): v is ServiceCategory => typeof v === 'number');

const CATEGORY_NAMES: Record<ServiceCategory, string> = {
  [ServiceCategory.RealEstate]: 'Emlak',
  [ServiceCategory.Wedding]: 'Düğün',
  [ServiceCategory.Inspection]: 'İnceleme',
  [ServiceCategory.Commercial]: 'Ticari',
  [ServiceCategory.Mapping]: 'Haritacılık',
  [ServiceCategory.Agriculture]: 'Tarım',
  [ServiceCategory.Construction]: 'İnşaat',
  [ServiceCategory.Events]: 'Etkinlik',
  [ServiceCategory.Cinematography]: 'Sinematografi',
};

type SortKey = 'price' | 'rating' | 'distance';

const ChevronIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const SkeletonCard = () => (
  <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden animate-pulse">
    <div className="h-52 bg-slate-800" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-800 rounded w-3/4" />
      <div className="h-3 bg-slate-800 rounded w-full" />
      <div className="h-3 bg-slate-800 rounded w-2/3" />
      <div className="h-8 bg-slate-800 rounded-xl mt-4" />
    </div>
  </div>
);

const BrowseDroneServices: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>();
  const [sortBy, setSortBy] = useState<SortKey>('price');

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listingAPI.search(searchQuery, selectedCategory);
      const sorted = [...data].sort((a, b) => {
        if (sortBy === 'price') return a.hourlyRate - b.hourlyRate;
        return 0;
      });
      setServices(sorted);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortBy]);

  useEffect(() => { loadServices(); }, [loadServices]);

  const clearFilters = () => { setSearchQuery(''); setSelectedCategory(undefined); };

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient */}
      <div className="fixed top-20 right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow" />
      <div className="fixed bottom-0 left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow delay-1000" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white">
            Drone{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Hizmetleri
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Projeniz için en iyi drone pilotlarını keşfedin.
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3 mb-10 flex flex-col md:flex-row gap-3 items-stretch md:items-center sticky top-24 z-30 shadow-xl shadow-blue-900/10">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Hizmet, pilot veya konum ara..."
              className="w-full bg-slate-800/50 border border-slate-700/80 rounded-xl py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 hover:bg-slate-800/80 transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            {/* Category */}
            <div className="relative group flex-1 md:flex-none md:min-w-[190px]">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
              <select
                className="w-full appearance-none bg-slate-800/50 border border-slate-700/80 rounded-xl py-3 pl-10 pr-8 text-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 hover:bg-slate-800/80 transition-all cursor-pointer"
                value={selectedCategory ?? ''}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) as ServiceCategory : undefined)}
              >
                <option value="">Tüm Kategoriler</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_NAMES[cat]}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"><ChevronIcon /></div>
            </div>

            {/* Sort */}
            <div className="relative group flex-1 md:flex-none md:min-w-[160px]">
              <Grid className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
              <select
                className="w-full appearance-none bg-slate-800/50 border border-slate-700/80 rounded-xl py-3 pl-10 pr-8 text-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 hover:bg-slate-800/80 transition-all cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
              >
                <option value="price">Fiyata Göre</option>
                <option value="rating">Puana Göre</option>
                <option value="distance">Mesafeye Göre</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"><ChevronIcon /></div>
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && services.length > 0 && (
          <p className="text-slate-500 text-sm mb-6 font-medium">
            <span className="text-slate-300 font-semibold">{services.length}</span> hizmet listeleniyor
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 rounded-[2.5rem] border border-dashed border-slate-800/80 backdrop-blur-sm">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">Sonuç Bulunamadı</h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-6">Aramanızla eşleşen hizmet yok. Filtreleri temizleyip tekrar deneyin.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 hover:text-blue-300 font-semibold transition-all text-sm"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseDroneServices;