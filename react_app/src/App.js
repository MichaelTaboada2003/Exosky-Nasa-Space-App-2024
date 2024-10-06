import React, { useState, useRef, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

const App = () => {
  const [loading, setLoading] = useState(true);

  // Estado para manejar el índice del planeta actual
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);

  // Creamos referencias para las secciones
  const infoSectionRef = useRef(null);
  const planetSectionRef = useRef(null);

  // Definir un array con planetas, colores y tamaños
  const planets = [
    { name: "Mercury", color: "#b1b1b1", size: "40px" },
    { name: "Venus", color: "#e3c099", size: "80px" },
    { name: "Earth", color: "#6b93d6", size: "100px" },
    { name: "Mars", color: "#d14f31", size: "60px" },
    { name: "Jupiter", color: "#e29d62", size: "150px" },
    { name: "Saturn", color: "#e6d69f", size: "120px" },
    { name: "Uranus", color: "#7ad9dc", size: "90px" },
    { name: "Neptune", color: "#466bc9", size: "85px" },
  ];

  // Función para hacer scroll a la sección de planetas
  const scrollToPlanets = () => {
    planetSectionRef.current.scrollIntoView({ behavior: "smooth" });
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
        top: `${Math.random() * 100}dvh`,
        left: `${Math.random() * 100}dvw`,
      };
      starsArray.push(<div className="star" style={style} key={i}></div>);
    }
    return starsArray;
  };

  return (
    <div className="min-h-screen relative">
      {generateStars()}
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-slate-50 overflow-hidden">
          {/* Sección 1: Título e información */}
          <section className="max-w-6xl w-full px-4 flex flex-col items-center" ref={infoSectionRef}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold">EXOSKY!</h1>
            </div>
            <div className="flex flex-col justify-center xl:grid xl:grid-cols-2 gap-12">
              <div className="flex flex-col gap-2 mx-12 sm:mx-0">
                <h3 className="text-3xl text-slate-50 font-semibold">
                  What is an exoplanet?
                </h3>
                <p className="text-justify">
                  <div>
                    All the planets in our solar system revolve around the Sun.
                    Planets that revolve around stars other than our Sun are
                    known as exoplanets. These exoplanets are difficult to
                    observe directly through telescopes because the brightness
                    of their stars obscures them.
                  </div>
                  <div className="mt-2">
                    Therefore, astronomers use alternative methods to detect and
                    examine these distant planets. They observe the impact that
                    exoplanets have on the stars they orbit to identify them.
                  </div>
                </p>
              </div>
              <div className="flex flex-col gap-2 mx-12 sm:mx-0">
                <h3 className="text-3xl text-slate-50 font-semibold">
                  What is EXOSKY?
                </h3>
                <p className="text-justify">
                  EXOSKY is an educational app designed to give students a
                  unique view of the night sky from the perspective of distant
                  exoplanets. Using data from NASA's Exoplanet Archive, which
                  includes over 5500 discovered exoplanets, the app combines
                  these locations with the latest star catalogs to generate
                  interactive star maps.
                </p>
              </div>
            </div>
            {/* Botón para hacer scroll a la sección de planetas */}
            <button
              onClick={scrollToPlanets}
              className="bg-slate-50 px-4 py-2 rounded-lg text-black font-bold"
            >
              Go to Planets
            </button>
          </section>

          {/* Sección 2: Planetas */}
          <section className="hidden px-4" ref={planetSectionRef}>
            <div className="planetContainer">
              {/* Muestra el planeta actual como un círculo */}
              <div
                className="planetDisplay"
                style={{
                  backgroundColor: planets[currentPlanetIndex].color,
                  width: planets[currentPlanetIndex].size,
                  height: planets[currentPlanetIndex].size,
                  borderRadius: "50%",
                }}
              ></div>

              {/* Botones para navegar entre los planetas */}
              <div className="planetControls">
                <button onClick={handlePreviousPlanet}>Previous</button>
                <button onClick={handleNextPlanet}>Next</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default App;
