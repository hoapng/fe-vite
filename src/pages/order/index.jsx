import { Button, Result, Steps } from "antd";
import { useState } from "react";
import ViewOrder from "../../components/Order/ViewOrder";
import Payment from "../../components/Order/Payment";
import { SmileOutlined } from "@ant-design/icons";

const OrderPage = (props) => {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div className="order-container" style={{ maxWidth: 1440 }}>
        <div className="order-steps">
          <Steps
            size="small"
            current={currentStep}
            status={"progress"}
            items={[
              {
                title: "Check cart",
              },
              {
                title: "Fill Info",
              },
              {
                title: "History",
              },
            ]}
          />
        </div>
        {currentStep === 0 && <ViewOrder setCurrentStep={setCurrentStep} />}
        {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}
        {currentStep === 2 && (
          <Result
            icon={<SmileOutlined />}
            title="Success"
            extra={<Button type="primary">History</Button>}
          />
        )}
      </div>
    </div>
  );
};

export default OrderPage;
