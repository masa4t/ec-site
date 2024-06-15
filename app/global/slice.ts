import { createSlice } from "@reduxjs/toolkit";
import { CartState } from "./types";

const initialState: CartState = {
  cartItems: [],
  amount: 0,
  total: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      state.amount = action.payload.length;
      state.total = action.payload.reduce(
        (total, item) => total + item.price,
        0
      );
    },
    addToCart: (state, action) => {
      const newItem = action.payload;
      state.cartItems.push(newItem);
      state.total += newItem.price;
      state.amount += 1;
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    removeCart: (state, action) => {
      const itemId = action.payload;
      const removedItem = state.cartItems.find((item) => item.id === itemId);
      if (removedItem) {
        state.total -= removedItem.price;
        state.amount -= 1;
        state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
        if (typeof window !== "undefined") {
          localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        }
      }
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartItems");
      }
    },
  },
});

export const { setCartItems, addToCart, removeCart, resetCart } =
  cartSlice.actions;
export default cartSlice.reducer;
