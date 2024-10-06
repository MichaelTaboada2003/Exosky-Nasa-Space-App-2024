import { useEffect, useState } from "react";

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
        onMouseEnter={() => props.setPlanetIsBeingHovered(true)}
        onMouseLeave={() => props.setPlanetIsBeingHovered(false)}
      />
    </div>
  );
}

export default Planet;
