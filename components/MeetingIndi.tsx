"use client";

import { Agents, Meetings } from "@prisma/client";
import React, { useState } from "react";
import AnimatedContent from "./AnimatedContent";
import { BanIcon, Video } from "lucide-react";
import { GeneratedAvatar } from "./generatedAvatar";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
  meetingData: Meetings;
  agentData: Agents;
};

const MeetingIndi = ({ meetingData, agentData }: Props) => {
  const [iscancelling, setiscancelling] = useState(false);

  const isUpcoming = meetingData.status === "UPCOMING";
  const isActive = meetingData.status === "ACTIVE";
  const isCancelled = meetingData.status === "CANCELLED";
  const isCompleted = meetingData.status === "COMPLETED";
  const isProcessing = meetingData.status === "PROCESSING";
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto pb-6">
      <div className="container mx-auto mt-6 px-4 h-full max-w-5xl">
        <div className="text-center mb-8">
          <AnimatedContent
            distance={80} // slightly less intense motion
            direction="vertical"
            reverse={false}
            duration={0.4} // slightly longer, smoother
            ease="easeOutCubic" // more natural easing
            initialOpacity={0}
            animateOpacity
            scale={1.05} // subtle, avoids "zoomy" feel
            threshold={0.1}
            delay={0.15}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_2px_10px_rgba(34,211,238,0.7)] tracking-tight mb-6">
              Meeting Details
            </h1>
          </AnimatedContent>
        </div>
        <AnimatedContent
          distance={80} // slightly less intense motion
          direction="vertical"
          reverse={false}
          duration={0.4} // slightly longer, smoother
          ease="easeOutCubic" // more natural easing
          initialOpacity={0}
          animateOpacity
          scale={1.05} // subtle, avoids "zoomy" feel
          threshold={0.1}
          delay={0.15}
        >
          <section className="flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a1a]/30 to-[#07172f]/30 rounded-xl border border-cyan-500/10 backdrop-blur-md p-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
            <div className="mb-10 flex items-center flex-col">
              <div className="flex items-center gap-3 mb-8">
                <Video className="w-12 h-12 text-cyan-400/90 drop-shadow-lg" />
                <h1 className="text-2xl font-medium text-white/95 tracking-tight">
                  {meetingData.name}
                </h1>
              </div>

              <div className="space-y-1 mb-5">
                <h2 className="text-lg font-light uppercase tracking-wider text-white/70">
                  Agent
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400/90 to-transparent"></div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-2 flex items-start justify-start pointer-events-none">
                    <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-lg"></div>
                  </div>
                  <div className="absolute -inset-2 flex items-start justify-end pointer-events-none">
                    <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-lg"></div>
                  </div>
                  <div className="absolute -inset-2 flex items-end justify-start pointer-events-none">
                    <div className="w-6 h-6 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-lg"></div>
                  </div>
                  <div className="absolute -inset-2 flex items-end justify-end pointer-events-none">
                    <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400/60 rounded-br-lg"></div>
                  </div>

                  <GeneratedAvatar
                    seed={agentData.name}
                    variant="botttsNeutral"
                    className="w-32 h-32 object-fill rounded-full overflow-hidden shadow-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5  transition-all duration-500 group-hover:shadow-2xl group-hover:border-cyan-400/30 relative z-10"
                  />

                  <div className="absolute inset-0 rounded-full bg-cyan-400/70 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>

                <h3 className="text-xl font-medium text-cyan-300/95 tracking-wide">
                  {agentData.name}
                </h3>
              </div>
            </div>

            {isUpcoming && (
              <div className="flex flex-col items-center justify-center text-center]">
                <h2 className="text-3xl font-extrabold  text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.4)] mb-2.5">
                  Not Started Yet
                </h2>
                <h3 className="text-md md:text-lg text-slate-300 font-light max-w-lg">
                  Once you start this meeting, a summary will appear here.
                </h3>
                <div className="my-4 flex gap-4">
                  <Button
                    disabled={iscancelling}
                    className="
      flex items-center gap-2 px-5 py-2.5 
      bg-gradient-to-r from-red-500/30 to-red-600/40 
      text-white font-semibold rounded-lg 
      shadow-md hover:shadow-lg transition-all 
      hover:from-red-400/50 hover:to-red-500/80 
      active:scale-[0.97] border border-red-400/30
    "
                  >
                    <BanIcon className="w-5 h-5" />
                    <h1 className="text-md ">Cancel Meeting</h1>
                  </Button>

                  <Link href={`/call/${meetingData.id}`}>
                    <Button
                      disabled={iscancelling}
                      className="
      flex items-center gap-2 px-5 py-2.5 
      bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 
      text-white font-semibold rounded-lg 
      shadow-md hover:shadow-lg transition-all 
      hover:from-cyan-400 hover:to-cyan-500 
      active:scale-[0.97] border border-cyan-400/30
    "
                    >
                      <Video className="w-5 h-5 text-cyan-100 drop-shadow-sm" />
                      <h1 className="text-md ">Start Meeting</h1>
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {isActive && (
              <div className="flex flex-col items-center justify-center text-center]">
                <h2 className="text-3xl font-extrabold  text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.4)] mb-2.5">
                  Meeting is Active
                </h2>
                <h3 className="text-md md:text-lg text-slate-300 font-light max-w-lg">
                  Meeting will end once all the participants have left
                </h3>
                <div className="my-4 flex">
                  <Button
                    disabled={iscancelling}
                    className="
      flex items-center gap-2 px-5 py-2.5 
      bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 
      text-white font-semibold rounded-lg 
      shadow-md hover:shadow-lg transition-all 
      hover:from-cyan-400 hover:to-cyan-500 
      active:scale-[0.97] border border-cyan-400/30
    "
                  >
                    <Video className="w-5 h-5 text-cyan-100 drop-shadow-sm" />
                    <h1 className="text-md ">Join Meeting</h1>
                  </Button>
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="flex flex-col items-center justify-center text-center]">
                <h2 className="text-3xl font-extrabold  text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.4)] mb-2.5">
                  Meeting Cancelled
                </h2>
                <h3 className="text-md md:text-lg text-slate-300 font-light max-w-lg">
                  This meeting was cancelled
                </h3>
              </div>
            )}
            {isProcessing && (
              <div className="flex flex-col items-center justify-center text-center]">
                <h2 className="text-3xl font-extrabold  text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.4)] mb-2.5">
                  Meeting Completed
                </h2>
                <h3 className="text-md md:text-lg text-slate-300 font-light max-w-lg">
                  The summary will appear soon
                </h3>
              </div>
            )}
          </section>
        </AnimatedContent>
      </div>
    </div>
  );
};

export default MeetingIndi;
