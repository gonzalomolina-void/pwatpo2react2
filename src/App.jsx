import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';
import { preferencesService } from './services/preferencesService';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Actualizar el título del documento dinámicamente según el idioma
  useEffect(() => {
    document.title = t('app.title');
  }, [t, i18n.language]);

  // Usamos un inicializador de estado (lazy initializer) para calcular
  // el valor inicial síncronamente y evitar el render extra.
  const [showSplash, setShowSplash] = useState(() => {
    return !preferencesService.hasSeenSplashScreen();
  });

  const handleSplashComplete = () => {
    preferencesService.setSplashScreenSeen();
    setShowSplash(false);
  };

  // Redirección obligatoria a /login al finalizar el Splash si no está autenticado
  useEffect(() => {
    if (!showSplash && !loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [showSplash, loading, isAuthenticated, navigate]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 transition-colors duration-500 dark:bg-slate-900 dark:text-slate-100">
        <Header />
        
        <main className="container mx-auto grow px-4">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/detalles/:id" element={
              <ProtectedRoute>
                <Detail />
              </ProtectedRoute>
            } />
            <Route path="/favoritos" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;


