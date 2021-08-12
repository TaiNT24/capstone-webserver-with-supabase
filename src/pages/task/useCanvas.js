import { useState, useEffect, useRef } from "react";
import { fetchTaskDetailById } from "../../store/Store";

let percent = 1;
const font_coordinate = "14px Arial";
const font_vehicle = "12px georgia";

const draw = (ctx, status, type, tasksDetail, area) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.beginPath();

  if (type === 2) {
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = "#bfbfbf";

    for (let i = 0; i < tasksDetail.length - 1; i++) {
      let x = tasksDetail[i].location_x * percent + area.move_point;
      let y = area.height - tasksDetail[i].location_y * percent;

      let x_next = tasksDetail[i + 1].location_x * percent + area.move_point;
      let y_next = area.height - tasksDetail[i + 1].location_y * percent;

      if (x === x_next) {
        ctx.fillRect(x - 10, y, x_next - x + 20, y_next - y);
      } else {
        ctx.fillRect(x, y - 10, x_next - x, y_next - y + 20);
      }
    }

    ctx.restore();
  }

  // let statusStyle = "#f00"; //red ->  detail is error
  // if (status === 0) {
  //   // detail is done
  //   statusStyle = "#389e0d"; //green
  // } else if (status === 2) {
  //   // detail is running
  //   statusStyle = "#096dd9"; //blue
  // }

  let statusStyle = "#096dd9";

  ctx.strokeStyle = statusStyle;
  ctx.fillStyle = "#68A691"; //color point

  let path = new Path2D();
  let points = [];

  for (let i = 0; i < tasksDetail.length; i++) {
    let shape = new Path2D();

    let x = tasksDetail[i].location_x * percent + area.move_point;
    let y = area.height - tasksDetail[i].location_y * percent;
    if (i === 0) {
      path.moveTo(x, y);
      points.push({ x: x, y: y });
      shape.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill(shape);

      ctx.save();
      ctx.fillStyle = "black";
      ctx.font = font_vehicle;
      ctx.fillText("Start", x - 10, y + 20);
      ctx.restore();
    } else if (i === tasksDetail.length - 1) {
      path.lineTo(x, y);
      points.push({ x: x, y: y });

      shape.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill(shape);
      path.moveTo(x, y);

      ctx.fillStyle = "black";
      ctx.fillText("End", x - 10, y + 20);
    } else {
      // if (type === 2) {
      //   let path_dup = new Path2D();

      //   let x_next = tasksDetail[i + 1].location_x * percent + area.move_point;
      //   let y_next = area.height - tasksDetail[i + 1].location_y * percent;
      //   let id_next = tasksDetail[i + 1].id;

      //   let x_prev = tasksDetail[i - 1].location_x * percent + area.move_point;
      //   let y_prev = area.height - tasksDetail[i - 1].location_y * percent;
      //   let id_prev = tasksDetail[i - 1].id;

      //   if (x_next === x_prev && y_next === y_prev) {
      //     console.log(
      //       "id_next: " +
      //         id_next +
      //         ", x_next: " +
      //         x_next +
      //         ", y_next: " +
      //         y_next
      //     );
      //     console.log(
      //       "id_prev: " +
      //         id_prev +
      //         ", x_prev: " +
      //         x_prev +
      //         ", y_prev: " +
      //         y_prev
      //     );

      //     // ctx.beginPath();
      //     ctx.save();
      //     ctx.strokeStyle = "red";
      //     path_dup.moveTo(x, y);
      //     path_dup.lineTo(x_next, y_next);
      //     ctx.stroke(path_dup);

      //     ctx.restore();

      //     path.moveTo(x_next, y_next);

      //   } else {
      //     path.lineTo(x, y);

      //     path.moveTo(x, y);
      //   }
      // } else {
      //   path.lineTo(x, y);

      //   path.moveTo(x, y);
      // }
      path.lineTo(x, y);

      let isDup = false;
      for (let i = 0; i < points.length; i++) {
        let p = points[i];
        if (p.x === x && p.y === y) {
          points.splice(i, points.length);
          isDup = true;
          break;
        }
      }

      // points.forEach((p, index) => {
      //   if(p.x === x && p.y === y){
      //     // points.pop();
      //     list.splice(index, points.length);
      //     isDup = true;
      //     break;
      //   }
      // });

      if (!isDup) {
        points.push({ x: x, y: y });
      }

      path.moveTo(x, y);
      shape.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill(shape);
    }
  }
  ctx.stroke(path);

  if (type === 2) {
    ctx.beginPath();
    let path2 = new Path2D();
    ctx.strokeStyle = "#389e0d"; //green: shortest path
    for (let i = 0; i < points.length; i++) {
      let x = points[i].x;
      let y = points[i].y;
      if (i === 0) {
        path2.moveTo(x, y);
      } else if (i === points.length - 1) {
        path2.lineTo(x, y);

        path2.moveTo(x, y);
      } else {
        path2.lineTo(x, y);

        path2.moveTo(x, y);
      }
    }
    ctx.stroke(path2);
  }

  // if (type === 2) {
  //   ctx.beginPath();
  //   ctx.save();
  //   ctx.strokeStyle = "gray";
  //   let path1 = new Path2D();
  //   let path2 = new Path2D();

  //   for (let i = 0; i < tasksDetail.length - 1; i++) {
  //     let x = tasksDetail[i].location_x * percent + area.move_point;
  //     let y = area.height - tasksDetail[i].location_y * percent;

  //     let x_next = tasksDetail[i + 1].location_x * percent + area.move_point;
  //     let y_next = area.height - tasksDetail[i + 1].location_y * percent;

  //     let x_prev;
  //     // let y_prev;

  //     if (i > 0) {
  //       x_prev = tasksDetail[i - 1].location_x * percent + area.move_point;
  //       // y_prev = area.height - tasksDetail[i - 1].location_y * percent;
  //     }

  //     if (i === 0) {
  //       if (x === x_next) {
  //         path1.moveTo(x + 10, y);
  //         path2.moveTo(x - 10, y);
  //       } else {
  //         path1.moveTo(x, y + 10);
  //         path2.moveTo(x, y - 10);
  //       }
  //     } else if (i === tasksDetail.length - 2) {
  //       if (x === x_prev) {
  //         path1.lineTo(x + 10, y);
  //         path2.lineTo(x - 10, y);
  //       } else {
  //         path1.lineTo(x, y + 10);
  //         path2.lineTo(x, y - 10);
  //       }
  //       if (x === x_next) {
  //         path1.moveTo(x + 10, y);
  //         path2.moveTo(x - 10, y);
  //       } else {
  //         path1.moveTo(x, y + 10);
  //         path2.moveTo(x, y - 10);
  //       }

  //       if (x === x_next) {
  //         path1.lineTo(x_next + 10, y_next);
  //         path2.lineTo(x_next - 10, y_next);
  //       } else {
  //         path1.lineTo(x_next, y_next + 10);
  //         path2.lineTo(x_next, y_next - 10);
  //       }
  //     } else {
  //       if (x === x_prev) {
  //         path1.lineTo(x + 10, y);
  //         path2.lineTo(x - 10, y);
  //       } else {
  //         path1.lineTo(x, y + 10);
  //         path2.lineTo(x, y - 10);
  //       }

  //       if (x === x_next) {
  //         path1.moveTo(x + 10, y);
  //         path2.moveTo(x - 10, y);
  //       } else {
  //         path1.moveTo(x, y + 10);
  //         path2.moveTo(x, y - 10);
  //       }
  //     }
  //   }

  //   ctx.stroke(path1);
  //   ctx.stroke(path2);
  //   ctx.restore();
  // }

  // ctx.save();

  // ctx.fillStyle = "black";
  // ctx.font = font_coordinate;
  // ctx.fillText("0", 0, area.height + area.move_point);

  // // ctx.fillText("x", area.width, area.height + area.move_point);
  // // ctx.fillText("y", 5, 15);

  // for(let i = 0; i < area.width; i++){
  //   ctx.fillText("x", area.width, area.height + area.move_point);
  // }

  // ctx.restore();
};

