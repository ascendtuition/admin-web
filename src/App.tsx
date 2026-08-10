import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import UsersPage from './pages/UsersPage';
import TutorsPage from './pages/TutorsPage';
import StudentsPage from './pages/StudentsPage';
import ParentsPage from './pages/ParentsPage';
import PackagesPage from './pages/PackagesPage';
import EnrollmentsPage from './pages/EnrollmentsPage';
import PaymentsPage from './pages/PaymentsPage';
import ReferralsPage from './pages/ReferralsPage';
import CoursesPage from './pages/CoursesPage';
import NotificationsPage from './pages/NotificationsPage';
import ContentPage from './pages/ContentPage';
import OperationsPage from './pages/OperationsPage';
import SchedulePage from './pages/SchedulePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OverviewPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="tutors" element={<TutorsPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="parents" element={<ParentsPage />} />
              <Route path="packages" element={<PackagesPage />} />
              <Route path="enrollments" element={<EnrollmentsPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="content" element={<ContentPage />} />
              <Route path="operations" element={<OperationsPage />} />
              <Route path="schedule" element={<SchedulePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
