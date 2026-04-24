import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Camera, Settings, Calendar, ArrowLeft, CheckCircle, AlertCircle, Star, ShieldCheck, UserCircle2 } from 'lucide-react';
import { listingAPI, bookingAPI, reviewAPI, extractApiErrorMessage } from '../services/api';
import type { Listing, CreateBookingDto, Review } from '../types';
import { BookingType } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/preferences';
import { formatTryCurrency, getLocaleForLanguage, getServiceCategoryLabel } from '../utils/serviceCategory';
import { buildPilotProfilePath, buildServicePath, isExpectedSlug } from '../utils/seoPaths';
import Seo from '../components/seo/Seo';
import { buildBreadcrumbSchema, toAbsoluteAssetUrl, toAbsoluteUrl, trimMetaDescription } from '../config/seo';

const padDateSegment = (value: number) => value.toString().padStart(2, '0');

const parseBookingDateValue = (value?: string) => {
  if (!value) {
    return null;
  }

  const [datePart, timePart] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);

  if (![year, month, day].every(Number.isFinite)) {
    return null;
  }

  const [hours = 0, minutes = 0] = timePart
    ? timePart.split(':').map(Number)
    : [0, 0];

  const parsed = new Date(year, month - 1, day, hours, minutes);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateInputValue = (value: Date) => (
  `${value.getFullYear()}-${padDateSegment(value.getMonth() + 1)}-${padDateSegment(value.getDate())}`
);

const formatDateTimeInputValue = (value: Date) => (
  `${formatDateInputValue(value)}T${padDateSegment(value.getHours())}:${padDateSegment(value.getMinutes())}`
);

const normalizeBookingInputValue = (value: string | undefined, bookingType: BookingType) => {
  const parsed = parseBookingDateValue(value);

  if (!parsed) {
    return '';
  }

  return bookingType === BookingType.Hourly
    ? formatDateTimeInputValue(parsed)
    : formatDateInputValue(parsed);
};

const toBookingApiDateValue = (value?: string) => {
  const parsed = parseBookingDateValue(value);
  return parsed ? parsed.toISOString() : '';
};

const calculateBookingDuration = (startDateValue?: string, endDateValue?: string) => {
  if (!startDateValue || !endDateValue) {
    return { hours: null, days: null, hasCompleteRange: false, isValid: false };
  }

  const startDate = parseBookingDateValue(startDateValue);
  const endDate = parseBookingDateValue(endDateValue);

  if (!startDate || !endDate) {
    return { hours: null, days: null, hasCompleteRange: true, isValid: false };
  }

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate >= endDate) {
    return { hours: null, days: null, hasCompleteRange: true, isValid: false };
  }

  const diffTime = endDate.getTime() - startDate.getTime();

  return {
    hours: Math.max(1, Math.round(diffTime / (1000 * 60 * 60) * 10) / 10),
    days: Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))),
    hasCompleteRange: true,
    isValid: true
  };
};

const formatBookingRangePreview = (
  startDate: Date | null,
  endDate: Date | null,
  bookingType: BookingType,
  locale: string
) => {
  if (!startDate || !endDate || startDate >= endDate) {
    return '';
  }

  const formatter = new Intl.DateTimeFormat(
    locale,
    bookingType === BookingType.Hourly
      ? { dateStyle: 'long', timeStyle: 'short' }
      : { dateStyle: 'long' }
  );

  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
};

