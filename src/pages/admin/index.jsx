import { useEffect, useState } from "react";
import React from "react";
import CountUp from "react-countup";
import { Col, Row, Statistic } from "antd";
import { callFetchDashboard } from "../../services/api";
const AdminPage = () => {
  const [dataDashboard, setDataDashboard] = useState({
    countUser: 0,
    countOrder: 0,
  });
  useEffect(() => {
    const init = async () => {
      const res = await callFetchDashboard();
      if (res && res.data) setDataDashboard(res.data);
    };
    init();
  }, []);
  const formatter = (value) => <CountUp end={value} separator="," />;
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Statistic
          title=" Users"
          value={dataDashboard.countUser}
          formatter={formatter}
        />
      </Col>
      <Col span={12}>
        <Statistic
          title="Orders"
          value={dataDashboard.countOrder}
          precision={2}
          formatter={formatter}
        />
      </Col>
    </Row>
  );
};

export default AdminPage;
