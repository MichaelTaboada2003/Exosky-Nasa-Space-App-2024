import React, { useState, useRef } from "react";
import LoadingScreen from "./LoadingScreen";
import { Planet } from "./Planet";
import { cn } from "./utils";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showPlanets, setShowPlanets] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);

  const infoSectionRef = useRef(null);
  const planetSectionRef = useRef(null);

  // Definir un array con planetas, colores y tamaños
  const planets = [
    { name: "Mercury", color: "#b1b1b1" },
    { name: "Venus", color: "#e3c099" },
    { name: "Earth", color: "#6b93d6" },
    { name: "Mars", color: "#d14f31" },
    { name: "Jupiter", color: "#e29d62" },
    { name: "Saturn", color: "#e6d69f" },
    { name: "Uranus", color: "#7ad9dc" },
    { name: "Neptune", color: "#466bc9" },
  ];

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
            <div className="w-4/5 h-4/5 flex flex-col items-center justify-center gap-12 overflow-x-hidden relative">
              <Planet bgColor={planets[currentPlanetIndex].color} />

              <div className="flex items-center gap-8">
                <button
                  className="rounded-md p-2 text-slate-50 border border-gray-50/30 text-2xl"
                  onClick={handlePreviousPlanet}
                >
                  <MdKeyboardArrowLeft />
                </button>

                <div>
                  <span className="font-bold text-3xl">
                    {planets[currentPlanetIndex].name}
                  </span>
                </div>

                <button
                  className="rounded-md p-2 text-slate-50 border border-gray-50/30 text-2xl"
                  onClick={handleNextPlanet}
                >
                  <MdKeyboardArrowRight />
                </button>
              </div>

              <div className="absolute top-0 left-0 w-1/3 p-4">
                <div className="w-full">
                  <input
                    className="w-full px-4 py-2 rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="Buscar ..."
                  />
                </div>

                <div className="mt-8">
                  <div className="text-2xl font-bold">
                    <span>{planets[currentPlanetIndex].name}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Laoreet
                    potenti libero varius dolor sit convallis gravida tempus a.
                    Dignissim bibendum leo aliquam nullam rutrum morbi.
                    Penatibus non luctus interdum egestas sit. Vitae laoreet
                    class maecenas laoreet venenatis ullamcorper. Nam id iaculis
                    consequat hendrerit ex elementum nibh enim. Dictum fames
                    placerat lacinia lectus mollis libero parturient. Parturien
                    malesuada diam leo nisl consequat cubilia nec fermentum.
                    Duis fringilla sociosqu lectus a ultricies. Tristique libero
                    bibendum leo himenaeos suscipit consectetur iaculis pulvinar
                    leo? Fermentum pulvinar duis maecenas iaculis vitae tortor
                    placerat taciti. Maximus eu luctus nisl quisque orci metus
                    leo. Ad nunc sagittis arcu parturient dictumst mus. Accumsan
                    facilisi torquent sit vivamus, penatibus platea mus.
                    Consectetur nec quis parturient curabitur ante, tincidunt
                    etiam. Tempor ultrices sollicitudin, senectus parturient
                    arcu lobortis. Faucibus inceptos ac risus tincidunt
                    condimentum felis montes. Donec convallis pharetra gravida
                    mi cras aptent quam. Inceptos fermentum nibh ullamcorper
                    dictum lectus velit per neque. Primis natoque elit eleifend
                    eros magnis sit porta facilisi morbi. Etiam non lectus
                    venenatis ex hac vitae amet diam. Tempor felis mi habitant,
                    commodo nibh lobortis himenaeos. Ultricies praesent nisl;
                    cubilia tincidunt ut placerat.
                  </div>
                </div>

                <div className="flex flex-wrap mt-2 gap-2 p-4">
                  {Array.from({ length: 12 }).map(() => (
                    <div className="px-3 py-1 text-sm font-medium text-gray-900 bg-white rounded-full">
                      Lorem
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex gap-2">
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

              {/*  */}
              <div className="absolute bottom-0 right-0 w-1/3 h-full flex flex-col justify-end p-4">
                <div className="text-sm">
                  Lorem ipsum odor amet, consectetuer adipiscing elit. Pulvinar
                  nostra pulvinar inceptos sem nulla vestibulum. Ad nostra
                  himenaeos netus habitasse fusce euismod. Nisi enim libero nibh
                  adipiscing eros libero potenti interdum. Aliquet senectus
                  felis conubia; commodo magna ridiculus. Nisl pharetra
                  consectetur leo nunc volutpat maecenas magnis. Consequat
                  ornare non habitasse mattis egestas cursus metus. Elit tortor
                  in a cras ad. Proin accumsan neque iaculis rutrum nec nibh
                  purus molestie. Praesent nec dapibus imperdiet magnis lacus
                  odio ligula. Velit ex dictum pharetra primis dapibus libero
                  eget lacinia. Dapibus blandit dictum integer sem imperdiet
                  arcu. Nibh sed libero fermentum eleifend bibendum nulla
                  dignissim tempor. Pellentesque lobortis curae habitasse est
                  penatibus vestibulum laoreet sapien. Finibus natoque vivamus
                  sit massa facilisis curabitur. Est tristique hendrerit sodales
                  pulvinar semper urna. Aliquam nostra posuere sem lorem elit.
                  Risus eros volutpat sodales magnis diam velit. Ex luctus enim
                  justo semper volutpat. Hac pharetra nam cursus facilisis dolor
                  lorem. Elementum mauris nam mus pellentesque venenatis
                  senectus. Maecenas at torquent nullam taciti diam varius
                  facilisis pretium. Tortor nibh integer nunc eu felis netus
                  phasellus lacinia tempus.
                </div>

                <div className="w-full h-1/3 bg-gray-950 rounded-lg overflow-hidden shadow-lg mt-4">
                  <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {Array.from({ length: 50 }).map((_, index) => (
                      <div
                        key={index}
                        className="p-3 border-b border-gray-700 hover:bg-gray-700 transition-colors"
                        onClick={() =>
                          console.log(
                            "Should select the thing in order to display some data"
                          )
                        }
                      >
                        Item {index + 1}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full mt-4">
                  <input
                    className="w-full px-4 py-2 rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="Buscar ..."
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default App;
