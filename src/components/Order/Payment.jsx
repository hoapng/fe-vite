import {
  Col,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  message,
  notification,
} from "antd";
import "./order.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  doDeleteItemsCartAction,
  doPlaceAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";
import TextArea from "antd/es/input/TextArea";
import { callPlaceOrder } from "../../services/api";

const Payment = (props) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.order.carts);
  const user = useSelector((state) => state.account.user);
  const [form] = Form.useForm();

  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);
  const handleOnChangeInput = (value, book) => {
    console.log(value, book);
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({ quantity: value, detail: book, _id: book._id })
      );
    }
  };

  const onFinish = async (values) => {
    const detailOrder = carts.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id,
      };
    });
    const data = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail: detailOrder,
    };

    const res = await callPlaceOrder(data);
    if (res && res.data) {
      message.success("Sucess");
      dispatch(doPlaceAction());
      props.setCurrentStep(2);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Col md={18} xs={24}>
            {carts?.map((book, index) => {
              const currentBookPrice = book?.detail?.price ?? 0;
              return (
                <div className="order-book" key={`index-${index}`}>
                  <div className="book-content">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        book?.detail?.thumbnail
                      }`}
                    />
                    <div className="title">{book?.detail?.mainText}</div>
                    <div className="price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(book?.detail?.price ?? 0)}
                    </div>
                  </div>
                  <div className="action">
                    <div className="quantity">
                      <InputNumber
                        onChange={(value) => handleOnChangeInput(value, book)}
                        value={book?.quantity}
                      />
                    </div>
                    <div className="sum">
                      Tổng:
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(currentBookPrice * book?.quantity)}
                      ₫
                    </div>
                    <DeleteOutlined
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        dispatch(doDeleteItemsCartAction({ _id: book._id }))
                      }
                    />
                  </div>
                </div>
              );
            })}
            {carts.length === 0 && (
              <div className="order-book-empty">
                <Empty description={"Nothing"} />
              </div>
            )}
          </Col>
          <Col md={6} xs={24}>
            <div className="order-sum">
              <Form form={form} onFinish={onFinish}>
                <Form.Item
                  style={{ margin: 0 }}
                  labelCol={{ span: 24 }}
                  label="Username"
                  name="name"
                  initialValue={user?.fullName}
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ margin: 0 }}
                  labelCol={{ span: 24 }}
                  label="Phone"
                  name="phone"
                  initialValue={user?.phone}
                  rules={[
                    { required: true, message: "Please input your phone!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ margin: 0 }}
                  labelCol={{ span: 24 }}
                  label="Address"
                  name="address"
                  rules={[
                    { required: true, message: "Please input your address!" },
                  ]}
                >
                  <TextArea autoFocus rows={4} />
                </Form.Item>
              </Form>
              <div className="info">
                <div className="method">
                  <div>Payment</div>
                  <Radio checked>COD</Radio>
                </div>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <div className="calculate">
                <span> Tổng tiền</span>
                <span className="sum-final">
                  {" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                  ₫
                </span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <button onClick={() => form.submit()}>
                Mua Hàng ({carts?.length ?? 0})
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Payment;
