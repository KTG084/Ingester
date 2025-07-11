import { auth } from "@/auth";
import { prisma } from "@/db/prisma";

import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { agentname, agentInst } = await req.json();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized or missing user ID" },
        { status: 401 }
      );
    }

    if (!agentname || !agentInst) {
      return NextResponse.json(
        { error: "Fill up the fields" },
        { status: 400 }
      );
    }

    const existingAgent = await prisma.agents.findUnique({
      where: {
        name: agentname,
      },
    });

    if (existingAgent) {
      return NextResponse.json(
        { error: "Agent already registered" },
        { status: 400 }
      );
    }

    await prisma.agents.create({
      data: {
        name: agentname,
        instructions: agentInst,
        userId: session?.user.id,
      },
    });

    return NextResponse.json(
      { message: "Agent created Succesfully" },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to register user";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
