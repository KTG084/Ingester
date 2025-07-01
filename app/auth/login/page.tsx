"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { TextShimmerWave } from "@/components/motion-primitives/text-shimmer-wave";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});
import AnimatedContent from "@/components/AnimatedContent";
import { showToast } from "@/lib/toaster";
const Page = () => {
  const [loading, setloading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onClick = (provider: "google" | "github") => {
    localStorage.setItem("toast", "login_success");
    signIn(provider, {
      callbackUrl,
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setloading(true);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.url) {
        localStorage.setItem("toast", "login_success");
        window.location.href = callbackUrl;
      } else {
        showToast.error("Invalid email or password");
      }
    } catch (err: unknown) {
      let fallbackMessage = "Something went wrong. Please try again.";
      if (err instanceof Error) {
        fallbackMessage = err.message;
      }
      showToast.error(fallbackMessage);
    }
  }
  return (
    <div className="-mt-24 bg-[#0a0a1a]/20 backdrop-blur-lg min-h-screen flex items-center justify-center px-4">
      <AnimatedContent
        distance={200}
        direction="vertical"
        reverse={false}
        duration={0.4}
        ease="easeOutCubic"
        initialOpacity={0}
        animateOpacity
        scale={1.04}
        threshold={0.15}
        delay={0.15}
      >
        <div
          className="backdrop-blur-xl bg-[#0a0a1a]/30 border border-cyan-400/30
        rounded-2xl shadow-[0_8px_40px_#00ffff44] px-10 py-10 w-[450px] max-w-full "
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-white">
            Login
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-full"
            >
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-lg">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                        className="w-full bg-white/10 backdrop-blur-md text-white placeholder:text-white/70 
                        border border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-400 
                        focus-visible:outline-none rounded-md text-base"
                      />
                    </FormControl>
                    <FormDescription className="text-white/70 text-sm">
                      This is your email ID.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-lg">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="w-full bg-white/10 backdrop-blur-md text-white placeholder:text-white/70 
                        border border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-400 
                        focus-visible:outline-none rounded-md  text-base"
                      />
                    </FormControl>
                    <FormDescription className="text-white/70 text-sm">
                      This is your password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-[90%] mx-auto flex cursor-pointer bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-500 
                text-white font-semibold text-lg py-3 rounded-lg shadow-[0_4px_15px_rgba(0,255,255,0.3)] transition duration-300"
              >
                {loading ? (
                  <TextShimmerWave className="text-white font-mono text-sm">
                    Submitting...
                  </TextShimmerWave>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>

          <div className="flex items-center gap-4 mt-6">
            <hr className="flex-grow border-t border-white/20" />
            <span className="text-white/50 text-sm">or</span>
            <hr className="flex-grow border-t border-white/20" />
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
            <Button
              onClick={() => {
                onClick("google");
              }}
              variant="ghost"
              className="cursor-pointer hover:text-cyan-400 flex items-center gap-2 px-6 py-2 rounded-xl shadow-md bg-cyan-400/10 backdrop-blur-md border border-white/20 hover:bg-cyan-400/20 transition text-white"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="text-sm font-medium">Google</span>
            </Button>
            <Button
              onClick={() => {
                onClick("github");
              }}
              variant="ghost"
              className="cursor-pointer hover:text-cyan-400 flex items-center gap-2 px-6 py-2 rounded-xl shadow-md bg-cyan-400/10 backdrop-blur-md border border-white/20 hover:bg-cyan-400/20 transition text-white"
            >
              <FaGithub className="w-5 h-5" />
              <span className="text-sm font-medium">Github</span>
            </Button>
          </div>

          {/* Register Link */}
          <p className="text-sm text-center text-white/70 mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition"
            >
              Register
            </Link>
          </p>
        </div>
      </AnimatedContent>
    </div>
  );
};

export default Page;

// ?callbackUrl

//   =${encodeURIComponent(callbackUrl)
