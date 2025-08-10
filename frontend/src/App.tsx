import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/hooks/useAuth';
import { EventsPage } from '@/pages/EventsPage';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { Protected } from '@/components/Protected';
import MyEventsPage from '@/pages/MyEventsPage';

export default function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
          <Route path="/my-events" element={<Protected><MyEventsPage /></Protected>} />
          <Route path="*" element={<div className="container">Not found</div>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}


