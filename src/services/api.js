import axios from "../utils/axios-customize";

export const callRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

export const callLogin = (username, password) => {
  return axios.post("/api/v1/auth/login", { username, password });
};

export const callFetchAccount = () => {
  return axios.get("/api/v1/auth/account");
};

export const callLogout = () => {
  return axios.post("/api/v1/auth/logout");
};

export const callFetchListUser = (query) => {
  return axios.get(`/api/v1/user?${query}`);
};

export const callCreateAUser = (fullName, password, email, phone) => {
  return axios.post("/api/v1/user", { fullName, password, email, phone });
};

export const callBulkCreateUser = (data) => {
  return axios.post("/api/v1/user/bulk-create", data);
};

export const callUpdateUser = (fullName, _id, phone) => {
  return axios.put("/api/v1/user", { fullName, _id, phone });
};

export const callDeleteUser = (_id) => {
  return axios.delete(`/api/v1/user/${_id}`);
};

export const callFetchListBook = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};

export const callFetchCategory = () => {
  return axios.get("/api/v1/database/category");
};

export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};

export const callCreateABook = (
  mainText,
  author,
  price,
  sold,
  quantity,
  category,
  thumbnail,
  slider
) => {
  return axios.post("/api/v1/book", {
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
    thumbnail,
    slider,
  });
};

export const callUpdateBook = (
  _id,
  mainText,
  author,
  price,
  sold,
  quantity,
  category,
  thumbnail,
  slider
) => {
  return axios.put(`/api/v1/book/${_id}`, {
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
    thumbnail,
    slider,
  });
};

export const callDeleteBook = (_id) => {
  return axios.delete(`/api/v1/book/${_id}`);
};

export const callFetchBookById = (_id) => {
  return axios.get(`/api/v1/book/${_id}`);
};

export const callPlaceOrder = (data) => {
  return axios.post("/api/v1/order", { ...data });
};

export const callHistory = () => {
  return axios.get(`/api/v1/history`);
};

export const callUpdateAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  });
};

export const callUpdateUserInfo = (_id, phone, fullName, avatar) => {
  return axios.put("/api/v1/user", { _id, phone, fullName, avatar });
};

export const callUpdatePassword = (email, oldpass, newpass) => {
  return axios.post("/api/v1/user/change-password", {
    email,
    oldpass,
    newpass,
  });
};

export const callFetchListOrder = (query) => {
  return axios.get(`/api/v1/order?${query}`);
};
export const callFetchDashboard = () => {
  return axios.get("/api/v1/database/dashboard");
};
