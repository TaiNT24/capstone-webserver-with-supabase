import React from "react";
import { Layout } from "antd";
import "./App.less";

import Sidebar from "./component/Siderbar";
import Content from "./component/Content";

const App = () => {
  const height = () => {
    var element = document.getElementsByTagName("BODY")[0];
    var positionInfo = element.getBoundingClientRect();
    var height = positionInfo.height;
    return height;
  };

  return (
    <Layout>
      <Sidebar />

      <Layout className="site-layout" style={{ marginLeft: 250 }}>
        <Content minHeight={height()} />
      </Layout>
    </Layout>
  );
};

export default App;
