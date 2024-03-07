import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, notification, Table, Upload } from "antd";
import * as XLSX from "xlsx";
import { json } from "react-router-dom";
import { callBulkCreateUser } from "../../../services/api";

const { Dragger } = Upload;

const UserImport = (props) => {
  const { openModalImport, setOpenModalImport, fetchUser } = props;

  const [dataExcel, setDataExcel] = useState([]);

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const propsUplaod = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    // action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    customRequest: dummyRequest,
    onChange(info) {
      //   console.log(">>>info", info);
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          let reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function (e) {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, { type: "array" });
            // find the name of your sheet in the workbook first
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];

            // convert to json format
            const json = XLSX.utils.sheet_to_json(worksheet, {
              header: ["fullName", "email", "phone"],
              range: 1, // skip row header
            });
            // console.log(">>>json", json);
            if (json && json.length > 0) setDataExcel(json);
          };
        }
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleSubmit = async () => {
    const data = dataExcel.map((item) => {
      item.password = "123456";
      return item;
    });
    console.log(">>>data", data);
    const res = await callBulkCreateUser(data);
    if (res.data) {
      notification.success({
        description: `Success ${res.data.countSuccess}, Error ${res.data.countError}`,
        message: "Success",
      });
      setDataExcel([]);
      setOpenModalImport(false);
      fetchUser();
    } else {
      notification.error({
        description: res.message,
        message: "Error",
      });
    }
  };
  return (
    <Modal
      title="Import Modal"
      width={"50vw"}
      open={openModalImport}
      onOk={() => {
        handleSubmit();
      }}
      onCancel={() => {
        setOpenModalImport(false);
        setDataExcel([]);
      }}
      okText={"Import"}
      okButtonProps={{ disabled: dataExcel.length < 1 }}
      maskClosable={false}
    >
      <Dragger {...propsUplaod}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">Support for a single upload.
        {/* &nbsp; <a onClick={(e)=> e.stopPropagation()} href={template} download>Download</a></p> */}
      </Dragger>
      <div style={{ paddingTop: 20 }}>
        <Table
          dataSource={dataExcel}
          title={() => <span>Upload data</span>}
          columns={[
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
          ]}
        ></Table>
      </div>
    </Modal>
  );
};
export default UserImport;
