import type { AppLanguage } from '../context/preferences';
import { ServiceCategory } from '../types';

const SERVICE_CATEGORY_LABELS: Record<AppLanguage, Record<ServiceCategory, string>> = {
    tr: {
        [ServiceCategory.RealEstate]: 'Emlak',
        [ServiceCategory.Wedding]: 'Düğün',
        [ServiceCategory.Inspection]: 'İnceleme',
        [ServiceCategory.Commercial]: 'Ticari',
        [ServiceCategory.Mapping]: 'Haritacılık',
        [ServiceCategory.Agriculture]: 'Tarım',
        [ServiceCategory.Construction]: 'İnşaat',
        [ServiceCategory.Events]: 'Etkinlik',
        [ServiceCategory.Cinematography]: 'Sinematografi',
    },
    en: {
        [ServiceCategory.RealEstate]: 'Real Estate',
        [ServiceCategory.Wedding]: 'Wedding',
        [ServiceCategory.Inspection]: 'Inspection',
        [ServiceCategory.Commercial]: 'Commercial',
        [ServiceCategory.Mapping]: 'Mapping',
        [ServiceCategory.Agriculture]: 'Agriculture',
        [ServiceCategory.Construction]: 'Construction',
        [ServiceCategory.Events]: 'Events',
        [ServiceCategory.Cinematography]: 'Cinematography',
    },
};

export const getServiceCategoryLabel = (category: ServiceCategory, language: AppLanguage) =>
    SERVICE_CATEGORY_LABELS[language][category] ?? (language === 'tr' ? 'Diğer' : 'Other');

export const getLocaleForLanguage = (language: AppLanguage) => (
    language === 'tr' ? 'tr-TR' : 'en-US'
);

export const formatTryCurrency = (value: number, language: AppLanguage) =>
    new Intl.NumberFormat(getLocaleForLanguage(language), {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
    }).format(value);
