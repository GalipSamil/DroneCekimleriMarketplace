import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
    const { isAuthenticated, isPilot, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {


        const handleScroll = () => {
            // Throttling via requestAnimationFrame could be added if needed, 
            // but checking value change is a good first step.
            const shouldBeScrolled = window.scrollY > 20;
            if (isScrolled !== shouldBeScrolled) {
                setIsScrolled(shouldBeScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);

    const isActive = (path: string) => location.pathname === path;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <Rocket className="w-8 h-8 text-blue-500 transform group-hover:-translate-y-1 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        </div>
                        <span className="text-xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                            SkyMarket
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" active={isActive('/')}>Ana Sayfa</NavLink>
                        <NavLink to="/browse-services" active={isActive('/browse-services')}>Hizmetler</NavLink>
                        <NavLink to="/about" active={isActive('/about')}>Hakkımızda</NavLink>
                    </nav>

                    {/* User & Action Buttons (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={isPilot ? "/pilot/dashboard" : "/customer/dashboard"}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all"
                                >
                                    <User size={18} className="text-blue-400" />
                                    <span className="text-sm font-medium text-slate-200">Panelim</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                    title="Çıkış Yap"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors whitespace-nowrap">
                                    Giriş Yap
                                </Link>
                                <Link to="/register" className="btn-primary py-2 px-6 text-sm">
                                    Kayıt Ol
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-slate-300 hover:text-white"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-slate-950 border-b border-slate-800 p-4 shadow-2xl animate-fade-in-down">
                    <div className="flex flex-col space-y-4">
                        <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Ana Sayfa</MobileNavLink>
                        <MobileNavLink to="/browse-services" onClick={() => setIsMenuOpen(false)}>Hizmetler</MobileNavLink>
                        <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>Hakkımızda</MobileNavLink>
                        <hr className="border-slate-800" />
                        {isAuthenticated ? (
                            <>
                                <MobileNavLink to={isPilot ? "/pilot/dashboard" : "/customer/dashboard"} onClick={() => setIsMenuOpen(false)}>
                                    Panelim
                                </MobileNavLink>
                                <button
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="flex items-center space-x-2 text-red-400 font-medium p-2"
                                >
                                    <LogOut size={18} />
                                    <span>Çıkış Yap</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-3 pt-2">
                                <Link to="/login" className="text-center py-2 text-slate-300 hover:text-white border border-slate-700 rounded-lg">Giriş Yap</Link>
                                <Link to="/register" className="btn-primary text-center">Kayıt Ol</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

const NavLink = ({ to, active, children }: { to: string, active: boolean, children: React.ReactNode }) => (
    <Link
        to={to}
        className={`relative text-sm font-medium transition-colors ${active ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
    >
        {children}
        {active && (
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        )}
    </Link>
);

const MobileNavLink = ({ to, onClick, children }: { to: string, onClick: () => void, children: React.ReactNode }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block text-slate-300 hover:text-white font-medium p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
    >
        {children}
    </Link>
);

export default Header;
