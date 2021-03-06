import { Table, Layout, Button, Row, Col, Input, notification } from "antd";
import {
  fetchStaff,
  fetchStaffCount,
  searchStaffLikeEmail,
  checkServer,
} from "../../store/Store";
import { useState, useEffect } from "react";
import UpdateStatusButton from "../../component/UpdateStatusButton";
import StaffProfile from "./StaffProfile";
import { MainTitle } from "../../utils/Text";
import NewStaff from "./NewStaff";
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const { Search } = Input;

export default function Staff(props) {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState();

  const [showProfile, setShowProfile] = useState(false);
  const [idProfile, setIdProfile] = useState();

  const [showNewStaff, setShowNewStaff] = useState(false);
  const [txtSearch, setTxtSearch] = useState("");
  
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
      fetchStaff(currentPage - 1, currentPageSize).then((staffs) => {
        mapStaffToData(staffs);
      });
    } else {
      setLoading(true);
      searchStaffLikeEmail(currentPage - 1, currentPageSize, txtSearch).then(
        (res) => {
          mapStaffToData(res.staffs);
          setTotalPage(res.count);
        }
      );
    }
    if(updateSuccess){
      setUpdateSuccess(false);
    }
  }, [currentPage, currentPageSize, txtSearch, updateSuccess]);

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
          date_create: moment(staff.date_create).format("YYYY-MM-DD, HH:mm:ss"),
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
      setTxtSearch(value);
      setCurrentPage(1);
    } else {
      setTxtSearch("");
    }
  }

  function onClickBtnCreateStaff() {
    // setShowNewStaff(true);

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
        // scroll={{ y: 500 }}
        loading={loading}
        pagination={{
          defaultPageSize: currentPageSize,
          total: totalPage,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30, 50],
          current: currentPage,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
          },
          onShowSizeChange: () => {
            document.documentElement.scrollTop = 0;
          },
          // position: ['topRight']
        }}
      />

      {showProfile ? (
        <StaffProfile
          showProfile={showProfile}
          id={idProfile}
          onCloseProfile={onCloseProfile}
          updateSuccess={() => setUpdateSuccess(true)}
          {...props}
        />
      ) : null}

      {showNewStaff ? (
        <NewStaff
          showNewStaff={showNewStaff}
          onCloseNewStaff={() => {
            setShowNewStaff(false);

            setLoading(true);
            fetchStaff(0, currentPageSize).then((staffs) => {
              mapStaffToData(staffs);
            });
          }}
          {...props}
        />
      ) : null}
    </Layout>
  );
}
