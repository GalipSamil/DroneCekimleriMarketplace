import { citySeoLandingPages } from './seoCityLandingPages';
import { serviceCitySeoLandingPages } from './seoServiceCityLandingPages';

export interface SeoLandingSection {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
}

export interface SeoLandingFaqItem {
    question: string;
    answer: string;
}

export interface SeoLandingRelatedLink {
    label: string;
    href: string;
}

export interface SeoLandingPageCopy {
    badge: string;
    title: string;
    description: string;
    sections: SeoLandingSection[];
    footerNote: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaPrimaryHref?: string;
    ctaSecondaryHref?: string;
    faqItems?: SeoLandingFaqItem[];
    relatedLinks?: SeoLandingRelatedLink[];
}

export interface SeoLandingPageEntry {
    slug: string;
    path: string;
    seoTitle: {
        tr: string;
        en: string;
    };
    seoDescription: {
        tr: string;
        en: string;
    };
    serviceType: {
        tr: string;
        en: string;
    };
    areaServed?: {
        tr: string;
        en: string;
    };
    priority: string;
    changefreq: string;
    copy: {
        tr: SeoLandingPageCopy;
        en: SeoLandingPageCopy;
    };
}

const buildCityServiceLinks = (cityValue: string, cityNameTr: string, cityNameEn: string) => ({
    tr: [
        { label: `${cityNameTr} icin aktif hizmetleri gor`, href: `/browse-services?search=${cityValue}` },
        { label: 'Emlak drone cekimi', href: `/${cityValue}-emlak-drone-cekimi` },
        { label: 'Insaat drone cekimi', href: `/${cityValue}-insaat-drone-cekimi` },
        { label: 'Dugun drone cekimi', href: `/${cityValue}-dugun-drone-cekimi` },
        { label: 'Arsa drone cekimi', href: `/${cityValue}-arsa-drone-cekimi` },
        { label: 'Tum sehirler', href: '/drone-cekimi-sehirleri' },
    ],
    en: [
        { label: `Browse services in ${cityNameEn}`, href: `/browse-services?search=${cityValue}` },
        { label: 'Real estate drone filming', href: `/${cityValue}-emlak-drone-cekimi` },
        { label: 'Construction drone filming', href: `/${cityValue}-insaat-drone-cekimi` },
        { label: 'Wedding drone filming', href: `/${cityValue}-dugun-drone-cekimi` },
        { label: 'Land drone filming', href: `/${cityValue}-arsa-drone-cekimi` },
        { label: 'All cities', href: '/drone-cekimi-sehirleri' },
    ],
});

const istanbulServiceLinks = buildCityServiceLinks('istanbul', 'Istanbul', 'Istanbul');
const ankaraServiceLinks = buildCityServiceLinks('ankara', 'Ankara', 'Ankara');

