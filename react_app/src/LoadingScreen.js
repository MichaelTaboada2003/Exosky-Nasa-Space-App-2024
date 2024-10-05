// LoadingScreen.js
import React, { useEffect } from 'react';
import './App.css';

const LoadingScreen = ({ setLoading }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // Tiempo de la animación antes de redirigir (3 segundos)

    return () => clearTimeout(timeout);
  }, [setLoading]);

  const generateStars = () => {
    const starsArray = [];
    for (let i = 0; i < 100; i++) {
      const style = {
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
      };
      starsArray.push(<div className="star" style={style} key={i}></div>);
    }
    return starsArray;
  };

  return (
    <div className="loading-container">
      <div className="stars">{generateStars()}</div>
      <div className="loading-text">Cargando EXOSKY...</div>
    </div>
  );
};

export default LoadingScreen;
