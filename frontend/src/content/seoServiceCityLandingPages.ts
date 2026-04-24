import type { SeoLandingPageEntry } from './seoLandingPages';
import { TURKISH_CITIES } from '../utils/turkishCities';

type ServiceCityProfile = {
    key: string;
    priorityBoost: string;
    badgeTr: string;
    badgeEn: string;
    seoQualifierTr: string;
    seoQualifierEn: string;
    serviceTypeTr: string;
    serviceTypeEn: string;
    introTr: (cityName: string) => string;
    introEn: (cityName: string) => string;
    seoDescriptionTr: (cityName: string) => string;
    seoDescriptionEn: (cityName: string) => string;
    projectBulletsTr: string[];
    projectBulletsEn: string[];
    prepTr: (cityName: string) => string;
    prepEn: (cityName: string) => string;
    pricingTr: (cityName: string) => string;
    pricingEn: (cityName: string) => string;
};

const TARGET_CITY_VALUES = [
    'istanbul',
    'ankara',
    'izmir',
    'antalya',
    'bursa',
    'kocaeli',
    'mersin',
    'mugla',
] as const;

const SERVICE_CITY_PROFILES: ServiceCityProfile[] = [
    {
        key: 'emlak',
        priorityBoost: '0.86',
        badgeTr: 'Emlak',
        badgeEn: 'Real Estate',
        seoQualifierTr: 'Gayrimenkul tanitimi icin profesyonel cekim',
        seoQualifierEn: 'Professional property marketing shoots',
        serviceTypeTr: 'Emlak drone cekimi',
        serviceTypeEn: 'Real estate drone filming',
        introTr: (cityName) => `${cityName} icinde satilik ve kiralik portfoyleri daha guclu gostermek icin emlak drone cekimi en hizli fark yaratan iceriklerden biridir.`,
        introEn: (cityName) => `In ${cityName}, real estate drone filming is one of the fastest ways to improve listing presentation and perceived value.`,
        seoDescriptionTr: (cityName) => `${cityName} genelinde satilik, kiralik ve proje tanitimlari icin emlak drone cekimi hizmeti alin. Lisansli pilotlarla gayrimenkul cekimlerini guclendirin.`,
        seoDescriptionEn: (cityName) => `Get real estate drone filming in ${cityName} for property listings, rentals, and project marketing with licensed pilots.`,
        projectBulletsTr: [
            'Satilik daire ve rezidans ilanlari',
            'Villa ve mustakil ev tanitimlari',
            'Ticari gayrimenkul ve plaza cekimleri',
            'Arsa ve proje alanlarinin gosterimi',
            'Lansman ve sosyal medya gayrimenkul icerikleri',
        ],
        projectBulletsEn: [
            'Apartment and residence listings',
            'Villa and detached home showcases',
            'Commercial property and office shoots',
            'Land and development visuals',
            'Launch and social media property content',
        ],
        prepTr: (cityName) => `${cityName} emlak drone cekimi oncesinde portfoyun one cikacak acilari, teslim formati ve yayinlanacak platformlar netlestirilmelidir.`,
        prepEn: (cityName) => `Before a ${cityName} real estate shoot, define the strongest angles, expected deliverables, and publishing channels clearly.`,
        pricingTr: (cityName) => `${cityName} icinde emlak drone cekimi fiyatlari lokasyon sayisi, cekim suresi, kurgu ihtiyaci, dikey-yatay teslimler ve erisim kosullarina gore degisir.`,
        pricingEn: (cityName) => `Real estate drone filming prices in ${cityName} vary by location count, shoot time, editing scope, delivery format, and access conditions.`,
    },
    {
        key: 'insaat',
        priorityBoost: '0.84',
        badgeTr: 'Insaat',
        badgeEn: 'Construction',
        seoQualifierTr: 'Santiye ve proje takip cekimleri',
        seoQualifierEn: 'Site progress and project tracking shoots',
        serviceTypeTr: 'Insaat drone cekimi',
        serviceTypeEn: 'Construction drone filming',
        introTr: (cityName) => `${cityName} genelinde santiye ilerleme raporlari, yatirimci sunumlari ve teslim oncesi tanitimlar icin insaat drone cekimi ciddi avantaj saglar.`,
        introEn: (cityName) => `In ${cityName}, construction drone filming improves progress reporting, investor communication, and project marketing.`,
        seoDescriptionTr: (cityName) => `${cityName} icinde santiye takibi, proje raporlama ve tanitim videolari icin insaat drone cekimi hizmeti alin.`,
        seoDescriptionEn: (cityName) => `Get construction drone filming in ${cityName} for site progress reporting, project updates, and promotional content.`,
        projectBulletsTr: [
            'Haftalik veya aylik santiye ilerleme raporlari',
            'Yatirimci ve yonetim sunum gorselleri',
            'Teslim oncesi proje tanitim videolari',
            'Saha ve lojistik alan genel gorunumleri',
            'Kurumsal referans ve arsiv cekimleri',
        ],
        projectBulletsEn: [
            'Weekly or monthly site progress reports',
            'Investor and management visuals',
            'Pre-handover project promotion videos',
            'Site and logistics overview shots',
            'Corporate reference and archive footage',
        ],
        prepTr: (cityName) => `${cityName} insaat drone cekimi planlanirken periyodik cekim ihtiyaci, ayni acilarin korunmasi ve teslim standardi en basta tanimlanmalidir.`,
        prepEn: (cityName) => `For ${cityName} construction filming, define recurring cadence, repeatable camera angles, and delivery standards from the start.`,
        pricingTr: (cityName) => `${cityName} icindeki insaat drone cekimi teklifleri genelde tekrarli cekim sayisi, saha buyuklugu, guvenlik gereksinimleri ve teslim formatlarina gore belirlenir.`,
        pricingEn: (cityName) => `Construction drone filming offers in ${cityName} are usually shaped by recurrence, site size, safety requirements, and delivery format.`,
    },
    {
        key: 'dugun',
        priorityBoost: '0.82',
        badgeTr: 'Dugun',
        badgeEn: 'Wedding',
        seoQualifierTr: 'Etkinlik ve dugun hikayesi cekimleri',
        seoQualifierEn: 'Wedding and event story shoots',
        serviceTypeTr: 'Dugun drone cekimi',
        serviceTypeEn: 'Wedding drone filming',
        introTr: (cityName) => `${cityName} dugun drone cekimi, mekanin atmosferini ve gunun buyuk anlarini daha sinematik sekilde kaydetmek icin tercih edilir.`,
        introEn: (cityName) => `${cityName} wedding drone filming is ideal for capturing venue scale, atmosphere, and key moments in a more cinematic way.`,
        seoDescriptionTr: (cityName) => `${cityName} genelinde dis cekim, dugun hikayesi, mekan girisi ve organizasyon videolari icin dugun drone cekimi hizmeti alin.`,
        seoDescriptionEn: (cityName) => `Get wedding drone filming in ${cityName} for outdoor shoots, venue storytelling, and event highlight videos.`,
        projectBulletsTr: [
            'Dis cekim ve save the date videolari',
            'Mekan genel gorunumu ve giris sahneleri',
            'Dugun hikayesi ve highlight kurgular',
            'Nisan ve organizasyon cekimleri',
            'Sosyal medya icin dikey kisa videolar',
        ],
        projectBulletsEn: [
            'Outdoor shoots and save-the-date videos',
            'Venue overview and entrance scenes',
            'Wedding story and highlight edits',
            'Engagement and event coverage',
            'Vertical social media reels',
        ],
        prepTr: (cityName) => `${cityName} dugun drone cekimi oncesi cekim akisi, mekan takvimi, muzikli highlight beklentisi ve sosyal medya teslimleri netlestirilmelidir.`,
        prepEn: (cityName) => `Before a ${cityName} wedding shoot, align on schedule, venue timing, highlight edit expectations, and social media versions.`,
        pricingTr: (cityName) => `${cityName} icinde dugun drone cekimi fiyatlari cekim suresi, mekan sayisi, kurgu paketi ve ek sosyal medya teslimlerine gore degisir.`,
        pricingEn: (cityName) => `Wedding drone filming prices in ${cityName} change based on duration, venue count, editing package, and extra social deliverables.`,
    },
    {
        key: 'arsa',
        priorityBoost: '0.8',
        badgeTr: 'Arsa',
        badgeEn: 'Land',
        seoQualifierTr: 'Arsa ve arazi tanitim cekimleri',
        seoQualifierEn: 'Plot and land showcase shoots',
        serviceTypeTr: 'Arsa drone cekimi',
        serviceTypeEn: 'Land drone filming',
        introTr: (cityName) => `${cityName} arsa drone cekimi, yol baglantisi, cevre, sinirlar ve parsel potansiyelini tek bakista gostermek icin kullanilir.`,
        introEn: (cityName) => `${cityName} land drone filming helps buyers understand access, surroundings, boundaries, and development potential much faster.`,
        seoDescriptionTr: (cityName) => `${cityName} genelinde arsa ve arazi satislarini guclendirmek icin profesyonel drone cekimi hizmeti alin.`,
        seoDescriptionEn: (cityName) => `Get professional land drone filming in ${cityName} to improve plot and land marketing with stronger aerial visuals.`,
        projectBulletsTr: [
            'Arsa ve arazi ilan gorselleri',
            'Parsel sinirlarinin gosterimi',
            'Yol ve ulasim avantajlarinin anlatimi',
            'Yatirimci sunumu icin genel alan videolari',
            'Harita destekli aciklamali tanitim kurgulari',
        ],
        projectBulletsEn: [
            'Land and plot listing visuals',
            'Parcel boundary demonstrations',
            'Road and access storytelling',
            'Investor presentation videos',
            'Map-supported annotated edits',
        ],
        prepTr: (cityName) => `${cityName} arsa drone cekimi oncesinde sinir bilgisi, yol baglantilari, one cikacak detaylar ve kullanilacak platformlar belirlenmelidir.`,
        prepEn: (cityName) => `Before a ${cityName} land shoot, confirm boundary references, access points, highlight details, and publishing channels.`,
        pricingTr: (cityName) => `${cityName} icinde arsa drone cekimi fiyatlarini en cok arazi buyuklugu, lokasyona ulasim, cekim suresi ve teslim kapsami belirler.`,
        pricingEn: (cityName) => `Land drone filming pricing in ${cityName} is mostly driven by site size, access logistics, shoot time, and delivery scope.`,
    },
];

