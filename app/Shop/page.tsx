// "use client";
import React from "react";
import { client } from "../lib/client";
import "./Shop.scss";
import Link from "next/link";
async function fetchProducts() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/syncProducts`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products = await response.json();
    console.log(products); // データをコンソールに出力して確認
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
const Shop = async () => {
  const data = await fetchProducts();
  return (
    <>
      <Link href="/" className="shop">
        shop
      </Link>
      <div className="home">
        {data.map((item) => (
          <div key={item.id}>
            <Link
              href={{
                pathname: `/content/${item.id}`,
                query: { item: JSON.stringify(item) },
              }}
            >
              <img src={item.imageUrls[0]} />
            </Link>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Shop;
