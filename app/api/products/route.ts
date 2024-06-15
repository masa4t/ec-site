// app/api/syncProducts/route.ts
import { PrismaClient } from "@prisma/client";
import { client } from "../../lib/client"; // microCMSクライアント
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//商品情報を取得するAPI
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
