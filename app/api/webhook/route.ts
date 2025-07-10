import { streamVideo } from "@/lib/streamVideo";
import { ok } from "assert";
import { NextRequest, NextResponse } from "next/server";

import {
  CallSessionStartedEvent,
  CallSessionParticipantLeftEvent,
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallRecordingReadyEvent,
} from "@stream-io/node-sdk";
import { prisma } from "@/db/prisma";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}
const openAiApiKey = process.env.OPEN_AI_APIA_KEY!;
export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or Api Key" },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid Signnature " }, { status: 400 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;

    const meetingId = event.call.custom.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing MeetingId" }, { status: 400 });
    }

    const existingMeet = await prisma.meetings.findFirst({
      where: {
        id: meetingId,
        status: "UPCOMING",
      },
    });

    if (!existingMeet) {
      return NextResponse.json({ error: "Invalid Meeting" }, { status: 400 });
    }

    await prisma.meetings.update({
      where: {
        id: meetingId,
      },
      data: {
        status: "ACTIVE",
        startedAt: new Date(),
      },
    });

    const existingAgent = await prisma.agents.findFirst({
      where: {
        id: existingMeet.agentId,
      },
    });

    if (!existingAgent) {
      return NextResponse.json({ error: "Invalid Agent" }, { status: 400 });
    }

    const call = streamVideo.video.call("default", meetingId);
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey,
      agentUserId: existingAgent.id,
    });

    realtimeClient.updateSession({
      instructions: existingAgent.instructions,
    });
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Missing MeetingId" }, { status: 400 });
    }

    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing MeetingId" }, { status: 400 });
    }

    await prisma.meetings.update({
      where: {
        id: meetingId,
        status: "ACTIVE",
      },
      data: {
        status: "PROCESSING",
        endedAt: new Date(),
      },
    });
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Missing MeetingId" }, { status: 400 });
    }

    await prisma.meetings.update({
      where: {
        id: meetingId,
        status: "PROCESSING",
      },
      data: {
        transcriptUrl: event.call_transcription.url,
      },
    });
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Missing MeetingId" }, { status: 400 });
    }

    await prisma.meetings.update({
      where: {
        id: meetingId,
        status: "PROCESSING",
      },
      data: {
        recordingUrl: event.call_recording.url,
      },
    });
  }

  return NextResponse.json({ status: ok });
}
