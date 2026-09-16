import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useAuthStore from './store/useAuthStore';
import DashboardLayout from './components/layout/DashboardLayout';
import Footer from './components/layout/Footer';
import PageTransition from './components/ui/PageTransition';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';

import ClientDashboard from './pages/client/ClientDashboard';
import MyAppointments from './pages/client/MyAppointments';
import ClientProfile from './pages/client/ClientProfile';

import BarberDashboard from './pages/barber/BarberDashboard';
import BarberSchedule from './pages/barber/BarberSchedule';
import BarberProfile from './pages/barber/BarberProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminServices from './pages/admin/AdminServices';
import AdminBarbers from './pages/admin/AdminBarbers';
import AdminUsers from './pages/admin/AdminUsers';

// Rutas protegidas por rol
function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Públicas */}
        <Route path="/" element={<PageTransition><HomePage /><Footer /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /><Footer /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /><Footer /></PageTransition>} />
        <Route path="/reservar" element={<PageTransition><BookingPage /><Footer /></PageTransition>} />

        {/* Dashboard Layout wrapper para las rutas de usuarios */}
        <Route element={<DashboardLayout />}>
          {/* Cliente */}
          <Route path="/cliente" element={
            <PrivateRoute allowedRoles={['cliente']}>
              <PageTransition><ClientDashboard /></PageTransition>
            </PrivateRoute>
          } />
          <Route path="/cliente/citas" element={
            <PrivateRoute allowedRoles={['cliente']}>
              <PageTransition><MyAppointments /></PageTransition>
            </PrivateRoute>
          } />
          <Route path="/cliente/perfil" element={
            <PrivateRoute allowedRoles={['cliente']}>
              <PageTransition><ClientProfile /></PageTransition>
            </PrivateRoute>
          } />

          {/* Barbero */}
          <Route path="/barber" element={
            <PrivateRoute allowedRoles={['barbero']}>
              <PageTransition><BarberDashboard /></PageTransition>
            </PrivateRoute>
          } />
          <Route path="/barber/agenda" element={
            <PrivateRoute allowedRoles={['barbero']}>
              <PageTransition><BarberSchedule /></PageTransition>
            </PrivateRoute>
          } />
          <Route path="/barber/perfil" element={
            <PrivateRoute allowedRoles={['barbero']}>
              <PageTransition><BarberProfile /></PageTransition>
            </PrivateRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
              <PageTransition><AdminDashboard /></PageTransition>
            </PrivateRoute>
          } />
          <Route path="/admin/citas" element={
            <PrivateRoute allowedRoles={['admin']}>
              <PageTransition><AdminAppointments /></PageTransition>
            </PrivateRoute>
          } />
          <Route path="/admin/servicios" element={
            <PrivateRoute allowedRoles={['admin']}>
              <PageTransition><AdminServices /></PageTransition>
            </PrivateRoute>
          } />
          <Route path="/admin/barberos" element={
            <PrivateRoute allowedRoles={['admin']}>
              <PageTransition><AdminBarbers /></PageTransition>
            </PrivateRoute>
          } />
          <Route path="/admin/usuarios" element={
            <PrivateRoute allowedRoles={['admin']}>
              <PageTransition><AdminUsers /></PageTransition>
            </PrivateRoute>
          } />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}