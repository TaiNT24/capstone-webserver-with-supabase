import { useState, useEffect, useRef } from "react";
import { fetchTaskDetailById } from "../../lib/Store";

let percent = 1;
const font_coordinate = "18px georgia";
const font_vehicle = "12px georgia";

const draw = (ctx, status, type, tasksDetail, area) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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
  ctx.fillStyle = "#68A691"; //color point

  tasksDetail.forEach((detail, index) => {
    let shape = new Path2D();
    let x = detail.location_x * percent + area.move_point;
    let y = area.height - detail.location_y * percent;
    if (index === 0) {
      ctx.moveTo(x, y);
      shape.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill(shape);

      ctx.save();
      ctx.fillStyle = "black";
      ctx.font = font_vehicle;
      ctx.fillText("Start", x - 10, y + 20);
      ctx.restore();
    } else if (index === tasksDetail.length - 1) {
      ctx.lineTo(x, y);

      shape.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill(shape);
      ctx.moveTo(x, y);

      ctx.fillStyle = "black";
      ctx.fillText("End", x - 10, y + 20);
    } else {
      ctx.lineTo(x, y);

      shape.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill(shape);
      ctx.moveTo(x, y);
    }
  });

  // if (type === 2) {
  //   let arr_x = [];
  //   let arr_y = [];

  //   ctx.save();
  //   ctx.strokeStyle = "#8c8c8c";

  //   for (let index = 0; index < tasksDetail.length; index++) {
  //     let x = tasksDetail[index].location_x * percent + area.move_point;
  //     let y = area.height - tasksDetail[index].location_y * percent;

  //     if (index === 0) {
  //       ctx.moveTo(x - 10, y - 10);

  //       arr_x.push(x);
  //       arr_y.push(y);
  //     } else if (index === tasksDetail.length - 1) {

  //       arr_x.push(x);
  //       arr_y.push(y);
  //     } else {
  //       arr_x.push(x);
  //       arr_y.push(y);

  //       let x_pre =
  //         tasksDetail[index - 1].location_x * percent + area.move_point;
  //       let y_pre = area.height - tasksDetail[index - 1].location_y * percent;

  //       let x_next =
  //         tasksDetail[index + 1].location_x * percent + area.move_point;
  //       let y_next = area.height - tasksDetail[index + 1].location_y * percent;

  //       // ctx.moveTo(x_pre - 10, y_pre - 10);
  //       ctx.lineTo(x - 10, y - 10);
  //     }
  //   }

  //   // ctx.clearRect(490,240 ,490,260);

  //   ctx.restore();
  // }

  ctx.stroke();

  ctx.save();

  ctx.fillStyle = "black";
  ctx.font = font_coordinate;
  ctx.fillText("O", 0, area.height + area.move_point);

  ctx.fillText("x", area.width, area.height + area.move_point);
  ctx.fillText("y", 5, 15);

  ctx.restore();
};

const backgroundDraw = (ctx, area) => {
  ctx.clearRect(0, 0, area.width, area.height);

  // ctx.drawImage(city, 0, 0);

  ctx.fillStyle = "#ededed"; //color background
  ctx.fillRect(area.move_point, 0, area.width + area.move_point, area.height);

  ctx.save();

  ctx.beginPath();
  ctx.strokeStyle = "#d9d9d9"; // color grid

  for (let x = 0 + area.move_point; x <= area.width; ) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, area.height);
    x = x + 100 * percent;
  }

  for (let y = 0; y <= area.height; ) {
    ctx.moveTo(area.move_point, y);
    ctx.lineTo(area.width + area.move_point, y);
    y = y + 100 * percent;
  }
  ctx.stroke();
  ctx.restore();
};

export function useCanvas(id, status, type, area) {
  percent = area.height / 1000;

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
        draw(ctx, status, type, tasksDetail, area);
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
