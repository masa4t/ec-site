"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks";
import { resetCart } from "../global/slice";
import Link from "next/link";
import "./success.scss";

// 日時のフォーマット関数を追加
const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  const month = date.getMonth() + 1; // 月は0から始まるため+1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${month}月 ${day}日 ${hours}時 ${minutes}分`;
};

const Success = () => {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState(null); // セッションIDをstateとして持つ
  const [orderData, setOrderData] = useState(null); // 注文データをstateとして持つ
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 最初のレンダリング時にのみ実行されるため、セッションIDを設定する
    const sessionIdFromParams = searchParams.get("session_id");
    if (sessionIdFromParams) {
      setSessionId(sessionIdFromParams);
    }
  }, [searchParams]); // searchParamsが変更された場合に再レンダリングされる

  useEffect(() => {
    // セッションIDが変更された場合にのみ実行される
    if (sessionId) {
      dispatch(resetCart());
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/success`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ session_id: sessionId }), // セッションIDをそのまま指定
            }
          );

          const data = await response.json();
          console.log(data); // データをコンソールに出力して確認
          setOrderData(data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchData();
    }
  }, [sessionId, dispatch]); // セッションIDとdispatchが変更された場合に再レンダリングされる

  if (!orderData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Link href="/" className="goto_shop">
        ホームへ
      </Link>
      <h1>ご購入ありがとうございます。</h1>
      <h2 className="success">
        ご注文手続きは{formatDate(orderData.createdAt)}に無事完了致しました。
      </h2>
      <div className="order-summary">
        <h2>Order Summary</h2>

        <ul>
          {orderData.orderItems.map((item) => (
            <li key={item.productId}>
              <img src={item.product.imageUrls} />
              <h2>{item.product.name}</h2>
              <h2>￥{item.product.price}</h2>
              {/* <p>Quantity: {item.quantity}</p> */}
            </li>
          ))}
        </ul>
      </div>
      <div className="totalAmount">
        <p>お買上点数 {orderData.orderItems.length}</p>
        <p>￥{orderData.total}</p>
      </div>
    </>
  );
};

export default Success;
