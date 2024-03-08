import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Popconfirm, message } from "antd";
import InputSearch from "./InputSearch";
import { callDeleteUser, callFetchListUser } from "../../services/api";
import UserViewDetail from "./UserViewDetail";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import UserModalCreate from "./UserModalCreate";
import UserImport from "./data/UserImport";
import * as XLSX from "xlsx";
import UserModalUpdate from "./UserModalUpdate";

// https://stackblitz.com/run?file=demo.tsx
const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("");

  const [dataViewDetail, setDataViewDetail] = useState({});
  const [openViewDetail, setOpenViewDetail] = useState(false);

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [openModalImport, setOpenModalImport] = useState(false);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, filter, sortQuery]);

  const fetchUser = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchListUser(query);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleDeleteUser = async (_id) => {
    const res = await callDeleteUser(_id);
    // console.log(res);
    if (res && res.data) {
      message.success("Thành công");
      fetchUser();
    } else {
      notification.error({ message: "Lỗi", description: res.message });
    }
  };

  const columns = [
    {
      title: "_id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            onClick={() => {
              setDataViewDetail(record);
              setOpenViewDetail(true);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "fullName",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "phone",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "action",
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Confirm Delete"}
              description={`Sure??? ${record._id}`}
              onConfirm={() => handleDeleteUser(record._id)}
            >
              <span style={{ cursor: "pointer", margin: "0 20px" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>

            <EditTwoTone
              twoToneColor="#F57800"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setDataViewDetail(record);
                setOpenModalUpdate(true);
              }}
            />
          </>
        );
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `&sort=${sorter.field}`
          : `&sort=-${sorter.field}`;
      setSortQuery(q);
    }

    // console.log("params", pagination, filters, sorter, extra);
  };

  const handleSearch = (query) => {
    setFilter(query);
  };

  const handleExportData = () => {
    if (listUser.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listUser);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workbook, "Export.xlsx");
    }
  };

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>List users</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button
            icon={<ExportOutlined />}
            type="primary"
            onClick={() => {
              handleExportData();
            }}
          >
            Export
          </Button>
          <Button
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => {
              setOpenModalImport(true);
            }}
          >
            Import
          </Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setOpenModalCreate(true);
            }}
          >
            Thêm
          </Button>

          <Button
            type="ghost"
            onClick={() => {
              setFilter("");
              setSortQuery("");
            }}
          >
            <ReloadOutlined />
          </Button>
        </span>
      </div>
    );
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch handleSearch={handleSearch} setFilter={setFilter} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            className="def"
            columns={columns}
            dataSource={listUser}
            onChange={onChange}
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              total: total,
              showTotal: (total, range) => {
                return (
                  <div>
                    {range[0]}-{range[1]}/{total}
                  </div>
                );
              },
            }}
          />
        </Col>
      </Row>
      <UserViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      <UserModalCreate
        fetchUser={fetchUser}
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
      />
      <UserImport
        fetchUser={fetchUser}
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
      />
      <UserModalUpdate
        fetchUser={fetchUser}
        dataUpdate={dataViewDetail}
        setDataUpdate={setDataViewDetail}
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
      />
    </>
  );
};

export default UserTable;
