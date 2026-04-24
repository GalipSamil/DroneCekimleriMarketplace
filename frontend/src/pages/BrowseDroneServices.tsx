import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid } from 'lucide-react';
import { extractApiErrorMessage, listingAPI } from '../services/api';
import type { Listing } from '../types';
import { ServiceCategory } from '../types';
import { ServiceCard } from '../components/services/ServiceCard';
import { CustomRequestModal } from '../components/dashboard/CustomRequestModal';
import { usePreferences } from '../context/preferences';
import { getServiceCategoryLabel } from '../utils/serviceCategory';
import { findTurkishCityByCoordinates, getTurkishCityOptions } from '../utils/turkishCities';

const CATEGORIES = Object.values(ServiceCategory).filter((v): v is ServiceCategory => typeof v === 'number');

type SortKey = 'price' | 'rating';

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
  const { language } = usePreferences();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>();
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('price');
  const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);
  const cityOptions = useMemo(() => getTurkishCityOptions(language), [language]);
  const copy = language === 'tr'
    ? {
      titleLead: 'Drone',
      titleAccent: 'Hizmetleri',
      description: 'Projeniz için en iyi drone pilotlarını keşfedin.',
      searchPlaceholder: 'Hizmet, pilot veya konum ara...',
      allCategories: 'Tüm Kategoriler',
      allCities: 'Tüm Şehirler',
      sortByPrice: 'Fiyata Göre',
      sortByRating: 'Puana Göre',
      loadError: 'Hizmetler yüklenemedi.',
      resultsLabel: 'hizmet listeleniyor',
      customRequestTitle: 'Uygun pilot bulamadın mı?',
      customRequestDescription: 'Talebini bize bırak, en kısa sürede sana geri dönüş yapalım.',
      customRequestButton: 'Özel Talep Oluştur',
      emptyTitle: 'Aradığınız Kriterlerde Pilot Bulunamadı',
      emptyDescriptionLead: 'Sorun değil. Talebini bize ilet,',
      emptyDescriptionAccent: 'en kısa sürede',
      emptyDescriptionTail: 'sana uygun bir pilotla geri dönüş yapalım.',
      clearFilters: 'Filtreleri Temizle',
    }
    : {
      titleLead: 'Drone',
      titleAccent: 'Services',
      description: 'Discover the best drone pilots for your project.',
      searchPlaceholder: 'Search by service, pilot, or location...',
      allCategories: 'All Categories',
      allCities: 'All Cities',
      sortByPrice: 'Sort by Price',
      sortByRating: 'Sort by Rating',
      loadError: 'Failed to load services.',
      resultsLabel: 'services listed',
      customRequestTitle: "Couldn't find a suitable pilot?",
      customRequestDescription: 'Leave your request with us and we will get back to you shortly.',
      customRequestButton: 'Create Custom Request',
      emptyTitle: 'No Pilot Matched Your Search',
      emptyDescriptionLead: 'No problem. Send us your request and',
      emptyDescriptionAccent: 'we will get back to you shortly',
      emptyDescriptionTail: 'with a suitable pilot for your project.',
      clearFilters: 'Clear Filters',
    };

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await listingAPI.search(undefined, selectedCategory);
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
      setServices([]);
      setError(extractApiErrorMessage(err, copy.loadError));
    } finally {
      setLoading(false);
    }
  }, [copy.loadError, selectedCategory]);

  useEffect(() => { loadServices(); }, [loadServices]);

  const displayedServices = useMemo(() => {
    const enrichedServices = services.map((service) => {
      const derivedCity = findTurkishCityByCoordinates(service.pilotLatitude, service.pilotLongitude);
      return {
        ...service,
        pilotLocation: service.pilotLocation || derivedCity?.label[language],
      };
    });

    const query = searchQuery.trim().toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US');
    const searchFiltered = query
      ? enrichedServices.filter((service) => {
        const searchableFields = [
          service.title,
          service.description,
          service.pilotName,
          service.pilotLocation,
        ];

        return searchableFields.some((field) =>
          field?.toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US').includes(query)
        );
      })
      : enrichedServices;

    const cityFiltered = selectedCity
      ? searchFiltered.filter((service) => findTurkishCityByCoordinates(service.pilotLatitude, service.pilotLongitude)?.value === selectedCity)
      : searchFiltered;

    return [...cityFiltered].sort((left, right) => {
      if (sortBy === 'rating') {
        const ratingDiff = right.averageRating - left.averageRating;
        if (ratingDiff !== 0) {
          return ratingDiff;
        }

        const reviewDiff = right.reviewCount - left.reviewCount;
        if (reviewDiff !== 0) {
          return reviewDiff;
        }
      }

      return left.hourlyRate - right.hourlyRate;
    });
  }, [language, searchQuery, selectedCity, services, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
    setSelectedCity('');
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-slate-50">
            {copy.titleLead}{' '}
            <span className="text-blue-500">{copy.titleAccent}</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl">
            {copy.description}
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-xl p-3 mb-8 flex flex-col md:flex-row gap-3 items-stretch md:items-center sticky top-24 z-30 shadow-lg">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder={copy.searchPlaceholder}
              className="w-full bg-slate-800/50 border border-slate-700/80 rounded-xl py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 hover:bg-slate-800/80 transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            {/* Category */}
            <div className="relative group flex-1 md:flex-none md:min-w-[190px]">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
              <select
                className="w-full appearance-none bg-slate-800/50 border border-slate-700/80 rounded-xl py-3 pl-10 pr-8 text-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 hover:bg-slate-800/80 transition-all cursor-pointer"
                value={selectedCategory ?? ''}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) as ServiceCategory : undefined)}
              >
                <option value="">{copy.allCategories}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{getServiceCategoryLabel(cat, language)}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"><ChevronIcon /></div>
            </div>

            <div className="relative group flex-1 md:flex-none md:min-w-[190px]">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
              <select
                className="w-full appearance-none bg-slate-800/50 border border-slate-700/80 rounded-xl py-3 pl-10 pr-8 text-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 hover:bg-slate-800/80 transition-all cursor-pointer"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">{copy.allCities}</option>
                {cityOptions.map((city) => (
                  <option key={city.value} value={city.value}>{city.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"><ChevronIcon /></div>
            </div>

            {/* Sort */}
            <div className="relative group flex-1 md:flex-none md:min-w-[160px]">
              <Grid className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
              <select
                className="w-full appearance-none bg-slate-800/50 border border-slate-700/80 rounded-xl py-3 pl-10 pr-8 text-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 hover:bg-slate-800/80 transition-all cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
              >
                <option value="price">{copy.sortByPrice}</option>
                <option value="rating">{copy.sortByRating}</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"><ChevronIcon /></div>
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && displayedServices.length > 0 && (
          <p className="text-slate-500 text-sm mb-6 font-medium">
            <span className="text-slate-300 font-semibold">{displayedServices.length}</span> {copy.resultsLabel}
          </p>
        )}

        {!loading && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/45 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-50">{copy.customRequestTitle}</p>
              <p className="mt-1 text-sm text-slate-400">{copy.customRequestDescription}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsCustomRequestOpen(true)}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              {copy.customRequestButton}
            </button>
          </div>
        )}

        {!loading && error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayedServices.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/60">
            <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-5 border border-blue-500/15">
              <Search className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-50 mb-2">{copy.emptyTitle}</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-7 text-sm leading-relaxed">
              {copy.emptyDescriptionLead} <span className="text-blue-500 font-medium">{copy.emptyDescriptionAccent}</span> {copy.emptyDescriptionTail}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                onClick={() => setIsCustomRequestOpen(true)}
                className="px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                {copy.customRequestButton}
                </button>
                <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold transition-colors hover:text-white"
                >
                {copy.clearFilters}
                </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>

      <CustomRequestModal 
        isOpen={isCustomRequestOpen} 
        onClose={() => setIsCustomRequestOpen(false)} 
        prefillCategory={selectedCategory}
        prefillLocation={searchQuery}
      />
    </div>
  );
};

export default BrowseDroneServices;