const serviceHubRelatedLinks = {
    emlak: {
        tr: [
            { label: 'Istanbul emlak drone cekimi', href: '/istanbul-emlak-drone-cekimi' },
            { label: 'Ankara emlak drone cekimi', href: '/ankara-emlak-drone-cekimi' },
            { label: 'Izmir emlak drone cekimi', href: '/izmir-emlak-drone-cekimi' },
            { label: 'Tum sehirler', href: '/drone-cekimi-sehirleri' },
        ],
        en: [
            { label: 'Istanbul real estate drone filming', href: '/istanbul-emlak-drone-cekimi' },
            { label: 'Ankara real estate drone filming', href: '/ankara-emlak-drone-cekimi' },
            { label: 'Izmir real estate drone filming', href: '/izmir-emlak-drone-cekimi' },
            { label: 'All cities', href: '/drone-cekimi-sehirleri' },
        ],
    },
    insaat: {
        tr: [
            { label: 'Istanbul insaat drone cekimi', href: '/istanbul-insaat-drone-cekimi' },
            { label: 'Ankara insaat drone cekimi', href: '/ankara-insaat-drone-cekimi' },
            { label: 'Kocaeli insaat drone cekimi', href: '/kocaeli-insaat-drone-cekimi' },
            { label: 'Tum sehirler', href: '/drone-cekimi-sehirleri' },
        ],
        en: [
            { label: 'Istanbul construction drone filming', href: '/istanbul-insaat-drone-cekimi' },
            { label: 'Ankara construction drone filming', href: '/ankara-insaat-drone-cekimi' },
            { label: 'Kocaeli construction drone filming', href: '/kocaeli-insaat-drone-cekimi' },
            { label: 'All cities', href: '/drone-cekimi-sehirleri' },
        ],
    },
    dugun: {
        tr: [
            { label: 'Istanbul dugun drone cekimi', href: '/istanbul-dugun-drone-cekimi' },
            { label: 'Antalya dugun drone cekimi', href: '/antalya-dugun-drone-cekimi' },
            { label: 'Izmir dugun drone cekimi', href: '/izmir-dugun-drone-cekimi' },
            { label: 'Mugla dugun drone cekimi', href: '/mugla-dugun-drone-cekimi' },
            { label: 'Tum sehirler', href: '/drone-cekimi-sehirleri' },
        ],
        en: [
            { label: 'Istanbul wedding drone filming', href: '/istanbul-dugun-drone-cekimi' },
            { label: 'Antalya wedding drone filming', href: '/antalya-dugun-drone-cekimi' },
            { label: 'Izmir wedding drone filming', href: '/izmir-dugun-drone-cekimi' },
            { label: 'Mugla wedding drone filming', href: '/mugla-dugun-drone-cekimi' },
            { label: 'All cities', href: '/drone-cekimi-sehirleri' },
        ],
    },
    arsa: {
        tr: [
            { label: 'Istanbul arsa drone cekimi', href: '/istanbul-arsa-drone-cekimi' },
            { label: 'Ankara arsa drone cekimi', href: '/ankara-arsa-drone-cekimi' },
            { label: 'Izmir arsa drone cekimi', href: '/izmir-arsa-drone-cekimi' },
            { label: 'Mersin arsa drone cekimi', href: '/mersin-arsa-drone-cekimi' },
            { label: 'Tum sehirler', href: '/drone-cekimi-sehirleri' },
        ],
        en: [
            { label: 'Istanbul land drone filming', href: '/istanbul-arsa-drone-cekimi' },
            { label: 'Ankara land drone filming', href: '/ankara-arsa-drone-cekimi' },
            { label: 'Izmir land drone filming', href: '/izmir-arsa-drone-cekimi' },
            { label: 'Mersin land drone filming', href: '/mersin-arsa-drone-cekimi' },
            { label: 'All cities', href: '/drone-cekimi-sehirleri' },
        ],
    },
};

