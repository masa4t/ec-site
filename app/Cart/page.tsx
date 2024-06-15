"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import "./cart.scss";
import Link from "next/link";
import { removeCart, setCartItems } from "../global/slice";
import { useRouter } from "next/navigation";

const Cart = () => {
  const { cartItems, total, amount } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  const handleRemoveItem = (itemId) => {
    dispatch(removeCart(itemId));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadCartFromLocalStorage = () => {
        try {
          const cartItems = localStorage.getItem("cartItems");
          if (cartItems) {
            return JSON.parse(cartItems);
          }
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
          return [];
        }
      };

      const cartItems = loadCartFromLocalStorage();
      dispatch(setCartItems(cartItems));
      setIsInitialized(true); // 状態が初期化されたことを示す
    }
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized && amount === 0) {
      router.push("/");
    }
  }, [isInitialized, amount, router]);

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

  return (
    <div className="cart_list">
      <h1 className="cart_head">カート内容のご確認</h1>
      {amount < 2 ? (
        <h2>{amount} item in cart</h2>
      ) : (
        <h2>{amount} items in cart</h2>
      )}
      {cartItems.map((item) => (
        <div className="cartItem" key={item.id}>
          <img src={item.imageUrls[0]} alt={item.name} />
          <p>{item.name}</p>
          <button onClick={() => handleRemoveItem(item.id)}>削除</button>
          <p className="price">￥ {item.price}</p>
        </div>
      ))}
      <h3>小計 ￥{total}</h3>
      <div className="buttonArea">
        <Link href="/">
          <button className="next">買い物を続ける</button>
        </Link>
        <button className="buy" onClick={handleCheckout}>
          ご注文手続きへ
        </button>
      </div>
    </div>
  );
};

export default Cart;
