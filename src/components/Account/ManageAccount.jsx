import { Modal, Tabs } from "antd";
import UserInfo from "./UserInfo";
import ChangePassword from "./ChangPassword";

const ManageAccount = (props) => {
  const { isModalOpen, setIsModalOpen } = props;
  const items = [
    {
      key: "info",
      label: "Update info",
      children: <UserInfo />,
    },
    {
      key: "password",
      label: "Change Password",
      children: <ChangePassword />,
    },
  ];
  return (
    <Modal
      title="Manage Account"
      open={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
      maskClosable={false}
      width={"60vw"}
    >
      <Tabs defaultActiveKey="info" items={items}></Tabs>
    </Modal>
  );
};
export default ManageAccount;
