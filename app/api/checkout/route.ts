// server.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req) {
  try {
    const { cartItems } = await req.json();

    const transformedItems = cartItems.map((item) => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: item.name,
          images: [item.imageUrls[0]],
        },
        unit_amount: item.price,
      },
      quantity: 1,
      //   metadata: {
      //     productId: item.id,
      //   },
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: transformedItems,
      mode: "payment",
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
      shipping_address_collection: {
        allowed_countries: ["JP"],
      },
      metadata: {
        cartItemIds: JSON.stringify(cartItems.map((item) => item.id)),
      },
    });
    
    return NextResponse.json({ checkout_url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
