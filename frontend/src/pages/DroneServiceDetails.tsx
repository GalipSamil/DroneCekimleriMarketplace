import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Camera, Settings, Calendar, ArrowLeft, CheckCircle, AlertCircle, Star, ShieldCheck } from 'lucide-react';
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
      hours: Math.max(1, Math.round(diffTime / (1000 * 60 * 60) * 10) / 10),
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
      alert('Lütfen başlangıç ve bitiş tarihini/saatini seçin.');
      return;
    }
    if (new Date(bookingForm.startDate) >= new Date(bookingForm.endDate)) {
      alert('Bitiş tarihi/saati, başlangıçtan sonra olmalıdır.');
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
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-300">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Hizmet Bulunamadı</h2>
        <button onClick={() => navigate('/browse-services')} className="btn-secondary mt-4 px-6">
          Hizmetlere Dön
        </button>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const nowDateTimeLocal = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow delay-1000"></div>

      {/* Hero Image Section */}
      <div className="relative h-[65vh] w-full bg-[#020617] overflow-hidden">
        {service.coverImageUrl ? (
          <img src={service.coverImageUrl} alt={service.title} className="w-full h-full object-cover scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <Camera size={64} className="text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent"></div>

        <div className="absolute top-28 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/80 text-white hover:bg-slate-800/80 hover:scale-105 transition-all shadow-lg"
            >
              <ArrowLeft size={18} /> Geri Dön
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 py-10 z-20">
          <div className="max-w-7xl mx-auto px-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/80 backdrop-blur-md text-xs font-bold text-white mb-5 shadow-lg shadow-blue-500/20 tracking-wide">
              {getCategoryName(service.category)}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 shadow-black drop-shadow-xl">
              {service.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg ring-2 ring-white/10">
                  {service.pilotName.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-bold text-white md:text-lg">{service.pilotName}</span>
                {service.pilotIsVerified && <CheckCircle size={18} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />}
              </div>
              {service.pilotLocation && (
                <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-800/80">
                  <MapPin size={18} className="text-emerald-400" />
                  <span className="font-medium">{service.pilotLocation}</span>
                </div>
              )}
            </div>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/20 backdrop-blur-md shadow-lg">
                    <Star size={18} className="fill-yellow-500" />
                    <span className="font-bold text-base mt-0.5">4.9</span>
                    <span className="text-yellow-500/80 text-sm ml-1 mt-0.5 font-medium">(24 Değerlendirme)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 backdrop-blur-md shadow-lg">
                    <ShieldCheck size={18} />
                    <span className="font-bold text-sm mt-0.5">100+ Başarılı Uçuş</span>
                </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 lg:-mt-24 relative z-20">
        <div 
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_340px] xl:grid-cols-[minmax(0,2fr)_360px] items-start w-full"
          style={{ gap: '2.5rem' }}
        >
          {/* Main Content */}
          <div className="flex flex-col w-full" style={{ gap: '2.5rem' }}>
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 md:p-10 shadow-2xl relative w-full">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight">Hizmet Açıklaması</h2>
              <p className="text-slate-300 leading-relaxed text-lg font-light whitespace-pre-wrap">
                {service.description}
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 md:p-10 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8 border-b border-slate-700/50 pb-6 tracking-tight">Teknik Detaylar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-start gap-5 py-4 group">
                  <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 shadow-inner border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                    <Settings size={28} />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-lg font-bold text-slate-200">Maksimum Mesafe</h4>
                    <p className="text-slate-400 text-sm mt-1.5 leading-relaxed font-medium">{service.maxDistance} km yarıçapında hizmet verilebilir.</p>
                  </div>
                </div>
                {service.requiredEquipment && (
                  <div className="flex items-start gap-5 py-4 group">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 shadow-inner border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                      <Camera size={28} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-lg font-bold text-slate-200">Ekipmanlar</h4>
                      <p className="text-slate-400 text-sm mt-1.5 leading-relaxed font-medium">{service.requiredEquipment}</p>
                    </div>
                  </div>
                )}
                {service.deliverableFormat && (
                  <div className="flex items-start gap-5 py-4 group">
                    <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-400 shadow-inner border border-violet-500/20 group-hover:bg-violet-500/20 group-hover:scale-110 transition-all duration-300">
                      <Calendar size={28} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-lg font-bold text-slate-200">Teslimat Formatı</h4>
                      <p className="text-slate-400 text-sm mt-1.5 leading-relaxed font-medium">{service.deliverableFormat}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Pricing & Booking */}
          <div className="w-full">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-blue-500/30 rounded-[2rem] p-8 shadow-[0_0_40px_rgba(59,130,246,0.15)] sticky top-28 filter drop-shadow-2xl">
              <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Hemen Rezervasyon Yap</h3>
              <p className="text-slate-400 text-sm mb-8 font-medium">Hizmet bedelleri ve çalışma türleri</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/80 shadow-inner hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg"><Clock className="text-blue-400" size={20} /></div>
                    <span className="text-slate-300 font-medium">Saatlik</span>
                  </div>
                  <span className="font-bold text-white text-lg">{formatPrice(service.hourlyRate)}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/80 shadow-inner hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg"><Calendar className="text-emerald-400" size={20} /></div>
                    <span className="text-slate-300 font-medium">Günlük</span>
                  </div>
                  <span className="font-bold text-white text-lg">{formatPrice(service.dailyRate)}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/80 shadow-inner hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-500/10 rounded-lg"><Settings className="text-violet-400" size={20} /></div>
                    <span className="text-slate-300 font-medium">Proje Bazlı</span>
                  </div>
                  <span className="font-bold text-white text-lg">{formatPrice(service.projectRate)}</span>
                </div>
              </div>

              {isAuthenticated && userId === service.pilotUserId ? (
                  <div className="space-y-4">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                          <p className="text-blue-400 text-sm font-medium flex items-start gap-2">
                               <AlertCircle size={18} className="mt-0.5 min-w-[18px]" /> 
                               Bu kendi ilanınızdır, kendinize rezervasyon yapamazsınız.
                          </p>
                      </div>
                      <button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-4 rounded-xl transition-all shadow-lg" onClick={() => navigate('/pilot/dashboard')}>
                          Pano'ya Dön ve Yönet
                      </button>
                  </div>
              ) : (
                  <button
                    className={`w-full py-4.5 text-lg font-bold rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden ${service.isActive ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30 hover:-translate-y-1 hover:shadow-blue-500/50 ring-1 ring-blue-500/50' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
                    onClick={() => setShowBookingForm(true)}
                    disabled={!service.isActive}
                  >
                    {service.isActive && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />}
                    {service.isActive ? (
                        <>
                            <span className="relative z-10 pt-0.5">Rezervasyon Yap</span>
                            <ArrowLeft size={22} className="relative z-10 rotate-180 group-hover:translate-x-1.5 transition-transform opacity-90" />
                        </>
                    ) : 'Hizmet Aktif Değil'}
                  </button>
              )}
              <p className="text-xs text-center text-slate-500 mt-6 font-medium">
                Rezervasyon işlemi güvenli ödeme altyapısı ile korunmaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="bg-[#020617] border border-slate-800/80 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-blue-900/10 disable-scrollbars">
            <div className="p-8 border-b border-slate-800/80 flex items-center justify-between sticky top-0 bg-[#020617]/90 z-20 backdrop-blur-md">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Rezervasyon Oluştur</h2>
              <button
                className="text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full transition-colors"
                onClick={() => setShowBookingForm(false)}
              >
                <XCircleIcon />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Form Content */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3 ml-1">Rezervasyon Tipi</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { type: BookingType.Hourly, label: 'Saatlik' },
                    { type: BookingType.Daily, label: 'Günlük' },
                    { type: BookingType.Project, label: 'Proje' }
                  ].map(option => (
                    <button
                      key={option.type}
                      onClick={() => setBookingForm({ ...bookingForm, type: option.type })}
                      className={`py-3.5 rounded-xl border transition-all font-bold text-sm tracking-wide ${bookingForm.type === option.type
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                        : 'bg-slate-800/40 border-slate-700/80 text-slate-400 hover:bg-slate-800/80'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300 ml-1">
                    {bookingForm.type === BookingType.Hourly ? 'Başlangıç Tarihi & Saati' : 'Başlangıç Tarihi'}
                  </label>
                  <input
                    type={bookingForm.type === BookingType.Hourly ? 'datetime-local' : 'date'}
                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                    value={bookingForm.startDate || ''}
                    min={bookingForm.type === BookingType.Hourly ? nowDateTimeLocal : today}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, startDate: e.target.value, endDate: '' }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300 ml-1">
                    {bookingForm.type === BookingType.Hourly ? 'Bitiş Tarihi & Saati' : 'Bitiş Tarihi'}
                  </label>
                  <input
                    type={bookingForm.type === BookingType.Hourly ? 'datetime-local' : 'date'}
                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                    value={bookingForm.endDate || ''}
                    min={bookingForm.startDate || (bookingForm.type === BookingType.Hourly ? nowDateTimeLocal : today)}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              {bookingForm.type === BookingType.Hourly && bookingForm.startDate && bookingForm.endDate && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-slate-400 font-medium">
                    Hesaplanan Süre: <span className="text-blue-400 font-bold text-base">{calculatedDuration.hours} saat</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Birim fiyat: {service ? formatPrice(service.hourlyRate) : ''}/saat</p>
                </div>
              )}

              {bookingForm.type === BookingType.Daily && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300 ml-1">Hesaplanan Gün Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-emerald-400 font-bold transition-all focus:outline-none"
                    value={calculatedDuration.days}
                    readOnly
                    title="Tarih aralığından otomatik hesaplandı"
                  />
                </div>
              )}

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-slate-300 ml-1">Çekim Yapılacak Konum *</label>
                <input
                  type="text"
                  placeholder="Çekim yapılacak tam adres veya ilçe..."
                  className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                  value={bookingForm.location || ''}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-slate-300 ml-1">Ek Notlar (İsteğe bağlı)</label>
                <textarea
                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60 resize-none min-h-[120px]"
                    placeholder="Örn: Çekim yapılacak alanın girişinde güvenlik noktası var."
                    rows={3}
                    value={bookingForm.customerNotes || ''}
                    onChange={(e) => setBookingForm(prev => ({...prev, customerNotes: e.target.value}))}
                />
              </div>
            </div>

            <div className="bg-slate-900/60 p-6 mx-8 mb-8 rounded-2xl border border-slate-800 flex justify-between items-center shadow-inner">
              <span className="text-slate-300 font-bold tracking-wide">Toplam Tutar</span>
              <span className="text-3xl font-extrabold text-white flex items-center gap-2">
                  {bookingForm.type === BookingType.Project && service.projectRate === 0
                      ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-2xl">Teklif Alınacak</span>
                      : <span>₺{calculateTotalPrice().toLocaleString()}</span>
                  }
              </span>
            </div>

            <div className="p-8 border-t border-slate-800/80 flex flex-col md:flex-row gap-4 bg-slate-900/40 rounded-b-[2.5rem]">
              <button
                onClick={() => setShowBookingForm(false)}
                className="w-full md:flex-1 py-4 font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors border border-slate-700"
              >
                İptal
              </button>
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full md:flex-1 py-4 font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
              >
                {bookingLoading ? 'İşleniyor...' : 'Rezervasyonu Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .disable-scrollbars::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .disable-scrollbars {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
);

export default DroneServiceDetails;