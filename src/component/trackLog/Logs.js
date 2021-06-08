import { Layout, Table, Typography } from "antd";
import React, { useState } from "react";
import moment from "moment";
import FilterDevice from "./FilterDevice";
import ClearLog from "./ClearLog";
import { useStore } from "../../lib/Store";

const { Title } = Typography;
const { Sider, Content } = Layout;

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
  const { listLog, devices, clearLogs } = useStore();

  const [idDeviceFilter, setIdDeviceFilter] = useState(listLog);

  function data() {
    const data = [];

    listLog.map((e, index) => {
      if (idDeviceFilter.length === 0) {
        data.push({
          key: index,
          time: e.time,
          idDevice: e.idDevice,
          content: e.content,
        });
      } else {
        if (idDeviceFilter.includes(e.idDevice)) {
          data.push({
            key: index,
            time: e.time,
            idDevice: e.idDevice,
            content: e.content,
          });
        }
      }
      return null;
    });

    return data;
  }

  function updateIdDeviceFilter(value) {
    setIdDeviceFilter(value);
  }

  return (
    <Layout>
      <FilterDevice
        idDeviceList={devices}
        onChangeDeviceFilter={updateIdDeviceFilter}
      />

      <Layout>
        <Content style={{ textAlign: "center" }}>
          <Title level={3}>Logs</Title>
        </Content>

        <Sider style={{ backgroundColor: "#f0f2f5" }}>
          <ClearLog clearLogs={clearLogs} />
        </Sider>
      </Layout>

      <Table
        pagination={false}
        columns={columns}
        dataSource={data()}
        scroll={{ y: 350 }}
        style={{ marginTop: 10 }}
      />
    </Layout>
  );
}
