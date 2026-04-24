import InfoPageLayout, { type InfoSection } from '../components/common/InfoPageLayout';
import { usePreferences } from '../context/preferences';

export default function PrivacyPolicy() {
    const { language } = usePreferences();

    const copy = language === 'tr'
        ? {
            badge: 'Gizlilik Politikası',
            title: 'DronePazar Gizlilik Politikası',
            description: 'Bu Gizlilik Politikası, DronePazar platformu kapsamında işlenebilecek kişisel verilerin kapsamını, işlenme amaçlarını ve temel veri koruma yaklaşımını açıklar.',
            sections: [
                {
                    title: '1. Genel Bilgilendirme',
                    paragraphs: [
                        'DronePazar, kullanıcı hesaplarının oluşturulması ve yönetilmesi, pilot ve müşteri arasındaki iletişim ile rezervasyon süreçlerinin yürütülmesi, platform güvenliğinin sağlanması ve teknik operasyonların sürdürülebilmesi amacıyla belirli kişisel verileri işler.',
                        'Bu kapsamda veri sorumlusu, DronePazar platformunu işleten gerçek kişidir.',
                        'DronePazar, kişisel verileri amaçla sınırlı ve gerekli olduğu ölçüde işlemeye çalışır.',
                    ],
                },
                {
                    title: '2. Toplanan Veriler',
                    bullets: [
                        'Hesap bilgileri: ad, e-posta adresi, kullanıcı rolü',
                        'Hizmet ve kullanım bilgileri: ilan içerikleri, rezervasyon detayları, kullanıcılar arasında paylaşılan hizmete ilişkin bilgiler',
                        'Teknik veriler: IP adresi, cihaz bilgisi, tarayıcı bilgisi, oturum kayıtları, hata ve güvenlik logları',
                    ],
                },
                {
                    title: '3. Verilerin İşlenme Amaçları',
                    bullets: [
                        'Kullanıcı hesabı oluşturmak ve oturum işlemlerini yürütmek',
                        'Hesap erişimi ve hesap güvenliğini sağlamak',
                        'Pilot ve müşteri eşleşmesini kolaylaştırmak',
                        'Rezervasyon ve iletişim akışına teknik altyapı sağlamak',
                        'Teknik sorunları tespit etmek, platform güvenliğini sağlamak ve kötüye kullanımı önlemek',
                        'İletişim kanalları üzerinden iletilen talepleri değerlendirmek',
                        'Mevzuattan doğan yükümlülükleri yerine getirmek',
                    ],
                },
                {
                    title: '4. Veri Toplama Yöntemi ve Hukuki Sebep',
                    paragraphs: [
                        'Kişisel veriler; kullanıcıların platforma doğrudan bilgi girmesi, hesap oluşturması, ilan yayınlaması, rezervasyon ve iletişim özelliklerini kullanması ve platformun teknik altyapısı üzerinden oluşan kayıtlar aracılığıyla elektronik ortamda toplanabilir.',
                        'Bu veriler; platformun çalıştırılması, hesap yönetiminin sağlanması, iletişim ve rezervasyon akışına teknik altyapı sunulması, platform güvenliğinin sağlanması ve mevzuattan doğan yükümlülüklerin yerine getirilmesi amaçlarıyla işlenebilir.',
                        'Kişisel veriler, somut duruma göre bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, hukuki yükümlülüklerin yerine getirilmesi, meşru menfaatler ve gerektiğinde açık rıza hukuki sebeplerine dayanılarak işlenebilir.',
                    ],
                },
                {
                    title: '5. Veri Paylaşımı',
                    paragraphs: [
                        'DronePazar, kişisel verileri kural olarak üçüncü kişilere satmaz.',
                        'Veriler, aşağıdaki durumlarda platformun teknik işleyişi için gerekli olduğu ölçüde sınırlı olarak paylaşılabilir.',
                    ],
                    bullets: [
                        'Yürürlükteki mevzuattan doğan yükümlülüklerin yerine getirilmesi',
                        'Yetkili kurum ve makamların usulüne uygun taleplerinin karşılanması',
                        'Barındırma, altyapı, e-posta ve benzeri teknik hizmetlerin sağlanması',
                    ],
                },
                {
                    title: '6. Saklama ve Güvenlik',
                    paragraphs: [
                        'Kişisel veriler, platformun işletilmesi için gerekli süre boyunca ve ilgili yasal yükümlülükler çerçevesinde saklanabilir.',
                        'DronePazar, kişisel verilerin yetkisiz erişim, kayıp, kötüye kullanım veya hukuka aykırı işlenmesine karşı platformun yapısına uygun makul teknik ve idari tedbirler almaya çalışır. Bununla birlikte, internet üzerinden yapılan veri aktarımlarının tamamen risksiz olduğu garanti edilemez.',
                    ],
                },
                {
                    title: '7. Kullanıcı Hakları',
                    paragraphs: [
                        'Kullanıcılar, yürürlükteki mevzuat kapsamında kendileriyle ilgili kişisel verilere ilişkin olarak aşağıdaki haklara sahip olabilir.',
                    ],
                    bullets: [
                        'Kişisel verilerinin işlenip işlenmediğini öğrenme',
                        'İşlenmişse buna ilişkin bilgi talep etme',
                        'İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme',
                        'Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme',
                        'Kişisel verilerin silinmesini veya yok edilmesini isteme',
                    ],
                },
                {
                    title: '8. İletişim',
                    paragraphs: [
                        'Kişisel verilere ilişkin talepler ve sorular için: info@dronepazar.com',
                    ],
                },
                {
                    title: '9. Güncellemeler',
                    paragraphs: [
                        'DronePazar, bu Gizlilik Politikası üzerinde gerekli gördüğü değişiklikleri yapma hakkını saklı tutar. Güncel metin, platform üzerinde yayımlandığı tarihten itibaren geçerli olur.',
                    ],
                },
            ] satisfies InfoSection[],
            footerNote: 'Kişisel verilere ilişkin talepler için info@dronepazar.com adresi üzerinden iletişime geçebilirsiniz.',
        }
        : {
            badge: 'Privacy Policy',
            title: 'DronePazar Privacy Policy',
            description: 'This Privacy Policy explains the scope of personal data that may be processed through the DronePazar platform, the purposes of processing, and the platform’s general data protection approach.',
            sections: [
                {
                    title: '1. General Information',
                    paragraphs: [
                        'DronePazar processes certain personal data for the purposes of creating and managing user accounts, enabling communication between pilots and customers, operating reservation workflows, maintaining platform security, and sustaining technical operations.',
                        'In this context, the data controller is the natural person operating the DronePazar platform.',
                        'DronePazar seeks to process personal data only for limited and necessary purposes.',
                    ],
                },
                {
                    title: '2. Data Collected',
                    bullets: [
                        'Account data: name, email address, user role',
                        'Service and usage data: listing content, reservation details, and service-related information shared between users',
                        'Technical data: IP address, device information, browser information, session records, and error/security logs',
                    ],
                },
                {
                    title: '3. Purposes of Processing',
                    bullets: [
                        'To create user accounts and manage sign-in sessions',
                        'To maintain account access and account security',
                        'To facilitate pilot and customer matching',
                        'To provide technical infrastructure for reservation and communication flows',
                        'To identify technical issues, protect platform security, and prevent misuse',
                        'To review requests sent through communication channels',
                        'To comply with legal obligations',
                    ],
                },
                {
                    title: '4. Method of Data Collection and Legal Basis',
                    paragraphs: [
                        'Personal data may be collected electronically through information entered directly by users into the platform, account creation, listing publication, use of reservation and communication features, and technical records generated by the platform infrastructure.',
                        'Such data may be processed for the purposes of operating the platform, managing user accounts, providing technical infrastructure for communication and reservation flows, maintaining platform security, and complying with legal obligations.',
                        'Depending on the specific circumstance, personal data may be processed on the legal grounds of necessity for the establishment or performance of a contract, compliance with legal obligations, legitimate interests, and explicit consent where required.',
                    ],
                },
                {
                    title: '5. Data Sharing',
                    paragraphs: [
                        'DronePazar does not, as a rule, sell personal data to third parties.',
                        'Data may be shared on a limited basis only to the extent necessary for the technical operation of the platform in the circumstances set out below.',
                    ],
                    bullets: [
                        'Compliance with obligations arising under applicable law',
                        'Responding to duly authorized requests from competent authorities',
                        'Provision of hosting, infrastructure, email, and similar technical services',
                    ],
                },
                {
                    title: '6. Retention and Security',
                    paragraphs: [
                        'Personal data may be retained for as long as necessary to operate the platform and as required under applicable legal obligations.',
                        'DronePazar seeks to apply reasonable technical and administrative safeguards appropriate to the nature of the platform against unauthorized access, loss, misuse, or unlawful processing of personal data. However, data transmission over the internet cannot be guaranteed to be entirely risk-free.',
                    ],
                },
                {
                    title: '7. User Rights',
                    paragraphs: [
                        'Under applicable law, users may have the following rights in relation to their personal data.',
                    ],
                    bullets: [
                        'To learn whether their personal data is being processed',
                        'To request information if their personal data has been processed',
                        'To learn the purpose of processing and whether the data is used in line with that purpose',
                        'To request correction of incomplete or inaccurate personal data',
                        'To request deletion or destruction of personal data',
                    ],
                },
                {
                    title: '8. Contact',
                    paragraphs: [
                        'For questions and requests regarding personal data: info@dronepazar.com',
                    ],
                },
                {
                    title: '9. Updates',
                    paragraphs: [
                        'DronePazar reserves the right to make changes to this Privacy Policy when deemed necessary. The current version becomes effective as of the date it is published on the platform.',
                    ],
                },
            ] satisfies InfoSection[],
            footerNote: 'For requests regarding personal data, you can contact info@dronepazar.com.',
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
