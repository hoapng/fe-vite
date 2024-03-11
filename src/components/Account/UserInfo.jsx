import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callUpdateAvatar, callUpdateUserInfo } from "../../services/api";
import {
  doUpdateUserInfoAction,
  doUploadAvatarAction,
} from "../../redux/account/accountSlice";

const UserInfo = () => {
  const user = useSelector((state) => state.account.user);
  const tempAvatar = useSelector((state) => state.account.tempAvatar);
  //   console.log(tempAvatar);
  const [form] = Form.useForm();
  const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    tempAvatar || user?.avatar
  }`;
  const dispatch = useDispatch();
  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    const res = await callUpdateAvatar(file);
    console.log(res);
    if (res && res.data) {
      const newAvatar = res.data.fileUploaded;
      dispatch(doUploadAvatarAction({ avatar: newAvatar }));
      setUserAvatar(newAvatar);
      onSuccess("ok");
    } else {
      onError("error");
    }
  };
  const propsUpload = {
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    customRequest: handleUploadAvatar,
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success("Success");
      }
      if (info.file.status === "error") {
        message.error("error");
      }
    },
  };
  const onFinish = async (values) => {
    const { fullName, phone, _id } = values;
    const res = await callUpdateUserInfo(_id, phone, fullName, userAvatar);

    if (res && res.data) {
      dispatch(doUpdateUserInfoAction({ avatar: userAvatar, phone, fullName }));
      message.success("Update successly");
      localStorage.removeItem("access_token");
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };

  return (
    <div style={{ minHeight: 400 }}>
      <Row>
        <Col sm={24} md={12}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Avatar
                size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
                icon={<AntDesignOutlined />}
                src={urlAvatar}
                shape="circle"
              />
            </Col>
            <Col span={24}>
              <Upload {...propsUpload}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Col>
          </Row>
        </Col>
        <Col span={24} md={12}>
          <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
            <Form.Item
              labelCol={{ span: 24 }}
              label="_id"
              name="_id"
              rules={[
                { required: true, message: "Vui lòng nhập tên hiển thị!" },
              ]}
              initialValue={user?.id}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label="email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập tên hiển thị!" },
              ]}
              initialValue={user?.email}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label="fullName"
              name="fullName"
              initialValue={user?.fullName}
              rules={[{ required: true, message: "Vui lòng nhập tác giả!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label="phone"
              name="phone"
              initialValue={user?.phone}
              rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Form>
          <button onClick={() => form.submit()}>Update</button>
        </Col>
      </Row>
    </div>
  );
};
export default UserInfo;
