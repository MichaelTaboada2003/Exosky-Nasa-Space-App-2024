import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { cn } from "./utils";

export const DrawingCanvas = ({ parentRef, handleExportSVG, showStarView }) => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });

  const handleContextMenu = (event) => {
    event.preventDefault();
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

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
  }, [parentRef]);

  return (
    <>
      <div
        className="w-full h-full absolute top-0 left-0 pointer-events-auto"
        onContextMenu={handleContextMenu}
        style={{ border: "1px solid black", width: "500px", height: "500px" }}
      >
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
      <button
        className={cn(
          "rounded-md border px-6 py-2 right-0 bottom-0 absolute text-xl border-gray-50/30",
          {
            "md:opacity-0": !showStarView,
            "md:opacity-100": showStarView,
          }
        )}
        onClick={() => handleExportSVG(canvasRef)}
      >
        Export your constelation
      </button>
    </>
  );
};

export default DrawingCanvas;
