"use client";

import dynamic from "next/dynamic";
import { Agents, Meetings, User } from "@prisma/client";

const Callui = dynamic(() => import("./Callui"), {
  ssr: false,
});

type ExtendedMeeting = Meetings & {
  agent: Agents;
  user: User;
};

type Props = {
  meetingData: ExtendedMeeting;
  token: string;
};

export default function CalluiWrapper({ meetingData, token }: Props) {
  return <Callui meetingData={meetingData} token={token} />;
}
