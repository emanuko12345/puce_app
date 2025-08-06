import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeVideo.css';

export default function WelcomeVideo() {
  const navigate = useNavigate();

  return (
    <div className="wv-container">
      <video className="wv-video" autoPlay muted loop>
        <source src="/video/bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>
      <div className="wv-overlay">
        <h1 className="wv-title">Bienvenido a PUCERIDE </h1>
        <button className="wv-button" onClick={() => navigate('/login')}>
          Empezar →
        </button>
      </div>
    </div>
  );
}
