import { Table, Layout, Tag } from "antd";
import { fetchTask, fetchAllStaff } from "../../lib/Store";
import { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { MainTitle } from "../../utils/Text";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

export default function Tasks(props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState();
  const [devicesFilter, setDevicesFilter] = useState([]);

  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Vehicle",
      key: "device",
      dataIndex: "device",
      width: 100,
      filters: devicesFilter,
      onFilter: (value, record) => record.device.props.value === value,
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
      width: 120,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      width: 100,
      filters: [
        {
          text: "Done",
          value: "Done",
        },
        {
          text: "Error",
          value: "Error",
        },
        {
          text: "Running",
          value: "Running",
        },
      ],
      onFilter: (value, record) => record.status.props.children === value,
    },
    {
      title: "Date create",
      key: "date_create",
      dataIndex: "date_create",
      width: 180,
      //   sorter: (a, b) =>
      //     moment(a.date_create).unix() - moment(b.date_create).unix(),
      //   defaultSortOrder: "descend",
    },
    {
      title: "Create By",
      key: "create_by",
      dataIndex: "create_by",
    },
    {
      title: "Detail",
      key: "detail",
      dataIndex: "detail",
      width: 100,
      fixed: "right",
      render: ({ id, status, type }) => (
        <Link
          to={{ pathname: `/tasks/${id}`, state: { status: status, type: type } }}
          key={id}
        >
          View map
        </Link>
      ),
    },
  ];

  useEffect(() => {
    if (props.devices) {
      if (!data) {
        setLoading(true);

        let deviceListFilter = [];

        props.devices.forEach((device) => {
          deviceListFilter.push({
            key: device.id,
            text: device.code,
            value: device.id,
          });
        });

        setDevicesFilter(deviceListFilter);

        fetchTask().then((dataTask) => {
          if (dataTask.length >= 0) {
            setupData(dataTask);
          } else {
            console.log("error_fetchTask: " + dataTask);
          }
        });
      }
    }
    // eslint-disable-next-line
  }, [props.devices]);

  function setupData(dataTask) {
    const dataShow = [];

    fetchAllStaff().then((dataStaff) => {
      if (dataStaff.length >= 0) {
        dataTask.forEach((task) => {
          let typeText = "";
          if(task.type === 0){
            typeText = "Task";
          } else if(task.type === 1){
            typeText = "Follow Path";
          } else if(task.type === 2){
            typeText = "Solve Maze";
          }

          let status;
          switch (task.status) {
            case 0:
              status = (
                <Tag color="#87d068" icon={<CheckCircleOutlined />}>
                  Done
                </Tag>
              );
              break;
            case 1:
              status = (
                <Tag icon={<CloseCircleOutlined />} color="#cd201f">
                  Error
                </Tag>
              );
              break;
            case 2:
              status = (
                <Tag icon={<SyncOutlined spin />} color="#108ee9">
                  Running
                </Tag>
              );
              break;

            default:
              status = (
                <Tag icon={<WarningOutlined />} color="#108ee9">
                  UN_SET_STATUS
                </Tag>
              );
          }

          let deviceCode = props.devices.filter(
            (device) => device.id === task.device_id
          )[0].code;

          let device = (
            <Link
              to={{ pathname: `/vehicles/${task.device_id}` }}
              value={task.device_id}
            >
              {deviceCode}
            </Link>
          );

          let createByEmail = dataStaff.filter(
            (staff) => staff.id === task.create_by
          )[0].email;

          dataShow.push({
            key: task.id,
            name: task.name,
            date_create: moment(task.date_create).format(
              "YYYY-MM-DD, HH:mm:ss"
            ),
            status: status,
            type: typeText,
            device: device,
            create_by: createByEmail,
            detail: { id: task.id, status: task.status, type: task.type },
          });
        });

        setData(dataShow);

        // if (data.length === 0) {
        //   setData(dataShow);
        // } else {
        //   setData((data) => [...data, dataShow]);
        // }
      } else {
        console.log("error_fetchAllStaff: " + dataStaff);
      }
      setLoading(false);
    });
  }

  //   function handleTableChange(pagination, filters, sorter) {
  //     debugger;
  // if (filters.device) {
  //   fetchTaskFilterByDevice(filters.device).then((data) => {
  //     setupData(data);
  //   });
  // }
  // fetchTaskFilterByDevice({
  //   sortField: sorter.field,
  //   sortOrder: sorter.order,
  //   pagination,
  //   ...filters,
  // });
  //   }

  //   function loadMoreRow(node) {
  //     const perc =
  //       (node.scrollTop / (node.scrollHeight - node.clientHeight)) * 100;
  //     if (perc >= 100) {
  //       console.log("load more row");
  //       fetchTask().then((dataTask) => {
  //         if (dataTask.length >= 0) {
  //           setupData(dataTask, props.devices);
  //         } else {
  //           console.log("error_fetchTask: " + dataTask);
  //         }
  //       });
  //     }
  //   }
  //   useEffect(() => {
  //     const node = document.querySelector(".table .ant-table-body");

  //     if (node && props.devices) {
  //       node.addEventListener("scroll", () => loadMoreRow(node));
  //     }

  //     return () => {
  //       if (node) {
  //         node.removeEventListener("scroll", loadMoreRow);
  //       }
  //     };
  //   }, [props.devices, data]);

  return (
    <Layout className="ant-layout-inside">
      <MainTitle value="History Task" />

      <Table
        className="table"
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: 460, scrollToFirstRowOnChange: false }}
        loading={loading}
        // onChange={handleTableChange}
      />
    </Layout>
  );
}
