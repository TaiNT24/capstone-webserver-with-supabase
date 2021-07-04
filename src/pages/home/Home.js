import { Layout } from "antd";
import Sidebar from "../../component/Siderbar";
import Content from "../../component/Content";
import { useAuth } from "../../lib/use-auth";
import { useStoreGetDevice } from "../../lib/Store";

const authPath = "/login";
let account = null;

export default function Home(props) {
  let auth = useAuth();
  let authed = auth.isLogin();

  if(auth.user){
    auth.fetchUser(auth.user.id).then((data) => {
      account = data[0];
    });
  }

  const { devices } = useStoreGetDevice();

  const extraProps = {
    devices: devices,
    user: account
  };

  const height = () => {
    var element = document.getElementsByTagName("BODY")[0];
    var positionInfo = element.getBoundingClientRect();
    var height = positionInfo.height;
    return height;
  };

  return (
    <Layout>
      <Sidebar user={account} />

      <Layout className="site-layout" style={{ marginLeft: 250 }}>
        <Content minHeight={height()} authed={authed} authPath={authPath} extraProps={extraProps}/>
      </Layout>
    </Layout>
  );
}
