import { auth } from "@/auth";
import { GeneratedAvatarUri } from "@/components/genrateAvatarDataUri";
import { prisma } from "@/db/prisma";
import { streamVideo } from "@/lib/streamVideo";

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

    const agent = await prisma.agents.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Selected agent does not exist" },
        { status: 400 }
      );
    }

    const creMeet = await prisma.meetings.create({
      data: {
        name: meetingname,
        userId: session.user.id,
        agentId: agentId,
      },
    });

    const call = streamVideo.video.call("default", creMeet.id);
    await call.create({
      data: {
        created_by_id: session.user.id,
        custom: {
          meetingId: creMeet.id,
          meetingName: creMeet.name,
        },
        settings_override: {
          transcription: {
            language: "en",
            mode: "auto-on",
            closed_caption_mode: "auto-on",
          },
          recording: {
            mode: "auto-on",
            quality: "1080p",
          },
        },
      },
    });

    await streamVideo.upsertUsers([
      {
        id: agent.id,
        name: agent.id,
        role: "user",
        image:
          session.user.image ??
          GeneratedAvatarUri({
            seed: session.user.name,
            variant: "botttsNeutral",
          }),
      },
    ]);

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
