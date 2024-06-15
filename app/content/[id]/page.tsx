"use client";
import { addToCart, removeCart } from "@/app/global/slice";
import "./content.scss";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
// import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export default function ContentPage() {
  const params = useSearchParams();
  const item = params.get("item");

  const parsedItem = JSON.parse(item!);

  const dispatch = useAppDispatch();

  const handlePurchase = () => {
    dispatch(addToCart(parsedItem));
  };
  const handleRemove = (parsedItem) => {
    dispatch(removeCart(parsedItem));
  };

  const { cartItems } = useAppSelector((state) => state.cart);
  console.log(cartItems);

  const itemExistsInCart = cartItems.some(
    (cartItem) => cartItem.id === parsedItem.id
  );

  return (
    <>
      <Link href="/" className="back">
        Back
      </Link>
      <div className="item">
        <img src={parsedItem.imageUrls[0]} alt={parsedItem.title} />
        <div className="content">
          <p>{parsedItem.title}</p>
          <p>{parsedItem.description}</p>
          <div className="sumImg"></div>
          <p>￥ {parsedItem.price}</p>
          <select>
            <option>--size--</option>
          </select>

          <div className="nextDo">
            {itemExistsInCart ? (
              <>
                <div>
                  <p className="incart">✔️ in cart</p>
                  <button
                    className="removeCart"
                    onClick={() => handleRemove(parsedItem.id)}
                  >
                    削除
                  </button>
                </div>
              </>
            ) : (
              <button className="toCart" onClick={handlePurchase}>
                カートに入れる
              </button>
            )}

            <Link href="/">
              <button className="nextBuy">買い物を続ける</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
