"use client";
import { Agents } from "@prisma/client";
import React, { useMemo, useState, useEffect } from "react";
import TrueFocus from "./TrueFocus";
import AnimatedContent from "./AnimatedContent";
import ShinyText from "./ShinyText";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import AnimatedList from "./AnimatedList";
import ProfileCard from "./ProfileCard";
import { useAgentStore } from "@/store/agentStore";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Agentcreator from "./Agentcreator";
import { GeneratedAvatarUri } from "./genrateAvatarDataUri";

type Props = {
  agents: Agents[];
};

const AllAgents = ({ agents }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setagents } = useAgentStore();

  useEffect(() => {
    setagents(agents);
  }, [agents, setagents]);

  const items = useMemo(() => {
    return agents.map((agent) => ({
      label: agent.name,
      value: agent.id,
      instructions: agent.instructions,
      meetings: agent.meetings,
    }));
  }, [agents]);

  const [selectedItem, setSelectedItem] = useState(items[0]);
  const avatarDataUri = GeneratedAvatarUri({
    seed: selectedItem.label,
    variant: "botttsNeutral",
  });
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
              sentence="Generate Your AI Agent"
              manualMode={false}
              glowColor="#67e8f9"
              blurAmount={5}
              borderColor="#67e8f9"
              animationDuration={0.5}
              pauseBetweenAnimations={1}
            />
            <div className="mt-7">
              <ShinyText
                text="Build Your Own AI-Powered Test Tutor. Personalized Learning Starts Here."
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
              My Agents
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
                  <span className="drop-shadow-sm">New Agent</span>
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
                <Agentcreator onSuccess={() => setDialogOpen(false)} />
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
          <section className="flex justify-between bg-gradient-to-br from-[#0a0a1a]/30 to-[#07172f]/30 rounded-xl border border-cyan-500/10 backdrop-blur-md p-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
            <AnimatedList
              items={items.map((item) => ({
                ...item,
                meetings: item.meetings ?? 0, 
              }))}
              onItemSelect={(item) => {
                setSelectedItem(item);
              }}
              showGradients={false}
              enableArrowNavigation={true}
              displayScrollbar={false}
            />

            <div>
              <ProfileCard
                className="mt-4 mr-10"
                name={selectedItem?.label || "Agent Name"}
                title={selectedItem?.instructions || "Agent Role"}
                handle={selectedItem.label || "Agent Name"}
                status="Online"
                contactText={
                  (selectedItem.meetings ?? 0) === 1
                    ? "1 Meets"
                    : `${selectedItem.meetings ?? 0} Meets`
                }
                avatarUrl={avatarDataUri}
                showUserInfo={true}
                enableTilt={true}
              />
            </div>
          </section>
        </AnimatedContent>
      </div>
    </div>
  );
};

export default AllAgents;
