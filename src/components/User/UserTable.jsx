import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button } from "antd";
import InputSearch from "./InputSearch";
import { callFetchListUser } from "../../services/api";
import UserViewDetail from "./UserViewDetail";

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
            <button>Del</button>
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

    console.log("params", pagination, filters, sorter, extra);
  };

  const handleSearch = (query) => {
    setFilter(query);
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch handleSearch={handleSearch} setFilter={setFilter} />
        </Col>
        <Col span={24}>
          {/* <Button type="ghost" onClick={
            setFilter('')
            setSortQuery('')
          }></></Button> */}
          <Table
            className="def"
            columns={columns}
            dataSource={listUser}
            onChange={onChange}
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              total: total,
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
    </>
  );
};

export default UserTable;
