import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Favorites from './pages/Favorites';
import SplashScreen from './components/SplashScreen';

function App() {
  // Usamos un inicializador de estado (lazy initializer) para calcular
  // el valor inicial síncronamente desde sessionStorage y evitar el render extra.
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('tcg_nexus_splash_seen');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('tcg_nexus_splash_seen', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
          <Header />
          
          <main className="grow container mx-auto px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detalles/:id" element={<Detail />} />
              <Route path="/favoritos" element={<Favorites />} />
              {/* Ruta por defecto para 404 - la puliremos en el issue 6 */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
