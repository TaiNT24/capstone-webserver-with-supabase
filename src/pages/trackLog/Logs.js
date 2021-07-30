import { Layout, Table, Button, BackTop, Typography, Row } from "antd";
import React, { useState, useEffect } from "react";
import moment from "moment";
import FilterDevice from "./FilterDevice";
// import ClearLog from "./ClearLog";
import { useStoreGetLog } from "../../lib/Store";
import { MainTitle } from "../../utils/Text";

// const { Sider, Content } = Layout;
const { Content } = Layout;
const { Text } = Typography;

const columns = [
  {
    title: "Time",
    width: 250,
    dataIndex: "time",
    key: "time",
    sorter: (a, b) => moment(a.time).isAfter(b.time),
    sortOrder: "descend",
  },
  {
    title: "ID Device",
    width: 200,
    dataIndex: "idDevice",
    key: "idDevice",
  },
  {
    title: "Content log",
    dataIndex: "content",
    key: "content",
  },
];

export default function Logs(props) {
  // const {listLog, clearLogs} = useStoreGetLog();
  const defaultLoadPerTime = 100;

  const { listLog, fetchLogs, countLog } = useStoreGetLog(defaultLoadPerTime);

  const [countLoad, setCountLoad] = useState(1);
  const [loading, setLoading] = useState();
  const [isEndLog, setIsEndLog] = useState(false);

  const [idDeviceFilter, setIdDeviceFilter] = useState([]);
  const [data, setData] = useState();

  useEffect(() => {
    const dataX = [];
    setLoading(true);

    if (
      listLog != null &&
      props.devices != null &&
      listLog.length !== 0 &&
      props.devices.length !== 0
    ) {
      listLog.map((e, index) => {
        if (idDeviceFilter.length === 0) {
          dataX.push({
            key: index,
            time: moment(e.date_create).format("YYYY-MM-DD, HH:mm:ss"),
            idDevice: props.devices.filter(
              (device) => device.id === e.device
            )[0].code,
            content: e.content,
          });
        } else {
          if (idDeviceFilter.includes(e.device)) {
            dataX.push({
              key: index,
              time: moment(e.date_create).format("YYYY-MM-DD, HH:mm:ss"),
              idDevice: props.devices.filter(
                (device) => device.id === e.device
              )[0].code,
              content: e.content,
            });
          }
        }
        return e;
      });
    }
    setData(dataX);

    if (data) {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [listLog, props.devices, idDeviceFilter]);

  useEffect(() => {
    if (listLog) {
      if (countLog === listLog.length) {
        setIsEndLog(true);
      }
    }
  }, [countLog, listLog]);

  function updateIdDeviceFilter(value) {
    setIdDeviceFilter(value);
  }

  function handleLoadMore() {
    let new_count = countLoad + 1;
    setLoading(true);
    fetchLogs(defaultLoadPerTime * new_count);
    setCountLoad(new_count);
  }

  return (
    <Layout className="ant-layout-inside">
      <BackTop />
      <MainTitle value="Logs" />

      <Layout style={{}}>
        <Content style={{}}>
          <FilterDevice
            idDeviceList={props.devices}
            onChangeDeviceFilter={updateIdDeviceFilter}
          />
        </Content>

        {/* <Sider style={{ backgroundColor: "#f0f2f5" }}>
          <ClearLog clearLogs={clearLogs} />
        </Sider> */}
      </Layout>

      <Layout style={{ marginTop: "1em" }}>
        <Table
          pagination={false}
          columns={columns}
          dataSource={data}
          loading={loading}
          // scroll={{ y: 420 }}
          style={{ marginTop: 10 }}
        />

        <Row style={{ marginTop: "1em", }} justify="center">
          
          {isEndLog ? (
            countLoad !== 1 ? <Text strong type="success">
              All log are load
            </Text> : null
          ) : <Button
          type="primary"
          style={{ width: "25%" }}
          onClick={handleLoadMore}
          disabled={loading || isEndLog}
        >
          Load more
        </Button>}
        </Row>
      </Layout>
    </Layout>
  );
}
