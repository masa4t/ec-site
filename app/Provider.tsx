"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { addToCart, loadCartFromLocalStorage } from "./global/slice";
import { useAppDispatch } from "./hooks";
import { store } from "./global/store";

const StoreProvider = ({ children }) => {
  // const dispatch = useAppDispatch();

  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
