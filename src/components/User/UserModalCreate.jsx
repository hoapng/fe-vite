import React, { useState } from "react";
import { Button, Divider, Form, Modal, message, notification } from "antd";
import { callCreateAUser } from "../../services/api";

const UserModalCreate = (props) => {
  const { fetchUser, openModalCreate, setOpenModalCreate } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const { fullName, password, email, phone } = values;
    setIsSubmit(true);
    const res = await callCreateAUser(fullName, password, email, phone);
    if (res && res.data) {
      message.success("Thành công");
      form.resetFields();
      setOpenModalCreate(false);
      await fetchUser();
    } else {
      notification.error({ message: "Lỗi", description: res.message });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title="Create Modal"
        open={openModalCreate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => setOpenModalCreate(false)}
        okText={"Tạo"}
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
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Họ tên không được để trống!" }]}
          >
            {/* <Input /> */}
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email không được để trống!" }]}
          >
            {/* <Input /> */}
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống!" },
            ]}
          >
            {/* <Input.Password /> */}
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Số điện thoại không được để trống!" },
            ]}
          >
            {/* <Input /> */}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserModalCreate;
