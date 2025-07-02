"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form"; // Removed Form import from here
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TextShimmerWave } from "./motion-primitives/text-shimmer-wave";
import { showToast } from "@/lib/toaster";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgentStore } from "@/store/agentStore";
import { GeneratedAvatar } from "./generatedAvatar";
const formSchema = z.object({
  meetingname: z.string().min(2, {
    message: "Meeting name must be at least 2 characters.",
  }),
  agentId: z.string().min(1, {
    message: "Please select an agent",
  }),
});

const Agentcreator = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meetingname: "",
      agentId: "",
    },
  });
  const agents = useAgentStore((state) => state.agents);

  const itemsAgent = useMemo(() => {
    return agents!.map((agent) => ({
      label: agent.name,
      value: agent.id,
      instructions: agent.instructions,
      meetings: agent.meetings,
    }));
  }, [agents]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(false);
    console.log(values)
    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data?.error || "Meeting Creation failed. Please try again";
        showToast.error(errorMsg);
        setLoading(false);
      } else {
        localStorage.setItem("toast", "meeting_success");
        onSuccess();
        router.push("/meetings");
      }
    } catch (error: unknown) {
      let fallbackMessage = "Something went wrong. Please try again";
      if (error instanceof Error) {
        fallbackMessage = error.message;
      }
      showToast.error(fallbackMessage);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md mx-auto"
        >
          <FormField
            control={form.control}
            name="meetingname"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel
                  className="text-cyan-100 text-lg font-medium tracking-wide 
                               group-focus-within:text-cyan-300 transition-colors duration-200
                               drop-shadow-sm"
                >
                  Meeting Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Meeting ka naam likh..."
                      {...field}
                      className="w-full h-12 bg-gradient-to-r from-slate-800/40 to-slate-900/40 
                          backdrop-blur-xl text-white placeholder:text-slate-400
                          border border-cyan-500/30 rounded-xl text-base font-medium
                          focus-visible:ring-2 focus-visible:ring-cyan-400/50 
                          focus-visible:border-cyan-400/70 focus-visible:outline-none
                          transition-all duration-300 ease-out
                          hover:border-cyan-400/50 hover:bg-slate-800/60
                          shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
                          focus-visible:shadow-[0_0_20px_rgba(34,211,238,0.3)]
                          px-4"
                    />
                    <div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 
                            pointer-events-none opacity-0 group-focus-within:opacity-100 
                            transition-opacity duration-300"
                    />
                  </div>
                </FormControl>
                <FormDescription
                  className="text-slate-400 text-sm font-light tracking-wide
                                     opacity-80 hover:opacity-100 transition-opacity duration-200"
                >
                  Choose a memorable name for your Meet
                </FormDescription>
                <FormMessage className="text-red-400 text-sm font-medium" />
              </FormItem>
            )}
          />

          {/* Instructions Field */}
          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel
                  className="text-cyan-100 text-lg font-medium tracking-wide 
                   group-focus-within:text-cyan-300 transition-colors duration-200
                   drop-shadow-sm"
                >
                  Select Agent
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className="w-full h-12 bg-gradient-to-r from-slate-800/40 to-slate-900/40 
                backdrop-blur-xl text-white placeholder:text-slate-400
                border border-cyan-500/30 rounded-xl text-base font-medium
                focus-visible:ring-2 focus-visible:ring-cyan-400/50 
                focus-visible:border-cyan-400/70 focus-visible:outline-none
                transition-all duration-300 ease-out
                hover:border-cyan-400/50 hover:bg-slate-800/60
                shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
                focus-visible:shadow-[0_0_20px_rgba(34,211,238,0.3)]
                px-4 py-7"
                      >
                        <SelectValue placeholder="Select your Agent" />
                      </SelectTrigger>
                      <div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 
                pointer-events-none opacity-0 group-focus-within:opacity-100 
                transition-opacity duration-300"
                      />
                      <SelectContent
                        className="bg-slate-900/95 border border-cyan-500/20 backdrop-blur-md 
                rounded-xl shadow-xl min-w-[280px] p-2 z-50"
                      >
                        <SelectGroup>
                          <SelectLabel className="text-cyan-300 text-xs font-semibold tracking-widest px-3 py-1">
                            Available Agents
                          </SelectLabel>
                          {itemsAgent.map((item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              className="rounded-lg p-3 mx-1 my-1 hover:bg-gradient-to-r 
                    hover:from-blue-900/20 hover:to-indigo-900/20 
                    focus:bg-gradient-to-r focus:from-blue-800/30 focus:to-indigo-800/30 
                    transition-all duration-200 cursor-pointer group/item"
                            >
                              <span className="flex items-center gap-3">
                                <GeneratedAvatar
                                  seed={item.label}
                                  variant="botttsNeutral"
                                  className="w-8 h-8 rounded-full ring-2 ring-slate-700 
                          group-hover/item:ring-blue-600 transition-all duration-200 shadow-sm"
                                />
                                <span className="text-white font-medium tracking-wide group-hover/item:text-blue-300 transition-colors duration-200">
                                  {item.label}
                                </span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormDescription
                  className="text-slate-400 text-sm font-light tracking-wide
          opacity-80 hover:opacity-100 transition-opacity duration-200"
                >
                  Choose a personalized agent
                </FormDescription>
                <FormMessage className="text-red-400 text-sm font-medium" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 relative overflow-hidden
                  bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600
                  text-white font-semibold text-lg tracking-wide
                  rounded-xl border border-cyan-400/30
                  shadow-[0_8px_32px_rgba(34,211,238,0.3)]
                  transition-all duration-300 ease-out
                  hover:from-cyan-500 hover:via-blue-500 hover:to-purple-600
                  hover:shadow-[0_12px_40px_rgba(34,211,238,0.4)]
                  hover:border-cyan-300/50 hover:scale-[1.02]
                  focus:outline-none focus:ring-2 focus:ring-cyan-400/50
                  active:scale-[0.98] active:transition-transform active:duration-100
                  disabled:opacity-60 disabled:cursor-not-allowed 
                  disabled:hover:scale-100 disabled:hover:shadow-[0_8px_32px_rgba(34,211,238,0.3)]
                  group"
            >
              {/* Button Background Effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* Button Content */}
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div
                      className="w-5 h-5 border-2 border-white/30 border-t-white 
                            rounded-full animate-spin"
                    />
                    <TextShimmerWave className="text-white font-medium text-base tracking-wide">
                      Creating Agent...
                    </TextShimmerWave>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="drop-shadow-sm">Create Agent</span>
                  </>
                )}
              </div>

              {/* Shimmer Effect */}
              <div
                className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent 
                       via-white/10 to-transparent opacity-0 group-hover:opacity-100
                       transition-opacity duration-500 group-hover:animate-pulse"
              />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Agentcreator;
