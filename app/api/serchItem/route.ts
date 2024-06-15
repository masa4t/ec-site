import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "../../../prisma/prisma";

export async function GET() {
  try {
    const recipt = await prisma.product.fin
    

  } catch {}
}
