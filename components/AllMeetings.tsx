"use client";

import AnimatedContent from "@/components/AnimatedContent";
import ShinyText from "@/components/ShinyText";
import TrueFocus from "@/components/TrueFocus";
import { Button } from "@/components/ui/button";
import { Agents, Meetings, User } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import React, { useMemo, useState } from "react";

type ExtendedMeeting = Meetings & {
  user: User;
  agent: Agents;
};
type Props = {
  meetings: ExtendedMeeting[];
};
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GeneratedAvatar } from "./generatedAvatar";
import MeetingCreator from "@/components/MeetingCreator";

const Page = ({ meetings }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const items = useMemo(() => {
    return meetings.map((meeting) => ({
      label: meeting.name,
      value: meeting.id,
      status: meeting.status,
      agent: meeting.agent,
      user: meeting.user,
    }));
  }, [meetings]);

  

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
            <TrueFocus
              sentence="Schedule & Create your Meetings"
              manualMode={false}
              glowColor="#67e8f9"
              blurAmount={5}
              borderColor="#67e8f9"
              animationDuration={0.5}
              pauseBetweenAnimations={1}
            />
            <div className="mt-7">
              <ShinyText
                text="Power Your Meetings with a Personalized AI Assistant."
                disabled={false}
                speed={5}
                className="text-cyan-300/80 drop-shadow-[0_0_10px_#67e8f9] text-lg "
              />
            </div>
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
          delay={0.35}
        >
          <section className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white border-b-2 drop-shadow-[0_2px_4px_rgba(103,232,249,0.5)] border-cyan-400 pb-1 inline-block">
              My Meetings
            </h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="cursor-pointer flex items-center gap-2 
                    bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 
                    text-white font-bold px-6 py-2.5 rounded-lg 
                    border border-cyan-400/30 backdrop-blur-sm
                    shadow-[0_4px_20px_rgba(34,211,238,0.3)] 
                    transition-all duration-300 ease-in-out 
                    hover:from-cyan-400 hover:to-cyan-500
                    hover:shadow-[0_6px_30px_rgba(34,211,238,0.5)] 
                    hover:border-cyan-300/50
                    hover:scale-[1.02] hover:-translate-y-0.5
                    focus:outline-none 
                    active:scale-[0.98] active:translate-y-0
                    drop-shadow-[0_2px_10px_rgba(103,232,249,0.3)]"
                >
                  <Plus className="w-4 h-4 drop-shadow-sm" strokeWidth={3.5} />
                  <span className="drop-shadow-sm">New Meeting</span>
                </Button>
              </DialogTrigger>
              <DialogContent
                className="
                flex flex-col items-center justify-center
                bg-gradient-to-br from-[#0a0a1a]/95 to-[#07172f]/95 
                border border-cyan-500/20 backdrop-blur-md
                shadow-[0_20px_50px_rgba(0,0,0,0.4)]
                rounded-xl max-w-md
                py-10 px-0 w-full
              "
              >
                <DialogTitle>
                  <div className="text-4xl font-bold mb-6 text-center text-white">
                    Create Your Agent
                  </div>
                </DialogTitle>
                <MeetingCreator onSuccess={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </section>
        </AnimatedContent>
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
          delay={0.35}
        >
          <section className="flex items-center justify-between mb-6">
            <Table className="w-full border border-cyan-500/10 rounded-xl backdrop-blur-md shadow-[0_8px_32px_rgba(0,255,255,0.05)] overflow-hidden">
              <TableHeader className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 backdrop-blur border-b border-cyan-500/10">
                <TableRow>
                  <TableHead className="px-4 py-3 text-cyan-200 text-sm font-semibold tracking-wide">
                    Meeting Name
                  </TableHead>
                  <TableHead className="px-4 py-3 text-cyan-200 text-sm font-semibold tracking-wide">
                    Agent Name
                  </TableHead>
                  <TableHead className="px-4 py-3 text-cyan-200 text-sm font-semibold tracking-wide">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-cyan-500/5">
                {items.map((item) => (
                  <TableRow
                    key={item.value}
                    className="hover:bg-gradient-to-r from-cyan-500/5 to-blue-500/5 transition-colors duration-300 group"
                  >
                    <TableCell className="px-4 py-3 font-medium text-white group-hover:text-cyan-100 transition-colors">
                      {item.label}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-slate-300 group-hover:text-cyan-100 transition-colors">
                      <span className="flex items-center gap-2">
                        <GeneratedAvatar
                          seed={item.agent.name}
                          variant="botttsNeutral"
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-white font-medium">
                          {item.agent.name}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shadow-sm
              ${
                item.status === "UPCOMING"
                  ? "bg-gradient-to-r from-emerald-400/10 to-emerald-400/5 text-emerald-300 border-emerald-400/20 shadow-emerald-400/20"
                  : item.status === "ONGOING"
                  ? "bg-gradient-to-r from-amber-400/10 to-amber-400/5 text-amber-300 border-amber-400/20 shadow-amber-400/20"
                  : item.status === "COMPLETED"
                  ? "bg-gradient-to-r from-cyan-400/10 to-cyan-400/5 text-cyan-300 border-cyan-400/20 shadow-cyan-400/20"
                  : item.status === "PROCESSING"
                  ? "bg-gradient-to-r from-blue-400/10 to-blue-400/5 text-blue-300 border-blue-400/20 shadow-blue-400/20"
                  : "bg-gradient-to-r from-red-400/10 to-red-400/5 text-red-300 border-red-400/20 shadow-red-400/20"
              }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </AnimatedContent>
      </div>
    </div>
  );
};

export default Page;
