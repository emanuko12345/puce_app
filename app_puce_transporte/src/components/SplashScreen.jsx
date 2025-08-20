// src/components/SplashScreen.jsx
import React, { useState, useEffect } from 'react';
import './SplashScreen.css';
import imagenCarroPuce from '../assets/imagen1carropuce.jpg'; // Ruta a tu imagen local

function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`splash-screen ${isVisible ? 'visible' : ''}`}>
      <img
        src={imagenCarroPuce}
        alt="inicio de aplicación"
        className="splash-logo"
      />
    </div>
  );
}

export default SplashScreen;