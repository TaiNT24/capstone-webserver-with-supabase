import { useState, useEffect, useRef } from "react";
import { fetchTaskDetailById } from "../../lib/Store";

const draw = (ctx, status, tasksDetail) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#f00";

  ctx.beginPath();

  let statusStyle = "#f00"; //red ->  detail is error
  if (status === 0) {
    // detail is done
    statusStyle = "#389e0d"; //green
  } else if (status === 2) {
    // detail is running
    statusStyle = "#096dd9"; //blue
  }

  ctx.strokeStyle = statusStyle;

  tasksDetail.forEach((detail, index) => {
    let shape = new Path2D();
    let x = detail.location_x
    let y = detail.location_y
    if (index === 0) {
      ctx.moveTo(x, y);
      shape.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill(shape);
    } else {
      ctx.lineTo(x, y);
      shape.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill(shape);
      ctx.moveTo(x, y);
    }
  });

  // ctx.fill();
  ctx.stroke();
};

const backgroundDraw = (ctx, area) => {
  ctx.clearRect(0, 0, area.width, area.height);

  // ctx.drawImage(city, 0, 0);

  ctx.fillStyle = "#bfbfbf";
  ctx.fillRect(0, 0, area.width, area.height);
};

export function useCanvas(id, status, area) {
  const canvasRef = useRef(null);
  const canvasRefBackground = useRef(null);

  const [tasksDetail, setTasksDetail] = useState();

  // const [height, setHeight] = useState();
  // const [width, setWidth] = useState();

  useEffect(() => {
    // let element = document.getElementsByTagName("BODY")[0];
    // let positionInfo = element.getBoundingClientRect();
    // let height1 = positionInfo.height;
    // let width1 = positionInfo.width - 250; // nav side bar

    // setHeight(height1);
    // setWidth(width1);
    fetchTaskDetailById(id).then((data) => {
      if (data.length > 0) {
        setTasksDetail(data);
      } else {
        console.log("error_fetchTaskDetailById: " + data);
      }
    });
  }, [id]);

  useEffect(() => {
    const canvasObj = canvasRef.current;
    const backgroundCanvasObj = canvasRefBackground.current;

    const ctx = canvasObj.getContext("2d");
    const backgroundCtx = backgroundCanvasObj.getContext("2d");

    // let animationFrameId;

    if (tasksDetail != null && tasksDetail.length > 0 && area != null) {
      // let frameCount = 0;
      // window.cancelAnimationFrame(animationFrameId);

      //Our draw came here
      function render() {
        // frameCount++;
        draw(ctx, status, tasksDetail);
        // animationFrameId = window.requestAnimationFrame(render);
      }

      backgroundDraw(backgroundCtx, area);
      render();
    }

    // return () => {
    //   window.cancelAnimationFrame(animationFrameId);
    // };
  });

  return [canvasRefBackground, canvasRef];
}
