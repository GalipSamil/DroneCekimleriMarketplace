import type { AppLanguage } from '../context/preferences';
import { seoLandingPagesByPath } from '../content/seoLandingPages';
import { citySeoLandingPages } from '../content/seoCityLandingPages';
import { getDistrictAreaSchemaItems } from '../content/seoDistrictCoverage';

export type SeoConfig = {
    title: string;
    description: string;
    noindex?: boolean;
    path?: string;
    type?: 'website' | 'article' | 'profile';
    image?: string;
    imageAlt?: string;
    schema?: JsonLd | JsonLd[];
};

export type JsonLd = Record<string, unknown>;
export type SitemapEntry = {
    path: string;
    changefreq: string;
    priority: string;
};

export const SITE_NAME = 'DronePazar';
export const SITE_URL = 'https://dronepazar.com';
export const DEFAULT_SOCIAL_IMAGE_PATH = '/og-default.png';
export const DEFAULT_SOCIAL_IMAGE_ALT = 'DronePazar drone hizmetleri platformu';

export const STATIC_SITEMAP_ENTRIES: SitemapEntry[] = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/browse-services', changefreq: 'daily', priority: '0.9' },
    { path: '/drone-cekimi-sehirleri', changefreq: 'weekly', priority: '0.85' },
    { path: '/about', changefreq: 'monthly', priority: '0.7' },
    { path: '/contact', changefreq: 'monthly', priority: '0.7' },
    { path: '/faq', changefreq: 'monthly', priority: '0.6' },
    { path: '/terms', changefreq: 'yearly', priority: '0.4' },
    { path: '/privacy', changefreq: 'yearly', priority: '0.4' },
    { path: '/kvkk', changefreq: 'yearly', priority: '0.4' },
];

const HOME_DESCRIPTION = {
    tr: 'DronePazar ile drone cekimi, hava fotografciligi, emlak cekimi, dugun cekimi ve ticari drone hizmetleri icin dogru pilotu bulun.',
    en: 'Find the right drone pilot on DronePazar for aerial video, real estate shoots, wedding filming, and commercial drone services.',
} satisfies Record<AppLanguage, string>;

export const trimMetaDescription = (value: string, maxLength = 160) => {
    const normalized = value.replace(/\s+/g, ' ').trim();

    if (normalized.length <= maxLength) {
        return normalized;
    }

    return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
};

export const toAbsoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
export const DEFAULT_SOCIAL_IMAGE_URL = toAbsoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH);

export const toAbsoluteAssetUrl = (value?: string | null) => {
    if (!value) {
        return undefined;
    }

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    return toAbsoluteUrl(value.startsWith('/') ? value : `/${value}`);
};

export const buildBreadcrumbSchema = (
    items: Array<{ name: string; path: string }>
): JsonLd => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: toAbsoluteUrl(item.path),
    })),
});

export const buildFaqSchema = (
    items: Array<{ question: string; answer: string }>
): JsonLd => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
        },
    })),
});

const ORGANIZATION_SCHEMA: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: toAbsoluteUrl('/favicon.svg'),
};

const WEBSITE_SCHEMA: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ['tr-TR', 'en-US'],
};

export const getSitemapEntries = (): SitemapEntry[] => ([
    ...STATIC_SITEMAP_ENTRIES,
    ...Array.from(seoLandingPagesByPath.values()).map((page) => ({
        path: page.path,
        changefreq: page.changefreq,
        priority: page.priority,
    })),
]);

export const getPrerenderPaths = (): string[] => getSitemapEntries().map((entry) => entry.path);

