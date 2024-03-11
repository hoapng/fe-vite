import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Popconfirm, message } from "antd";
// import InputOrderSearch from "./InputOrderSearch";
// import { callDeleteOrder, callFetchListOrder } from "../../../services/api";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import * as XLSX from "xlsx";
import { callFetchListOrder } from "../../services/api";
// import OrderViewDetail from "./OrderViewDetail";
// import OrderModalCreate from "./OrderModalCreate";
// import OrderModalUpdate from "./OrderModalUpadate";

// https://stackblitz.com/run?file=demo.tsx
const OrderTable = () => {
  const [listOrder, setListOrder] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  //   const [dataViewDetail, setDataViewDetail] = useState({});
  //   const [openViewDetail, setOpenViewDetail] = useState(false);

  //   const [openModalCreate, setOpenModalCreate] = useState(false);

  //   const [openModalImport, setOpenModalImport] = useState(false);

  //   const [openModalUpdate, setOpenModalUpdate] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [current, pageSize, filter, sortQuery]);

  const fetchOrder = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchListOrder(query);
    if (res && res.data) {
      setListOrder(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  //   const handleDeleteOrder = async (_id) => {
  //     const res = await callDeleteOrder(_id);
  //     // console.log(res);
  //     if (res && res.data) {
  //       message.success("Thành công");
  //       fetchOrder();
  //     } else {
  //       notification.error({ message: "Lỗi", description: res.message });
  //     }
  //   };

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
      title: "name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "address",
      dataIndex: "address",
      sorter: true,
    },
    {
      title: "phone",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "type",
      dataIndex: "type",
      sorter: true,
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      sorter: true,
    },
    // {
    //   title: "action",
    //   render: (text, record, index) => {
    //     return (
    //       <>
    //         <Popconfirm
    //           placement="leftTop"
    //           title={"Confirm Delete"}
    //           description={`Sure??? ${record._id}`}
    //           onConfirm={() => handleDeleteOrder(record._id)}
    //         >
    //           <span style={{ cursor: "pointer", margin: "0 20px" }}>
    //             <DeleteTwoTone twoToneColor="#ff4d4f" />
    //           </span>
    //         </Popconfirm>

    //         <EditTwoTone
    //           twoToneColor="#F57800"
    //           style={{ cursor: "pointer" }}
    //           onClick={() => {
    //             setDataViewDetail(record);
    //             setOpenModalUpdate(true);
    //           }}
    //         />
    //       </>
    //     );
    //   },
    // },
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
    if (listOrder.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listOrder);
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
        <span>List</span>
        {/* <span style={{ display: "flex", gap: 15 }}>
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
        </span> */}
      </div>
    );
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        {/* <Col span={24}>
          <InputOrderSearch handleSearch={handleSearch} setFilter={setFilter} />
        </Col> */}
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            className="def"
            columns={columns}
            dataSource={listOrder}
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
      {/* <OrderViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      <OrderModalCreate
        fetchOrder={fetchOrder}
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
      /> */}
      {/* <UserImport
        fetchOrder={fetchOrder}
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
      />*/}
      {/* <OrderModalUpdate
        fetchOrder={fetchOrder}
        dataUpdate={dataViewDetail}
        setDataUpdate={setDataViewDetail}
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
      /> */}
    </>
  );
};

export default OrderTable;
