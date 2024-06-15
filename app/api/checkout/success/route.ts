import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/prisma/prisma";

const prismaClient = new PrismaClient();

export async function POST(req: Request) {
  const { session_id } = await req.json();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    // 既存の注文をセッションIDで検索
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: session_id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    if (existingOrder) {
      console.log("このセッションIDはすでに存在します。既存の注文を返します。");
      return NextResponse.json(existingOrder);
    }

    // Stripeからセッション情報を取得
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const metadata = JSON.parse(session.metadata!.cartItemIds);
    console.log(metadata);
    const customerDetails = session.customer_details;
    console.log(customerDetails);

    // 顧客情報をデータベースに保存 (upsertを使用)
    const customer = await prisma.customer.upsert({
      where: { email: customerDetails!.email as string },
      update: {
        name: customerDetails!.name as string,
        address: customerDetails?.address?.line1,
        city: customerDetails?.address?.line2,
        state: customerDetails?.address?.state,
        zip: customerDetails?.address?.postal_code,
        updatedAt: new Date(),
      },
      create: {
        email: customerDetails?.email as string,
        name: customerDetails?.name as string,
        address: customerDetails?.address?.line1,
        city: customerDetails?.address?.line2,
        state: customerDetails?.address?.state,
        zip: customerDetails?.address?.postal_code,
        country: "日本",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 注文情報をデータベースに保存
    const order = await prisma.order.create({
      data: {
        id: session_id, // セッションIDを注文のIDとして使用
        total: session?.amount_total!,
        customerId: customer.id,
        createdAt: new Date(),
        orderItems: {
          create: metadata.map((itemId: string) => ({
            productId: itemId,
            quantity: 1,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true, // 注文項目に関連する商品データも取得
          },
        },
        customer: true,
      },
    });

    // 在庫を減らす処理
    for (const itemId of metadata) {
      await prisma.product.update({
        where: { id: itemId },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });
    }

    return NextResponse.json(order);
    return NextResponse.json(customer);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 500 });
  } finally {
    await prismaClient.$disconnect();
  }
}
