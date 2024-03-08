import { useLocation } from "react-router-dom";
import BookTable from "../../components/Admin/Book/BookTable";

const BookPage = () => {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id");

  console.log("id", id);
  return (
    <>
      <BookTable />
    </>
  );
};

export default BookPage;
