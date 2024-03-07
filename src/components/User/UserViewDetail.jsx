import { Descriptions, Drawer } from "antd";
import moment from "moment";

const UserViewDetail = (props) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;
  const onClose = () => {
    setOpenViewDetail(false);
  };

  return (
    <>
      <Drawer
        title="Basic Drawer"
        width={"50vw"}
        onClose={onClose}
        open={openViewDetail}
      >
        <Descriptions title="User Info" column={2} bordered>
          <Descriptions.Item label="_id">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="email">
            {dataViewDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item label="fullName">
            {dataViewDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="createdAt">
            {moment(dataViewDetail?.createdAt).format("DD-MM-YYYY hh:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="phone">
            {dataViewDetail?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="role">
            {dataViewDetail?.role}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default UserViewDetail;
