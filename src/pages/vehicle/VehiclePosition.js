import { Layout} from "antd";
import { useCanvas } from "./useCanvas";

export default function Canvas(props) {

  const area = {
    height: 1000,
    width: 1000
  }

  const [
    canvasRefBackground,
    canvasRef
  ] = useCanvas(props.devices, area);

  return (
      <Layout style={{ position: "relative", height: area.height, width: area.width }}>
        <canvas
          id="layer1"
          ref={canvasRefBackground}
          style={{ zIndex: "1", position: "absolute", left: "0px", top: "0px" }}
          height={area.height}
          width={area.width}
        >
          This text is displayed if your browser does not support HTML5 Canvas.
        </canvas>

        <canvas
          id="layer2"
          ref={canvasRef}
          width={area.width}
          height={area.height}
          style={{
            zIndex: "2",
            position: "absolute",
            left: "0px",
            top: "0px",
          }}
        />
      </Layout>
  );
}

