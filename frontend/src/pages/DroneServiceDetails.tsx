import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Camera, Settings, Calendar, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { listingAPI, bookingAPI } from '../services/api';
import type { Listing, CreateBookingDto } from '../types';
import { BookingType, ServiceCategory } from '../types';
import { useAuth } from '../context/AuthContext';

const DroneServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuth();

  const [service, setService] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState<Partial<CreateBookingDto>>({
    startDate: '',
    endDate: '',
    type: BookingType.Hourly,
    location: '',
    customerNotes: ''
  });

  const loadService = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listingAPI.getById(id!);
      setService(data);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id, loadService]);

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

  const calculatedDuration = (() => {
    if (!bookingForm.startDate || !bookingForm.endDate) return { hours: 1, days: 1 };
    const start = new Date(bookingForm.startDate);
    const end = new Date(bookingForm.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return { hours: 1, days: 1 };
    }
    const diffTime = end.getTime() - start.getTime();
    return {
      hours: Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60))),
      days: Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    };
  })();

  const calculateTotalPrice = (): number => {
    if (!service) return 0;

    switch (bookingForm.type) {
      case BookingType.Hourly:
        return service.hourlyRate * calculatedDuration.hours;
      case BookingType.Daily:
        return service.dailyRate * calculatedDuration.days;
      case BookingType.Project:
        return service.projectRate;
      default:
        return 0;
    }
  };

  const handleBooking = async () => {
    if (!service || !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!bookingForm.startDate || !bookingForm.endDate) {
      alert('Lütfen başlangıç ve bitiş tarihlerini seçin.');
      return;
    }

    if (!bookingForm.location || !bookingForm.location.trim()) {
      alert('Lütfen çekim yapılacak konumu belirtiniz.');
      return;
    }

    try {
      setBookingLoading(true);

      const booking: CreateBookingDto = {
        listingId: service.id,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        type: bookingForm.type as BookingType,
        location: bookingForm.location,
        latitude: bookingForm.latitude || 0, // Default to 0 if not set
        longitude: bookingForm.longitude || 0, // Default to 0 if not set
        hours: calculatedDuration.hours,
        days: calculatedDuration.days,
        customerNotes: bookingForm.customerNotes || ''
      };

      await bookingAPI.create(booking);
      alert('Rezervasyon talebiniz başarıyla gönderildi!');
      setShowBookingForm(false);
      navigate('/customer/dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Rezervasyon oluşturulurken bir hata oluştu.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Hizmet Bulunamadı</h2>
        <button onClick={() => navigate('/browse-services')} className="btn-secondary mt-4">
          Hizmetlere Dön
        </button>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
      {/* Background Ambience */}
      <div className="fixed top-20 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Hero Image Section */}
      <div className="relative h-[60vh] w-full bg-slate-900 overflow-hidden">
        {service.coverImageUrl ? (
          <img src={service.coverImageUrl} alt={service.title} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <Camera size={64} className="text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        <div className="absolute top-24 left-4 md:left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700 text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={18} /> Geri Dön
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12 z-20">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-xs font-bold text-white mb-4">
              {getCategoryName(service.category)}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4 shadow-black drop-shadow-lg">
              {service.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {service.pilotName.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-medium text-white">{service.pilotName}</span>
                {service.pilotIsVerified && <CheckCircle size={16} className="text-blue-400" />}
              </div>
              {service.pilotLocation && (
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-slate-400" />
                  <span>{service.pilotLocation}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Hizmet Açıklaması</h2>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                {service.description}
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-8 border-b border-slate-700/50 pb-4">Teknik Detaylar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex items-start gap-5 py-6">
                  <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400 shadow-inner border border-blue-500/20">
                    <Settings size={28} />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-lg font-bold text-slate-200">Maksimum Mesafe</h4>
                    <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{service.maxDistance} km yarıçapında hizmet verilebilir.</p>
                  </div>
                </div>
                {service.requiredEquipment && (
                  <div className="flex items-start gap-5 py-6">
                    <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 shadow-inner border border-emerald-500/20">
                      <Camera size={28} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-lg font-bold text-slate-200">Ekipmanlar</h4>
                      <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{service.requiredEquipment}</p>
                    </div>
                  </div>
                )}
                {service.deliverableFormat && (
                  <div className="flex items-start gap-5 py-6">
                    <div className="p-4 rounded-xl bg-violet-500/10 text-violet-400 shadow-inner border border-violet-500/20">
                      <Calendar size={28} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-lg font-bold text-slate-200">Teslimat Formatı</h4>
                      <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{service.deliverableFormat}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Pricing & Booking */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">Fiyatlandırma</h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Clock className="text-blue-400" size={20} />
                    <span className="text-slate-300">Saatlik</span>
                  </div>
                  <span className="font-bold text-white">{formatPrice(service.hourlyRate)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-emerald-400" size={20} />
                    <span className="text-slate-300">Günlük</span>
                  </div>
                  <span className="font-bold text-white">{formatPrice(service.dailyRate)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Settings className="text-violet-400" size={20} />
                    <span className="text-slate-300">Proje Bazlı</span>
                  </div>
                  <span className="font-bold text-white">{formatPrice(service.projectRate)}</span>
                </div>
              </div>

              {isAuthenticated && userId === service.pilotUserId ? (
                  <div className="space-y-4">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                          <p className="text-blue-400 text-sm font-medium flex items-start gap-2">
                               <AlertCircle size={16} className="mt-0.5 min-w-[16px]" /> 
                               Bu kendi ilanınızdır, kendinize rezervasyon yapamazsınız.
                          </p>
                      </div>
                      <button className="w-full btn-secondary py-4 text-lg font-bold" onClick={() => navigate('/pilot/dashboard')}>
                          Pano'ya Dön ve Yönet
                      </button>
                  </div>
              ) : (
                  <button
                    className="w-full btn-primary py-4 text-lg font-bold shadow-lg shadow-blue-500/20"
                    onClick={() => setShowBookingForm(true)}
                    disabled={!service.isActive}
                  >
                    {service.isActive ? 'Rezervasyon Yap' : 'Hizmet Aktif Değil'}
                  </button>
              )}
              <p className="text-xs text-center text-slate-500 mt-4">
                Rezervasyon işlemi güvenli ödeme altyapısı ile korunmaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900/90 z-10 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white">Rezervasyon Oluştur</h2>
              <button
                className="text-slate-400 hover:text-white transition-colors"
                onClick={() => setShowBookingForm(false)}
              >
                <XCircleIcon />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Form Content */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Rezervasyon Tipi</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { type: BookingType.Hourly, label: 'Saatlik' },
                    { type: BookingType.Daily, label: 'Günlük' },
                    { type: BookingType.Project, label: 'Proje' }
                  ].map(option => (
                    <button
                      key={option.type}
                      onClick={() => setBookingForm({ ...bookingForm, type: option.type })}
                      className={`py-3 rounded-xl border transition-all font-medium ${bookingForm.type === option.type
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Başlangıç Tarihi</label>
                            <input
                                type="date"
                                className="input-field"
                                value={bookingForm.startDate}
                                min={today}
                                onChange={(e) => setBookingForm(prev => ({...prev, startDate: e.target.value}))}
                            />          </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Bitiş Tarihi</label>
                            <input
                                type="date"
                                className="input-field"
                                value={bookingForm.endDate}
                                min={bookingForm.startDate || today}
                                onChange={(e) => setBookingForm(prev => ({...prev, endDate: e.target.value}))}
                            />          </div>
              </div>

              {bookingForm.type === BookingType.Hourly && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Hesaplanan Saat Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    className="input-field bg-slate-800/80 text-blue-400 font-bold"
                    value={calculatedDuration.hours}
                    readOnly
                    title="Tarih aralığından otomatik hesaplandı"
                  />
                </div>
              )}

              {bookingForm.type === BookingType.Daily && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Hesaplanan Gün Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    className="input-field bg-slate-800/80 text-emerald-400 font-bold"
                    value={calculatedDuration.days}
                    readOnly
                    title="Tarih aralığından otomatik hesaplandı"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Çekim Yapılacak Konum *</label>
                <input
                  type="text"
                  placeholder="Çekim yapılacak tam adres veya ilçe..."
                  className="input-field"
                  value={bookingForm.location || ''}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Ek Notlar (İsteğe bağlı)</label>
                <textarea
                    className="input-field min-h-[100px]"
                    placeholder="Örn: Çekim yapılacak alanın girişinde güvenlik noktası var."
                    rows={3}
                    value={bookingForm.customerNotes || ''}
                    onChange={(e) => setBookingForm(prev => ({...prev, customerNotes: e.target.value}))}
                />
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 mx-6 mb-6 rounded-xl border border-slate-700 flex justify-between items-center">
              <span className="text-slate-300 font-medium">Toplam Tutar</span>
              <span className="text-2xl font-bold text-white flex items-center gap-2">
                  {bookingForm.type === BookingType.Project && service.projectRate === 0
                      ? <span className="text-gradient">Teklif Alınacak</span>
                      : <span>₺{calculateTotalPrice().toLocaleString()}</span>
                  }
              </span>
            </div>

            <div className="p-6 border-t border-slate-700 flex gap-4 bg-slate-900/50 rounded-b-2xl">
              <button
                onClick={() => setShowBookingForm(false)}
                className="flex-1 btn-secondary"
              >
                İptal
              </button>
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="flex-1 btn-primary"
              >
                {bookingLoading ? 'İşleniyor...' : 'Rezervasyonu Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
);

export default DroneServiceDetails;