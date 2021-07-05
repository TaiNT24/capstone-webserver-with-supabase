import { Layout, Table } from "antd";
import React, { useState, useEffect } from "react";
import moment from "moment";
import FilterDevice from "./FilterDevice";
import ClearLog from "./ClearLog";
import { useStoreGetLog } from "../../lib/Store";
import { MainTitle } from "../../utils/Text";

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
  const {listLog, clearLogs} = useStoreGetLog();
  const [loading, setLoading] = useState();

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
            time: e.date_create,
            idDevice: props.devices.filter((device) => device.id === e.device)[0]
              .code,
            content: e.content,
          });
        } else {
          if (idDeviceFilter.includes(e.device)) {
            dataX.push({
              key: index,
              time: e.date_create,
              idDevice: props.devices.filter((device) => device.id === e.device)[0]
                .code,
              content: e.content,
            });
          }
        }
        return e;
      });

    }
    setData(dataX);

    if(data ){ 
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [listLog, props.devices, idDeviceFilter]);

  function updateIdDeviceFilter(value) {
    setIdDeviceFilter(value);
  }

  return (
    <Layout className="ant-layout-inside">
      <MainTitle value="Logs"/>

      <Layout style={{}}>
        <Content style={{}}>
          <FilterDevice
            idDeviceList={props.devices}
            onChangeDeviceFilter={updateIdDeviceFilter}
          />
        </Content>

        <Sider style={{ backgroundColor: "#f0f2f5" }}>
          <ClearLog clearLogs={clearLogs} />
        </Sider>
      </Layout>

      <Layout style={{ marginTop: "1em" }}>
        <Table
          pagination={false}
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ y: 420 }}
          style={{ marginTop: 10 }}
        />
      </Layout>
    </Layout>
  );
}
