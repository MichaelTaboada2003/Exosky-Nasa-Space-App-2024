import { useEffect, useState, useRef } from "react";
import { DrawingCanvas } from "./DrawingCanvas";

export function SpaceView(props) {
  return (
    <div className="w-full h-screen relative">
      {!props.showStarView ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Planet setShowStarView={props.setShowStarView} />
        </div>
      ) : (
        <StarView
          stars={props.planetStars}
          onClose={() => props.setShowStarView(false)}
        />
      )}
    </div>
  );
}

export function Planet(props) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative perspective-[1000px]">
      <div
        className="size-96 rounded-full transition-transform duration-300 ease-linear"
        style={{
          backgroundColor: "#fff",
          transform: `rotateY(${rotation}deg)`,
          backgroundImage:
            "linear-gradient(45deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)",
        }}
        onClick={() => props.setShowStarView(true)}
      />
    </div>
  );
}

function StarView({ stars, onClose }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const raMin = Math.min(...stars.map((s) => s.ra));
  const raMax = Math.max(...stars.map((s) => s.ra));
  const decMin = Math.min(...stars.map((s) => s.dec));
  const decMax = Math.max(...stars.map((s) => s.dec));

  const convertToScreenCoordinates = (ra, dec) => {
    const amplificationFactor = 10;

    const normalizedRA = ((ra - raMin) / (raMax - raMin)) * amplificationFactor;
    const normalizedDec =
      ((dec - decMin) / (decMax - decMin)) * amplificationFactor;

    const raRadians = (normalizedRA * Math.PI) / 2;
    const decRadians = (normalizedDec * Math.PI) / 2;

    const x = Math.cos(raRadians);
    const y = Math.sin(decRadians);

    const margin = {
      x: dimensions.width * 0.1,
      y: dimensions.height * 0.1,
    };

    const usableWidth = dimensions.width - margin.x * 2;
    const usableHeight = dimensions.height - margin.y * 2;

    const screenX = margin.x + ((x + 1) / 2) * usableWidth;
    const screenY = margin.y + ((y + 1) / 2) * usableHeight;

    return {
      x: (screenX / dimensions.width) * 100,
      y: (screenY / dimensions.height) * 100,
    };
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden p-4"
      ref={containerRef}
    >
      {dimensions.width > 0 &&
        stars.map((star, index) => {
          const coords = convertToScreenCoordinates(star.ra, star.dec);

          return (
            <div
              key={index}
              className="absolute rounded-full bg-white size-1 shadow-[0_0_5px_3px_rgba(255,255,255,0.6)] animate-pulse pointer-events-none"
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transition: "all 0.3s ease-in-out",
              }}
            />
          );
        })}

      <DrawingCanvas parentRef={containerRef} />

      <div className="absolute bottom-4 left-4 text-white/50 text-sm">
        {`${Math.round(dimensions.width)} x ${Math.round(dimensions.height)}px`}
      </div>

      <button
        onClick={onClose}
        className="absolute top-8 right-4 bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 "
      >
        Go back to planet
      </button>
    </div>
  );
}

export default Planet;
