const AllMeetings = React.lazy(() => import("@/components/AllMeetings"));
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import React, { Suspense } from "react";

const page = async () => {
  const session = await auth();
  try {
    const meetings = await prisma.meetings.findMany({
      where: {
        userId: session?.user.id,
      },
      include:{
        user:true,
        agent:true,
      }
    });

    return (
      <Suspense
        //   todo
        fallback={
          <div className="flex items-center justify-center h-screen w-full">
            this is loading....
          </div>
        }
      >
        <AllMeetings meetings={meetings} />
      </Suspense>
    );
  } catch (error: unknown) {
    let errMsg = "Failed to fetch agents" as string;

    if (error instanceof Error) {
      errMsg = error.message;
    }

    return <div className="text-red-500">{errMsg}</div>;
  }
};

export default page;
