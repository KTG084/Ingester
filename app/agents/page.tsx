const AllAgents = React.lazy(() => import("@/components/AllAgents"));
import { prisma } from "@/db/prisma";
import React, { Suspense } from "react";

const page = async () => {
  try {
    const agents = await prisma.agents.findMany({});
    return (
      <Suspense
        //   todo
        fallback={
          <div className="flex items-center justify-center h-screen w-full">this is loading....</div>
        }
      >
        <AllAgents agents={agents} />
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
