import { useState, useRef, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
import { SpaceView } from "./Planet";
import { cn } from "./utils";
import DrawingCanvas from "./DrawingCanvas";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showPlanets, setShowPlanets] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showStarView, setShowStarView] = useState(false);

  const [planets, setPlanets] = useState([]);
  const [planetInfo, setPlanetInfo] = useState();
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
  const [planetStars, setPlanetStars] = useState([]);

  const infoSectionRef = useRef(null);
  const planetSectionRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8000/exoplanets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        setPlanets(Array.from(new Set(data)));
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!planets) return;

    fetch(`http://localhost:8000/exoplanet/${planets[currentPlanetIndex]}`)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => setPlanetInfo(data));
  }, [currentPlanetIndex, planets]);

  useEffect(() => {
    if (!planets) return;

    const planetName = planets[currentPlanetIndex];

    if (!planetName) return;

    fetch(
      `http://localhost:8000/exoplanet/${encodeURIComponent(
        planetName
      )}/nearest_stars`
    )
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => setPlanetStars(data))
      .catch((error) => console.error(error));
  }, [currentPlanetIndex, planets]);

  function handleSearch(event) {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const inputElement = elements.namedItem("input");
    const planetsRegistered = planets.filter(
      (element) =>
        element.toLowerCase() === inputElement.value.toString().toLowerCase()
    );

    if (planetsRegistered.length === 0) {
      inputElement.value = "";
      return;
    }

    setCurrentPlanetIndex(planets.indexOf(planetsRegistered[0]));
  }

  const handleSceneTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowPlanets((prev) => !prev);
      setIsTransitioning(false);
    }, 500);
  };

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
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-slate-50 overflow-x-hidden">
          {/* Sección 1: Título e información */}
          <section
            ref={infoSectionRef}
            className={cn(
              "absolute w-full transition-all duration-500 ease-in-out transform flex flex-col items-center",
              {
                "translate-x-0 opacity-100": !showPlanets && !isTransitioning,
                "-translate-y-full opacity-0": showPlanets || isTransitioning,
              }
            )}
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold">EXOSKY!</h1>
            </div>
            <div className="flex flex-col justify-center xl:grid xl:grid-cols-2 gap-12 mx-14">
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

            <button
              className="bg-slate-50 px-6 py-3 rounded-lg text-black font-bold
                             hover:bg-slate-200 transition-all duration-300
                             transform hover:scale-105 mt-6"
              onClick={handleSceneTransition}
            >
              Go to Planets
            </button>
          </section>

          {/* Sección 2: Planetas */}
          <section
            ref={planetSectionRef}
            className={cn(
              "absolute w-full h-full transition-all duration-500 ease-in-out transform flex items-center justify-center",
              {
                "translate-x-0 opacity-100": showPlanets && !isTransitioning,
                "translate-y-full opacity-0": !showPlanets || isTransitioning,
              },
              {
                hidden: !showPlanets,
              }
            )}
          >
            <div className="w-full h-full md:w-4/5 md:h-4/5 flex flex-col items-center justify-center gap-12 overflow-x-hidden relative">
            <DrawingCanvas
            showStarView={showStarView}
            setShowStarView={setShowStarView}
            />
              <SpaceView
                showStarView={showStarView}
                setShowStarView={setShowStarView}
                planetStars={planetStars}
              />
              <div className="flex items-center gap-4 md:gap-8">
                <button
                  className="rounded-md p-2 text-slate-50 border border-gray-50/30 text-xl md:text-2xl"
                  onClick={handlePreviousPlanet}
                >
                  <MdKeyboardArrowLeft />
                </button>

                <div>
                  <span className="font-bold text-2xl md:text-3xl">
                    {planetInfo && planetInfo.name}
                  </span>
                </div>

                <button
                  className="rounded-md p-2 text-slate-50 border border-gray-50/30 text-xl md:text-2xl"
                  onClick={handleNextPlanet}
                >
                  <MdKeyboardArrowRight />
                </button>
              </div>

              <div
                className={cn(
                  "w-full md:w-1/3 p-4 my-5",
                  "md:absolute md:top-0 md:left-0",
                  "md:transition-opacity md:duration-300",
                  {
                    "md:opacity-0": showStarView,
                    "md:opacity-100": !showStarView,
                  }
                )}
              >
                <div className="w-full sm:flex sm:justify-center px-4 md:px-0">
                  <form className="w-full" onSubmit={handleSearch}>
                    <input
                      className="w-full px-4 py-2 rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="Search ..."
                      name="input"
                      autoComplete="off"
                    />
                  </form>
                </div>

                <div className="mt-8 mx-4">
                  <div className="text-2xl font-bold">
                    <span>{planetInfo && planetInfo.name}</span>
                  </div>
                </div>
                {planetInfo && (
                  <div className="flex flex-wrap mt-2 gap-2 p-4">
                    <div className="px-3 py-1 text-sm font-medium text-gray-900 bg-white rounded-full">
                      Coordinates: {planetInfo.coordinates}
                    </div>
                    <div className="px-3 py-1 text-sm font-medium text-gray-900 bg-white rounded-full">
                      Hoststar: {planetInfo.hoststar}
                    </div>
                    <div className="px-3 py-1 text-sm font-medium text-gray-900 bg-white rounded-full">
                      Base Mase: {planetInfo.pl_bmasse}
                    </div>
                    <div className="px-3 py-1 text-sm font-medium text-gray-900 bg-white rounded-full">
                      V Mag: {planetInfo.v_mag}
                    </div>
                    <div className="px-3 py-1 text-sm font-medium text-gray-900 bg-white rounded-full">
                      Ks Mag: {planetInfo.ks_mag}
                    </div>
                    <div className="px-3 py-1 text-sm font-medium text-gray-900 bg-white rounded-full">
                      Gaia Mag: {planetInfo.gaia_mag}
                    </div>
                    <div className="px-3 py-1 text-sm font-medium text-gray-900 bg-white rounded-full">
                      Spectral Type: {planetInfo.spectral_type}
                    </div>
                    <div className="px-3 py-1 text-sm font-medium text-gray-900 bg-white rounded-full">
                      Orbital Period: {planetInfo.orbital_period}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2 flex gap-2 opacity-100 absolute bottom-12 md:bottom-0 left-8 md:left-4">
                <button
                  className="px-6 py-1 bg-orange-500 hover:bg-orange-700 rounded-md font-medium transition-all"
                  onClick={() => setShowPlanets(false)}
                >
                  Go Back
                </button>
                <button className="px-6 py-1 border border-slate-50 text-slate-50-500 rounded-md font-medium hover:bg-slate-50 hover:text-slate-950 transition-colors duration-200">
                  Pick a random planet
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default App;
