import React, { useRef, useState, useEffect } from "react";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Establecer el tamaño del canvas
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    // Establecer el estilo de línea
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 5; // Grosor de línea
    context.strokeStyle = "#ffffff"; // Color de línea

    const startDrawing = (event) => {
      const { offsetX, offsetY } = event.nativeEvent;
      setIsDrawing(true);
      setLastPosition({ x: offsetX, y: offsetY });
    };

    const draw = (event) => {
      if (!isDrawing) return;

      const { offsetX, offsetY } = event.nativeEvent;
      context.beginPath();
      context.moveTo(lastPosition.x, lastPosition.y);
      context.lineTo(offsetX, offsetY);
      context.stroke();
      setLastPosition({ x: offsetX, y: offsetY });
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    // Event listeners
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      // Cleanup event listeners when the component unmounts
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [isDrawing, lastPosition]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 z-50 " // Mantener el canvas al frente
      style={{ pointerEvents: "auto" }} // Habilitar interacción con el canvas
    ></canvas>
  );
};

export default DrawingCanvas;
