import { Form, Input, message, notification } from "antd";
import { useSelector } from "react-redux";
import { callUpdatePassword } from "../../services/api";

const ChangePassword = () => {
  const user = useSelector((state) => state.account.user);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const { email, oldpass, newpass } = values;
    console.log(values);
    const res = await callUpdatePassword(email, oldpass, newpass);
    if (res && res.data) {
      message.success("Update successly");
      form.setFieldValue("oldpass", "");
      form.setFieldValue("newpass", "");
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };
  return (
    <>
      <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
        <Form.Item
          labelCol={{ span: 24 }}
          label="email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
          initialValue={user?.email}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          label="oldpass"
          name="oldpass"
          rules={[{ required: true, message: "Vui lòng nhập tác giả!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          label="newpass"
          name="newpass"
          rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
      <button onClick={() => form.submit()}>Update</button>
    </>
  );
};
export default ChangePassword;
