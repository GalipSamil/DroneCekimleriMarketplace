import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Contact from './pages/Contact';
import BrowseDroneServices from './pages/BrowseDroneServices';
import PilotDashboard from './pages/PilotDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import DroneServiceDetails from './pages/DroneServiceDetails';
import About from './pages/About';
import PublicPilotProfile from './pages/PublicPilotProfile';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/layout/Footer';
import ChatWidget from './components/chat/ChatWidget';
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
  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/browse-services" element={<BrowseDroneServices />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pilot/:id" element={<PublicPilotProfile />} />
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
      <Footer />
      <ChatWidget />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
