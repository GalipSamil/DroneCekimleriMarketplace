import InfoPageLayout, { type InfoSection } from '../components/common/InfoPageLayout';
import { usePreferences } from '../context/preferences';

export default function TermsOfUse() {
    const { language } = usePreferences();

    const copy = language === 'tr'
        ? {
            badge: 'Kullanım Koşulları',
            title: 'DronePazar Kullanım Koşulları',
            description: 'Bu Kullanım Koşulları, DronePazar platformunun kullanımına ilişkin temel kuralları, kullanıcı yükümlülüklerini ve DronePazar’ın sorumluluk sınırlarını düzenler.',
            sections: [
                {
                    title: '1. Genel Bilgilendirme',
                    paragraphs: [
                        'DronePazar, drone çekimi ve benzeri insansız hava aracı hizmeti arayan kullanıcılar ile bu hizmetleri sunan pilotları bir araya getiren dijital bir pazaryeri ve teknoloji platformudur.',
                        'Platform; listeleme, eşleştirme, iletişim, teklif ve rezervasyon süreçlerini kolaylaştıran teknik altyapı sağlar. DronePazar, platform üzerinden sunulan veya kararlaştırılan hiçbir hizmetin sağlayıcısı değildir ve kullanıcılar arasında kurulan hizmet ilişkilerinin tarafı değildir.',
                    ],
                },
                {
                    title: '2. Platformun Niteliği',
                    paragraphs: [
                        'DronePazar yalnızca dijital aracı platform olarak faaliyet gösterir. Platform üzerinden sunulan hizmetler doğrudan ilgili kullanıcılar arasında gerçekleşir.',
                        'Platform üzerinden yapılan tüm rezervasyonlar, hizmet talepleri, özel anlaşmalar ve hizmete ilişkin iletişimler, ilgili kullanıcılar arasında doğrudan kurulmuş kabul edilir. DronePazar, hizmetin ifasına katılmaz, hizmetin niteliğini belirlemez ve taraflar arasındaki hizmet sözleşmesinin tarafı haline gelmez.',
                    ],
                    bullets: [
                        'DronePazar yalnızca dijital aracı platformdur.',
                        'Hizmetin kapsamı, yöntemi, zamanı, saha detayları ve sonuçları ilgili kullanıcılarca belirlenir.',
                        'Hizmetin ifası, kalitesi, güvenliği, hukuka uygunluğu, teslimi, iptali ve sonuçları ilgili kullanıcıların sorumluluğundadır.',
                    ],
                },
                {
                    title: '3. Kullanıcı Yükümlülükleri',
                    paragraphs: [
                        'Platformu kullanan tüm kullanıcılar, hesapları ve platform üzerindeki tüm faaliyetlerinden bizzat sorumludur.',
                    ],
                    bullets: [
                        'Platforma doğru, güncel, eksiksiz ve yanıltıcı olmayan bilgi sağlamak.',
                        'Hesap bilgilerini ve giriş verilerini korumak, yetkisiz erişime karşı gerekli önlemleri almak.',
                        'Platformu hukuka, dürüstlük kuralına ve üçüncü kişilerin haklarına uygun şekilde kullanmak.',
                        'Üçüncü kişilerin haklarını ihlal etmemek.',
                        'Platformu kötüye kullanmamak, yanıltıcı veya hukuka aykırı içerik paylaşmamak.',
                    ],
                },
                {
                    title: '4. Drone Uçuşları ve Yasal Sorumluluk',
                    paragraphs: [
                        'Platform üzerinden sunulan drone hizmetlerine ilişkin tüm operasyonel ve hukuki sorumluluk ilgili pilotlara ve gerekli olduğu ölçüde hizmet alan kullanıcılara aittir. DronePazar, herhangi bir uçuşu onaylayan, yöneten, denetleyen veya mevzuata uygunluğunu garanti eden bir taraf değildir.',
                        'Pilotlar; uçuş izinleri, operasyon planlaması, saha güvenliği, ekipman uygunluğu, SHGM mevzuatı, hava sahası kuralları, özel mülkiyet, görüntü alma izinleri, üçüncü kişi hakları, güvenlik önlemleri ve ilgili tüm yasal yükümlülüklere tam uyum sağlamakla yükümlüdür.',
                        'DronePazar, gerçekleştirilen veya planlanan uçuşlar nedeniyle doğabilecek hiçbir idari, hukuki, cezai, mali veya operasyonel sorumluluğu kabul etmez. Hizmetin yapılabilirliği, güvenliği, yasal uygunluğu ve sonucu ilgili kullanıcıların sorumluluğundadır.',
                    ],
                    bullets: [
                        'SHGM düzenlemeleri ve ilgili İHA mevzuatı',
                        'Uçuş izni, kayıt, bildirim ve operasyon kuralları',
                        'Hava sahası kısıtlamaları, yasaklı bölgeler ve yerel güvenlik kuralları',
                        'Özel mülkiyet, üçüncü kişi hakları ve görüntü alma izinleri',
                        'Kişisel veriler, mahremiyet, yayın ve kullanım izinleri',
                        'Saha güvenliği ve doğabilecek idari, hukuki veya cezai sonuçlar',
                    ],
                },
                {
                    title: '5. İçerik ve Hizmet Bilgileri',
                    paragraphs: [
                        'Pilot profilleri, hizmet açıklamaları, fiyatlar, teslim bilgileri, görseller ve diğer hizmet içerikleri ilgili kullanıcılar tarafından oluşturulur. DronePazar, bu bilgilerin doğruluğunu, güncelliğini, eksiksizliğini, güvenilirliğini veya belirli bir sonuca yol açacağını garanti etmez.',
                        'DronePazar, kullanıcı içeriklerini önceden doğrulamakla yükümlü değildir. Bununla birlikte, hukuka aykırı, yanıltıcı, uygunsuz veya platform işleyişine zarar verdiğini değerlendirdiği içerikleri kaldırma, düzenleme, görünürlüğünü azaltma veya erişimi sınırlandırma hakkını saklı tutar.',
                    ],
                },
                {
                    title: '6. Sorumluluğun Sınırı',
                    paragraphs: [
                        'DronePazar, platformun kullanımı veya platform üzerinden kurulan ilişkiler sonucunda ortaya çıkabilecek hizmet kalitesi sorunları, teslim gecikmeleri, iptaller, saha kaynaklı problemler, maddi veya manevi zararlar, veri kaybı, gelir kaybı, üçüncü kişilere verilen zararlar ve benzeri doğrudan veya dolaylı zararlardan sorumlu tutulamaz.',
                        'Platform "olduğu gibi" ve "mevcut olduğu ölçüde" sunulmaktadır. DronePazar, platformun kesintisiz, hatasız, güvenli veya beklentilere tam uygun çalışacağını garanti etmez.',
                        'DronePazar, platform üzerinden sunulan hiçbir hizmete ilişkin açık veya zımni garanti vermez.',
                    ],
                    bullets: [
                        'Hizmetin hiç veya gereği gibi yerine getirilmemesi',
                        'Uçuşun yapılamaması, gecikmesi, iptali veya mevzuata aykırı olması',
                        'Teslim, kalite, performans veya sonuç beklentilerinin karşılanmaması',
                        'Saha kaynaklı riskler, güvenlik olayları veya ekipman arızaları',
                        'Üçüncü kişi talepleri, para cezaları, hukuki uyuşmazlıklar veya cezai sonuçlar',
                        'Veri kaybı, gelir kaybı, iş kaybı, itibar kaybı veya diğer dolaylı zararlar',
                    ],
                },
                {
                    title: '7. Kullanıcılar Arasındaki Anlaşmazlıklar',
                    paragraphs: [
                        'Platform üzerinden kurulan tüm hizmet ilişkileri kullanıcılar arasında gerçekleşir. DronePazar, bu ilişkilerin tarafı değildir ve kullanıcılar arasında doğabilecek hiçbir anlaşmazlığa müdahil olmaz.',
                        'DronePazar, kullanıcılar arasındaki herhangi bir uyuşmazlık bakımından çözüm sağlama, uzlaşma kurma, ifayı garanti etme veya zararı üstlenme yükümlülüğü altında değildir.',
                    ],
                },
                {
                    title: '8. Hesap Yönetimi',
                    paragraphs: [
                        'DronePazar, kendi takdirine bağlı olarak ve önceden bildirimde bulunmaksızın herhangi bir kullanıcı hesabını askıya alma, erişimini sınırlandırma, rezervasyon veya iletişim özelliklerini kapatma, içeriği kaldırma veya hesabı kalıcı olarak platformdan çıkarma hakkını saklı tutar.',
                        'Bu yetki özellikle kullanım koşullarının ihlali, hukuka aykırı davranış, yanlış veya yanıltıcı bilgi verilmesi, platformun güvenliğinin tehlikeye atılması, üçüncü kişi haklarının ihlali veya kötüye kullanım şüphesi halinde kullanılabilir.',
                    ],
                },
                {
                    title: '9. Hukuki Uygulama',
                    paragraphs: [
                        'Bu Kullanım Koşulları Türkiye Cumhuriyeti hukukuna tabidir.',
                        'Tüketici sıfatını haiz kullanıcıların emredici mevzuattan doğan hakları saklı kalmak kaydıyla, DronePazar ile kullanıcı arasında doğabilecek uyuşmazlıklarda Adana Mahkemeleri ve İcra Daireleri yetkilidir.',
                    ],
                },
                {
                    title: '10. Son Hüküm',
                    paragraphs: [
                        'DronePazar, bu Kullanım Koşulları’nı dilediği zaman güncelleme, değiştirme veya kısmen yürürlükten kaldırma hakkını saklı tutar. Güncel metin platformda yayımlandığı tarihte yürürlüğe girer.',
                        'Kullanıcıların platformu kullanmaya devam etmesi, güncel Kullanım Koşulları’nı kabul ettiği anlamına gelir.',
                    ],
                },
            ] satisfies InfoSection[],
            footerNote: 'DronePazar, platform üzerinden sunulan hizmetlerin tarafı değildir; platform yalnızca dijital aracı altyapı sağlar.',
        }
        : {
            badge: 'Terms of Use',
            title: 'DronePazar Terms of Use',
            description: 'These Terms of Use govern access to and use of the DronePazar platform, including core user obligations and the limits of DronePazar’s responsibility.',
            sections: [
                {
                    title: '1. General Information',
                    paragraphs: [
                        'DronePazar is a digital marketplace and technology platform that connects users seeking drone and related aerial services with pilots offering such services.',
                        'The platform provides technical infrastructure that facilitates listings, matching, communication, proposals, and reservation workflows. DronePazar is not the provider of any service offered through the platform and is not a party to service relationships established between users.',
                    ],
                },
                {
                    title: '2. Nature of the Platform',
                    paragraphs: [
                        'DronePazar operates solely as a digital intermediary platform. Services offered through the platform are performed directly between the relevant users.',
                        'All reservations, service requests, private arrangements, and service-related communications made through the platform are deemed to be established directly between users. DronePazar does not participate in the performance of the service and does not become a party to any service agreement between users.',
                    ],
                    bullets: [
                        'DronePazar acts solely as a digital intermediary platform.',
                        'Service scope, method, timing, field conditions, and outcomes are determined by the relevant users.',
                        'Performance, quality, safety, legality, delivery, cancellation, and results remain the responsibility of the relevant users.',
                    ],
                },
                {
                    title: '3. User Obligations',
                    paragraphs: [
                        'All users are personally responsible for their accounts and for all activity carried out on the platform.',
                    ],
                    bullets: [
                        'Provide accurate, current, complete, and non-misleading information.',
                        'Keep account credentials secure and protect against unauthorized access.',
                        'Use the platform in compliance with law, good faith, and third-party rights.',
                        'Do not infringe third-party rights.',
                        'Do not misuse the platform or share unlawful or misleading content.',
                    ],
                },
                {
                    title: '4. Drone Flights and Legal Responsibility',
                    paragraphs: [
                        'All operational and legal responsibility related to drone services offered through the platform belongs to the relevant pilot and, where applicable, the user requesting the service. DronePazar is not a party that approves, manages, supervises, or guarantees the legal compliance of any flight.',
                        'Pilots are responsible for full compliance with flight permissions, operational planning, field safety, equipment suitability, DGCA/SHGM rules, airspace restrictions, private property rules, filming permissions, third-party rights, safety measures, and all other applicable legal obligations.',
                        'DronePazar accepts no administrative, civil, criminal, financial, or operational responsibility arising from any planned or completed flight. The feasibility, safety, legality, and outcome of the service remain the responsibility of the relevant users.',
                    ],
                    bullets: [
                        'DGCA/SHGM regulations and all applicable UAV rules',
                        'Flight permissions, registration, notification, and operational requirements',
                        'Airspace restrictions, prohibited zones, and local safety rules',
                        'Private property, third-party rights, and filming permissions',
                        'Personal data, privacy, publication, and usage permissions',
                        'Field safety and any resulting administrative, civil, or criminal consequences',
                    ],
                },
                {
                    title: '5. Content and Service Information',
                    paragraphs: [
                        'Pilot profiles, service descriptions, prices, delivery information, images, and other service-related content are created by the relevant users. DronePazar does not guarantee the accuracy, completeness, reliability, legality, or outcome of such information.',
                        'DronePazar is not obligated to verify user content in advance. However, it reserves the right to remove, edit, limit visibility, or restrict access to content it considers unlawful, misleading, inappropriate, or harmful to platform operations.',
                    ],
                },
                {
                    title: '6. Limitation of Liability',
                    paragraphs: [
                        'DronePazar shall not be liable for service quality issues, delivery delays, cancellations, field-related problems, material or moral damages, data loss, loss of revenue, harm to third parties, or any direct or indirect loss arising from use of the platform or from relationships established through it.',
                        'The platform is provided on an "as is" and "as available" basis. DronePazar does not guarantee that the platform will operate uninterrupted, error-free, securely, or in a manner fully meeting user expectations.',
                        'DronePazar provides no express or implied warranty regarding any service listed or arranged through the platform.',
                    ],
                    bullets: [
                        'Failure to perform or improper performance of a service',
                        'A flight not taking place, being delayed, cancelled, or found unlawful',
                        'Delivery, quality, performance, or outcome expectations not being met',
                        'Field risks, safety incidents, or equipment failures',
                        'Third-party claims, fines, disputes, or criminal consequences',
                        'Loss of data, revenue, business, reputation, or other indirect losses',
                    ],
                },
                {
                    title: '7. Disputes Between Users',
                    paragraphs: [
                        'All service relationships formed through the platform arise directly between users. DronePazar is not a party to those relationships and does not intervene in disputes between users.',
                        'DronePazar has no obligation to provide a solution, secure settlement, guarantee performance, or assume loss in any dispute between users.',
                    ],
                },
                {
                    title: '8. Account Management',
                    paragraphs: [
                        'DronePazar reserves the right, at its sole discretion and without prior notice, to suspend any user account, restrict access, disable reservation or communication features, remove content, or permanently terminate access to the platform.',
                        'This right may be exercised in particular in cases of breach of these Terms, unlawful conduct, false or misleading information, risk to platform security, infringement of third-party rights, or suspected abuse.',
                    ],
                },
                {
                    title: '9. Governing Law',
                    paragraphs: [
                        'These Terms of Use are governed by the laws of the Republic of Turkiye.',
                        'Without prejudice to mandatory consumer rights, the courts and enforcement offices of Adana shall have jurisdiction over disputes arising between DronePazar and a user.',
                    ],
                },
                {
                    title: '10. Final Provision',
                    paragraphs: [
                        'DronePazar reserves the right to update, amend, or partially repeal these Terms of Use at any time. The current version becomes effective on the date it is published on the platform.',
                        'Continued use of the platform constitutes acceptance of the current Terms of Use.',
                    ],
                },
            ] satisfies InfoSection[],
            footerNote: 'DronePazar is not a party to the services offered through the platform; the platform only provides digital intermediary infrastructure.',
        };

    return (
        <InfoPageLayout
            badge={copy.badge}
            title={copy.title}
            description={copy.description}
            sections={copy.sections}
            footerNote={copy.footerNote}
        />
    );
}
