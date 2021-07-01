import React from "react";
import { Button } from "antd";
import { ClearOutlined } from "@ant-design/icons";

export default function ButtonSize(props) {
  return (
    <>
      <Button
        type="primary"
        shape="round"
        icon={<ClearOutlined />}
        size="large"
        onClick={props.clearLogs}
        style={{ width: "80%", marginLeft: "10%"}}
      >
        Clear Log
      </Button>
    </>
  );
}