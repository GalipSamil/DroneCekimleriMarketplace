import type { SeoLandingPageEntry } from './seoLandingPages';
import { TURKISH_CITIES } from '../utils/turkishCities';

type CityProfile = 'metro' | 'tourism' | 'industry' | 'agriculture' | 'general';

const POPULAR_CITY_ORDER = [
    'istanbul',
    'ankara',
    'izmir',
    'antalya',
    'bursa',
    'kocaeli',
    'konya',
    'adana',
    'gaziantep',
    'mersin',
] as const;

const SERVICE_COMBO_CITY_SET = new Set([
    'istanbul',
    'ankara',
    'izmir',
    'antalya',
    'bursa',
    'kocaeli',
    'mersin',
    'mugla',
]);

const METRO_CITIES = new Set(['istanbul', 'ankara', 'izmir', 'bursa', 'eskisehir', 'kocaeli']);
const TOURISM_CITIES = new Set(['antalya', 'mugla', 'aydin', 'mersin', 'canakkale', 'balikesir', 'trabzon', 'rize', 'hatay']);
const INDUSTRIAL_CITIES = new Set(['ankara', 'bursa', 'kocaeli', 'gaziantep', 'konya', 'kayseri', 'adana', 'sakarya', 'tekirdag', 'manisa', 'denizli']);
const AGRICULTURE_CITIES = new Set(['konya', 'sanliurfa', 'adana', 'mersin', 'manisa', 'aydin', 'antalya', 'denizli', 'ordu', 'samsun']);

const resolveProfile = (cityValue: string): CityProfile => {
    if (METRO_CITIES.has(cityValue)) {
        return 'metro';
    }

    if (TOURISM_CITIES.has(cityValue)) {
        return 'tourism';
    }

    if (INDUSTRIAL_CITIES.has(cityValue)) {
        return 'industry';
    }

    if (AGRICULTURE_CITIES.has(cityValue)) {
        return 'agriculture';
    }

    return 'general';
};

const getPriority = (cityValue: string) => {
    const popularIndex = POPULAR_CITY_ORDER.indexOf(cityValue as (typeof POPULAR_CITY_ORDER)[number]);

    if (popularIndex >= 0 && popularIndex < 4) {
        return '0.9';
    }

    if (popularIndex >= 0) {
        return '0.85';
    }

    return '0.75';
};

const getServiceComboLinks = (cityValue: string, language: 'tr' | 'en') => {
    if (!SERVICE_COMBO_CITY_SET.has(cityValue)) {
        return [];
    }

    const links = [
        {
            tr: { label: 'Emlak drone cekimi', href: `/${cityValue}-emlak-drone-cekimi` },
            en: { label: 'Real estate drone filming', href: `/${cityValue}-emlak-drone-cekimi` },
        },
        {
            tr: { label: 'Insaat drone cekimi', href: `/${cityValue}-insaat-drone-cekimi` },
            en: { label: 'Construction drone filming', href: `/${cityValue}-insaat-drone-cekimi` },
        },
        {
            tr: { label: 'Dugun drone cekimi', href: `/${cityValue}-dugun-drone-cekimi` },
            en: { label: 'Wedding drone filming', href: `/${cityValue}-dugun-drone-cekimi` },
        },
        {
            tr: { label: 'Arsa drone cekimi', href: `/${cityValue}-arsa-drone-cekimi` },
            en: { label: 'Land drone filming', href: `/${cityValue}-arsa-drone-cekimi` },
        },
    ];

    return links.map((item) => item[language]);
};