const backgroundDraw = (ctx, area) => {
  ctx.clearRect(
    0,
    0,
    area.width + area.move_point + 20,
    area.height + area.move_point + 10
  );

  // ctx.drawImage(city, 0, 0);

  ctx.font = font_coordinate;
  ctx.fillStyle = "#ededed"; //color background
  ctx.fillRect(area.move_point, 0, area.width, area.height);

  ctx.save();

  ctx.beginPath();
  ctx.strokeStyle = "#d9d9d9"; // color grid

  let count_x = 0;
  let x;
  for (x = 0 + area.move_point; x <= area.width; ) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, area.height);

    if (count_x > 0) {
      ctx.save();
      ctx.fillStyle = "black";
      ctx.fillText(`${100 * count_x}`, x - 15, area.height + 25);
      ctx.restore();
    }
    x = x + 100 * percent;
    count_x++;
  }

  ctx.save();
  ctx.fillStyle = "black";
  ctx.fillText(`${100 * count_x}`, x - 15, area.height + 25);
  ctx.restore();

  let count_y = 9;

  ctx.save();
  ctx.fillStyle = "black";
  ctx.fillText(`${100 * 10}`, 0, 10);
  ctx.restore();

  for (let y = 0; y <= area.height; ) {
    ctx.moveTo(area.move_point, y);
    ctx.lineTo(area.width + area.move_point, y);

    if (count_y > 0 && y !== 0) {
      ctx.save();
      ctx.fillStyle = "black";
      ctx.fillText(`${100 * count_y}`, 0, y + 5);
      ctx.restore();
      count_y--;
    }
    y = y + 100 * percent;
  }
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "black";
  ctx.fillText("0", 10, area.height + 10);
  ctx.restore();
};

export function useCanvas(id, status, type, area) {
  percent = area.height / 1000;

  const canvasRef = useRef(null);
  const canvasRefBackground = useRef(null);

  const [tasksDetail, setTasksDetail] = useState();

  useEffect(() => {
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
