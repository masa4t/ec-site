"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import "./Total.scss";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { setCartItems } from "../global/slice"; // Reduxのアクションをインポート

const Total = () => {
  const { total, cartItems, amount } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // クライアントサイドであることを示す
  }, []);

  useEffect(() => {
    if (isClient) {
      // クライアントサイドでのみ実行
      const loadCartFromLocalStorage = () => {
        try {
          const cartItems = localStorage.getItem("cartItems");
          if (cartItems) {
            dispatch(setCartItems(JSON.parse(cartItems)));
          }
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      };

      loadCartFromLocalStorage();
    }
  }, [isClient, dispatch]);

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartItems }),
        }
      );
      const responseData = await response.json();

      if (responseData.checkout_url) {
        router.push(responseData.checkout_url);
      } else {
        console.error("No checkout URL found in response:", responseData);
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
    }
  };

  const isCartPage = pathname === "/Cart";

  return isClient && amount !== 0 && !isCartPage ? (
    <div className="total">
      <div>
        {amount < 2 ? (
          <p>{amount} item in cart</p>
        ) : (
          <p>{amount} items in cart</p>
        )}
        <h2>小計 ￥{total}</h2>
      </div>
      <Link href="/Cart">
        <button className="cart">カート内容のご確認</button>
      </Link>
      <button onClick={handleCheckout} className="purchase">
        ご注文手続きへ
      </button>
    </div>
  ) : null;
};

export default Total;