export const getStaticSeo = (pathname: string, language: AppLanguage): SeoConfig | null => {
    const isTr = language === 'tr';
    const seoLandingPage = seoLandingPagesByPath.get(pathname);

    if (pathname.startsWith('/service/')) {
        return null;
    }

    if (pathname.startsWith('/pilot/') && pathname !== '/pilot/profile' && pathname !== '/pilot/dashboard') {
        return null;
    }

    if (seoLandingPage) {
        const title = seoLandingPage.seoTitle[language];
        const description = trimMetaDescription(seoLandingPage.seoDescription[language]);
        const serviceType = seoLandingPage.serviceType[language];
        const areaServed = seoLandingPage.areaServed?.[language];
        const structuredAreas = getDistrictAreaSchemaItems(seoLandingPage);
        const faqItems = seoLandingPage.copy[language].faqItems ?? [];
        const breadcrumbItems = areaServed
            ? [
                { name: SITE_NAME, path: '/' },
                { name: isTr ? 'Sehirlere gore drone cekimi' : 'Drone filming by city', path: '/drone-cekimi-sehirleri' },
                { name: title, path: seoLandingPage.path },
            ]
            : [
                { name: SITE_NAME, path: '/' },
                { name: isTr ? 'Drone cekimi' : 'Drone filming', path: seoLandingPage.path },
            ];

        return {
            title,
            description,
            path: seoLandingPage.path,
            type: 'article',
            schema: [
                {
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: title,
                    description,
                    url: toAbsoluteUrl(seoLandingPage.path),
                },
                {
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    name: title,
                    serviceType,
                    provider: {
                        '@type': 'Organization',
                        name: SITE_NAME,
                        url: SITE_URL,
                    },
                    ...(areaServed
                        ? {
                            areaServed: structuredAreas.length > 0
                                ? structuredAreas
                                : {
                                    '@type': 'City',
                                    name: areaServed,
                                },
                        }
                        : {}),
                },
                buildBreadcrumbSchema(breadcrumbItems),
                ...(faqItems.length > 0 ? [buildFaqSchema(faqItems)] : []),
            ],
        };
    }

    if (pathname === '/') {
        return {
            title: isTr ? 'Drone cekimi icin pilot bul' : 'Find drone pilots for your project',
            description: HOME_DESCRIPTION[language],
            path: '/',
            type: 'website',
            schema: [
                ORGANIZATION_SCHEMA,
                WEBSITE_SCHEMA,
                {
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: isTr ? 'DronePazar ana sayfa' : 'DronePazar home page',
                    description: HOME_DESCRIPTION[language],
                    url: SITE_URL,
                },
            ],
        };
    }

    if (pathname === '/browse-services') {
        return {
            title: isTr ? 'Drone hizmetlerini kesfedin' : 'Browse drone services',
            description: isTr
                ? 'Sehir, kategori ve ihtiyaca gore drone pilotlarini ve aktif hizmet ilanlarini kesfedin.'
                : 'Explore active drone service listings and find pilots by city, category, and project needs.',
            path: '/browse-services',
            schema: [
                {
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: isTr ? 'Drone hizmetlerini kesfedin' : 'Browse drone services',
                    description: isTr
                        ? 'Sehir, kategori ve ihtiyaca gore drone pilotlarini ve aktif hizmet ilanlarini kesfedin.'
                        : 'Explore active drone service listings and find pilots by city, category, and project needs.',
                    url: toAbsoluteUrl('/browse-services'),
                },
                buildBreadcrumbSchema([
                    { name: SITE_NAME, path: '/' },
                    { name: isTr ? 'Hizmetler' : 'Services', path: '/browse-services' },
                ]),
            ],
        };
    }

    if (pathname === '/drone-cekimi-sehirleri') {
        const pageTitle = isTr ? 'Sehirlere gore drone cekimi' : 'Drone filming by city';
        const pageDescription = isTr
            ? 'Ankara, Istanbul, Izmir, Antalya ve diger sehirlerde drone cekimi hizmetlerini sehir bazli kesfedin.'
            : 'Explore drone filming services by city including Istanbul, Ankara, Izmir, Antalya, and more.';

        return {
            title: pageTitle,
            description: pageDescription,
            path: '/drone-cekimi-sehirleri',
            schema: [
                {
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: pageTitle,
                    description: pageDescription,
                    url: toAbsoluteUrl('/drone-cekimi-sehirleri'),
                },
                {
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    itemListElement: citySeoLandingPages.map((page, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        name: page.seoTitle[language],
                        url: toAbsoluteUrl(page.path),
                    })),
                },
                buildBreadcrumbSchema([
                    { name: SITE_NAME, path: '/' },
                    { name: pageTitle, path: '/drone-cekimi-sehirleri' },
                ]),
            ],
        };
    }

    if (pathname === '/about') {
        return {
            title: isTr ? 'DronePazar hakkinda' : 'About DronePazar',
            description: isTr
                ? 'DronePazar, drone hizmeti arayan musteriler ile pilotlari bulusturan dijital pazaryeridir.'
                : 'DronePazar is a digital marketplace that connects customers looking for drone services with pilots.',
            path: '/about',
        };
    }

    if (pathname === '/contact') {
        return {
            title: isTr ? 'Iletisim' : 'Contact',
            description: isTr
                ? 'DronePazar ile iletisime gecin. Sorulariniz, is birlikleri ve destek talepleriniz icin bize ulasin.'
                : 'Contact DronePazar for support, partnership requests, and questions about the platform.',
            path: '/contact',
        };
    }

    if (pathname === '/faq') {
        return {
            title: isTr ? 'Sikca sorulan sorular' : 'Frequently asked questions',
            description: isTr
                ? 'DronePazar platformu, rezervasyon akisi, pilot profilleri ve sifre sifirlama hakkinda sikca sorulan sorular.'
                : 'Frequently asked questions about DronePazar, pilot profiles, bookings, and password reset.',
            path: '/faq',
        };
    }

    if (pathname === '/terms') {
        return {
            title: isTr ? 'Kullanim kosullari' : 'Terms of use',
            description: isTr
                ? 'DronePazar kullanim kosullari, platformun kapsamini, kullanici yukumluluklerini ve sorumluluk sinirlarini aciklar.'
                : 'DronePazar terms of use covering platform scope, user responsibilities, and liability limitations.',
            path: '/terms',
        };
    }

    if (pathname === '/privacy') {
        return {
            title: isTr ? 'Gizlilik politikasi' : 'Privacy policy',
            description: isTr
                ? 'DronePazar gizlilik politikasi, hangi verilerin hangi amaclarla islendigi ve veri koruma yaklasimini aciklar.'
                : "DronePazar privacy policy explaining processed data, purposes, and the platform's data protection approach.",
            path: '/privacy',
        };
    }

    if (pathname === '/kvkk') {
        return {
            title: isTr ? 'KVKK aydinlatma metni' : 'Data protection notice',
            description: isTr
                ? 'DronePazar kapsaminda islenen kisisel verilere iliskin KVKK aydinlatma metni.'
                : 'Data protection disclosure for personal data processed through DronePazar.',
            path: '/kvkk',
        };
    }

    if (pathname === '/login') {
        return {
            title: isTr ? 'Giris yap' : 'Sign in',
            description: isTr
                ? 'DronePazar hesabina giris yapin.'
                : 'Sign in to your DronePazar account.',
            noindex: true,
            path: '/login',
        };
    }

    if (pathname === '/register') {
        return {
            title: isTr ? 'Kayit ol' : 'Create an account',
            description: isTr
                ? 'DronePazar uzerinde hesap olusturun ve pilot veya musteri olarak platforma katilin.'
                : 'Create a DronePazar account and join the platform as a pilot or a customer.',
            noindex: true,
            path: '/register',
        };
    }

    if (pathname === '/forgot-password' || pathname === '/reset-password') {
        return {
            title: isTr ? 'Sifre sifirlama' : 'Password reset',
            description: isTr
                ? 'DronePazar sifre sifirlama akisi.'
                : 'DronePazar password reset flow.',
            noindex: true,
            path: pathname,
        };
    }

    if (
        pathname === '/pilot/profile'
        || pathname === '/pilot/dashboard'
        || pathname === '/customer/dashboard'
        || pathname === '/admin'
        || pathname === '/admin/dashboard'
    ) {
        return {
            title: isTr ? 'Hesap paneli' : 'Account dashboard',
            description: isTr
                ? 'DronePazar kullanici paneli.'
                : 'DronePazar account dashboard.',
            noindex: true,
            path: pathname,
        };
    }

    return {
        title: SITE_NAME,
        description: HOME_DESCRIPTION[language],
        path: pathname,
    };
};
