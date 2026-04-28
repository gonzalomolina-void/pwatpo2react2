import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import SplashScreen from './components/SplashScreen';
import { preferencesService } from './services/preferencesService';

function App() {
  // Usamos un inicializador de estado (lazy initializer) para calcular
  // el valor inicial síncronamente y evitar el render extra.
  const [showSplash, setShowSplash] = useState(() => {
    return !preferencesService.hasSeenSplashScreen();
  });

  const handleSplashComplete = () => {
    preferencesService.setSplashScreenSeen();
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <Router>
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 transition-colors duration-500 dark:bg-slate-900 dark:text-slate-100">
          <Header />
          
          <main className="container mx-auto grow px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detalles/:id" element={<Detail />} />
              <Route path="/favoritos" element={<Favorites />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
