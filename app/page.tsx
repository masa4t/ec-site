// "use client";
import Link from "next/link";
import Items from "./components/Items";
import "./layout.scss";

async function fetchProducts() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/syncProducts`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products = await response.json();
    // console.log(products); // データをコンソールに出力して確認
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const data = await fetchProducts();

  return (
    <>
      <Link href="Shop" className="view">
        view all
      </Link>
      <Items data={data} />
    </>
  );
}
