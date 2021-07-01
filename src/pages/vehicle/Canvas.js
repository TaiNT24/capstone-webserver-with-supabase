import { useRef, useEffect, useState } from "react";
import { useCanvas } from "./useCanvas";

function Canvas(props) {
  const [
    coordinates,
    setCoordinates,
    canvasRefBackground,
    canvasRef,
    width,
    height,
  ] = useCanvas();

  return (
    <>
      <div style={{ position: "relative" }}>
        <canvas
          id="layer2"
          ref={canvasRefBackground}
          style={{ zIndex: "1", position: "absolute", left: "0px", top: "0px" }}
          height={height}
          width={width}
        >
          This text is displayed if your browser does not support HTML5 Canvas.
        </canvas>

        <canvas
          className="App-canvas"
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            zIndex: "2",
            position: "absolute",
            left: "0px",
            top: "0px",
          }}
          // onClick={handleCanvasClick}
        />
      </div>
    </>
  );
}

export default Canvas;
