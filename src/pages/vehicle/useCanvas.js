import { useState, useEffect, useRef } from "react";
import { fetchAllDevice } from "../../lib/Store";

let city = new Image();
city.src = "/img/backgound_canvas.png";

const draw = (ctx, frameCount, devices) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#f00";

  devices.forEach((device) => {
    let position = {
      x: device.last_x,
      y: device.last_y,
    };
    let shape = new Path2D();

    ctx.beginPath();
    // ctx.arc(50, 100, 20, 0, 2*Math.PI)

    let x = 1; //device is inactive
    if(device.status ==! 1){ // device is active
        x = Math.sin(frameCount * 0.08) ** 2
    }
    shape.arc(
      position.x,
      position.y,
      10 * x,
      0,
      2 * Math.PI
    );
    ctx.fill(shape);

    // ctx.moveTo(position.x + 10, position.y + 10);
    ctx.save();

    ctx.fillStyle = "black";
    ctx.fillText(device.code, position.x - 10,  position.y + 20);

    ctx.restore();
  });
};

const backgroundDraw = (ctx) => {
  let WIDTH = 400;
  let HEIGHT = 300;

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.drawImage(city, 0, 0);

  //   ctx.fillStyle = "blue";

  //   ctx.beginPath();
  //   // ctx.arc(50, 100, 20, 0, 2*Math.PI)
  //   ctx.arc(400, 400, 400, 0, 2 * Math.PI);
  //   ctx.fill();
};

export function useCanvas() {
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();

  const { devices } = fetchAllDevice();

  const canvasRef = useRef(null);
  const canvasRefBackground = useRef(null);

  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    let element = document.getElementsByTagName("BODY")[0];
    let positionInfo = element.getBoundingClientRect();
    let height1 = positionInfo.height;
    let width1 = positionInfo.width;

    setHeight(height1);
    setWidth(width1);
  }, []);

  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext("2d");

    const backgroundCanvasObj = canvasRefBackground.current;
    const backgroundCtx = backgroundCanvasObj.getContext("2d");

    let animationFrameId;

    if (devices != null && devices.length > 0) {
      let frameCount = 0;

      //Our draw came here
      function render() {
        frameCount++;
        draw(ctx, frameCount, devices);
        animationFrameId = window.requestAnimationFrame(render);
      }

      backgroundDraw(backgroundCtx);
      render();
    }

    // return () => {
    //   window.cancelAnimationFrame(animationFrameId);
    // };
  }, [devices, draw]);

  return [
    coordinates,
    setCoordinates,
    canvasRefBackground,
    canvasRef,
    width,
    height,
  ];
}
