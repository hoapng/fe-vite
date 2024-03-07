import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  message,
  notification,
} from "antd";
import { callUpdateUser } from "../../services/api";

const UserModalUpdate = (props) => {
  const {
    fetchUser,
    openModalUpdate,
    setOpenModalUpdate,
    dataUpdate,
    setDataUpdate,
  } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const { fullName, _id, phone } = values;
    setIsSubmit(true);
    const res = await callUpdateUser(fullName, _id, phone);
    if (res && res.data) {
      message.success("Thành công");
      form.resetFields();
      setOpenModalUpdate(false);
      await fetchUser();
    } else {
      notification.error({ message: "Lỗi", description: res.message });
    }
    setIsSubmit(false);
  };

  useEffect(() => {
    form.setFieldsValue(dataUpdate);
  }, [dataUpdate]);

  return (
    <>
      <Modal
        title="Create Modal"
        open={openModalUpdate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => setOpenModalUpdate(false)}
        okText={"Update"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
      >
        <Divider />
        <Form
          form={form}
          name="basic"
          // style={{ maxWidth: 600, margin: '0 auto' }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="_id"
            name="_id"
            rules={[
              { required: true, message: "Mật khẩu không được để trống!" },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Họ tên không được để trống!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email không được để trống!" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Số điện thoại không được để trống!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserModalUpdate;
