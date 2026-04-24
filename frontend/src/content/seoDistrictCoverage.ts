import type { AppLanguage } from '../context/preferences';
import type { SeoLandingPageEntry } from './seoLandingPages';
import { TURKISH_CITIES } from '../utils/turkishCities';

type DistrictCoverageConfig = {
    districts: string[];
};

export type DistrictCoverageContent = {
    title: string;
    description: string;
    districts: string[];
};

const DISTRICT_COVERAGE_BY_CITY: Record<string, DistrictCoverageConfig> = {
    adana: {
        districts: ['Seyhan', 'Cukurova', 'Yuregir', 'Saricam', 'Ceyhan', 'Kozan', 'Karatas', 'Pozanti'],
    },
    ankara: {
        districts: ['Cankaya', 'Kecioren', 'Yenimahalle', 'Etimesgut', 'Golbasi', 'Sincan', 'Pursaklar', 'Mamak'],
    },
    antalya: {
        districts: ['Muratpasa', 'Konyaalti', 'Dosemealti', 'Alanya', 'Manavgat', 'Kas', 'Kemer', 'Serik'],
    },
    bursa: {
        districts: ['Nilufer', 'Osmangazi', 'Yildirim', 'Inegol', 'Mudanya', 'Gemlik', 'Gursu', 'Karacabey'],
    },
    gaziantep: {
        districts: ['Sehitkamil', 'Sahinbey', 'Nizip', 'Islahiye', 'Nurdagi', 'Oguzeli', 'Araban', 'Karkamis'],
    },
    istanbul: {
        districts: ['Besiktas', 'Sisli', 'Kadikoy', 'Uskudar', 'Sariyer', 'Beylikduzu', 'Basaksehir', 'Buyukcekmece'],
    },
    izmir: {
        districts: ['Konak', 'Bornova', 'Karsiyaka', 'Buca', 'Cesme', 'Urla', 'Gaziemir', 'Menemen'],
    },
    kocaeli: {
        districts: ['Izmit', 'Gebze', 'Darica', 'Korfez', 'Basiskele', 'Golcuk', 'Kartepe', 'Dilovasi'],
    },
    konya: {
        districts: ['Selcuklu', 'Meram', 'Karatay', 'Eregli', 'Beysehir', 'Cihanbeyli', 'Aksehir', 'Seydisehir'],
    },
    mersin: {
        districts: ['Yenisehir', 'Mezitli', 'Toroslar', 'Akdeniz', 'Tarsus', 'Erdemli', 'Silifke', 'Anamur'],
    },
    mugla: {
        districts: ['Bodrum', 'Fethiye', 'Marmaris', 'Milas', 'Datca', 'Ortaca', 'Dalaman', 'Yatagan'],
    },
};

const cityLabelToValue = new Map(
    TURKISH_CITIES.map((city) => [city.label.tr.toLocaleLowerCase('tr-TR'), city.value])
);

const resolveCityValue = (page: Pick<SeoLandingPageEntry, 'areaServed'>) => {
    const cityLabel = page.areaServed?.tr;

    if (!cityLabel) {
        return null;
    }

    return cityLabelToValue.get(cityLabel.toLocaleLowerCase('tr-TR')) ?? null;
};

export const getDistrictCoverageContent = (
    page: Pick<SeoLandingPageEntry, 'areaServed'>,
    language: AppLanguage
): DistrictCoverageContent | null => {
    const cityValue = resolveCityValue(page);

    if (!cityValue) {
        return null;
    }

    const coverage = DISTRICT_COVERAGE_BY_CITY[cityValue];

    if (!coverage) {
        return null;
    }

    const cityName = page.areaServed?.[language];

    if (!cityName) {
        return null;
    }

    if (language === 'tr') {
        return {
            title: `${cityName} icinde one cikan cekim bolgeleri`,
            description: `${cityName} icinde drone cekimi talepleri genelde su ilceler ve yakin lokasyonlardan gelir. Projeniz bu bolgelerdeyse ilgili pilotlari ve hizmetleri daha hizli karsilastirabilirsiniz.`,
            districts: coverage.districts,
        };
    }

    return {
        title: `Popular filming districts in ${cityName}`,
        description: `Drone filming requests in ${cityName} commonly come from these districts and nearby locations. If your project is in one of these areas, you can compare relevant pilots faster.`,
        districts: coverage.districts,
    };
};

export const getDistrictAreaSchemaItems = (page: Pick<SeoLandingPageEntry, 'areaServed'>) => {
    const cityValue = resolveCityValue(page);

    if (!cityValue || !page.areaServed?.tr || !page.areaServed.en) {
        return [];
    }

    const coverage = DISTRICT_COVERAGE_BY_CITY[cityValue];

    if (!coverage) {
        return [];
    }

    return [
        {
            '@type': 'City',
            name: page.areaServed.tr,
        },
        ...coverage.districts.map((district) => ({
            '@type': 'AdministrativeArea',
            name: `${district}, ${page.areaServed?.tr}`,
        })),
    ];
};