const DroneServiceDetails: React.FC = () => {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuth();
  const { language, theme } = usePreferences();
  const isLight = theme === 'light';
  const locale = getLocaleForLanguage(language);
  const copy = language === 'tr'
    ? {
        loadServiceError: 'Hizmet detayları yüklenirken bir hata oluştu.',
        chooseDates: 'Lütfen başlangıç ve bitiş tarihini/saatini seçin.',
        chooseValidDates: 'Lütfen geçerli bir başlangıç ve bitiş tarihi seçin.',
        pastStart: 'Başlangıç tarihi geçmiş bir zaman olamaz. Lütfen ileri bir tarih seçin.',
        endAfterStart: 'Bitiş tarihi/saati, başlangıçtan sonra olmalıdır.',
        chooseLocation: 'Lütfen çekim yapılacak konumu belirtiniz.',
        hourlyLimit: 'Saatlik rezervasyon en fazla 240 saat olabilir. Daha uzun işler için günlük veya proje seçin.',
        bookingSuccess: 'Rezervasyon talebiniz başarıyla gönderildi!',
        bookingError: 'Rezervasyon oluşturulurken bir hata oluştu.',
        notFoundTitle: 'Hizmet Bulunamadı',
        backToServices: 'Hizmetlere Dön',
        fixedProjectBudget: 'Sabit proje bütçesi',
        askPilot: 'Pilota Sor',
        back: 'Geri Dön',
        reviewsCount: (count: number) => `(${count} Değerlendirme)`,
        successfulFlights: '100+ Başarılı Uçuş',
        serviceDescription: 'Hizmet Açıklaması',
        technicalDetails: 'Teknik Detaylar',
        maxDistance: 'Maksimum Mesafe',
        maxDistanceText: (distance: number) => `${distance} km yarıçapında hizmet verilebilir.`,
        equipment: 'Ekipmanlar',
        deliverableFormat: 'Teslimat Formatı',
        pilotReviews: 'Pilot Değerlendirmeleri',
        reviewsAbout: (pilotName: string) => `${pilotName} hakkında yapılan yorumlar.`,
        noReviewsForPilot: 'Bu pilot için henüz yorum yapılmamış.',
        noReviewsYet: 'Henüz Değerlendirme Yok',
        noReviewsDescription: 'İlk hizmeti tamamladıktan sonra müşterilerin yapacağı yorumlar burada görünecektir.',
        bookNow: 'Hemen Rezervasyon Yap',
        pricingSubtitle: 'Hizmet bedelleri ve çalışma türleri',
        hourly: 'Saatlik',
        daily: 'Günlük',
        project: 'Proje',
        projectBased: 'Proje Bazlı',
        ownListing: 'Bu kendi ilanınızdır, kendinize rezervasyon yapamazsınız.',
        returnManage: "Pano'ya Dön ve Yönet",
        book: 'Rezervasyon Yap',
        inactiveService: 'Hizmet Aktif Değil',
        securePayment: 'Platform, rezervasyon talebinizi ilgili pilota iletmek için teknik altyapı sağlar.',
        createBooking: 'Rezervasyon Oluştur',
        bookingType: 'Rezervasyon Tipi',
        startDateTime: 'Başlangıç Tarihi & Saati',
        startDate: 'Başlangıç Tarihi',
        endDateTime: 'Bitiş Tarihi & Saati',
        endDate: 'Bitiş Tarihi',
        selectedRange: 'Seçilen aralık:',
        invalidRangeMessage: 'Bitiş tarihi/saati başlangıçtan sonra olmalıdır.',
        calculatedDuration: 'Hesaplanan Süre:',
        hours: 'saat',
        unitPrice: 'Birim fiyat:',
        daysCount: 'Hesaplanan Gün Sayısı',
        dateRangeCalculated: 'Tarih aralığından otomatik hesaplandı',
        shootLocation: 'Çekim Yapılacak Konum *',
        shootLocationPlaceholder: 'Çekim yapılacak tam adres veya ilçe...',
        extraNotes: 'Ek Notlar (İsteğe bağlı)',
        notesPlaceholder: 'Örn: Çekim yapılacak alanın girişinde güvenlik noktası var.',
        total: 'Toplam Tutar',
        totalPending: 'Geçerli tarih aralığı seçin',
        cancel: 'İptal',
        processing: 'İşleniyor...',
        confirmBooking: 'Rezervasyonu Onayla',
      }
    : {
        loadServiceError: 'An error occurred while loading the service details.',
        chooseDates: 'Please select a start and end date/time.',
        chooseValidDates: 'Please select a valid start and end date.',
        pastStart: 'The start date cannot be in the past. Please choose a future date.',
        endAfterStart: 'The end date/time must be after the start.',
        chooseLocation: 'Please specify the shooting location.',
        hourlyLimit: 'Hourly bookings can be at most 240 hours. For longer jobs choose daily or project pricing.',
        bookingSuccess: 'Your booking request has been submitted successfully!',
        bookingError: 'An error occurred while creating the booking.',
        notFoundTitle: 'Service Not Found',
        backToServices: 'Back to Services',
        fixedProjectBudget: 'Fixed project budget',
        askPilot: 'Ask the Pilot',
        back: 'Go Back',
        reviewsCount: (count: number) => `(${count} Reviews)`,
        successfulFlights: '100+ Successful Flights',
        serviceDescription: 'Service Description',
        technicalDetails: 'Technical Details',
        maxDistance: 'Maximum Range',
        maxDistanceText: (distance: number) => `Service available within a ${distance} km radius.`,
        equipment: 'Equipment',
        deliverableFormat: 'Delivery Format',
        pilotReviews: 'Pilot Reviews',
        reviewsAbout: (pilotName: string) => `Reviews about ${pilotName}.`,
        noReviewsForPilot: 'There are no reviews for this pilot yet.',
        noReviewsYet: 'No Reviews Yet',
        noReviewsDescription: 'Customer reviews will appear here after the first completed service.',
        bookNow: 'Book Now',
        pricingSubtitle: 'Service fees and work types',
        hourly: 'Hourly',
        daily: 'Daily',
        project: 'Project',
        projectBased: 'Project Based',
        ownListing: 'This is your own listing. You cannot make a booking for yourself.',
        returnManage: 'Return to Dashboard',
        book: 'Book Service',
        inactiveService: 'Service Inactive',
        securePayment: 'The platform provides technical infrastructure to transmit your booking request to the relevant pilot.',
        createBooking: 'Create Booking',
        bookingType: 'Booking Type',
        startDateTime: 'Start Date & Time',
        startDate: 'Start Date',
        endDateTime: 'End Date & Time',
        endDate: 'End Date',
        selectedRange: 'Selected range:',
        invalidRangeMessage: 'The end date/time must be after the start date/time.',
        calculatedDuration: 'Calculated Duration:',
        hours: 'hours',
        unitPrice: 'Unit price:',
        daysCount: 'Calculated Number of Days',
        dateRangeCalculated: 'Automatically calculated from the selected date range',
        shootLocation: 'Shooting Location *',
        shootLocationPlaceholder: 'Full address or district for the shoot...',
        extraNotes: 'Additional Notes (Optional)',
        notesPlaceholder: 'Example: There is a security checkpoint at the entrance of the shooting area.',
        total: 'Total Amount',
        totalPending: 'Select a valid date range',
        cancel: 'Cancel',
        processing: 'Processing...',
        confirmBooking: 'Confirm Booking',
      };

  const [service, setService] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
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
      
      // Load reviews separately
      if (data && data.pilotId) {
          setReviewsLoading(true);
          try {
              const reviewsData = await reviewAPI.getByPilot(data.pilotId);
              setReviews(reviewsData);
          } catch (rErr) {
              console.error('Error loading reviews:', rErr);
          } finally {
              setReviewsLoading(false);
          }
      }
    } catch (error) {
      console.error('Error loading service:', error);
      alert(extractApiErrorMessage(error, copy.loadServiceError));
    } finally {
      setLoading(false);
    }
  }, [copy.loadServiceError, id]);

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id, loadService]);

  useEffect(() => {
    if (!service) {
      return;
    }

    if (isExpectedSlug(slug, service.title)) {
      return;
    }

    navigate(buildServicePath({ id: service.id, title: service.title }), { replace: true });
  }, [navigate, service, slug]);

  const calculatedDuration = calculateBookingDuration(bookingForm.startDate, bookingForm.endDate);

  const calculateTotalPrice = (): number => {
    if (!service) return 0;

    switch (bookingForm.type) {
      case BookingType.Hourly:
        return calculatedDuration.isValid && calculatedDuration.hours !== null
          ? service.hourlyRate * calculatedDuration.hours
          : 0;
      case BookingType.Daily:
        return calculatedDuration.isValid && calculatedDuration.days !== null
          ? service.dailyRate * calculatedDuration.days
          : 0;
      case BookingType.Project:
        return service.projectRate;
      default:
        return 0;
    }
  };

  const handleBookingTypeChange = (type: BookingType) => {
    setBookingForm(prev => ({
      ...prev,
      type,
      startDate: normalizeBookingInputValue(prev.startDate, type),
      endDate: normalizeBookingInputValue(prev.endDate, type)
    }));
  };

  const handleBooking = async () => {
    if (!service || !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!bookingForm.startDate || !bookingForm.endDate) {
      alert(copy.chooseDates);
      return;
    }

    const startDateObj = parseBookingDateValue(bookingForm.startDate);
    const endDateObj = parseBookingDateValue(bookingForm.endDate);
    const nowObj = new Date();

    if (!startDateObj || !endDateObj) {
      alert(copy.chooseValidDates);
      return;
    }

    // If it's a daily/project booking (no time selected), only compare the date part
    if (bookingForm.type !== BookingType.Hourly) {
        nowObj.setHours(0, 0, 0, 0);
        startDateObj.setHours(0, 0, 0, 0);
    }

    if (startDateObj < nowObj) {
        alert(copy.pastStart);
        return;
    }

    if (startDateObj >= endDateObj) {
      alert(copy.endAfterStart);
      return;
    }

    if (!bookingForm.location || !bookingForm.location.trim()) {
      alert(copy.chooseLocation);
      return;
    }

    if (bookingForm.type === BookingType.Hourly && calculatedDuration.hours !== null && calculatedDuration.hours > 240) {
      alert(copy.hourlyLimit);
      return;
    }

    try {
      setBookingLoading(true);

      const bookingType = bookingForm.type as BookingType;

      const booking: CreateBookingDto = {
        listingId: service.id,
        startDate: toBookingApiDateValue(bookingForm.startDate),
        endDate: toBookingApiDateValue(bookingForm.endDate),
        type: bookingType,
        location: bookingForm.location,
        latitude: bookingForm.latitude || 0, // Default to 0 if not set
        longitude: bookingForm.longitude || 0, // Default to 0 if not set
        hours: bookingType === BookingType.Hourly ? calculatedDuration.hours ?? 0 : 0,
        days: bookingType === BookingType.Daily ? calculatedDuration.days ?? 0 : 0,
        customerNotes: bookingForm.customerNotes || ''
      };

      await bookingAPI.create(booking);
      alert(copy.bookingSuccess);
      setShowBookingForm(false);
      navigate('/customer/dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(extractApiErrorMessage(error, copy.bookingError));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-slate-50' : 'bg-[#020617]'}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-slate-300 ${isLight ? 'bg-slate-50' : 'bg-[#020617]'}`}>
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">{copy.notFoundTitle}</h2>
        <button onClick={() => navigate('/browse-services')} className="btn-secondary mt-4 px-6">
          {copy.backToServices}
        </button>
      </div>
    );
  }

  const projectPricing = service.projectRate > 0
    ? {
        price: formatTryCurrency(service.projectRate, language),
        subtitle: copy.fixedProjectBudget
      }
    : {
        price: null,
        subtitle: copy.askPilot
      };

  const activeBookingType = bookingForm.type ?? BookingType.Hourly;
  const today = formatDateInputValue(new Date());
  const nowDateTimeLocal = formatDateTimeInputValue(new Date());
  const normalizedStartDate = normalizeBookingInputValue(bookingForm.startDate, activeBookingType);
  const normalizedEndDate = normalizeBookingInputValue(bookingForm.endDate, activeBookingType);
  const parsedStartDate = parseBookingDateValue(normalizedStartDate);
  const parsedEndDate = parseBookingDateValue(normalizedEndDate);
  const bookingRangePreview = formatBookingRangePreview(
    parsedStartDate,
    parsedEndDate,
    activeBookingType,
    locale
  );
  const hasInvalidSelectedRange = calculatedDuration.hasCompleteRange && !calculatedDuration.isValid;
  const heroOverlayClass = isLight
    ? 'bg-gradient-to-b from-slate-950/8 via-slate-950/12 to-slate-950/52'
    : 'bg-gradient-to-b from-slate-950/14 via-slate-950/18 to-slate-950/62';
  const heroBottomVeilClass = isLight
    ? 'bg-gradient-to-t from-slate-950/84 via-slate-950/52 to-transparent'
    : 'bg-gradient-to-t from-slate-950/90 via-slate-950/62 to-transparent';
  const heroContentShellClass = isLight
    ? 'bg-slate-950/42 border-white/14 shadow-[0_24px_72px_rgba(15,23,42,0.28)]'
    : 'bg-slate-950/40 border-white/10 shadow-[0_24px_72px_rgba(2,6,23,0.4)]';
  const heroSurfaceClass = isLight
    ? 'bg-slate-950/26 border-white/14'
    : 'bg-slate-950/34 border-white/10';
  const heroMutedTextClass = isLight ? 'text-slate-100/82' : 'text-slate-200/82';
  const sectionCardClass = isLight
    ? 'bg-slate-900/52 border-white/[0.08] shadow-[0_28px_70px_-42px_rgba(15,23,42,0.48)]'
    : 'bg-slate-900/48 border-white/[0.06] shadow-[0_28px_70px_-42px_rgba(2,6,23,0.62)]';
  const sidebarCardClass = isLight
    ? 'bg-slate-900/64 border-blue-400/20 shadow-[0_24px_60px_-36px_rgba(59,130,246,0.3)]'
    : 'bg-slate-900/70 border-blue-500/22 shadow-[0_24px_60px_-36px_rgba(37,99,235,0.32)]';
  const pricingRowClass = isLight
    ? 'bg-white/[0.05] border-white/[0.08] hover:bg-white/[0.075]'
    : 'bg-white/[0.035] border-white/[0.08] hover:bg-white/[0.06]';
  const serviceCategoryLabel = getServiceCategoryLabel(service.category, language);
  const serviceLocation = service.pilotLocation?.trim();
  const servicePath = buildServicePath({ id: service.id, title: service.title });
  const pilotProfilePath = buildPilotProfilePath({ userId: service.pilotUserId, fullName: service.pilotName });
  const seoDescription = language === 'tr'
    ? trimMetaDescription(`${service.title}. ${service.description} ${serviceLocation ? `${serviceLocation} bolgesinde hizmet verir.` : ''}`)
    : trimMetaDescription(`${service.title}. ${service.description} ${serviceLocation ? `Available around ${serviceLocation}.` : ''}`);
  const seoTitle = language === 'tr'
    ? `${service.title} - Drone hizmeti`
    : `${service.title} - Drone service`;
  const serviceImageUrl = toAbsoluteAssetUrl(service.coverImageUrl);
  const serviceOffers = [
    service.hourlyRate > 0
      ? {
          '@type': 'Offer',
          name: language === 'tr' ? 'Saatlik hizmet' : 'Hourly service',
          price: service.hourlyRate,
          priceCurrency: 'TRY',
          availability: 'https://schema.org/InStock',
          url: toAbsoluteUrl(servicePath),
        }
      : null,
    service.dailyRate > 0
      ? {
          '@type': 'Offer',
          name: language === 'tr' ? 'Gunluk hizmet' : 'Daily service',
          price: service.dailyRate,
          priceCurrency: 'TRY',
          availability: 'https://schema.org/InStock',
          url: toAbsoluteUrl(servicePath),
        }
      : null,
    service.projectRate > 0
      ? {
          '@type': 'Offer',
          name: language === 'tr' ? 'Proje bazli hizmet' : 'Project service',
          price: service.projectRate,
          priceCurrency: 'TRY',
          availability: 'https://schema.org/InStock',
          url: toAbsoluteUrl(servicePath),
        }
      : null,
  ].filter(Boolean);
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: seoDescription,
    serviceType: serviceCategoryLabel,
    url: toAbsoluteUrl(servicePath),
    image: serviceImageUrl ? [serviceImageUrl] : undefined,
    provider: {
      '@type': 'Person',
      name: service.pilotName,
      url: toAbsoluteUrl(pilotProfilePath),
    },
    areaServed: serviceLocation
      ? {
          '@type': 'AdministrativeArea',
          name: serviceLocation,
        }
      : undefined,
    offers: serviceOffers.length > 0 ? serviceOffers : undefined,
    aggregateRating: service.reviewCount > 0 && service.averageRating > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: Number(service.averageRating.toFixed(1)),
          reviewCount: service.reviewCount,
        }
      : undefined,
  };
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'DronePazar', path: '/' },
    { name: language === 'tr' ? 'Hizmetler' : 'Services', path: '/browse-services' },
    { name: service.title, path: servicePath },
  ]);

  return (
    <div className={`min-h-screen text-slate-200 pb-20 relative overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-[#020617]'}`}>
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={servicePath}
        type="article"
        image={service.coverImageUrl}
        imageAlt={service.title}
        schema={[serviceSchema, breadcrumbSchema]}
      />
      {/* Hero Image Section */}
      <div className={`relative h-[65vh] w-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#020617]'}`}>
        {service.coverImageUrl ? (
          <img src={service.coverImageUrl} alt={service.title} className="w-full h-full object-cover scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <Camera size={64} className="text-slate-600" />
          </div>
        )}
        <div className={`absolute inset-0 ${heroOverlayClass}`}></div>
        <div className={`absolute inset-x-0 bottom-0 h-[72%] ${heroBottomVeilClass}`}></div>

        <div className="absolute left-0 right-0 top-24 z-20 md:top-28">
          <div className="max-w-7xl mx-auto px-6">
            <button
              onClick={() => navigate(-1)}
              className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-white backdrop-blur-md transition-all hover:scale-[1.02] shadow-lg ${heroSurfaceClass} ${isLight ? 'hover:bg-slate-950/30' : 'hover:bg-slate-950/44'}`}
            >
              <ArrowLeft size={18} /> {copy.back}
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 py-8 md:py-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className={`relative max-w-[52rem] overflow-hidden rounded-[1.75rem] border px-5 py-5 backdrop-blur-lg md:px-7 md:py-6 lg:px-8 lg:py-7 ${heroContentShellClass}`}>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-white/0 to-transparent"></div>
              <div className="relative">
                <span className="mb-4 inline-flex max-w-full items-center rounded-full border border-white/16 bg-blue-500/82 px-3.5 py-1.5 text-[0.7rem] font-semibold leading-5 tracking-wide text-white shadow-md shadow-blue-500/20 backdrop-blur-md">
                  {serviceCategoryLabel}
                </span>
                <h1 className="mb-4 max-w-4xl break-words text-4xl font-bold leading-[0.95] tracking-tight text-white md:text-5xl lg:text-6xl">
                  {service.title}
                </h1>
                <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${heroMutedTextClass}`}>
                  <div className="flex min-w-0 flex-wrap items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md ring-2 ring-white/15">
                      {service.pilotName.substring(0, 2).toUpperCase()}
                    </div>
                    <Link
                      to={pilotProfilePath}
                      className="inline-flex max-w-full items-center gap-2 break-words font-bold text-white transition-colors hover:text-blue-300 md:text-lg"
                    >
                      <span className="truncate">{service.pilotName}</span>
                      {service.pilotIsVerified && <CheckCircle size={18} className="text-blue-300" />}
                    </Link>
                  </div>
                  {service.pilotLocation && (
                    <div className={`flex min-h-[42px] max-w-full items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-sm ${heroSurfaceClass}`}>
                      <MapPin size={18} className="shrink-0 text-emerald-300" />
                      <span className="break-words font-medium text-slate-50">{service.pilotLocation}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {service.averageRating > 0 && (
                    <div className={`flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 backdrop-blur-sm shadow-md ${heroSurfaceClass}`}>
                      <Star size={18} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-base text-white">{service.averageRating.toFixed(1)}</span>
                      <span className="ml-1 text-sm font-medium text-slate-200/82">{copy.reviewsCount(service.reviewCount)}</span>
                    </div>
                  )}
                  <div className={`flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 backdrop-blur-sm shadow-md ${heroSurfaceClass}`}>
                    <ShieldCheck size={18} className="text-emerald-300" />
                    <span className="font-bold text-sm text-slate-50">{copy.successfulFlights}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 lg:-mt-16 relative z-20">
        <div 
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_340px] xl:grid-cols-[minmax(0,2fr)_360px] items-start w-full"
          style={{ gap: '2rem' }}
        >
          {/* Main Content */}
          <div className="flex flex-col w-full" style={{ gap: '1.75rem' }}>
            <div className={`relative w-full rounded-[1.75rem] border p-6 shadow-2xl backdrop-blur-lg md:p-7 ${sectionCardClass}`}>
              <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">{copy.serviceDescription}</h2>
              <p className="whitespace-pre-wrap text-[1.02rem] font-normal leading-8 text-slate-300">
                {service.description}
              </p>
            </div>

            <div className={`rounded-[1.75rem] border p-6 shadow-2xl backdrop-blur-lg md:p-7 ${sectionCardClass}`}>
              <h2 className="mb-6 border-b border-slate-700/45 pb-5 text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">{copy.technicalDetails}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="group flex items-start gap-4 py-3">
                  <div className="rounded-2xl border border-blue-500/15 bg-blue-600/10 p-3.5 text-blue-500 shadow-inner transition-colors duration-300">
                    <Settings size={28} />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-lg font-bold text-slate-200">{copy.maxDistance}</h4>
                    <p className="text-slate-400 text-sm mt-1.5 leading-relaxed font-medium">{copy.maxDistanceText(service.maxDistance)}</p>
                  </div>
                </div>
                {service.requiredEquipment && (
                  <div className="group flex items-start gap-4 py-3">
                    <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-3.5 text-emerald-400 shadow-inner transition-colors duration-300">
                      <Camera size={28} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-lg font-bold text-slate-200">{copy.equipment}</h4>
                      <p className="text-slate-400 text-sm mt-1.5 leading-relaxed font-medium">{service.requiredEquipment}</p>
                    </div>
                  </div>
                )}
                {service.deliverableFormat && (
                  <div className="group flex items-start gap-4 py-3">
                    <div className="rounded-2xl border border-violet-500/15 bg-violet-500/10 p-3.5 text-violet-400 shadow-inner transition-colors duration-300">
                      <Calendar size={28} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-lg font-bold text-slate-200">{copy.deliverableFormat}</h4>
                      <p className="text-slate-400 text-sm mt-1.5 leading-relaxed font-medium">{service.deliverableFormat}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Reviews Section */}
            <div className={`rounded-[1.75rem] border p-6 shadow-2xl backdrop-blur-lg md:p-7 ${sectionCardClass}`}>
              <h2 className="mb-2 flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
                  <Star size={28} className="text-yellow-500 fill-yellow-500" />
                  {copy.pilotReviews}
              </h2>
              <p className="mb-6 border-b border-slate-700/45 pb-5 text-sm text-slate-400">
                  {service.reviewCount > 0 ? copy.reviewsAbout(service.pilotName) : copy.noReviewsForPilot}
              </p>
              
              {reviewsLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
              ) : reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {reviews.map(review => (
                          <div key={review.id} className="rounded-2xl border border-slate-700/55 bg-slate-800/36 p-6 transition-colors hover:border-slate-600/60">
                              <div className="flex items-center gap-4 mb-4">
                                  {review.customerProfilePictureUrl ? (
                                      <img src={review.customerProfilePictureUrl} alt={review.customerName} className="w-12 h-12 rounded-full object-cover" />
                                  ) : (
                                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                                          <UserCircle2 size={24} />
                                      </div>
                                  )}
                                  <div>
                                      <h4 className="font-bold text-slate-200">{review.customerName}</h4>
                                      <div className="flex items-center gap-2 mt-1">
                                          <div className="flex text-yellow-500">
                                              {[...Array(5)].map((_, i) => (
                                                  <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-500' : 'text-slate-600'} />
                                              ))}
                                          </div>
                                          <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString(locale)}</span>
                                      </div>
                                  </div>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="rounded-2xl border border-dashed border-slate-700/50 bg-slate-800/18 py-10 text-center">
                      <Star size={48} className="text-slate-600 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-slate-300 mb-2">{copy.noReviewsYet}</h4>
                      <p className="text-slate-500 max-w-sm mx-auto">{copy.noReviewsDescription}</p>
                  </div>
              )}
            </div>
          </div>

          {/* Sidebar Pricing & Booking */}
          <div className="w-full">
            <div className={`sticky top-24 rounded-[1.75rem] border p-6 shadow-2xl backdrop-blur-xl filter drop-shadow-2xl md:p-7 ${sidebarCardClass}`}>
              <h3 className="text-2xl font-bold text-slate-50 mb-2 tracking-tight">{copy.bookNow}</h3>
              <p className="text-slate-400 text-sm mb-7 font-medium">{copy.pricingSubtitle}</p>

              <div className="mb-7 space-y-3.5">
                <div className={`flex items-center justify-between rounded-xl border p-3.5 shadow-inner transition-colors ${pricingRowClass}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg"><Clock className="text-blue-500" size={20} /></div>
                    <span className="text-slate-300 font-medium">{copy.hourly}</span>
                  </div>
                  <span className="font-bold text-white text-lg">{formatTryCurrency(service.hourlyRate, language)}</span>
                </div>
                <div className={`flex items-center justify-between rounded-xl border p-3.5 shadow-inner transition-colors ${pricingRowClass}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg"><Calendar className="text-emerald-400" size={20} /></div>
                    <span className="text-slate-300 font-medium">{copy.daily}</span>
                  </div>
                  <span className="font-bold text-white text-lg">{formatTryCurrency(service.dailyRate, language)}</span>
                </div>
                <div className={`flex items-center justify-between rounded-xl border p-3.5 shadow-inner transition-colors ${pricingRowClass}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-500/10 rounded-lg"><Settings className="text-violet-400" size={20} /></div>
                    <div>
                      <span className="block text-slate-300 font-medium">{copy.projectBased}</span>
                      <span className="block text-xs text-slate-500 mt-0.5">{projectPricing.subtitle}</span>
                    </div>
                  </div>
                  {projectPricing.price && (
                    <span className="font-bold text-white text-lg">{projectPricing.price}</span>
                  )}
                </div>
              </div>

              {isAuthenticated && userId === service.pilotUserId ? (
                  <div className="space-y-4">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                          <p className="text-blue-500 text-sm font-medium flex items-start gap-2">
                               <AlertCircle size={18} className="mt-0.5 min-w-[18px]" /> 
                               {copy.ownListing}
                          </p>
                      </div>
                      <button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-4 rounded-xl transition-all shadow-lg" onClick={() => navigate('/pilot/dashboard')}>
                          {copy.returnManage}
                      </button>
                  </div>
              ) : (
                  <button
                    className={`w-full py-4.5 text-lg font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-3 group relative overflow-hidden ${service.isActive ? 'bg-blue-600 hover:bg-blue-500 text-white ring-1 ring-blue-500/50' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
                    onClick={() => setShowBookingForm(true)}
                    disabled={!service.isActive}
                  >
                    {service.isActive && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />}
                    {service.isActive ? (
                        <>
                            <span className="relative z-10 pt-0.5">{copy.book}</span>
                            <ArrowLeft size={22} className="relative z-10 rotate-180 group-hover:translate-x-1.5 transition-transform opacity-90" />
                        </>
                    ) : copy.inactiveService}
                  </button>
              )}
              <p className="text-xs text-center text-slate-500 mt-6 font-medium">
                {copy.securePayment}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="bg-[#020617] border border-slate-800/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-blue-900/10">
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between flex-shrink-0 bg-[#020617] z-20 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-slate-50 tracking-tight">{copy.createBooking}</h2>
              <button
                className="text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full transition-colors"
                onClick={() => setShowBookingForm(false)}
              >
                <XCircleIcon />
              </button>
            </div>

            <div className="p-6 pb-5 space-y-6 overflow-y-auto flex-1 min-h-0">
              {/* Form Content */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3 ml-1">{copy.bookingType}</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { type: BookingType.Hourly, label: copy.hourly },
                    { type: BookingType.Daily, label: copy.daily },
                    { type: BookingType.Project, label: copy.project }
                  ].map(option => (
                    <button
                      key={option.type}
                      onClick={() => handleBookingTypeChange(option.type)}
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
                    {bookingForm.type === BookingType.Hourly ? copy.startDateTime : copy.startDate}
                  </label>
                  <input
                    type={bookingForm.type === BookingType.Hourly ? 'datetime-local' : 'date'}
                    lang={locale}
                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                    value={normalizedStartDate}
                    min={bookingForm.type === BookingType.Hourly ? nowDateTimeLocal : today}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, startDate: e.target.value, endDate: '' }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300 ml-1">
                    {bookingForm.type === BookingType.Hourly ? copy.endDateTime : copy.endDate}
                  </label>
                  <input
                    type={bookingForm.type === BookingType.Hourly ? 'datetime-local' : 'date'}
                    lang={locale}
                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                    value={normalizedEndDate}
                    min={normalizedStartDate || (bookingForm.type === BookingType.Hourly ? nowDateTimeLocal : today)}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              {bookingRangePreview && (
                <div className="rounded-xl border border-slate-700/70 bg-slate-800/30 px-4 py-3">
                  <p className="text-sm text-slate-400">
                    {copy.selectedRange} <span className="font-semibold text-slate-200">{bookingRangePreview}</span>
                  </p>
                </div>
              )}

              {hasInvalidSelectedRange && (
                <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3">
                  <p className="text-sm font-medium text-rose-200">{copy.invalidRangeMessage}</p>
                </div>
              )}

              {bookingForm.type === BookingType.Hourly && calculatedDuration.isValid && calculatedDuration.hours !== null && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-slate-400 font-medium">
                    {copy.calculatedDuration} <span className="text-blue-500 font-bold text-base">{calculatedDuration.hours} {copy.hours}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{copy.unitPrice} {service ? formatTryCurrency(service.hourlyRate, language) : ''}/{copy.hours}</p>
                </div>
              )}

              {bookingForm.type === BookingType.Daily && calculatedDuration.isValid && calculatedDuration.days !== null && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300 ml-1">{copy.daysCount}</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-emerald-400 font-bold transition-all focus:outline-none"
                    value={calculatedDuration.days}
                    readOnly
                    title={copy.dateRangeCalculated}
                  />
                </div>
              )}

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-slate-300 ml-1">{copy.shootLocation}</label>
                <input
                  type="text"
                  placeholder={copy.shootLocationPlaceholder}
                  className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                  value={bookingForm.location || ''}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-slate-300 ml-1">{copy.extraNotes}</label>
                <textarea
                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60 resize-none min-h-[96px]"
                    placeholder={copy.notesPlaceholder}
                    rows={3}
                    value={bookingForm.customerNotes || ''}
                    onChange={(e) => setBookingForm(prev => ({...prev, customerNotes: e.target.value}))}
                />
              </div>
            </div>

            <div className="flex-shrink-0 rounded-b-2xl border-t border-slate-800/70 bg-[#020617] px-6 pb-6 pt-4">
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex justify-between items-center shadow-inner">
                <span className="text-slate-300 font-bold tracking-wide">{copy.total}</span>
                <span className="text-right text-3xl font-extrabold text-white flex items-center gap-2">
                    {bookingForm.type === BookingType.Project && service.projectRate === 0
                        ? <span className="text-blue-500 text-2xl font-bold">{copy.askPilot}</span>
                        : activeBookingType !== BookingType.Project && !calculatedDuration.isValid
                          ? <span className="text-sm font-semibold text-slate-400">{copy.totalPending}</span>
                          : <span>{formatTryCurrency(calculateTotalPrice(), language)}</span>
                    }
                </span>
              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-3">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="w-full md:flex-1 py-4 font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors border border-slate-700"
                >
                  {copy.cancel}
                </button>
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="w-full md:flex-1 py-4 font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-colors disabled:cursor-not-allowed disabled:bg-blue-700/70"
                >
                  {bookingLoading ? copy.processing : copy.confirmBooking}
                </button>
              </div>
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
