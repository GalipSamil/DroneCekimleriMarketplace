import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/preferences';
import BrandLogo from './BrandLogo';

interface HeaderProps {
    variant?: 'marketing' | 'dashboard';
}

const Header: React.FC<HeaderProps> = ({ variant = 'marketing' }) => {
    const { isAuthenticated, isPilot, isAdmin, logout } = useAuth();
    const { language, setLanguage, theme, toggleTheme } = usePreferences();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const location = useLocation();
    const isServiceDetailRoute = location.pathname.startsWith('/service/');
    const isScrolled = variant === 'dashboard' || hasScrolled;
    const useHeroReadableHeader = variant === 'marketing' && isServiceDetailRoute && !isScrolled;
    const marketingHeaderClass = isScrolled
        ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800'
        : useHeroReadableHeader
            ? 'bg-slate-950/34 backdrop-blur-[6px] border-b border-white/10 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.85)]'
            : 'bg-transparent';


    const copy = language === 'tr'
        ? {
            viewSite: 'Siteyi Gör',
            browseServices: 'Hizmetleri Keşfet',
            panel: 'Panelim',
            profile: 'Profilim',
            logout: 'Çıkış Yap',
            home: 'Ana Sayfa',
            services: 'Hizmetler',
            about: 'Hakkımızda',
            login: 'Giriş Yap',
            register: 'Kayıt Ol',
            languageTr: 'TR',
            languageEn: 'EN',
            switchToLight: 'Açık temaya geç',
            switchToDark: 'Koyu temaya geç',
        }
        : {
            viewSite: 'View Site',
            browseServices: 'Explore Services',
            panel: 'Dashboard',
            profile: 'My Profile',
            logout: 'Log Out',
            home: 'Home',
            services: 'Services',
            about: 'About',
            login: 'Log In',
            register: 'Sign Up',
            languageTr: 'TR',
            languageEn: 'EN',
            switchToLight: 'Switch to light theme',
            switchToDark: 'Switch to dark theme',
        };

    useEffect(() => {
        if (variant === 'dashboard') {
            return;
        }

        const handleScroll = () => {
            setHasScrolled(window.scrollY > 20);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [variant]);

    const isActive = (path: string) => location.pathname === path;

    if (variant === 'dashboard') {
        const workspaceLink = isAdmin ? '/' : '/browse-services';
        const workspaceLabel = isAdmin ? copy.viewSite : copy.browseServices;

        return (
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/88 backdrop-blur-xl shadow-[0_10px_40px_-24px_rgba(15,23,42,0.95)]">
                <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-4">
                        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
                            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/78 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-blue-400/30 group-hover:bg-slate-900">
                                <BrandLogo
                                    className="h-8 w-8 items-center justify-center"
                                    imageClassName="h-8 w-8 transition-transform duration-300 group-hover:scale-[1.04]"
                                />
                            </div>
                            <span className="text-xl font-bold font-heading tracking-tight text-slate-100">
                                DronePazar
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <PreferenceControls
                            language={language}
                            theme={theme}
                            setLanguage={setLanguage}
                            toggleTheme={toggleTheme}
                            trLabel={copy.languageTr}
                            enLabel={copy.languageEn}
                            themeLabel={theme === 'dark' ? copy.switchToLight : copy.switchToDark}
                        />

                        <Link
                            to={workspaceLink}
                            className="hidden sm:inline-flex items-center space-x-2 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition-all hover:border-blue-400/30 hover:text-white"
                        >
                            <span>{workspaceLabel}</span>
                        </Link>

                        {isAuthenticated && isPilot && (
                            <Link
                                to="/pilot/profile"
                                className="hidden sm:inline-flex items-center space-x-2 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition-all hover:border-blue-400/30 hover:text-white"
                            >
                                <span>{copy.profile}</span>
                            </Link>
                        )}

                        {isAuthenticated && (
                            <Link
                                to={isAdmin ? '/admin' : (isPilot ? '/pilot/dashboard' : '/customer/dashboard')}
                                className="inline-flex items-center space-x-2 rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2 text-sm font-medium text-slate-200 transition-all hover:border-blue-400/30 hover:text-white"
                            >
                                <User size={16} className="text-blue-500" />
                                <span className="hidden sm:inline">{copy.panel}</span>
                            </Link>
                        )}

                        <button
                            onClick={logout}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-400 transition-colors hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-300"
                            title={copy.logout}
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform ${marketingHeaderClass}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="group flex items-center gap-2.5">
                        <div className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-blue-400/30 ${useHeroReadableHeader ? 'border-white/14 bg-slate-950/60 backdrop-blur-sm' : 'border-white/10 bg-slate-900/78'}`}>
                            <BrandLogo
                                className="h-8 w-8 items-center justify-center"
                                imageClassName={`h-8 w-8 transition-transform duration-300 group-hover:scale-[1.04]`}
                            />
                        </div>
                        <span className={`text-xl font-bold font-heading tracking-tight ${useHeroReadableHeader ? 'text-white' : 'text-slate-100'}`}>
                            DronePazar
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" active={isActive('/')} tone={useHeroReadableHeader ? 'hero' : 'default'}>{copy.home}</NavLink>
                        <NavLink to="/browse-services" active={isActive('/browse-services')} tone={useHeroReadableHeader ? 'hero' : 'default'}>{copy.services}</NavLink>
                        <NavLink to="/about" active={isActive('/about')} tone={useHeroReadableHeader ? 'hero' : 'default'}>{copy.about}</NavLink>
                    </nav>

                    {/* User & Action Buttons (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <PreferenceControls
                            language={language}
                            theme={theme}
                            setLanguage={setLanguage}
                            toggleTheme={toggleTheme}
                            trLabel={copy.languageTr}
                            enLabel={copy.languageEn}
                            themeLabel={theme === 'dark' ? copy.switchToLight : copy.switchToDark}
                        />

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {isPilot && (
                                    <Link
                                        to="/pilot/profile"
                                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all"
                                    >
                                        <span className="text-sm font-medium text-slate-200">{copy.profile}</span>
                                    </Link>
                                )}
                                <Link
                                    to={isAdmin ? "/admin" : (isPilot ? "/pilot/dashboard" : "/customer/dashboard")}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all"
                                >
                                    <User size={18} className="text-blue-500" />
                                    <span className="text-sm font-medium text-slate-200">{copy.panel}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                    title={copy.logout}
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors whitespace-nowrap">
                                    {copy.login}
                                </Link>
                                <Link to="/register" className="btn-primary py-2 px-6 text-sm">
                                    {copy.register}
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
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-3">
                            <PreferenceControls
                                language={language}
                                theme={theme}
                                setLanguage={setLanguage}
                                toggleTheme={toggleTheme}
                                trLabel={copy.languageTr}
                                enLabel={copy.languageEn}
                                themeLabel={theme === 'dark' ? copy.switchToLight : copy.switchToDark}
                            />
                        </div>
                        <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>{copy.home}</MobileNavLink>
                        <MobileNavLink to="/browse-services" onClick={() => setIsMenuOpen(false)}>{copy.services}</MobileNavLink>
                        <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>{copy.about}</MobileNavLink>
                        <hr className="border-slate-800" />
                        {isAuthenticated ? (
                            <>
                                {isPilot && (
                                    <MobileNavLink to="/pilot/profile" onClick={() => setIsMenuOpen(false)}>
                                        {copy.profile}
                                    </MobileNavLink>
                                )}
                                <MobileNavLink to={isAdmin ? "/admin" : (isPilot ? "/pilot/dashboard" : "/customer/dashboard")} onClick={() => setIsMenuOpen(false)}>
                                    {copy.panel}
                                </MobileNavLink>
                                <button
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="flex items-center space-x-2 text-red-400 font-medium p-2"
                                >
                                    <LogOut size={18} />
                                    <span>{copy.logout}</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-3 pt-2">
                                <Link to="/login" className="text-center py-2 text-slate-300 hover:text-white border border-slate-700 rounded-lg">{copy.login}</Link>
                                <Link to="/register" className="btn-primary text-center">{copy.register}</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

const NavLink = ({ to, active, children, tone = 'default' }: { to: string, active: boolean, children: React.ReactNode, tone?: 'default' | 'hero' }) => (
    <Link
        to={to}
        className={`relative text-sm font-medium transition-colors ${active
            ? 'text-blue-500'
            : tone === 'hero'
                ? 'text-slate-100/88 hover:text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
    >
        {children}
        {active && (
            <span className={`absolute left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full ${tone === 'hero'
                ? '-bottom-5 bg-white'
                : '-bottom-6 bg-blue-500'
                }`} />
        )}
    </Link>
);

interface PreferenceControlsProps {
    language: 'tr' | 'en';
    theme: 'dark' | 'light';
    setLanguage: (language: 'tr' | 'en') => void;
    toggleTheme: () => void;
    trLabel: string;
    enLabel: string;
    themeLabel: string;
}

const PreferenceControls = ({
    language,
    theme,
    setLanguage,
    toggleTheme,
    trLabel,
    enLabel,
    themeLabel,
}: PreferenceControlsProps) => (
    <div className="flex items-center gap-2">
        <div className="inline-flex items-center rounded-xl border border-white/10 bg-slate-900/70 p-1">
            <button
                type="button"
                onClick={() => setLanguage('tr')}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${language === 'tr' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                {trLabel}
            </button>
            <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                {enLabel}
            </button>
        </div>

        <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-300 transition-colors hover:border-blue-400/30 hover:text-white"
            title={themeLabel}
            aria-label={themeLabel}
        >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
    </div>
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