const getProfileCopy = (profile: CityProfile, cityName: string) => {
    switch (profile) {
        case 'metro':
            return {
                seoQualifierTr: 'Lisansli Drone Pilotlari',
                seoQualifierEn: 'Licensed Drone Pilots',
                descriptionTr: `${cityName} genelinde emlak, kurumsal tanitim, santiye, etkinlik ve sosyal medya cekimleri icin lisansli drone pilotlarini bulun.`,
                descriptionEn: `Find licensed drone pilots in ${cityName} for real estate, construction, branded content, and event shoots.`,
                introTr: `${cityName} gibi yogun rekabetin oldugu sehirlerde drone cekimi, proje tanitimini ve mekan sunumunu daha hizli guclendirir.`,
                introEn: `In a competitive city like ${cityName}, drone filming helps projects, venues, and brands stand out much faster.`,
                projectBulletsTr: [
                    'Emlak ve gayrimenkul tanitimlari',
                    'Kurumsal tanitim ve reklam cekimleri',
                    'Insaat ve santiye ilerleme cekimleri',
                    'Etkinlik, fuar ve organizasyon videolari',
                    'Sosyal medya ve dijital kampanya icerikleri',
                ],
                projectBulletsEn: [
                    'Real estate and property showcases',
                    'Corporate promos and advertising shoots',
                    'Construction progress coverage',
                    'Event and launch videos',
                    'Social media campaign creatives',
                ],
                pricingTr: `${cityName} icinde fiyatlar genelde lokasyon sayisi, cekim suresi, trafik ve erisim kosullari, teslim tipi ve kurgu ihtiyacina gore degisir.`,
                pricingEn: `Pricing in ${cityName} usually depends on the number of locations, shoot duration, access conditions, and post-production needs.`,
            };
        case 'tourism':
            return {
                seoQualifierTr: 'Otel, villa ve etkinlik cekimleri',
                seoQualifierEn: 'Hotel, villa, and event shoots',
                descriptionTr: `${cityName} genelinde otel, villa, mekan, dugun, etkinlik ve tanitim projeleri icin profesyonel drone cekimi hizmetlerine ulasin.`,
                descriptionEn: `Reach drone pilots in ${cityName} for hotels, villas, venues, destination weddings, and promotional shoots.`,
                introTr: `${cityName} gibi gorsel degerin yuksek oldugu sehirlerde drone cekimi, manzarayi, mekani ve deneyimi tek karede daha guclu anlatir.`,
                introEn: `In visually driven destinations like ${cityName}, aerial content makes scenery, venues, and experiences easier to sell.`,
                projectBulletsTr: [
                    'Otel, villa ve tatil tesisi tanitimlari',
                    'Dugun, etkinlik ve organizasyon cekimleri',
                    'Restoran, beach club ve mekan videolari',
                    'Yat, marina ve sahil odakli tanitim icerikleri',
                    'Sosyal medya ve reklam kampanyalari',
                ],
                projectBulletsEn: [
                    'Hotels, villas, and hospitality promos',
                    'Wedding and event coverage',
                    'Restaurant and venue videos',
                    'Marina and coastal content',
                    'Tourism and social media campaigns',
                ],
                pricingTr: `${cityName} icin fiyatlar sezon yogunlugu, lokasyon erisimi, gunes saati planlamasi, teslim beklentisi ve cekim tipine gore degisir.`,
                pricingEn: `Pricing in ${cityName} is shaped by seasonality, location access, golden-hour planning, delivery scope, and shoot type.`,
            };
        case 'industry':
            return {
                seoQualifierTr: 'Santiye ve ticari projeler',
                seoQualifierEn: 'Construction and commercial projects',
                descriptionTr: `${cityName} genelinde santiye takibi, fabrika, depo, arsa, ticari tanitim ve kurumsal projeler icin drone pilotlari bulun.`,
                descriptionEn: `Find drone pilots in ${cityName} for construction progress, industrial facilities, land marketing, and commercial projects.`,
                introTr: `${cityName} gibi sanayi ve ticaret agirlikli sehirlerde drone cekimi; proje takibi, tesis tanitimi ve saha raporlamasi icin ciddi avantaj saglar.`,
                introEn: `In production-driven cities like ${cityName}, aerial content is valuable for site tracking, facility promotion, and operational reporting.`,
                projectBulletsTr: [
                    'Insaat ve santiye ilerleme raporlari',
                    'Fabrika, tesis ve depo tanitimlari',
                    'Arsa ve ticari gayrimenkul cekimleri',
                    'Kurumsal sunum ve yatirimci icerikleri',
                    'OSB, saha ve lojistik alan cekimleri',
                ],
                projectBulletsEn: [
                    'Construction and site progress reports',
                    'Factory and warehouse promotions',
                    'Land and commercial property shoots',
                    'Investor and company presentation content',
                    'Industrial zone and logistics coverage',
                ],
                pricingTr: `${cityName} icinde fiyatlari en cok etkileyen kalemler; cekim tekrar sayisi, saha buyuklugu, guvenlik kurallari ve teslim standardidir.`,
                pricingEn: `The main pricing drivers in ${cityName} are recurring shoot frequency, site size, safety constraints, and delivery standards.`,
            };
        case 'agriculture':
            return {
                seoQualifierTr: 'Arazi ve tarim cekimleri',
                seoQualifierEn: 'Land and agriculture shoots',
                descriptionTr: `${cityName} genelinde tarim arazileri, bahce, sera, arazi tanitimi, tesis ve proje cekimleri icin drone hizmetlerine ulasin.`,
                descriptionEn: `Reach drone pilots in ${cityName} for agricultural land, greenhouses, orchards, facilities, and plot showcase shoots.`,
                introTr: `${cityName} gibi arazi ve saha odakli ihtiyaclarin guclu oldugu sehirlerde drone cekimi, alanin buyuklugunu ve verim hikayesini daha net gosterir.`,
                introEn: `For land-heavy markets like ${cityName}, aerial visuals explain field size, access, and site potential much more clearly.`,
                projectBulletsTr: [
                    'Tarim arazisi ve bahce tanitimlari',
                    'Sera, tesis ve uretim alani cekimleri',
                    'Arsa, arazi ve yol baglantisi gosterimleri',
                    'Periyodik saha ilerleme ve durum raporlari',
                    'Tanitim ve yatirimci sunum icerikleri',
                ],
                projectBulletsEn: [
                    'Agricultural land and orchard showcases',
                    'Greenhouse and facility shoots',
                    'Land access and boundary visuals',
                    'Recurring field progress reports',
                    'Promotional and investor materials',
                ],
                pricingTr: `${cityName} genelinde fiyatlar arazi buyuklugu, yol ve saha erisimi, cekim suresi, tekrarli cekim plani ve teslim bicimine gore degisir.`,
                pricingEn: `Pricing in ${cityName} usually depends on land size, access logistics, shoot time, recurring schedule, and output format.`,
            };
        default:
            return {
                seoQualifierTr: 'Profesyonel Drone Hizmeti',
                seoQualifierEn: 'Professional Drone Services',
                descriptionTr: `${cityName} genelinde emlak, arsa, dugun, etkinlik, santiye ve tanitim cekimleri icin drone pilotlarini DronePazar uzerinden bulun.`,
                descriptionEn: `Find drone pilots in ${cityName} for real estate, land, event, construction, and promotional shoots.`,
                introTr: `${cityName} icin dogru drone cekimi, lokasyonu, projeyi veya etkinligi daha guclu gostermenin en hizli yollarindan biridir.`,
                introEn: `The right drone shoot in ${cityName} is one of the fastest ways to make a project, venue, or event look stronger.`,
                projectBulletsTr: [
                    'Emlak ve gayrimenkul tanitimlari',
                    'Arsa ve arazi cekimleri',
                    'Dugun ve etkinlik videolari',
                    'Santiye ve proje ilerleme cekimleri',
                    'Kurumsal tanitim ve sosyal medya icerikleri',
                ],
                projectBulletsEn: [
                    'Real estate and property showcases',
                    'Land and plot shoots',
                    'Wedding and event videos',
                    'Construction progress coverage',
                    'Promotional and social content',
                ],
                pricingTr: `${cityName} icin drone cekimi fiyatlari, lokasyon, sure, ekipman ihtiyaci, kurgu kapsami ve teslim tipine gore sekillenir.`,
                pricingEn: `Drone filming prices in ${cityName} depend on location, duration, equipment needs, editing scope, and deliverables.`,
            };
    }
};

