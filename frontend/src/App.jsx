import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
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
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reservar" element={<BookingPage />} />

      {/* Cliente */}
      <Route path="/cliente" element={
        <PrivateRoute allowedRoles={['cliente']}>
          <ClientDashboard />
        </PrivateRoute>
      } />
      <Route path="/cliente/citas" element={
        <PrivateRoute allowedRoles={['cliente']}>
          <MyAppointments />
        </PrivateRoute>
      } />
      <Route path="/cliente/perfil" element={
        <PrivateRoute allowedRoles={['cliente']}>
          <ClientProfile />
        </PrivateRoute>
      } />

      {/* Barbero */}
      <Route path="/barber" element={
        <PrivateRoute allowedRoles={['barbero']}>
          <BarberDashboard />
        </PrivateRoute>
      } />
      <Route path="/barber/agenda" element={
        <PrivateRoute allowedRoles={['barbero']}>
          <BarberSchedule />
        </PrivateRoute>
      } />
      <Route path="/barber/perfil" element={
        <PrivateRoute allowedRoles={['barbero']}>
          <BarberProfile />
        </PrivateRoute>
      } />

      {/* Admin */}
      <Route path="/admin" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path="/admin/citas" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminAppointments />
        </PrivateRoute>
      } />
      <Route path="/admin/servicios" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminServices />
        </PrivateRoute>
      } />
      <Route path="/admin/barberos" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminBarbers />
        </PrivateRoute>
      } />
      <Route path="/admin/usuarios" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminUsers />
        </PrivateRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}