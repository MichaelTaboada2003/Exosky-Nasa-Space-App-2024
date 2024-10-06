import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export const DrawingCanvas = ({ parentRef }) => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    const resizeCanvas = () => {
      if (!parentRef.current) return;

      setCanvasSize({
        width: parentRef.current.offsetWidth,
        height: parentRef.current.offsetHeight,
      });
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <ReactSketchCanvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      strokeWidth={4}
      strokeColor="white"
      backgroundImage="none"
      exportWithBackgroundImage={false}
      className="absolute top-0 left-0 pointer-events-auto"
    />
  );
};

export default DrawingCanvas;
