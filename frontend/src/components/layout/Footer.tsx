import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 group mb-4">
                            <div className="relative">
                                <Rocket className="w-6 h-6 text-blue-500" />
                                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20" />
                            </div>
                            <span className="text-xl font-bold font-heading text-slate-100">
                                SkyMarket
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Türkiye'nin en kapsamlı drone hizmetleri pazaryeri. Profesyonel pilotlarla müşterileri buluşturan güvenilir platform.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-slate-100 font-semibold mb-6">Hızlı Erişim</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/browse-services" className="text-slate-400 hover:text-blue-400 transition-colors">Hizmet Ara</Link></li>
                            <li><Link to="/register" className="text-slate-400 hover:text-blue-400 transition-colors">Pilot Ol</Link></li>
                            <li><Link to="/about" className="text-slate-400 hover:text-blue-400 transition-colors">Hakkımızda</Link></li>
                            <li><Link to="/contact" className="text-slate-400 hover:text-blue-400 transition-colors">İletişim</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-slate-100 font-semibold mb-6">Kurumsal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/terms" className="text-slate-400 hover:text-blue-400 transition-colors">Kullanım Koşulları</Link></li>
                            <li><Link to="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link to="/kvkk" className="text-slate-400 hover:text-blue-400 transition-colors">KVKK Aydınlatma</Link></li>
                            <li><Link to="/faq" className="text-slate-400 hover:text-blue-400 transition-colors">Sıkça Sorulan Sorular</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-slate-100 font-semibold mb-6">İletişim</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex items-start space-x-3">
                                <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                                <span>Maslak Mah. Büyükdere Cad. No:123<br />Sarıyer/İstanbul</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-blue-500 shrink-0" />
                                <span>+90 (212) 555 0000</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-blue-500 shrink-0" />
                                <span>info@skymarket.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social & Copyright */}
                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-sm text-slate-500">
                        © {new Date().getFullYear()} SkyMarket. Tüm hakları saklıdır.
                    </div>
                    <div className="flex space-x-6">
                        <SocialIcon icon={Twitter} />
                        <SocialIcon icon={Instagram} />
                        <SocialIcon icon={Linkedin} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
    <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors transform hover:-translate-y-1 duration-300">
        <Icon size={20} />
    </a>
);

export default Footer;
