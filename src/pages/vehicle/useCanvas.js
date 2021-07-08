import { useState, useEffect, useRef } from "react";

let city = new Image();
city.src = "/img/backgound_canvas.png";

let percent = 1;
const radius_point = 5;

const font_coordinate = "18px georgia";
const font_vehicle = "12px georgia";

const draw = (ctx, devices, area) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#f00";

  devices.forEach((device) => {
    let position = {
      x: device.last_x * percent + area.move_point,
      y: area.height - device.last_y * percent  // dời trục Oy = height
    };
    let shape = new Path2D();

    ctx.beginPath();

    let statusFrame = 1; //device is inactive
    let statusStyle = "#f00"; //red

    if (device.status === 0) {
      // device is DISCONNECTED
      statusStyle = "#f00"; //green #389e0d
    } else if (device.status === 1) {
      // device is AVAILABLE
      statusStyle = "#389e0d"; //green
    }
    else if (device.status === 2) {
      // device is running
      // statusFrame = Math.sin(frameCount * 0.08) ** 2;
      statusStyle = "#096dd9"; //blue
    }else if (device.status === 3) {
      // device is STOP
      statusStyle = "#ff5500"; // orange
    }
    

    ctx.fillStyle = statusStyle;

    shape.arc(
      position.x,
      position.y,
      radius_point * statusFrame,
      0,
      2 * Math.PI
    );
    ctx.fill(shape);

    ctx.save();

    ctx.fillStyle = "black";
    ctx.font = font_vehicle;

    ctx.fillText(device.code, position.x - 10, position.y + 15);

    ctx.restore();
  });

  //draw Coordinate
  ctx.fillStyle = "black";
  ctx.font = font_coordinate;
  ctx.fillText("O", 0, area.height + area.move_point);

  ctx.fillText("x", area.width, area.height + area.move_point);
  ctx.fillText("y", 5, 15);
};

const backgroundDraw = (ctx, area) => {
  ctx.clearRect(0, 0, area.width, area.height);

  // ctx.drawImage(city, 0, 0);

  ctx.fillStyle = "#ededed"; //color background
  ctx.fillRect(
    area.move_point,
    0,
    area.width + area.move_point,
    area.height
  );

  //draw grid
  ctx.save();

  ctx.beginPath();
  ctx.strokeStyle = "#d9d9d9"; // color grid

  for (let x = 0 + area.move_point; x <= area.width ; ) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, area.height);
    x = x + 100 * percent;
  }

  for (let y = 0 ; y <= area.height  ; ) {
    ctx.moveTo(area.move_point, y);
    ctx.lineTo(area.width + area.move_point, y);
    y = y + 100 * percent;
  }
  ctx.stroke();
  ctx.restore();
};

export function useCanvas(devices, area) {
  percent = area.height / 1000;

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

    // let animationFrameId;

    if (devices != null && devices.length > 0 && area != null) {
      // let frameCount = 0;
      // window.cancelAnimationFrame(animationFrameId);

      //Our draw came here
      function render() {
        // frameCount++;
        draw(ctx, devices, area);
        // animationFrameId = window.requestAnimationFrame(render);
      }

      backgroundDraw(backgroundCtx, area);
      render();
    }

    // return () => {
    //   window.cancelAnimationFrame(animationFrameId);
    // };
  }, [devices, area]);

  return [canvasRefBackground, canvasRef, width, height];
}
