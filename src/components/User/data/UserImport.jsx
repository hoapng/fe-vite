import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, Table, Upload } from "antd";

const { Dragger } = Upload;

const UserImport = (props) => {
  const { openModalImport, setOpenModalImport } = props;

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
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <Modal
      title="Import Modal"
      open={openModalImport}
      onOk={() => {
        setOpenModalImport(false);
      }}
      onCancel={() => setOpenModalImport(false)}
      okText={"Import"}
      okButtonProps={{ disabled: true }}
      maskClosable={false}
    >
      <Dragger {...propsUplaod}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">Support for a single upload.</p>
      </Dragger>
      <div style={{ paddingTop: 20 }}>
        <Table
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
