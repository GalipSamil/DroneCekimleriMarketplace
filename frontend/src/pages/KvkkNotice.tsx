import InfoPageLayout, { type InfoSection } from '../components/common/InfoPageLayout';
import { usePreferences } from '../context/preferences';

export default function KvkkNotice() {
    const { language } = usePreferences();

    const copy = language === 'tr'
        ? {
            badge: 'KVKK Aydınlatma',
            title: '6698 Sayılı Kanun Kapsamında Aydınlatma',
            description: 'Bu sayfa, DronePazar tarafından işlenen kişisel verilere ilişkin temel KVKK bilgilendirmesini özetler.',
            sections: [
                {
                    title: 'Veri Sorumlusu',
                    paragraphs: [
                        'DronePazar platformu kapsamında işlenen kişisel veriler bakımından veri sorumlusu, platformu işleten gerçek kişidir.',
                    ],
                },
                {
                    title: 'İşlenen Veri Kategorileri',
                    bullets: [
                        'Kimlik ve iletişim bilgileri',
                        'Kullanıcı hesap, ilan ve rezervasyon kayıtları',
                        'Platform içi iletişime ilişkin teknik kayıtlar',
                        'İşlem güvenliği ve hata kayıtları',
                    ],
                },
                {
                    title: 'İşleme Amaçları ve Hukuki Sebepler',
                    paragraphs: [
                        'Veriler; platformun işletilmesi, kullanıcı hesaplarının yönetilmesi, kullanıcılar arası iletişim ve rezervasyon akışına teknik altyapı sağlanması, işlem güvenliğinin korunması ve hukuki yükümlülüklerin yerine getirilmesi amaçlarıyla işlenebilir.',
                        'Kişisel veriler, somut duruma göre bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, hukuki yükümlülüklerin yerine getirilmesi, meşru menfaatler ve gerektiğinde açık rıza hukuki sebeplerine dayanılarak işlenebilir.',
                    ],
                },
                {
                    title: 'Haklarınız',
                    bullets: [
                        'Hangi verilerinizin işlendiğini öğrenme',
                        'Eksik veya yanlış işlenen verilerin düzeltilmesini isteme',
                        'Şartları varsa silme veya yok etme talebinde bulunma',
                        'İşlemeye itiraz etme ve zarar halinde tazminat talep etme',
                    ],
                },
            ] satisfies InfoSection[],
            footerNote: 'Kişisel verilere ilişkin başvurular info@dronepazar.com adresi üzerinden iletilebilir.',
        }
        : {
            badge: 'Data Notice',
            title: 'Information Notice Under Turkish Data Protection Law',
            description: 'This page summarizes the core disclosure regarding personal data processed by DronePazar under Turkish data protection requirements.',
            sections: [
                {
                    title: 'Data Controller',
                    paragraphs: [
                        'For personal data processed through the DronePazar platform, the data controller is the natural person operating the platform.',
                    ],
                },
                {
                    title: 'Categories of Data Processed',
                    bullets: [
                        'Identity and contact information',
                        'User account, listing, and booking records',
                        'Technical records relating to in-platform communication',
                        'Security and error logs',
                    ],
                },
                {
                    title: 'Purposes and Legal Grounds',
                    paragraphs: [
                        'Data may be processed for the operation of the platform, management of user accounts, provision of technical infrastructure for communication and reservation flows, protection of transaction security, and compliance with legal obligations.',
                        'Depending on the specific circumstance, personal data may be processed on the legal grounds of necessity for the establishment or performance of a contract, compliance with legal obligations, legitimate interests, and explicit consent where required.',
                    ],
                },
                {
                    title: 'Your Rights',
                    bullets: [
                        'Learn whether your personal data is being processed',
                        'Request correction of incomplete or inaccurate data',
                        'Request deletion or destruction where the conditions are met',
                        'Object to processing and seek compensation in case of damage',
                    ],
                },
            ] satisfies InfoSection[],
            footerNote: 'Requests relating to personal data can be sent to info@dronepazar.com.',
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
