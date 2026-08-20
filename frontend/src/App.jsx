import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import ArtisansList from './pages/ArtisansList';
import ArtisanProfile from './pages/ArtisanProfile';
import Booking from './pages/Booking';
import Success from './pages/Success';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProfileEdit from './pages/ProfileEdit';
import DashboardPortfolio from './pages/DashboardPortfolio';
import Bookings from './pages/Bookings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Public / customer-facing — no account required */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/artisans" element={<ArtisansList />} />
        <Route path="/artisan/:id" element={<ArtisanProfile />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Artisan dashboard — protected */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/portfolio" element={<DashboardPortfolio />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/bookings" element={<Bookings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
