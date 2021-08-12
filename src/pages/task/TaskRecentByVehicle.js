import { List, Button, Skeleton, Typography, Descriptions, Tag } from "antd";
import { useState, useEffect } from "react";
import { fetchAllStaff, fetchTaskByVehicleId } from "../../store/Store";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Link } from "react-router-dom";

const { Title } = Typography;
const count = 3;

export default function TaskRecentByVehicle(props) {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [list, setList] = useState();
  const [dataStaff, setDataStaff] = useState(null);
  const [idVehicle, setIdVehicle] = useState();

  useEffect(() => {
    if (props.idVehicle) {
      setIdVehicle(props.idVehicle);

      getData(props.idVehicle, (dataRes, dataStaffRes) => {
        const tasks = setUpMoreInfo(dataRes, dataStaffRes);

        setInitLoading(false);
        setData(tasks);
        setList(tasks);

        if (dataRes.length < count) {
          setLoading(true);
        }
      });
    }
    // eslint-disable-next-line
  }, [props.idVehicle]);

  function setUpMoreInfo(dataTask, dataStaffx) {
    const tasks = dataTask.map((task) => {
      let emailStaff = dataStaffx.filter(
        (staff) => staff.id === task.create_by
      )[0].email;
      task.emailStaff = emailStaff;

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

      task.statusTag = status;
      return task;
    });

    return tasks;
  }

  function getData(idVehicle, callback) {
    let row = 0;
    if (list != null) {
      row = list.length / count;
    }

    if (dataStaff === null) {
      fetchTaskByVehicleId(idVehicle, row).then((data) => {
        if (data.length > 0) {
          fetchAllStaff().then((dataStaffRes) => {
            if (dataStaffRes.length > 0) {
              setDataStaff(dataStaffRes);
              callback(data, dataStaffRes);
            }
          });
        }
        if (data.length === 0) {
          setInitLoading(false);
          setLoading(true);
        } else {
          console.log("error_fetchTaskByVehicleId: " + data);
        }
      });
    } else {
      fetchTaskByVehicleId(idVehicle, row).then((data) => {
        if (data.length > 0) {
          callback(data);
        } else {
          console.log("error_fetchTaskByVehicleId: " + data);
        }
      });
    }
  }

  const onLoadMore = () => {
    setLoading(true);

    getData(idVehicle, (dataRes) => {
      setList(
        data.concat([...new Array(count)].map(() => ({ loading: true })))
      );

      const tasks = setUpMoreInfo(dataRes, dataStaff);

      const dataNew = data.concat(tasks);

      if (dataRes.length === count) {
        setLoading(false);
      }

      setData(dataNew);
      setList(dataNew);

      // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
      // In real scene, you can using public method of react-virtualized:
      // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
      // window.dispatchEvent(new Event("resize"));
    });
  };

  return (
    <div>
      <List
        style={{ overflow: "auto", height: "36em" }}
        className="demo-loadmore-list"
        header={
          <Title level={5} style={{ textAlign: "center" }}>
            Quick Recent Task
          </Title>
        }
        bordered
        loading={initLoading}
        itemLayout="horizontal"
        // loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => {
          let typeText = "";
          if (item.type === 0) {
            typeText = "Task";
          } else if (item.type === 1) {
            typeText = "Follow Path";
          } else if (item.type === 2) {
            typeText = "Solve Maze";
          }

          return (
            <List.Item
              actions={[
                <Link
                  to={{
                    pathname: `/tasks/${item.id}`,
                    state: { status: item.status },
                  }}
                >
                  View map
                </Link>,
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <Descriptions size="small" bordered style={{ width: "100vw" }}>
                  <Descriptions.Item>
                    <span style={{ fontWeight: "bold" }}>Name: </span>{" "}
                    {item.name}
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <span style={{ fontWeight: "bold" }}>Type: </span>
                    {typeText}
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <span style={{ fontWeight: "bold" }}>Create by: </span>
                    {item.emailStaff}
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <span style={{ fontWeight: "bold" }}>Status: </span>
                    {item.statusTag}
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <span style={{ fontWeight: "bold" }}>Date create: </span>
                    {moment(item.date_create).format("YYYY-MM-DD, HH:mm:ss")}
                  </Descriptions.Item>
                </Descriptions>
              </Skeleton>
            </List.Item>
          );
        }}
      />

      {!initLoading && !loading ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "1em",
            marginBottom: "1em",
            height: 32,
            lineHeight: "32px",
          }}
        >
          <Button onClick={onLoadMore}>Loading more</Button>
        </div>
      ) : null}
    </div>
  );
}
