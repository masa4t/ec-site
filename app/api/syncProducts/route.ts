// app/api/syncProducts/route.ts
import { PrismaClient } from "@prisma/client";
import { client } from "@/app/lib/client";
import { NextResponse } from "next/server";
import prisma from "../../../prisma/prisma";

export async function GET() {
  try {
    // CMSからのデータ取得
    const response = await client.get({ endpoint: "sup" });
    const products = response.contents; // contentsプロパティから商品情報を取得

    console.log("Fetched products from CMS:", products);

    // 商品情報を保存する配列
    const savedProducts = [];

    // 取得した商品データを処理
    for (const product of products) {
      // 商品情報をデータベースに保存
      const savedProduct = await prisma.product.upsert({
        where: { id: product.id },
        update: {
          name: product.title,
          description: product.description,
          price: product.price,
          // すべての画像URLを保存する
          imageUrls: product.images.map((image: any) => image.url),
          updatedAt: new Date(), // updatedAtフィールドを現在時刻に更新
        },
        create: {
          id: product.id,
          name: product.title,
          description: product.description,
          price: product.price,
          // すべての画像URLを保存する
          imageUrls: product.images.map((image: any) => image.url),
          stock: product.amount, // 初回同期時のみ在庫数を設定
          createdAt: new Date(), // 現在の時刻に設定
          updatedAt: new Date(), // 現在の時刻に設定
        },
      });

      console.log("Saved product:", savedProduct);

      savedProducts.push(savedProduct);
    }

    return NextResponse.json(savedProducts);
  } catch (error) {
    console.error("Error syncing products:", error);
    return NextResponse.json(
      { message: "Failed to sync products" },
      { status: 500 }
    );
  }
}
