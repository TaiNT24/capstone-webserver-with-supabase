import { Layout } from "antd";
import Sidebar from "../../component/Siderbar";
import Content from "../../component/Content";

export default function Home(props) {
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
        <Content 
          minHeight={height()} 
          authed={props.authed} 
          authPath={props.authPath}
          />
      </Layout>
    </Layout>
  );
}
