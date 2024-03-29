import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  carts: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    doAddBookAction: (state, action) => {
      let carts = state.carts;
      const item = action.payload;

      let isExistIndex = carts.findIndex((c) => c._id === item._id);
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity =
          carts[isExistIndex].quantity + item.quantity;
        if (
          carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity
        ) {
          carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
        }
      } else {
        carts.push({
          quantity: item.quantity,
          _id: item._id,
          detail: item.detail,
        });
      }
      //update redux
      state.carts = carts;
      message.success("Add successly");
    },
    doUpdateCartAction: (state, action) => {
      let carts = state.carts;
      const item = action.payload;

      let isExistIndex = carts.findIndex((c) => c._id === item._id);
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity = item.quantity;
        if (
          carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity
        ) {
          carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
        }
      } else {
        carts.push({
          quantity: item.quantity,
          _id: item._id,
          detail: item.detail,
        });
      }
      //update redux
      state.carts = carts;
      message.success("Update successly");
    },
    doDeleteItemsCartAction: (state, action) => {
      //update redux
      state.carts = state.carts.filter((c) => c._id !== action.payload._id);
      message.success("Del successly");
    },
    doPlaceAction: (state, action) => {
      state.carts = [];
    },
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {},
});

export const {
  doAddBookAction,
  doUpdateCartAction,
  doDeleteItemsCartAction,
  doPlaceAction,
} = orderSlice.actions;

export default orderSlice.reducer;
