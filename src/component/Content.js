import Logs from "./trackLog/Logs";

export default function Content(props) {
  return (
    <div
      className="site-layout-background"
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: props.minHeight,
      }}
    >
      <Logs />
    </div>
  );
}
