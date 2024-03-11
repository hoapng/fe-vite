import { useEffect, useState } from "react";
import { callHistory } from "../../services/api";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const fetchHistory = async () => {
    const res = await callHistory();
    if (res && res.data) {
      setHistory(res.data);
    }
  };
  useEffect(() => {
    fetchHistory();
  }, []);
  return <div>{JSON.stringify(history)}</div>;
};
export default HistoryPage;
