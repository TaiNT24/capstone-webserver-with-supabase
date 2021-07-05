import { Layout} from "antd";
import { useCanvas } from "./useCanvas";

export default function Canvas(props) {
  const area = {
    height: 500,
    width: 1000,
    move_point: 20
  } // origin: 1000*2000 => const x = 2

  const [
    canvasRefBackground,
    canvasRef
  ] = useCanvas(props.devices, area);
  
  return (
      <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
        <canvas
          id="layer1"
          ref={canvasRefBackground}
          style={{ zIndex: "1", position: "absolute", left: "0px", top: "0px" }}
          height={area.height  }
          width={area.width + area.move_point}
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
            top: "0px",
          }}
        />
      </div>
  );
}

