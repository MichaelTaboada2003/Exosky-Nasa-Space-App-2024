import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export const DrawingCanvas = ({ parentRef }) => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });
    // Función para manejar el click derecho y llamar a undo()
    const handleContextMenu = (event) => {
      event.preventDefault(); // Previene el menú contextual por defecto
      if (canvasRef.current) {
        canvasRef.current.undo(); // Llama a la función undo()
      }}

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
    <div className="w-full h-full absolute top-0 left-0 pointer-events-auto" onContextMenu={handleContextMenu} // Evento para detectar click derecho
    style={{ border: '1px solid black', width: '500px', height: '500px' }}>
      <ReactSketchCanvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      strokeWidth={4}
      strokeColor="white"
      backgroundImage="none"
      exportWithBackgroundImage={false}
    />
    </div>
    
  );
};

export default DrawingCanvas;
