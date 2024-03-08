import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Popconfirm, message } from "antd";
import InputBookSearch from "./InputBookSearch";
import { callDeleteBook, callFetchListBook } from "../../../services/api";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import * as XLSX from "xlsx";
import BookViewDetail from "./BookViewDetail";
import BookModalCreate from "./BookModalCreate";
import BookModalUpdate from "./BookModalUpadate";

// https://stackblitz.com/run?file=demo.tsx
const BookTable = () => {
  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const [dataViewDetail, setDataViewDetail] = useState({});
  const [openViewDetail, setOpenViewDetail] = useState(false);

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [openModalImport, setOpenModalImport] = useState(false);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filter, sortQuery]);

  const fetchBook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchListBook(query);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleDeleteBook = async (_id) => {
    const res = await callDeleteBook(_id);
    // console.log(res);
    if (res && res.data) {
      message.success("Thành công");
      fetchBook();
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
      title: "mainText",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "author",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "price",
      dataIndex: "price",
      sorter: true,
    },
    {
      title: "category",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
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
              onConfirm={() => handleDeleteBook(record._id)}
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
    if (listBook.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listBook);
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
        <span>List books</span>
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
          <InputBookSearch handleSearch={handleSearch} setFilter={setFilter} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            className="def"
            columns={columns}
            dataSource={listBook}
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
      <BookViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      <BookModalCreate
        fetchBook={fetchBook}
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
      />
      {/* <UserImport
        fetchBook={fetchBook}
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
      />*/}
      <BookModalUpdate
        fetchBook={fetchBook}
        dataUpdate={dataViewDetail}
        setDataUpdate={setDataViewDetail}
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
      />
    </>
  );
};

export default BookTable;
