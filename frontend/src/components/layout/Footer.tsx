import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { usePreferences } from '../../context/preferences';
import { popularCitySeoLandingPages } from '../../content/seoCityLandingPages';
import BrandLogo from './BrandLogo';

const Footer: React.FC = () => {
    const { language } = usePreferences();
    const instagramUrl = 'https://www.instagram.com/dronepazartr/';
    const xUrl = 'https://x.com/DronePazar';
    const footerCityLinks = popularCitySeoLandingPages.slice(0, 3);
    const copy = language === 'tr'
        ? {
            description: 'Drone cekimi arayan kullanicilarla pilot profillerini bulusturan dijital platform.',
            quickLinks: 'Hizli Erisim',
            browse: 'Hizmet Ara',
            becomePilot: 'Pilot Ol',
            about: 'Hakkimizda',
            contact: 'Iletisim',
            legal: 'Kurumsal',
            terms: 'Kullanim Kosullari',
            privacy: 'Gizlilik Politikasi',
            kvkk: 'KVKK Aydinlatma',
            faq: 'Sikca Sorulan Sorular',
            popularCities: 'Sehir Rehberi',
            cityGuideDescription: 'Sehir bazli SEO sayfalari ana akisi kalabaliklastirmadan bu rehber altinda toplandi.',
            allCities: 'Tum Sehirler',
            copyright: 'Tum haklari saklidir.',
        }
        : {
            description: 'A digital platform connecting people looking for drone shoots with pilot profiles.',
            quickLinks: 'Quick Links',
            browse: 'Browse Services',
            becomePilot: 'Become a Pilot',
            about: 'About',
            contact: 'Contact',
            legal: 'Company',
            terms: 'Terms of Use',
            privacy: 'Privacy Policy',
            kvkk: 'Data Notice',
            faq: 'FAQ',
            popularCities: 'City Guide',
            cityGuideDescription: 'City-based SEO pages are collected under this guide instead of taking over the main experience.',
            allCities: 'All Cities',
            copyright: 'All rights reserved.',
        };

    return (
        <footer className="border-t border-slate-900 bg-slate-950 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-5">
                    <div className="xl:col-span-1">
                        <Link to="/" className="group mb-4 flex items-center gap-2.5">
                            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/78 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-blue-400/30 group-hover:bg-slate-900">
                                <BrandLogo
                                    className="h-8 w-8 items-center justify-center"
                                    imageClassName="h-8 w-8 transition-transform duration-300 group-hover:scale-[1.04]"
                                />
                            </div>
                            <span className="font-heading text-xl font-bold tracking-tight text-slate-100">
                                DronePazar
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            {copy.description}
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-6 font-semibold text-slate-100">{copy.quickLinks}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/browse-services" className="text-slate-400 transition-colors hover:text-blue-500">{copy.browse}</Link></li>
                            <li><Link to="/register" className="text-slate-400 transition-colors hover:text-blue-500">{copy.becomePilot}</Link></li>
                            <li><Link to="/about" className="text-slate-400 transition-colors hover:text-blue-500">{copy.about}</Link></li>
                            <li><Link to="/contact" className="text-slate-400 transition-colors hover:text-blue-500">{copy.contact}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-semibold text-slate-100">{copy.legal}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/terms" className="text-slate-400 transition-colors hover:text-blue-500">{copy.terms}</Link></li>
                            <li><Link to="/privacy" className="text-slate-400 transition-colors hover:text-blue-500">{copy.privacy}</Link></li>
                            <li><Link to="/kvkk" className="text-slate-400 transition-colors hover:text-blue-500">{copy.kvkk}</Link></li>
                            <li><Link to="/faq" className="text-slate-400 transition-colors hover:text-blue-500">{copy.faq}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-semibold text-slate-100">{copy.popularCities}</h4>
                        <p className="mb-4 text-sm leading-relaxed text-slate-400">
                            {copy.cityGuideDescription}
                        </p>
                        <ul className="space-y-3 text-sm">
                            {footerCityLinks.map((page) => (
                                <li key={page.slug}>
                                    <Link to={page.path} className="text-slate-400 transition-colors hover:text-blue-500">
                                        {page.areaServed?.[language]} drone {language === 'tr' ? 'cekimi' : 'filming'}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link to="/drone-cekimi-sehirleri" className="text-slate-400 transition-colors hover:text-blue-500">
                                    {copy.allCities}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-semibold text-slate-100">{copy.contact}</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex items-start space-x-3">
                                <MapPin size={18} className="mt-0.5 shrink-0 text-blue-500" />
                                <span>Maslak Mah. Buyukdere Cad. No:123<br />Sariyer/Istanbul</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="shrink-0 text-blue-500" />
                                <span>+90 (212) 555 0000</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="shrink-0 text-blue-500" />
                                <span>info@dronepazar.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between space-y-4 border-t border-slate-900 pt-8 md:flex-row md:space-y-0">
                    <div className="text-sm text-slate-500">
                        (c) {new Date().getFullYear()} DronePazar. {copy.copyright}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <SocialButton
                            href={xUrl}
                            icon={Twitter}
                            label="X"
                            tone="dark"
                        />
                        <SocialButton
                            href={instagramUrl}
                            icon={Instagram}
                            label="Instagram"
                            tone="brand"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialButton = ({
    href,
    icon: Icon,
    label,
    tone,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    tone: 'dark' | 'brand';
}) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${tone === 'dark'
            ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:text-white'
            : 'border-pink-500/20 bg-pink-500/10 text-pink-300 hover:border-pink-400/40 hover:bg-pink-500/20 hover:text-pink-200'
            }`}
    >
        <Icon size={15} />
        {label}
    </a>
);

export default Footer;
