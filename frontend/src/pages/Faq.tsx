import InfoPageLayout, { type InfoSection } from '../components/common/InfoPageLayout';
import { usePreferences } from '../context/preferences';

export default function Faq() {
    const { language } = usePreferences();

    const copy = language === 'tr'
        ? {
            badge: 'SSS',
            title: 'Sıkça Sorulan Sorular',
            description: 'Platformun çalışma şekli, rezervasyon akışı ve iletişim kanalları hakkında temel soruların kısa cevaplarını burada bulabilirsiniz.',
            sections: [
                {
                    title: 'DronePazar nasıl çalışır?',
                    paragraphs: [
                        'Müşteriler ihtiyaçlarına uygun hizmetleri veya pilotları arar, detayları inceler ve uygun seçenekler üzerinden rezervasyon veya iletişim başlatır.',
                    ],
                },
                {
                    title: 'Pilotlar nasıl seçiliyor?',
                    paragraphs: [
                        'Pilotlar profil bilgileri, hizmet kapsamı, ekipman ve konum bilgilerine göre platformda listelenir.',
                    ],
                },
                {
                    title: 'Rezervasyon süreci nasıl ilerler?',
                    paragraphs: [
                        'Kullanıcı hizmet detaylarını inceler, uygun hizmeti seçer, rezervasyon oluşturur ve taraflar gerekli iletişimi platform üzerinden sürdürebilir.',
                    ],
                },
                {
                    title: 'DronePazar hizmetin tarafı mı?',
                    paragraphs: [
                        'Hayır. DronePazar, yalnızca kullanıcılar arasında iletişim, listeleme ve rezervasyon sürecini kolaylaştıran bir teknoloji platformudur.',
                        'Platform üzerinden sunulan hizmetlerin ifası, kalitesi, güvenliği, teslimi, iptali ve taraflar arasında doğabilecek uyuşmazlıklar tamamen ilgili kullanıcıların sorumluluğundadır.',
                        'DronePazar, kullanıcılar arasındaki anlaşmazlıklarda taraf değildir ve bu anlaşmazlıkların çözümünden sorumlu tutulamaz.',
                    ],
                },
                {
                    title: 'Şifremi unuttum, ne yapmalıyım?',
                    paragraphs: [
                        'Giriş ekranındaki şifre sıfırlama akışını kullanarak kayıtlı e-posta adresinize sıfırlama bağlantısı gönderebilirsiniz.',
                    ],
                },
                {
                    title: 'DronePazar’a nasıl ulaşırım?',
                    paragraphs: [
                        'İletişim sayfasındaki formu kullanabilir, `info@dronepazar.com` adresine yazabilir veya sosyal medya hesapları üzerinden bize ulaşabilirsiniz.',
                    ],
                },
            ] satisfies InfoSection[],
            footerNote: 'Detaylı bilgi için Kullanım Koşulları ve Gizlilik Politikası sayfalarını inceleyebilirsiniz.',
        }
        : {
            badge: 'FAQ',
            title: 'Frequently Asked Questions',
            description: 'Here you can find short answers to the most common questions about how the platform, booking flow, and communication channels work.',
            sections: [
                {
                    title: 'How does DronePazar work?',
                    paragraphs: [
                        'Customers search for suitable services or pilots, review the details, and start a booking or communication flow through the platform.',
                    ],
                },
                {
                    title: 'How are pilots listed?',
                    paragraphs: [
                        'Pilots are presented based on their profile details, service scope, equipment, and location.',
                    ],
                },
                {
                    title: 'How does booking work?',
                    paragraphs: [
                        'Users review service details, choose a suitable option, create a booking, and continue coordination through the platform.',
                    ],
                },
                {
                    title: 'Is DronePazar a party to the service?',
                    paragraphs: [
                        'No. DronePazar is only a technology platform that facilitates communication, listings, and reservation workflows between users.',
                        'The performance, quality, safety, delivery, cancellation, and any disputes arising between the parties in relation to services offered through the platform remain entirely the responsibility of the relevant users.',
                        'DronePazar is not a party to disputes between users and cannot be held responsible for resolving such disputes.',
                    ],
                },
                {
                    title: 'What if I forgot my password?',
                    paragraphs: [
                        'You can use the password reset flow on the login screen to send a reset link to your registered email address.',
                    ],
                },
                {
                    title: 'How can I contact DronePazar?',
                    paragraphs: [
                        'You can use the contact form, email `info@dronepazar.com`, or reach out through our social media accounts.',
                    ],
                },
            ] satisfies InfoSection[],
            footerNote: 'For more detail, you can review the Terms of Use and Privacy Policy pages.',
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