const manualSeoLandingPages: SeoLandingPageEntry[] = [
    {
        slug: 'istanbul-drone-cekimi',
        path: '/istanbul-drone-cekimi',
        seoTitle: {
            tr: 'Istanbul Drone Cekimi | Lisansli Drone Pilotlari',
            en: 'Istanbul Drone Filming | Licensed Drone Pilots',
        },
        seoDescription: {
            tr: 'Istanbulda emlak, arsa, insaat, dugun ve tanitim cekimleri icin lisansli drone pilotlarini DronePazar uzerinden bulun.',
            en: 'Find licensed drone pilots in Istanbul for real estate, land, construction, wedding, and promotional shoots.',
        },
        serviceType: {
            tr: 'Istanbul drone cekimi',
            en: 'Istanbul drone filming',
        },
        areaServed: {
            tr: 'Istanbul',
            en: 'Istanbul',
        },
        priority: '0.9',
        changefreq: 'weekly',
        copy: {
            tr: {
                badge: 'Istanbul',
                title: 'Istanbul Drone Cekimi Hizmeti',
                description: 'Istanbulda emlak tanitimlarindan insaat takibine, etkinlik cekimlerinden kurumsal tanitim videolarina kadar lisansli drone pilotlariyla hizli sekilde eslesin.',
                sections: [
                    {
                        title: 'Istanbulda drone cekimi neden onemli?',
                        paragraphs: [
                            'Istanbul gibi yogun ve rekabetci bir pazarda havadan cekim, bir mekani, projeyi veya etkinligi tek karede daha guclu anlatmanin en hizli yollarindan biridir.',
                            'Dogru pilot secimi, izin hassasiyetleri, cekim plani ve teslim kalitesi acisindan fark yaratir.',
                        ],
                    },
                    {
                        title: 'Hangi cekim tipleri icin kullanilir?',
                        bullets: [
                            'Emlak ve gayrimenkul portfoy tanitimlari',
                            'Insaat ve santiye ilerleme cekimleri',
                            'Otel, restoran ve mekan tanitim videolari',
                            'Dugun, etkinlik ve organizasyon cekimleri',
                            'Sosyal medya ve reklam icerikleri',
                        ],
                    },
                    {
                        title: 'Pilot secerken neye dikkat edilmeli?',
                        bullets: [
                            'Lisans ve ekipman yeterliligi',
                            'Daha once benzer cekimlerde deneyim',
                            'Cekim lokasyonuna yakinlik',
                            'Teslim suresi ve revizyon esnekligi',
                            'Cekim amacina uygun portfoy kalitesi',
                        ],
                    },
                    {
                        title: 'Fiyati hangi faktorler etkiler?',
                        paragraphs: [
                            'Cekim suresi, lokasyon sayisi, hava kosullari, post-produksiyon ihtiyaci, kullanilacak ekipman ve cekimin ticari kullanim amaci fiyatlari dogrudan etkiler.',
                        ],
                    },
                ],
                footerNote: 'Istanbul drone cekimi icin teklif toplamadan once hizmet detaylarini netlestirin; cekim amaci, lokasyon ve teslim beklentisi dogru pilotu bulmanizi hizlandirir.',
                ctaTitle: 'Istanbul icin dogru drone pilotunu bulun',
                ctaDescription: 'Sehre, hizmet tipine ve ihtiyaca gore filtreleyin; aktif ilanlari inceleyin ve en uygun pilota hizla ulasin.',
                ctaPrimary: 'Hizmetleri Kesfet',
                ctaSecondary: 'Pilot Olarak Kayit Ol',
                relatedLinks: istanbulServiceLinks.tr,
            },
            en: {
                badge: 'Istanbul',
                title: 'Drone Filming Services in Istanbul',
                description: 'Match with licensed drone pilots in Istanbul for real estate showcases, construction tracking, event coverage, and branded promotional videos.',
                sections: [
                    {
                        title: 'Why drone filming matters in Istanbul',
                        paragraphs: [
                            'In a dense and competitive city like Istanbul, aerial visuals help projects, venues, and events stand out much faster.',
                            'Choosing the right pilot matters for permits, planning, safety, and final delivery quality.',
                        ],
                    },
                    {
                        title: 'Common use cases',
                        bullets: [
                            'Real estate and property showcases',
                            'Construction and site progress reports',
                            'Hotel, restaurant, and venue promotions',
                            'Wedding and event coverage',
                            'Social media and advertising creatives',
                        ],
                    },
                    {
                        title: 'What to check before choosing a pilot',
                        bullets: [
                            'Licensing and equipment readiness',
                            'Relevant project experience',
                            'Proximity to the shoot location',
                            'Delivery speed and revision flexibility',
                            'Portfolio quality for your target use case',
                        ],
                    },
                    {
                        title: 'What affects pricing',
                        paragraphs: [
                            'Duration, number of locations, weather conditions, post-production scope, equipment needs, and commercial usage all influence pricing.',
                        ],
                    },
                ],
                footerNote: 'Before requesting offers in Istanbul, define your goal, location, and delivery expectations clearly to speed up the matching process.',
                ctaTitle: 'Find the right drone pilot in Istanbul',
                ctaDescription: 'Filter by city, service type, and project need; review active listings and contact the most suitable pilot.',
                ctaPrimary: 'Browse Services',
                ctaSecondary: 'Join as a Pilot',
                relatedLinks: istanbulServiceLinks.en,
            },
        },
    },
    {
        slug: 'ankara-drone-cekimi',
        path: '/ankara-drone-cekimi',
        seoTitle: {
            tr: 'Ankara Drone Cekimi | Lisansli Drone Pilotlari',
            en: 'Ankara Drone Filming | Licensed Drone Pilots',
        },
        seoDescription: {
            tr: 'Ankarada profesyonel drone cekimi icin lisansli pilotlara ulasin. Emlak, insaat, arsa ve etkinlik cekimleri icin teklif alin.',
            en: 'Reach licensed drone pilots in Ankara for real estate, construction, land, and event shoots.',
        },
        serviceType: {
            tr: 'Ankara drone cekimi',
            en: 'Ankara drone filming',
        },
        areaServed: {
            tr: 'Ankara',
            en: 'Ankara',
        },
        priority: '0.9',
        changefreq: 'weekly',
        copy: {
            tr: {
                badge: 'Ankara',
                title: 'Ankara Drone Cekimi Hizmeti',
                description: 'Ankarada proje tanitimi, santiye takibi, emlak tanitimi ve etkinlik cekimleri icin ihtiyaciniza uygun lisansli drone pilotlarini tek yerden inceleyin.',
                sections: [
                    {
                        title: 'Ankarada hangi projeler icin drone cekimi talep edilir?',
                        bullets: [
                            'Konut ve ticari gayrimenkul tanitimlari',
                            'Santiye ilerleme raporlari ve proje sunumlari',
                            'Arsa ve arazi tanitim cekimleri',
                            'Etkinlik, fuar ve lansman icerikleri',
                            'Kurumsal ve kamusal alan tanitimlari',
                        ],
                    },
                    {
                        title: 'Ankara lokasyonlarinda planlama neden kritiktir?',
                        paragraphs: [
                            'Merkezi lokasyonlar, resmi binalara yakin alanlar ve acik araziler farkli planlama gerektirir. Cekim oncesinde lokasyon, saat araligi ve beklenti netlesirse is akisiniz hizlanir.',
                        ],
                    },
                    {
                        title: 'Dogru pilotu bulmak icin hangi bilgileri hazirlamalisiniz?',
                        bullets: [
                            'Lokasyon ve cekim tarihi',
                            'Istediginiz video veya fotograf teslim bicimi',
                            'Tek seferlik mi yoksa duzenli cekim mi oldugu',
                            'Ham goruntu, montaj veya sosyal medya versiyonu ihtiyaci',
                        ],
                    },
                    {
                        title: 'Ankara drone cekimi teklifleri nasil karsilastirilir?',
                        paragraphs: [
                            'Sadece fiyat degil, teslim suresi, ekipman seviyesi, onceki isler ve cekim amacina uygunluk da birlikte degerlendirilmelidir.',
                        ],
                    },
                ],
                footerNote: 'Ankara icin olusturdugunuz talep ne kadar net olursa, uygun pilotla eslesme ve dogru teklif alma ihtimaliniz o kadar artar.',
                ctaTitle: 'Ankarada drone cekimi icin teklif toplayin',
                ctaDescription: 'Aktif hizmetleri inceleyin veya ozel talep olusturarak ihtiyaciniza uygun pilota ulasin.',
                ctaPrimary: 'Hizmetleri Kesfet',
                ctaSecondary: 'Ozel Talep Olustur',
                relatedLinks: ankaraServiceLinks.tr,
            },
            en: {
                badge: 'Ankara',
                title: 'Drone Filming Services in Ankara',
                description: 'Review licensed drone pilots in Ankara for project presentations, site tracking, real estate showcases, and event coverage.',
                sections: [
                    {
                        title: 'What projects commonly need drone filming in Ankara?',
                        bullets: [
                            'Residential and commercial property showcases',
                            'Construction progress reports and project updates',
                            'Land and plot presentations',
                            'Events, fairs, and launch coverage',
                            'Corporate and public space promotions',
                        ],
                    },
                    {
                        title: 'Why planning matters in Ankara',
                        paragraphs: [
                            'Central districts, official zones, and open lands require different planning. Clear timing, location, and expectations speed up the shoot process.',
                        ],
                    },
                    {
                        title: 'What information should you prepare first?',
                        bullets: [
                            'Location and preferred shoot date',
                            'Expected video or photo deliverables',
                            'One-time or recurring shoot scope',
                            'Need for raw footage, editing, or social versions',
                        ],
                    },
                    {
                        title: 'How to compare offers',
                        paragraphs: [
                            'Do not compare only price. Delivery time, equipment level, past work, and fit for your specific goal should be evaluated together.',
                        ],
                    },
                ],
                footerNote: 'The clearer your request is for Ankara, the easier it becomes to get matched with the right pilot and receive better offers.',
                ctaTitle: 'Collect Ankara drone filming offers',
                ctaDescription: 'Review active services or create a custom request to reach the pilot that fits your needs.',
                ctaPrimary: 'Browse Services',
                ctaSecondary: 'Create Custom Request',
                relatedLinks: ankaraServiceLinks.en,
            },
        },
    },
    {
        slug: 'emlak-drone-cekimi',
        path: '/emlak-drone-cekimi',
        seoTitle: {
            tr: 'Emlak Drone Cekimi | Gayrimenkul Tanitimi Icin Profesyonel Cekim',
            en: 'Real Estate Drone Filming | Professional Property Shoots',
        },
        seoDescription: {
            tr: 'Satilik ve kiralik portfoyler icin emlak drone cekimi hizmeti alin. Gayrimenkul projelerinizi havadan guclu sekilde tanitin.',
            en: 'Get real estate drone filming for listings and property projects. Showcase your property from the air with stronger visuals.',
        },
        serviceType: {
            tr: 'Emlak drone cekimi',
            en: 'Real estate drone filming',
        },
        priority: '0.85',
        changefreq: 'weekly',
        copy: {
            tr: {
                badge: 'Emlak',
                title: 'Emlak Drone Cekimi',
                description: 'Satilik ve kiralik portfoylerinizi havadan guclu bir hikayeyle sunmak, konumu ve cevre avantajlarini gostermek icin profesyonel emlak drone cekimi kullanin.',
                sections: [
                    {
                        title: 'Emlak drone cekimi ne saglar?',
                        bullets: [
                            'Portfoyun cevresel konum avantajini gosterir',
                            'Proje buyuklugunu ve ulasim avantajlarini daha net anlatir',
                            'Ilan ve sosyal medya iceriklerinde dikkat cekicilik saglar',
                            'Prestijli projeler icin daha profesyonel sunum olusturur',
                        ],
                    },
                    {
                        title: 'Hangi gayrimenkul tipleri icin uygundur?',
                        bullets: [
                            'Satilik daire ve rezidans projeleri',
                            'Villa ve mustakil ev tanitimlari',
                            'Ticari gayrimenkuller ve plaza ofisleri',
                            'Arsa ve gelistirme alanlari',
                            'Toplu konut ve yeni proje lansmanlari',
                        ],
                    },
                    {
                        title: 'Cekim oncesi hangi hazirliklar yapilmali?',
                        paragraphs: [
                            'Portfoyun en guclu yonleri, hangi acilarin istenecegi, teslim formatlari ve kullanilacak platformlar netlestirilmelidir. Boylece cekim plana bagli ilerler ve montaj sureci hizlanir.',
                        ],
                    },
                    {
                        title: 'Dogru emlak pilotu nasil secilir?',
                        bullets: [
                            'Gayrimenkul cekimi orneklerine bakmak',
                            'Dikey sosyal medya, yatay tanitim ve foto teslim seceneklerini sormak',
                            'Lokasyon tecrubesi ve cekim planini ogrenmek',
                            'Ham goruntu ve kurgu kapsamlarini karsilastirmak',
                        ],
                    },
                ],
                footerNote: 'Emlak drone cekimi, sadece guzel goruntu degil; konumu, ulasimi ve deger algisini daha iyi anlatan satis odakli bir icerik yatirimidir.',
                ctaTitle: 'Gayrimenkul portfoyunuz icin drone pilotu bulun',
                ctaDescription: 'Emlak tanitimina uygun aktif hizmetleri karsilastirin ve portfoyunuz icin en dogru pilota ulasin.',
                ctaPrimary: 'Hizmetleri Kesfet',
                ctaSecondary: 'Iletisim Kur',
                relatedLinks: serviceHubRelatedLinks.emlak.tr,
            },
            en: {
                badge: 'Real Estate',
                title: 'Real Estate Drone Filming',
                description: 'Use aerial property visuals to highlight location, surroundings, project scale, and listing quality more effectively.',
                sections: [
                    {
                        title: 'What real estate drone filming improves',
                        bullets: [
                            'Shows the location context more clearly',
                            'Highlights project scale and access advantages',
                            'Improves listing and social media performance',
                            'Creates a more premium presentation for valuable projects',
                        ],
                    },
                    {
                        title: 'Best fit property types',
                        bullets: [
                            'Apartments and residential projects',
                            'Villas and detached houses',
                            'Commercial spaces and office buildings',
                            'Land and development plots',
                            'Large-scale housing and launch projects',
                        ],
                    },
                    {
                        title: 'What to prepare before the shoot',
                        paragraphs: [
                            'Define the strongest selling points, expected angles, delivery formats, and publishing channels first. This makes the shoot and edit process much smoother.',
                        ],
                    },
                    {
                        title: 'How to choose the right pilot',
                        bullets: [
                            'Review past property-focused work',
                            'Ask for vertical, horizontal, and photo delivery options',
                            'Check location familiarity and planning approach',
                            'Compare raw footage and edit scope clearly',
                        ],
                    },
                ],
                footerNote: 'Real estate drone filming is not just about nice visuals; it is a sales-focused asset that improves perceived value and location storytelling.',
                ctaTitle: 'Find the right pilot for your property',
                ctaDescription: 'Compare active real estate-focused services and contact the pilot that best fits your listing goals.',
                ctaPrimary: 'Browse Services',
                ctaSecondary: 'Contact Us',
                relatedLinks: serviceHubRelatedLinks.emlak.en,
            },
        },
    },
    {
        slug: 'insaat-drone-cekimi',
        path: '/insaat-drone-cekimi',
        seoTitle: {
            tr: 'Insaat Drone Cekimi | Santiye ve Proje Takip Cekimleri',
            en: 'Construction Drone Filming | Site Progress and Project Shoots',
        },
        seoDescription: {
            tr: 'Santiye ilerleme takibi, proje raporlama ve tanitim videolari icin profesyonel insaat drone cekimi hizmeti alin.',
            en: 'Get construction drone filming for site progress tracking, reporting, and promotional project videos.',
        },
        serviceType: {
            tr: 'Insaat drone cekimi',
            en: 'Construction drone filming',
        },
        priority: '0.85',
        changefreq: 'weekly',
        copy: {
            tr: {
                badge: 'Insaat',
                title: 'Insaat Drone Cekimi',
                description: 'Santiye ilerleme takibi, donemsel raporlama, yatirimci sunumu ve lansman icerikleri icin profesyonel insaat drone cekimi hizmetlerine ulasin.',
                sections: [
                    {
                        title: 'Insaat drone cekimi hangi alanlarda kullanilir?',
                        bullets: [
                            'Haftalik veya aylik santiye ilerleme raporlari',
                            'Yatirimci ve yonetim sunumlari',
                            'Proje teslim ve tanitim videolari',
                            'Saha lojistigi ve genel durum takibi',
                            'Pazarlama ve lansman icerikleri',
                        ],
                    },
                    {
                        title: 'Neden duzenli cekim planlamak avantajlidir?',
                        paragraphs: [
                            'Ayni acilarla belirli periyotlarda cekim yapmak, ilerleme takibini daha olculebilir hale getirir. Bu hem proje ekipleri hem de yatirimci iletisiminde ciddi kolaylik saglar.',
                        ],
                    },
                    {
                        title: 'Insaat cekiminde teslim formatlari nasil olmalidir?',
                        bullets: [
                            'Ham goruntu arsivi',
                            'Tarih bazli ilerleme kolajlari',
                            'Sunum uyumlu yatay videolar',
                            'Sosyal medya icin kisa versiyonlar',
                            'Referans arsivi icin yuksek cozum foto seti',
                        ],
                    },
                    {
                        title: 'Teklif alirken hangi bilgileri vermelisiniz?',
                        bullets: [
                            'Santiye konumu ve erisim bilgisi',
                            'Periyodik mi tek seferlik mi oldugu',
                            'Istenen teslim bicimi',
                            'Kullanilacak icerigin raporlama mi tanitim mi oldugu',
                        ],
                    },
                ],
                footerNote: 'Insaat drone cekiminde duzenli planlama, ayni acilarin korunmasi ve dogru teslim standardi proje takibi acisindan en kritik farki yaratir.',
                ctaTitle: 'Santiyeniz icin uygun drone pilotunu bulun',
                ctaDescription: 'Periyodik proje takibi veya tek seferlik tanitim cekimi icin aktif ilanlari karsilastirin.',
                ctaPrimary: 'Hizmetleri Kesfet',
                ctaSecondary: 'Ozel Talep Olustur',
                relatedLinks: serviceHubRelatedLinks.insaat.tr,
            },
            en: {
                badge: 'Construction',
                title: 'Construction Drone Filming',
                description: 'Reach professional drone pilots for site progress reporting, investor updates, project launches, and construction marketing visuals.',
                sections: [
                    {
                        title: 'Where construction drone filming is used',
                        bullets: [
                            'Weekly or monthly progress reports',
                            'Investor and management presentations',
                            'Project handover and launch videos',
                            'Site logistics and overview tracking',
                            'Marketing and promotion content',
                        ],
                    },
                    {
                        title: 'Why recurring shoots are useful',
                        paragraphs: [
                            'Capturing the same angles over time makes progress much easier to measure and communicate to teams, management, and investors.',
                        ],
                    },
                    {
                        title: 'Useful delivery formats',
                        bullets: [
                            'Raw archive footage',
                            'Date-based progress comparisons',
                            'Presentation-ready horizontal edits',
                            'Short social media cuts',
                            'High-resolution reference photo sets',
                        ],
                    },
                    {
                        title: 'What to include in your request',
                        bullets: [
                            'Site location and access details',
                            'Recurring or one-time schedule',
                            'Expected delivery format',
                            'Whether the content is for reporting or promotion',
                        ],
                    },
                ],
                footerNote: 'Consistent planning, repeatable angles, and a clear delivery standard make the biggest difference in construction drone filming.',
                ctaTitle: 'Find the right drone pilot for your site',
                ctaDescription: 'Compare active listings for recurring site tracking or one-time project promotion.',
                ctaPrimary: 'Browse Services',
                ctaSecondary: 'Create Custom Request',
                relatedLinks: serviceHubRelatedLinks.insaat.en,
            },
        },
    },
    {
        slug: 'dugun-drone-cekimi',
        path: '/dugun-drone-cekimi',
        seoTitle: {
            tr: 'Dugun Drone Cekimi | Dugun ve Etkinlik Hikayesi Cekimleri',
            en: 'Wedding Drone Filming | Wedding and Event Story Shoots',
        },
        seoDescription: {
            tr: 'Dugun, nisan ve acik hava organizasyonlari icin profesyonel dugun drone cekimi hizmeti alin.',
            en: 'Get professional wedding drone filming for weddings, engagements, and outdoor event storytelling.',
        },
        serviceType: {
            tr: 'Dugun drone cekimi',
            en: 'Wedding drone filming',
        },
        priority: '0.8',
        changefreq: 'weekly',
        copy: {
            tr: {
                badge: 'Dugun',
                title: 'Dugun Drone Cekimi',
                description: 'Mekan atmosferini, kalabaligi, giris anlarini ve gunun hikayesini daha sinematik gostermek icin profesyonel dugun drone cekimi kullanin.',
                sections: [
                    {
                        title: 'Dugun drone cekimi neden tercih edilir?',
                        bullets: [
                            'Mekan olcegini ve atmosferini daha guclu gosterir',
                            'Dis cekim ve hikaye kurgusunda sinematik acilar sunar',
                            'Giris, kalabalik ve genel planlari daha etkileyici kaydeder',
                            'Highlight videolari icin premium goruntu katmani saglar',
                        ],
                    },
                    {
                        title: 'Hangi cekimlerde kullanilir?',
                        bullets: [
                            'Dugun hikayesi ve highlight videolari',
                            'Save the date ve dis cekim gunleri',
                            'Nisan, soz ve organizasyon cekimleri',
                            'Mekan tanitimi ve davetli genel planlari',
                        ],
                    },
                    {
                        title: 'Cekim oncesi neler netlestirilmeli?',
                        paragraphs: [
                            'Mekan akisi, cekim saatleri, giris anlari, muzikli highlight beklentisi ve sosyal medyada kullanilacak teslimler cekim oncesinde netlestirilmelidir.',
                        ],
                    },
                    {
                        title: 'Pilot secerken nelere bakilmali?',
                        bullets: [
                            'Daha once dugun veya etkinlik cekimi yapmis olmasi',
                            'Guvenli ucus ve kalabalik alan deneyimi',
                            'Kurgu paketi, teslim suresi ve revizyon kapsami',
                            'Mekana ve cekim senaryosuna uygun planlama yapabilmesi',
                        ],
                    },
                ],
                footerNote: 'Dugun drone cekimi, sadece havadan goruntu degil; mekan hissini ve gunun enerjisini daha guclu anlatan hikaye aracidir.',
                ctaTitle: 'Dugununuz icin uygun drone pilotunu bulun',
                ctaDescription: 'Dugun ve etkinlik cekimlerine uygun aktif hizmetleri inceleyin, ornek isleri karsilastirin ve size en uygun pilota ulasin.',
                ctaPrimary: 'Hizmetleri Kesfet',
                ctaSecondary: 'Iletisim Kur',
                relatedLinks: serviceHubRelatedLinks.dugun.tr,
            },
            en: {
                badge: 'Wedding',
                title: 'Wedding Drone Filming',
                description: 'Use cinematic aerial footage to capture venue scale, atmosphere, entrances, and the overall story of the day more effectively.',
                sections: [
                    {
                        title: 'Why couples choose wedding drone filming',
                        bullets: [
                            'Shows venue scale and atmosphere more clearly',
                            'Adds cinematic angles to story-driven edits',
                            'Captures entrances, crowds, and wide moments better',
                            'Strengthens premium highlight video delivery',
                        ],
                    },
                    {
                        title: 'Best-fit event types',
                        bullets: [
                            'Wedding story and highlight films',
                            'Save-the-date and outdoor portrait shoots',
                            'Engagements and special event coverage',
                            'Venue showcases and guest overview scenes',
                        ],
                    },
                    {
                        title: 'What should be agreed before the shoot',
                        paragraphs: [
                            'Align on venue flow, filming hours, entrance moments, highlight edit expectations, and social media deliverables before shoot day.',
                        ],
                    },
                    {
                        title: 'How to choose the right pilot',
                        bullets: [
                            'Check past wedding or live event projects',
                            'Look for safe flying experience in crowded venues',
                            'Compare edit package, delivery speed, and revision scope',
                            'Make sure the pilot can plan around the venue schedule',
                        ],
                    },
                ],
                footerNote: 'Wedding drone filming is not just aerial coverage; it is a storytelling layer that makes the venue and the emotion of the day more memorable.',
                ctaTitle: 'Find the right drone pilot for your wedding',
                ctaDescription: 'Review active wedding-focused services, compare sample work, and contact the pilot that best matches your day.',
                ctaPrimary: 'Browse Services',
                ctaSecondary: 'Contact Us',
                relatedLinks: serviceHubRelatedLinks.dugun.en,
            },
        },
    },
    {
        slug: 'arsa-drone-cekimi',
        path: '/arsa-drone-cekimi',
        seoTitle: {
            tr: 'Arsa Drone Cekimi | Arsa ve Arazi Tanitim Cekimleri',
            en: 'Land Drone Filming | Plot and Land Showcase Shoots',
        },
        seoDescription: {
            tr: 'Arsa ve arazi satislarinda konumu ve cevreyi guclu gostermek icin profesyonel drone cekimi hizmeti alin.',
            en: 'Get professional drone filming to better present location and surroundings in plot and land sales.',
        },
        serviceType: {
            tr: 'Arsa drone cekimi',
            en: 'Land drone filming',
        },
        priority: '0.8',
        changefreq: 'weekly',
        copy: {
            tr: {
                badge: 'Arsa',
                title: 'Arsa Drone Cekimi',
                description: 'Arsa ve arazi tanitiminda sinirlar, cevre, ulasim ve genel potansiyel ancak dogru acilarla guclu gosterilir. Drone cekimi bu noktada en etkili araclarin basinda gelir.',
                sections: [
                    {
                        title: 'Arsa tanitiminda drone cekimi neden etkilidir?',
                        paragraphs: [
                            'Arazinin buyuklugunu, cevresini, yol baglantilarini ve yakin cevre avantajlarini tek bir bakista anlatir.',
                            'Ozellikle ilan siteleri, WhatsApp paylasimlari ve portfoy sunumlari icin dikkat cekici goruntu sunar.',
                        ],
                    },
                    {
                        title: 'Hangi detaylar gosterilmelidir?',
                        bullets: [
                            'Parselin genel sinirlari',
                            'Yol ve ulasim baglantilari',
                            'Yakin cevredeki yapilar ve imkanlar',
                            'Egilim, arazi formu ve genel yerlesim',
                            'Bolgenin genel potansiyeli',
                        ],
                    },
                    {
                        title: 'Cekim planinda hangi teslimler istenir?',
                        bullets: [
                            'Yatay tanitim videosu',
                            'Dikey sosyal medya videosu',
                            'Yuksek cozum referans fotograflari',
                            'Harita destekli veya aciklamali kurgu versiyonlari',
                        ],
                    },
                    {
                        title: 'Arsa cekimi icin dogru pilot nasil secilir?',
                        paragraphs: [
                            'Arazi ve acik alan cekimlerinde deneyimli, hikaye kurabilen ve lokasyon avantajlarini dogru gosterebilen pilotlar daha iyi sonuc verir.',
                        ],
                    },
                ],
                footerNote: 'Arsa drone cekimi, sadece yukaridan goruntu almak degil; alicinin arazinin konumunu ve potansiyelini hizli anlamasini saglayan bir sunum aracidir.',
                ctaTitle: 'Arsa tanitiminiz icin drone pilotu bulun',
                ctaDescription: 'Arsa ve arazi cekimlerine uygun aktif hizmetleri inceleyin veya ihtiyaciniza gore talep olusturun.',
                ctaPrimary: 'Hizmetleri Kesfet',
                ctaSecondary: 'Teklif Al',
                relatedLinks: serviceHubRelatedLinks.arsa.tr,
            },
            en: {
                badge: 'Land',
                title: 'Land Drone Filming',
                description: 'For plot and land promotion, aerial visuals are one of the strongest ways to communicate boundaries, access, surroundings, and site potential.',
                sections: [
                    {
                        title: 'Why it works well for land sales',
                        paragraphs: [
                            'It shows the scale, shape, road access, and nearby context of the land in a much clearer way than standard ground shots.',
                            'It is especially useful for listings, WhatsApp sharing, and broker portfolio presentations.',
                        ],
                    },
                    {
                        title: 'What should be shown clearly',
                        bullets: [
                            'General plot boundaries',
                            'Road and access connections',
                            'Nearby structures and facilities',
                            'Land slope and overall topography',
                            'Broader area potential',
                        ],
                    },
                    {
                        title: 'Useful deliverables for land shoots',
                        bullets: [
                            'Horizontal promo video',
                            'Vertical social media edit',
                            'High-resolution reference photos',
                            'Map-supported or annotated edits',
                        ],
                    },
                    {
                        title: 'How to choose the right pilot',
                        paragraphs: [
                            'Pilots experienced in open-land shoots and location storytelling usually deliver stronger results for land and plot marketing.',
                        ],
                    },
                ],
                footerNote: 'Land drone filming is not just about aerial footage; it is a sales tool that helps the buyer understand location and potential much faster.',
                ctaTitle: 'Find a drone pilot for your land listing',
                ctaDescription: 'Review active land-focused services or create a request based on your exact location and delivery needs.',
                ctaPrimary: 'Browse Services',
                ctaSecondary: 'Get a Quote',
                relatedLinks: serviceHubRelatedLinks.arsa.en,
            },
        },
    },
];

export const seoLandingPages: SeoLandingPageEntry[] = [
    ...manualSeoLandingPages,
    ...citySeoLandingPages.filter((page) => !manualSeoLandingPages.some((manualPage) => manualPage.path === page.path)),
    ...serviceCitySeoLandingPages.filter((page) => !manualSeoLandingPages.some((manualPage) => manualPage.path === page.path)),
];

export const seoLandingPagesByPath = new Map(seoLandingPages.map((page) => [page.path, page]));
export const seoLandingPagesBySlug = new Map(seoLandingPages.map((page) => [page.slug, page]));
