import { useLocation, useParams } from "react-router-dom";
import { MainTitle } from "../../utils/Text";
import { useCanvas } from "./useCanvas";

export default function TaskDetail(props) {
  const { id } = useParams();
  const location = useLocation();

  const area = {
    height: 500,
    width: 1000,
    move_point: 35,
  };

  const [canvasRefBackground, canvasRef] = useCanvas(
    id,
    location.state.status,
    location.state.type,
    area
  );

  return (
    <div style={{ position: "relative", height: "100vh", width: "77vw" }}>
      <MainTitle value="History Map" />

      <div >
        <canvas
          id="layer1"
          ref={canvasRefBackground}
          style={{ zIndex: "1", position: "absolute", left: "0px", top: "12vh" }}
          height={area.height + area.move_point + 10}
          width={area.width + area.move_point + 20}
        >
          This text is displayed if your browser does not support HTML5 Canvas.
        </canvas>

        <canvas
          id="layer2"
          ref={canvasRef}
          width={area.width + area.move_point}
          height={area.height + area.move_point}
          style={{
            zIndex: "2",
            position: "absolute",
            left: "0px",
            top: "12vh",
          }}
        />
      </div>
    </div>
  );
}