const createCityLandingPage = (city: (typeof TURKISH_CITIES)[number]): SeoLandingPageEntry => {
    const cityNameTr = city.label.tr;
    const cityNameEn = city.label.en;
    const profile = resolveProfile(city.value);
    const copy = getProfileCopy(profile, cityNameTr);
    const searchPath = `/browse-services?search=${city.value}`;
    const pagePath = `/${city.value}-drone-cekimi`;
    const relatedLinksTr = [
        { label: `${cityNameTr} icin aktif hizmetleri gor`, href: searchPath },
        ...getServiceComboLinks(city.value, 'tr'),
        { label: 'Tum sehirler', href: '/drone-cekimi-sehirleri' },
    ];
    const relatedLinksEn = [
        { label: `Browse services in ${cityNameEn}`, href: searchPath },
        ...getServiceComboLinks(city.value, 'en'),
        { label: 'All cities', href: '/drone-cekimi-sehirleri' },
    ];

    return {
        slug: `${city.value}-drone-cekimi`,
        path: pagePath,
        seoTitle: {
            tr: `${cityNameTr} Drone Cekimi | ${copy.seoQualifierTr}`,
            en: `${cityNameEn} Drone Filming | ${copy.seoQualifierEn}`,
        },
        seoDescription: {
            tr: copy.descriptionTr,
            en: copy.descriptionEn,
        },
        serviceType: {
            tr: `${cityNameTr} drone cekimi`,
            en: `${cityNameEn} drone filming`,
        },
        areaServed: {
            tr: cityNameTr,
            en: cityNameEn,
        },
        priority: getPriority(city.value),
        changefreq: 'weekly',
        copy: {
            tr: {
                badge: cityNameTr,
                title: `${cityNameTr} Drone Cekimi Hizmeti`,
                description: copy.descriptionTr,
                sections: [
                    {
                        title: `${cityNameTr} icin drone cekimi neden onemli?`,
                        paragraphs: [
                            copy.introTr,
                            `Dogru pilot secimi; cekim plani, lokasyon uyumu, teslim kalitesi ve zamanlama tarafinda fark yaratir.`,
                        ],
                    },
                    {
                        title: `${cityNameTr} genelinde hangi projeler icin tercih edilir?`,
                        bullets: copy.projectBulletsTr,
                    },
                    {
                        title: `${cityNameTr} icin pilot secerken neye dikkat edilmeli?`,
                        bullets: [
                            'Lisans, ekipman ve cekim deneyimi',
                            'Benzer projelerde teslim etmis oldugu portfoy',
                            'Lokasyona yakinlik ve planlama disiplini',
                            'Teslim suresi, revizyon kapsami ve iletisim hizi',
                            'Projenin amacina uygun cekim ornekleri',
                        ],
                    },
                    {
                        title: `${cityNameTr} drone cekimi fiyatlarini neler etkiler?`,
                        paragraphs: [
                            copy.pricingTr,
                        ],
                    },
                ],
                footerNote: `${cityNameTr} icin teklif toplamadan once lokasyon, cekim amaci ve teslim beklentisini netlestirmeniz, dogru pilotla daha hizli eslesmenizi saglar.`,
                ctaTitle: `${cityNameTr} icin uygun drone pilotunu bulun`,
                ctaDescription: `${cityNameTr} odakli aktif hizmetleri inceleyin, teklifleri karsilastirin ve projenize uygun pilota ulasin.`,
                ctaPrimary: 'Bu sehirdeki hizmetleri kesfet',
                ctaSecondary: 'Tum sehirler',
                ctaPrimaryHref: searchPath,
                ctaSecondaryHref: '/drone-cekimi-sehirleri',
                faqItems: [
                    {
                        question: `${cityNameTr} drone cekimi fiyatlari neye gore degisir?`,
                        answer: `${cityNameTr} icinde fiyatlar genelde cekim suresi, lokasyon sayisi, erisim durumu, teslim formatlari ve kurgu ihtiyacina gore degisir.`,
                    },
                    {
                        question: `${cityNameTr} icin drone pilotu secmeden once ne istemeliyim?`,
                        answer: `Portfoy, ekipman bilgisi, teslim suresi, onceki benzer isler ve proje amaciniza uygun ornekler istemek daha dogru secim yapmanizi saglar.`,
                    },
                    {
                        question: `${cityNameTr} icinde hangi cekim tipleri icin drone hizmeti alinabilir?`,
                        answer: copy.projectBulletsTr.join(', ') + '.',
                    },
                ],
                relatedLinks: relatedLinksTr,
            },
            en: {
                badge: cityNameEn,
                title: `Drone Filming Services in ${cityNameEn}`,
                description: copy.descriptionEn,
                sections: [
                    {
                        title: `Why drone filming matters in ${cityNameEn}`,
                        paragraphs: [
                            copy.introEn,
                            'The right pilot improves planning, timing, delivery quality, and fit for your exact project goal.',
                        ],
                    },
                    {
                        title: `Common project types in ${cityNameEn}`,
                        bullets: copy.projectBulletsEn,
                    },
                    {
                        title: `How to choose the right pilot in ${cityNameEn}`,
                        bullets: [
                            'Licensing, equipment readiness, and project experience',
                            'A portfolio with relevant work samples',
                            'Location fit and planning discipline',
                            'Delivery speed, revision scope, and communication',
                            'Examples matching your exact project intent',
                        ],
                    },
                    {
                        title: `What affects pricing in ${cityNameEn}`,
                        paragraphs: [
                            copy.pricingEn,
                        ],
                    },
                ],
                footerNote: `Before requesting offers in ${cityNameEn}, define the location, output type, and project goal clearly to match with the right pilot faster.`,
                ctaTitle: `Find the right drone pilot in ${cityNameEn}`,
                ctaDescription: `Review active listings focused on ${cityNameEn}, compare offers, and contact the pilot that fits your project.`,
                ctaPrimary: 'Browse local services',
                ctaSecondary: 'All cities',
                ctaPrimaryHref: searchPath,
                ctaSecondaryHref: '/drone-cekimi-sehirleri',
                faqItems: [
                    {
                        question: `What changes drone filming prices in ${cityNameEn}?`,
                        answer: `Pricing in ${cityNameEn} usually depends on shoot time, location count, access conditions, delivery formats, and editing scope.`,
                    },
                    {
                        question: `What should I ask before hiring a pilot in ${cityNameEn}?`,
                        answer: 'Request portfolio samples, equipment details, delivery timelines, and examples from similar projects before deciding.',
                    },
                    {
                        question: `Which project types are common for drone filming in ${cityNameEn}?`,
                        answer: copy.projectBulletsEn.join(', ') + '.',
                    },
                ],
                relatedLinks: relatedLinksEn,
            },
        },
    };
};

export const citySeoLandingPages: SeoLandingPageEntry[] = TURKISH_CITIES.map(createCityLandingPage);

const cityPageBySlug = new Map(citySeoLandingPages.map((page) => [page.slug, page]));

export const popularCitySeoLandingPages = POPULAR_CITY_ORDER
    .map((cityValue) => cityPageBySlug.get(`${cityValue}-drone-cekimi`))
    .filter((page): page is SeoLandingPageEntry => Boolean(page));
