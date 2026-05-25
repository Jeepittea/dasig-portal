import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import NewsPage from './pages/NewsPage';
import TrainingPage from './pages/TrainingPage';
import MembersPage from './pages/MembersPage';
import MembershipPage from './pages/MembershipPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <>
              <Nav />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/training" element={<TrainingPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
              <Footer />
              <Chatbot />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