const CITY_PRIORITY_OVERRIDES: Record<string, string> = {
    istanbul: '0.9',
    ankara: '0.88',
    izmir: '0.87',
    antalya: '0.86',
    bursa: '0.84',
    kocaeli: '0.83',
    mersin: '0.82',
    mugla: '0.82',
};

const targetCities = TURKISH_CITIES.filter((city) => TARGET_CITY_VALUES.includes(city.value as (typeof TARGET_CITY_VALUES)[number]));

const buildPriority = (cityValue: string, fallback: string) => CITY_PRIORITY_OVERRIDES[cityValue] ?? fallback;

const createServiceCityPage = (city: (typeof targetCities)[number], service: ServiceCityProfile): SeoLandingPageEntry => {
    const cityNameTr = city.label.tr;
    const cityNameEn = city.label.en;
    const path = `/${city.value}-${service.key}-drone-cekimi`;
    const browsePath = `/browse-services?search=${encodeURIComponent(`${cityNameTr} ${service.badgeTr.toLocaleLowerCase('tr-TR')}`)}`;
    const genericServicePath = `/${service.key}-drone-cekimi`;
    const cityPath = `/${city.value}-drone-cekimi`;

    return {
        slug: `${city.value}-${service.key}-drone-cekimi`,
        path,
        seoTitle: {
            tr: `${cityNameTr} ${service.badgeTr} Drone Cekimi | ${service.seoQualifierTr}`,
            en: `${cityNameEn} ${service.badgeEn} Drone Filming | ${service.seoQualifierEn}`,
        },
        seoDescription: {
            tr: service.seoDescriptionTr(cityNameTr),
            en: service.seoDescriptionEn(cityNameEn),
        },
        serviceType: {
            tr: `${cityNameTr} ${service.serviceTypeTr}`,
            en: `${cityNameEn} ${service.serviceTypeEn}`,
        },
        areaServed: {
            tr: cityNameTr,
            en: cityNameEn,
        },
        priority: buildPriority(city.value, service.priorityBoost),
        changefreq: 'weekly',
        copy: {
            tr: {
                badge: `${cityNameTr} - ${service.badgeTr}`,
                title: `${cityNameTr} ${service.badgeTr} Drone Cekimi`,
                description: service.seoDescriptionTr(cityNameTr),
                sections: [
                    {
                        title: `${cityNameTr} icin ${service.badgeTr.toLocaleLowerCase('tr-TR')} drone cekimi neden tercih edilir?`,
                        paragraphs: [
                            service.introTr(cityNameTr),
                            `${cityNameTr} icinde dogru pilot secimi; lokasyon planlamasi, cekim amaci ve teslim kalitesi tarafinda dogrudan fark yaratir.`,
                        ],
                    },
                    {
                        title: `${cityNameTr} icinde hangi projelerde kullanilir?`,
                        bullets: service.projectBulletsTr,
                    },
                    {
                        title: `${cityNameTr} cekimi oncesi ne netlestirilmeli?`,
                        paragraphs: [
                            service.prepTr(cityNameTr),
                        ],
                    },
                    {
                        title: `${cityNameTr} tekliflerini karsilastirirken neye bakilmali?`,
                        bullets: [
                            'Portfoyde ayni hizmet tipine benzer cekimlerin bulunmasi',
                            'Teslim suresi ve kurgu kapsami',
                            'Dikey, yatay ve foto teslim secenekleri',
                            'Lokasyon bilgisine ve plana hakimiyet',
                            'Ham goruntu, revizyon ve iletisim hizi',
                        ],
                    },
                    {
                        title: `${cityNameTr} ${service.badgeTr.toLocaleLowerCase('tr-TR')} drone cekimi fiyatlari nasil degisir?`,
                        paragraphs: [
                            service.pricingTr(cityNameTr),
                        ],
                    },
                ],
                footerNote: `${cityNameTr} icin ${service.badgeTr.toLocaleLowerCase('tr-TR')} drone cekimi talebiniz ne kadar net olursa, dogru pilotla eslesmeniz o kadar hizlanir.`,
                ctaTitle: `${cityNameTr} icin ${service.badgeTr.toLocaleLowerCase('tr-TR')} drone pilotu bulun`,
                ctaDescription: `${cityNameTr} odakli hizmetleri inceleyin, uygun pilotlari karsilastirin ve projenize gore teklif alin.`,
                ctaPrimary: 'Bu hizmeti ara',
                ctaSecondary: 'Sehir sayfasina don',
                ctaPrimaryHref: browsePath,
                ctaSecondaryHref: cityPath,
                faqItems: [
                    {
                        question: `${cityNameTr} ${service.badgeTr.toLocaleLowerCase('tr-TR')} drone cekimi fiyatlari neye gore degisir?`,
                        answer: service.pricingTr(cityNameTr),
                    },
                    {
                        question: `${cityNameTr} icinde pilot secerken hangi ornekleri istemeliyim?`,
                        answer: `${service.badgeTr} odakli daha once teslim edilmis benzer isler, ekipman bilgisi, teslim formatlari ve zamanlama plani istenmelidir.`,
                    },
                    {
                        question: `${cityNameTr} icinde hangi cekim tipleri icin bu hizmet alinabilir?`,
                        answer: service.projectBulletsTr.join(', ') + '.',
                    },
                ],
                relatedLinks: [
                    { label: `${cityNameTr} drone cekimi`, href: cityPath },
                    { label: `${service.badgeTr} drone cekimi`, href: genericServicePath },
                    { label: `${cityNameTr} icinde hizmet ara`, href: browsePath },
                    { label: 'Sehir bazli drone cekimi rehberi', href: '/drone-cekimi-sehirleri' },
                ],
            },
            en: {
                badge: `${cityNameEn} - ${service.badgeEn}`,
                title: `${service.badgeEn} Drone Filming in ${cityNameEn}`,
                description: service.seoDescriptionEn(cityNameEn),
                sections: [
                    {
                        title: `Why choose ${service.badgeEn.toLowerCase()} drone filming in ${cityNameEn}`,
                        paragraphs: [
                            service.introEn(cityNameEn),
                            `Choosing the right pilot in ${cityNameEn} directly affects planning quality, visual fit, and final delivery quality.`,
                        ],
                    },
                    {
                        title: `Typical project types in ${cityNameEn}`,
                        bullets: service.projectBulletsEn,
                    },
                    {
                        title: 'What should be clarified before the shoot',
                        paragraphs: [
                            service.prepEn(cityNameEn),
                        ],
                    },
                    {
                        title: 'What to compare in pilot offers',
                        bullets: [
                            'A portfolio with similar service-focused work',
                            'Delivery time and editing scope',
                            'Vertical, horizontal, and photo output options',
                            'Location planning confidence',
                            'Raw footage, revisions, and communication speed',
                        ],
                    },
                    {
                        title: `What affects pricing in ${cityNameEn}`,
                        paragraphs: [
                            service.pricingEn(cityNameEn),
                        ],
                    },
                ],
                footerNote: `The clearer your ${service.badgeEn.toLowerCase()} filming request is in ${cityNameEn}, the easier it becomes to match with the right pilot.`,
                ctaTitle: `Find a ${service.badgeEn.toLowerCase()} drone pilot in ${cityNameEn}`,
                ctaDescription: `Review ${cityNameEn}-focused services, compare active pilots, and request offers that match your project.`,
                ctaPrimary: 'Search this service',
                ctaSecondary: 'Back to city page',
                ctaPrimaryHref: browsePath,
                ctaSecondaryHref: cityPath,
                faqItems: [
                    {
                        question: `What changes ${service.badgeEn.toLowerCase()} drone filming prices in ${cityNameEn}?`,
                        answer: service.pricingEn(cityNameEn),
                    },
                    {
                        question: `What should I request before choosing a pilot in ${cityNameEn}?`,
                        answer: `Ask for relevant work samples, equipment details, delivery formats, and a plan that matches your ${service.badgeEn.toLowerCase()} project.`,
                    },
                    {
                        question: `Which project types fit this service in ${cityNameEn}?`,
                        answer: service.projectBulletsEn.join(', ') + '.',
                    },
                ],
                relatedLinks: [
                    { label: `${cityNameEn} drone filming`, href: cityPath },
                    { label: `${service.badgeEn} drone filming`, href: genericServicePath },
                    { label: `Search services in ${cityNameEn}`, href: browsePath },
                    { label: 'Drone filming by city', href: '/drone-cekimi-sehirleri' },
                ],
            },
        },
    };
};

export const serviceCitySeoLandingPages: SeoLandingPageEntry[] = targetCities.flatMap((city) =>
    SERVICE_CITY_PROFILES.map((service) => createServiceCityPage(city, service))
);

const FEATURED_SERVICE_CITY_SLUGS = [
    'istanbul-emlak-drone-cekimi',
    'ankara-insaat-drone-cekimi',
    'izmir-emlak-drone-cekimi',
    'antalya-dugun-drone-cekimi',
    'bursa-insaat-drone-cekimi',
    'kocaeli-insaat-drone-cekimi',
    'mersin-dugun-drone-cekimi',
    'mugla-dugun-drone-cekimi',
    'istanbul-arsa-drone-cekimi',
    'ankara-emlak-drone-cekimi',
    'izmir-dugun-drone-cekimi',
    'antalya-emlak-drone-cekimi',
] as const;

const serviceCitySeoLandingPagesBySlug = new Map(serviceCitySeoLandingPages.map((page) => [page.slug, page]));

export const featuredServiceCitySeoPages = FEATURED_SERVICE_CITY_SLUGS
    .map((slug) => serviceCitySeoLandingPagesBySlug.get(slug))
    .filter((page): page is SeoLandingPageEntry => Boolean(page));
