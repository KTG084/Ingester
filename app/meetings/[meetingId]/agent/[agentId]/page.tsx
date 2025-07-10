import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { Agents, Meetings } from "@prisma/client";
import { Suspense } from "react";
import React from "react";

const MeetingIndi = React.lazy(() => import("@/components/MeetingIndi"));
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ meetingId: string; agentId: string }>;
}) {
  const { meetingId, agentId } = await params;
  const session = await auth();

  const meetingData: Meetings | null = await prisma.meetings.findUnique({
    where: {
      id: meetingId || undefined,
    },
  });

  if (!session?.user?.id || !meetingId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-red-500 font-semibold">
        🚫 Invalid session or meeting ID
      </div>
    );
  }

  const agentData: Agents | null = await prisma.agents.findUnique({
    where: {
      id: agentId,
    },
  });

  if (!meetingData || !agentData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-red-500 font-semibold">
        ⚠️ Meeting or Agent not found
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen w-full">
          this is loading....
        </div>
      }
    >
      <MeetingIndi meetingData={meetingData} agentData={agentData} />
    </Suspense>
  );
}
