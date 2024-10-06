import React, { useState, useRef, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

const App = () => {
  const [loading, setLoading] = useState(true);

    // Estado para manejar el índice del planeta actual
    const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);

  // Creamos referencias para las secciones
  const infoSectionRef = useRef(null);
  const planetSectionRef = useRef(null);

  // Definir un array con planetas, colores y tamaños
  const planets = [
    { name: 'Mercury', color: '#b1b1b1', size: '40px' },
    { name: 'Venus', color: '#e3c099', size: '80px' },
    { name: 'Earth', color: '#6b93d6', size: '100px' },
    { name: 'Mars', color: '#d14f31', size: '60px' },
    { name: 'Jupiter', color: '#e29d62', size: '150px' },
    { name: 'Saturn', color: '#e6d69f', size: '120px' },
    { name: 'Uranus', color: '#7ad9dc', size: '90px' },
    { name: 'Neptune', color: '#466bc9', size: '85px' },
  ];

  // Función para hacer scroll a la sección de planetas
  const scrollToPlanets = () => {
    planetSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

    // Detecta cuando la infoSection sale del viewport y automáticamente hace scroll a la sección de planetas
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry.isIntersecting) {
            scrollToPlanets();
          }
        },
        { threshold: 0.1 }
      );
  
      if (infoSectionRef.current) {
        observer.observe(infoSectionRef.current);
      }
  
      return () => {
        if (infoSectionRef.current) {
          observer.unobserve(infoSectionRef.current);
        }
      };
    }, []);
  
    // Funciones para navegar entre planetas
    const handleNextPlanet = () => {
      setCurrentPlanetIndex((prevIndex) => (prevIndex + 1) % planets.length); // Avanza, y si llega al final vuelve al primero
    };
  
    const handlePreviousPlanet = () => {
      setCurrentPlanetIndex((prevIndex) =>
        prevIndex === 0 ? planets.length - 1 : prevIndex - 1
      ); // Retrocede, y si está en el primero, vuelve al último
    };

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
    <div className="body">
      {generateStars()}
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <>
          {/* Sección 1: Título e información */}
          <section className="infoSection" ref={infoSectionRef}>
            <div className="titleContainer">
              <h1 className="titulazo">EXOSKY!</h1>
            </div>
            <div className="infoContainer">
              <div>
                <h3>What is an exoplanet?</h3>
                <p className="textoInfo">
                  All the planets in our solar system revolve around the Sun. Planets that revolve around stars other than our Sun are known as exoplanets. These exoplanets are difficult to observe directly through telescopes because the brightness of their stars obscures them.
                  <br /><br />
                  Therefore, astronomers use alternative methods to detect and examine these distant planets. They observe the impact that exoplanets have on the stars they orbit to identify them.
                </p>
              </div>
              <div>
                <h3>What is EXOSKY?</h3>
                <p className="textoInfo">
                  EXOSKY is an educational app designed to give students a unique view of the night sky from the perspective of distant exoplanets. Using data from NASA's Exoplanet Archive, which includes over 5500 discovered exoplanets, the app combines these locations with the latest star catalogs to generate interactive star maps.
                </p>
              </div>
            </div>
            {/* Botón para hacer scroll a la sección de planetas */}
            <button onClick={scrollToPlanets} className="scrollButton">
              Scroll to Planets
            </button>
          </section>

          {/* Sección 2: Planetas */}
          <section className="planetSection" ref={planetSectionRef}>
            <div className="planetContainer">
              {/* Muestra el planeta actual como un círculo */}
              <div
                className="planetDisplay"
                style={{
                  backgroundColor: planets[currentPlanetIndex].color,
                  width: planets[currentPlanetIndex].size,
                  height: planets[currentPlanetIndex].size,
                  borderRadius: '50%',
                }}
              ></div>

              {/* Botones para navegar entre los planetas */}
              <div className="planetControls">
                <button onClick={handlePreviousPlanet}>Previous</button>
                <button onClick={handleNextPlanet}>Next</button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default App;