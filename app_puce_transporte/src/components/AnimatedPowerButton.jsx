import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AnimatedPowerButton.css';

export default function AnimatedPowerButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login'); // 👉 redirige al login
  };

  return (
    <div className="container" onClick={handleClick}>
      <input name="power" id="power" type="checkbox" />
      <label className="power" htmlFor="power">
        <span className="icon-off" />
        <span className="light" />
      </label>
    </div>
  );
}
