"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form"; // Removed Form import from here
import { z } from "zod";
import {
  Form, // Import Form from your UI components instead
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
import { GeneratedAvatar } from "./generatedAvatar";

const formSchema = z.object({
  agentname: z.string().min(2, {
    message: "Agent name must be at least 2 characters.",
  }),
  agentInst: z.string().nonempty({
    message: "Instruction must be given",
  }),
});

const Agentcreator = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false); // Fixed: set proper boolean type
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentname: "",
      agentInst: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data?.error || "Registration failed. Please try again";
        showToast.error(errorMsg);
        setLoading(false);
      } else {
        onSuccess();
        showToast.success("Agent created successfully")
        router.push("/agents");
      }
    } catch (error: unknown) {
      let fallbackMessage = "Something went wrong. Please try again";
      if (error instanceof Error) {
        fallbackMessage = error.message;
      }
      showToast.error(fallbackMessage);
    }finally{
      setLoading(false)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md mx-auto"
        >
          <GeneratedAvatar
            seed={form.watch("agentname")}
            variant="botttsNeutral"
            className="size-25 mx-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
"
          />
          <FormField
            control={form.control}
            name="agentname"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel
                  className="text-cyan-100 text-lg font-medium tracking-wide 
                               group-focus-within:text-cyan-300 transition-colors duration-200
                               drop-shadow-sm"
                >
                  Agent Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter your agent's name..."
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
                  Choose a memorable name for your AI agent
                </FormDescription>
                <FormMessage className="text-red-400 text-sm font-medium" />
              </FormItem>
            )}
          />

          {/* Instructions Field */}
          <FormField
            control={form.control}
            name="agentInst"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel
                  className="text-cyan-100 text-lg font-medium tracking-wide
                               group-focus-within:text-cyan-300 transition-colors duration-200
                               drop-shadow-sm"
                >
                  Instructions
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <textarea
                      placeholder="Describe your agent's role and behavior..."
                      {...field}
                      rows={4}
                      className="w-full bg-gradient-to-r from-slate-800/40 to-slate-900/40 
                          backdrop-blur-xl text-white placeholder:text-slate-400
                          border border-cyan-500/30 rounded-xl text-base font-medium
                          focus-visible:ring-2 focus-visible:ring-cyan-400/50 
                          focus-visible:border-cyan-400/70 focus-visible:outline-none
                          transition-all duration-300 ease-out resize-none
                          hover:border-cyan-400/50 hover:bg-slate-800/60
                          shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
                          focus-visible:shadow-[0_0_20px_rgba(34,211,238,0.3)]
                          px-4 py-3 leading-relaxed"
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
                  Define your agent&apos;s personality and capabilities
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
