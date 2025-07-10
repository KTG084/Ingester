import { createStreamToken } from "@/app/meetings/procedures/generateToken";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { Agents, Meetings, User } from "@prisma/client";
import React, { Suspense } from "react";

import CalluiWrapper from "@/components/CalluiWrapper";

export const dynamic = "force-dynamic";

type ExtendedMeeting = Meetings & {
  agent: Agents;
  user: User;
};
export default async function Page({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;
  const token = await createStreamToken();

  const session = await auth();
  try {
    if (!session || !session.user.id) {
      return <div>You need to login first</div>;
    }
    const meetingData: ExtendedMeeting | null =
      await prisma.meetings.findUnique({
        where: {
          id: meetingId,
        },
        include: {
          agent: true,
          user: true,
        },
      });

    if (!meetingData) {
      return (
        <div className="flex items-center justify-center min-h-screen text-lg text-red-500 font-semibold">
          🚫 Meeting doesn&apos;t exist.
        </div>
      );
    }

    if (meetingData?.status === "COMPLETED") {
      return (
        <div className="flex items-center justify-center min-h-screen text-lg text-red-500 font-semibold">
          🚫 This meeting has already ended.
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
        <CalluiWrapper meetingData={meetingData} token={token} />
      </Suspense>
    );
  } catch (error: unknown) {
    let errMsg = "Failed to fetch agents" as string;

    if (error instanceof Error) {
      errMsg = error.message;
    }

    return <div className="text-red-500">{errMsg}</div>;
  }
}
