import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Contact from './pages/Contact';
import BrowseDroneServices from './pages/BrowseDroneServices';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import KvkkNotice from './pages/KvkkNotice';
import Faq from './pages/Faq';
import PilotDashboard from './pages/PilotDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import DroneServiceDetails from './pages/DroneServiceDetails';
import About from './pages/About';
import CityDirectory from './pages/CityDirectory';
import SeoLandingPage from './pages/SeoLandingPage';
import PublicPilotProfile from './pages/PublicPilotProfile';
import PublicPilotServices from './pages/PublicPilotServices';
import PilotProfileSettings from './pages/PilotProfileSettings';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/layout/Footer';
import ChatWidget from './components/chat/ChatWidget';
import { PreferencesProvider } from './context/PreferencesContext';
import { usePreferences } from './context/preferences';
import Seo from './components/seo/Seo';
import { getStaticSeo } from './config/seo';
import { seoLandingPages } from './content/seoLandingPages';
import './App.css';

function PrivateRoute({ children, requirePilot, requireAdmin }: { children: React.JSX.Element; requirePilot?: boolean; requireAdmin?: boolean }) {
  const { isAuthenticated, isPilot, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  // If we require pilot status strictly, check it. (Admin doesn't bypass this for pilot-only pages)
  if (requirePilot !== undefined && isPilot !== requirePilot && !requireAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}

function AppRoutes() {
  const location = useLocation();
  const { language } = usePreferences();
  const isDashboardRoute = location.pathname === '/customer/dashboard'
    || location.pathname === '/pilot/dashboard'
    || location.pathname === '/pilot/profile'
    || location.pathname === '/admin'
    || location.pathname === '/admin/dashboard';
  const staticSeo = getStaticSeo(location.pathname, language);

  useEffect(() => {
    document.body.classList.toggle('dashboard-body', isDashboardRoute);
    document.documentElement.lang = language === 'tr' ? 'tr' : 'en';

    return () => {
      document.body.classList.remove('dashboard-body');
    };
  }, [isDashboardRoute, language]);

  return (
    <div className={`app-wrapper ${isDashboardRoute ? 'dashboard-app-shell' : ''}`}>
      {staticSeo && (
        <Seo
          title={staticSeo.title}
          description={staticSeo.description}
          path={staticSeo.path}
          noindex={staticSeo.noindex}
          type={staticSeo.type}
          schema={staticSeo.schema}
        />
      )}
      <Header variant={isDashboardRoute ? 'dashboard' : 'marketing'} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/browse-services" element={<BrowseDroneServices />} />
          <Route path="/about" element={<About />} />
          <Route path="/drone-cekimi-sehirleri" element={<CityDirectory />} />
          {seoLandingPages.map((page) => (
            <Route key={page.slug} path={page.path} element={<SeoLandingPage page={page} />} />
          ))}
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/kvkk" element={<KvkkNotice />} />
          <Route path="/faq" element={<Faq />} />
          <Route
            path="/pilot/profile"
            element={
              <PrivateRoute requirePilot={true}>
                <PilotProfileSettings />
              </PrivateRoute>
            }
          />
          <Route path="/pilot/:id/:slug/services" element={<PublicPilotServices />} />
          <Route path="/pilot/:id/services" element={<PublicPilotServices />} />
          <Route path="/pilot/:id/:slug" element={<PublicPilotProfile />} />
          <Route path="/pilot/:id" element={<PublicPilotProfile />} />
          <Route path="/service/:id/:slug" element={<DroneServiceDetails />} />
          <Route path="/service/:id" element={<DroneServiceDetails />} />
          <Route
            path="/pilot/dashboard"
            element={
              <PrivateRoute requirePilot={true}>
                <PilotDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/dashboard"
            element={
              <PrivateRoute requirePilot={false}>
                <CustomerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute requireAdmin={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute requireAdmin={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {!isDashboardRoute && <Footer />}
      <ChatWidget />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PreferencesProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </PreferencesProvider>
    </BrowserRouter>
  );
}

export default App;
