import { Table, Layout, Button, Row, Col, Input, notification } from "antd";
import {
  fetchStaff,
  fetchStaffCount,
  searchStaffLikeEmail,
  checkServer,
} from "../../lib/Store";
import { useState, useEffect } from "react";
import UpdateStatusButton from "../../component/UpdateStatusButton";
import StaffProfile from "./StaffProfile";
import { MainTitle } from "../../utils/Text";
import NewStaff from "./NewStaff";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Search } = Input;

export default function Staff(props) {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState();

  const [showProfile, setShowProfile] = useState(false);
  const [idProfile, setIdProfile] = useState();

  const [showNewStaff, setShowNewStaff] = useState(false);
  const [txtSearch, setTxtSearch] = useState("");

  const onOpenProfile = (id) => {
    setIdProfile(id);
    setShowProfile(true);
  };

  const onCloseProfile = (id) => {
    setIdProfile(null);
    setShowProfile(false);
  };

  const columns = [
    {
      title: "Email",
      width: 200,
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Full name",
      width: 150,
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Date created",
      dataIndex: "date_create",
      key: "8",
      width: 150,
    },
    {
      title: "Status",
      width: 100,
      dataIndex: "status",
      key: "status",
      render: (tag) => <UpdateStatusButton tag={tag} />,
    },
    {
      title: "Action",
      key: "operation",
      dataIndex: "operation",
      // fixed: "right",
      width: 100,
      render: (id) => {
        return (
          // <a href="#" onClick={() => onOpenProfile(id)} key={id}>
          //   View Profile
          // </a>
          <Button
            type="link"
            onClick={() => onOpenProfile(id)}
            style={{ paddingLeft: "0" }}
          >
            View Profile
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (txtSearch === "") {
      fetchStaffCount().then((count) => {
        setTotalPage(count);
      });
    }
  }, [txtSearch]);

  useEffect(() => {
    if (txtSearch === "") {
      setLoading(true);
      fetchStaff(currentPage - 1).then((staffs) => {
        mapStaffToData(staffs);
      });
    } else {
      setLoading(true);
      searchStaffLikeEmail(currentPage - 1, txtSearch).then((res) => {
        mapStaffToData(res.staffs);
        setTotalPage(res.count);
      });
    }
  }, [currentPage, txtSearch]);

  function mapStaffToData(staffs) {
    let dataTable = [];
    if (staffs != null) {
      staffs.map((staff, index) => {
        dataTable.push({
          key: staff.id,
          email: staff.email,
          fullname: staff.full_name,
          status: {
            id: staff.id,
            status: staff.status === 0 ? "ACTIVE" : "INACTIVE",
          },
          date_create: staff.date_create,
          operation: staff.id,
        });

        return null;
      });
    }

    setData(dataTable);
    setLoading(false);
  }

  function onSearchStaff(value) {
    if (value !== "") {
      console.log(value);
      setTxtSearch(value);
      setCurrentPage(1);
    } else {
      setTxtSearch("");
    }
  }

  function onClickBtnCreateStaff() {
    checkServer().then((res) => {
      if (!res) {
        console.log("res res: ", res);
        notification["error"]({
          message: "Server is error, please try again later",
          icon: <CloseCircleOutlined style={{ color: "#cd201f" }} />,
        });
      } else {
        setShowNewStaff(true);
      }
    });
  }

  return (
    <Layout className="ant-layout-inside" style={{ paddingBottom: "0.5em" }}>
      <MainTitle value="Staffs" style={{ marginBottom: "0" }} />

      <Row justify="space-between" style={{ marginBottom: "2em" }}>
        <Col span={9}>
          <Search
            placeholder="Search staff by email"
            allowClear
            onSearch={onSearchStaff}
            enterButton
          />
        </Col>
        <Col>
          <Button type="primary" onClick={onClickBtnCreateStaff}>
            Create New Staff
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        scroll={{ y: 400 }}
        loading={loading}
        pagination={{
          pageSize: 50,
          total: totalPage,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
          // position: ['topRight']
        }}
      />

      {showProfile ? (
        <StaffProfile
          showProfile={showProfile}
          id={idProfile}
          onCloseProfile={onCloseProfile}
          {...props}
        />
      ) : null}

      {showNewStaff ? (
        <NewStaff
          showNewStaff={showNewStaff}
          onCloseNewStaff={() => {
            setShowNewStaff(false);

            setLoading(true);
            fetchStaff(0).then((staffs) => {
              mapStaffToData(staffs);
            });
          }}
          {...props}
        />
      ) : null}
    </Layout>
  );
}
