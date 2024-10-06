import { useEffect, useState, useRef } from "react";

export function SpaceView(props) {
  const sampleStars = [
    { name: "Sirius", ra: "06h 45m", dec: "-16° 43'", magnitude: -1.46 },
    { name: "Vega", ra: "18h 37m", dec: "+38° 47'", magnitude: 0.03 },
    { name: "Arcturus", ra: "14h 15m", dec: "+19° 11'", magnitude: -0.04 },
    {
      name: "Alpha Centauri",
      ra: "14h 39m",
      dec: "-60° 50'",
      magnitude: -0.27,
    },
    { name: "Capella", ra: "05h 16m", dec: "+45° 59'", magnitude: 0.08 },
    { name: "Rigel", ra: "05h 14m", dec: "-08° 12'", magnitude: 0.13 },
    { name: "Procyon", ra: "07h 39m", dec: "+05° 13'", magnitude: 0.34 },
    { name: "Achernar", ra: "01h 37m", dec: "-57° 14'", magnitude: 0.46 },
    { name: "Betelgeuse", ra: "05h 55m", dec: "+07° 24'", magnitude: 0.42 },
    { name: "Polaris", ra: "02h 31m", dec: "+89° 15'", magnitude: 1.97 },
  ];

  return (
    <div className="w-full h-screen relative">
      {!props.showStarView ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Planet
            bgColor={props.bgColor}
            setShowStarView={props.setShowStarView}
          />
        </div>
      ) : (
        <StarView
          stars={sampleStars}
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
          backgroundColor: props.bgColor,
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

  const convertToScreenCoordinates = (ra, dec) => {
    const hours = ra.split("h ")[0];
    const minutes = ra.split("h ")[1].toString().split("m")[0];
    const raRadians =
      ((parseInt(hours) + parseInt(minutes) / 60) / 24) * 2 * Math.PI;

    const decDegrees = parseFloat(dec.replace("°", ""));
    const decRadians = (decDegrees * Math.PI) / 180;

    const r = (2 + Math.cos(decRadians)) / 3;
    const x = r * Math.cos(raRadians);
    const y = r * Math.sin(raRadians);

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
      <div className="absolute inset-0" />

      {dimensions.width > 0 &&
        stars.map((star, index) => {
          const coords = convertToScreenCoordinates(star.ra, star.dec);
          const size = Math.max(2, 8 - star.magnitude * 1.5);

          const brightness = Math.max(0.3, 1 - star.magnitude * 0.2);

          return (
            <div
              key={index}
              className="absolute rounded-full bg-white"
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                width: `${size}px`,
                height: `${size}px`,
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 ${size * 2}px ${
                  size / 2
                }px rgba(255,255,255,${brightness})`,
                opacity: brightness,
                transition: "all 0.3s ease-in-out",
              }}
              title={`${star.name} (RA: ${star.ra}, Dec: ${star.dec})`}
            />
          );
        })}

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
