import { useState, useEffect, useRef } from "react";

let city = new Image();
city.src = "/img/backgound_canvas.png";

const draw = (ctx, frameCount, devices, area) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#f00";

  devices.forEach((device) => {
    let position = {
      x: device.last_x,
      y: device.last_y,
    };
    let shape = new Path2D();

    ctx.beginPath();

    let statusFrame = 1; //device is inactive
    let statusStyle = "#f00"; //red

    if (device.status === 0) {
      // device is active
      statusStyle = "#389e0d"; //green
    } else if (device.status === 2) {
      // device is running
      statusFrame = Math.sin(frameCount * 0.08) ** 2;
      statusStyle = "#096dd9"; //blue
    }

    ctx.fillStyle = statusStyle;

    shape.arc(position.x, position.y, 10 * statusFrame, 0, 2 * Math.PI);
    ctx.fill(shape);

    // ctx.moveTo(position.x + 10, position.y + 10);
    ctx.save();

    ctx.fillStyle = "black";
    ctx.fillText(device.code, position.x - 10, position.y + 20);

    ctx.restore();
  });
};

const backgroundDraw = (ctx, area) => {
  ctx.clearRect(0, 0, area.width, area.height);

  // ctx.drawImage(city, 0, 0);

  ctx.fillStyle = "#bfbfbf";
  ctx.fillRect(0, 0, area.width, area.height);
};

export function useCanvas(devices, area) {
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();


  const canvasRef = useRef(null);
  const canvasRefBackground = useRef(null);

  useEffect(() => {
    let element = document.getElementsByTagName("BODY")[0];
    let positionInfo = element.getBoundingClientRect();
    let height1 = positionInfo.height;
    let width1 = positionInfo.width - 250; // nav side bar

    setHeight(height1);
    setWidth(width1);
  }, []);

  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext("2d");
  
    const backgroundCanvasObj = canvasRefBackground.current;
    const backgroundCtx = backgroundCanvasObj.getContext("2d");

    let animationFrameId;

    if (devices != null && devices.length > 0 && area != null) {
      let frameCount = 0;
      window.cancelAnimationFrame(animationFrameId);

      //Our draw came here
      function render() {
        frameCount++;
        draw(ctx, frameCount, devices, area);
        animationFrameId = window.requestAnimationFrame(render);
      }

      backgroundDraw(backgroundCtx, area);
      render();
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [devices, area]);

  return [
    canvasRefBackground,
    canvasRef,
    width,
    height,
  ];
}
