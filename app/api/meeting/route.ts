import { auth } from "@/auth";
import { prisma } from "@/db/prisma";

import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { meetingname, agentId } = await req.json();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized or missing user ID" },
        { status: 401 }
      );
    }

    if (!meetingname || !agentId) {
      return NextResponse.json(
        { error: "Fill up the fields" },
        { status: 400 }
      );
    }

    const existingMeet = await prisma.meetings.findUnique({
      where: {
        name: meetingname,
      },
    });

    if (existingMeet) {
      return NextResponse.json(
        { error: "Agent already registered" },
        { status: 400 }
      );
    }

    await prisma.meetings.create({
      data: {
        name: meetingname,
        userId: session.user.id,
        agentId: agentId,
      },
    });

    return NextResponse.json(
      { message: "Meeting created Succesfully" },
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
