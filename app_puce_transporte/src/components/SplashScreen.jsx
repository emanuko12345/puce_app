// src/components/SplashScreen.jsx
import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activar animación al montar
    setIsVisible(true);

    // Opcional: ocultar después de 3 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`splash-screen ${isVisible ? 'visible' : ''}`}>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvkyi4fHRb1yieBaU62LarXgThRLS3go2roA&s"
        alt="inicio de aplicación"
        className="splash-logo"
      />
    </div>
  );
}

export default SplashScreen;