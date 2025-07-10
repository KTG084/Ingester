"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import TrueFocus from "@/components/TrueFocus";
import AnimatedContent from "@/components/AnimatedContent";
import ShinyText from "@/components/ShinyText";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { showToast } from "@/lib/toaster";
import { TextShimmerWave } from "@/components/motion-primitives/text-shimmer-wave";
import Noise from "@/components/Noise";
import { Video } from "lucide-react";

const Page = () => {
  const [callActive, setcallActive] = useState(false);
  const [connnecting, setconnnecting] = useState(false);
  const [isSpeaking, setisSpeaking] = useState(false);
  const [listening, setlistening] = useState(false);
  const [messages, setmessages] = useState<any[]>([]);
  const [callEnded, setcallEnded] = useState(false);
  const [voiceHeights, setVoiceHeights] = useState<number[]>([
    50, 50, 50, 50, 50,
  ]);

  const router = useRouter();
  const { data: session, status } = useSession();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // if (!callEnded) return;
    // const redirectTimer = setTimeout(() => {
    //   router.push("/profile");
    // }, 1500);
    // return () => clearTimeout(redirectTimer);
  }, [callEnded, router]);

  useEffect(() => {
    const handleCallStart = () => {
      showToast.info("Call Started");
      setconnnecting(false);
      setcallActive(true);
      setcallEnded(false);
    };

    const handleCallEnded = () => {
      showToast.info("Call Ended");
      setcallActive(false);
      setconnnecting(false);
      setisSpeaking(false);
      setlistening(false);
      setcallEnded(true);
    };

    const handleSpeechStart = () => {
      setisSpeaking(true);
      setlistening(false);
    };

    const handleSpeechEnded = () => {
      setisSpeaking(false);
      setlistening(true);
    };

    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role };
        setmessages((prev) => [...prev, newMessage]);
      }
    };

    const handleError = (error: any) => {
      console.log("Vapi Error", error);
      setconnnecting(false);
      setcallActive(false);
    };
  });

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setconnnecting(true);
        setmessages([]);
        setcallEnded(false);

        await vapi.start("79484bc8-d69c-4cee-9c8c-c6efda69973b");
      } catch (error) {
        console.error("Vapi start error:", error);
        let erroMsg = "Failed to Start Call";

        if (error instanceof Error) {
          erroMsg = error.message;
        }

        showToast.error(erroMsg);
        setconnnecting(false);
      }
    }
  };

  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setVoiceHeights(
          Array.from({ length: 5 }, () => Math.random() * 40 + 40)
        );
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto pb-6">
      <div className="container mx-auto mt-6 px-4 h-full max-w-5xl">
        {/* Title */}
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
            <div className="flex justify-center items-center gap-3 mb-8">
              <Video className="w-12 h-12 text-cyan-400/90 drop-shadow-lg" />
              <h1 className="text-4xl font-medium text-white/95 tracking-tight">
                uibhjno
              </h1>
            </div>
          </AnimatedContent>
        </div>

        {/* VideoCall  */}
        <div className="grid cursor-pointer grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-10">
          {/* Video Panel 1 */}
          <AnimatedContent
            distance={100} // slightly more dramatic entrance
            direction="horizontal"
            reverse={true} // slides in from left
            duration={0.6} // a bit smoother
            ease="easeOutQuart" // more modern easing
            initialOpacity={0}
            animateOpacity
            scale={1.03} // very subtle pop
            threshold={0.1}
            delay={0.1} // slight head start
          >
            <Card className="bg-[#0a0a1a] border border-cyan-400/20 shadow-[0_0_15px_#00ffff22] relative">
              <CardHeader>
                <CardTitle className="text-cyan-300 text-center">
                  AI Jeff Nippard
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center justify-center relative">
                {/* Voice wave animation overlay */}
                {isSpeaking && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center transition-opacity duration-300">
                    <div className="flex items-end gap-1.5 h-40">
                      {voiceHeights.map((height, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-cyan-400 animate-sound-wave"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                            height: `${height}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Avatar */}
                <div className="relative w-32 h-32 mb-4">
                  {isSpeaking && (
                    <div className="absolute inset-0 bg-cyan-400 opacity-20 rounded-full blur-lg animate-pulse" />
                  )}

                  <div className="relative w-full h-full rounded-full overflow-hidden border border-cyan-400 shadow-inner">
                    <Image
                      src="/ai-avatar.png"
                      alt="AI Assistant"
                      className="w-full h-full object-cover relative z-10"
                      fill
                      sizes="128px"
                      priority
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col items-center justify-center gap-2">
                <h2 className="text-sm text-white text-center">
                  Fitness and Bauna Coach
                </h2>

                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c0c1c] border ${
                    isSpeaking ? "border-cyan-400" : "border-neutral-800"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isSpeaking
                        ? "bg-cyan-400 animate-pulse"
                        : "bg-neutral-600"
                    }`}
                  />
                  <span className="text-xs text-gray-400">
                    {isSpeaking ? (
                      <TextShimmerWave className="font-mono" duration={0.38}>
                        Speaking...
                      </TextShimmerWave>
                    ) : callActive ? (
                      <TextShimmerWave className="font-mono" duration={0.38}>
                        Listening...
                      </TextShimmerWave>
                    ) : callEnded ? (
                      "Redirecting to profile..."
                    ) : (
                      "Waiting..."
                    )}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </AnimatedContent>

          {/* Video Panel 2 */}
          <AnimatedContent
            distance={100}
            direction="horizontal"
            reverse={false} // slides in from right
            duration={0.6}
            ease="easeOutQuart"
            initialOpacity={0}
            animateOpacity
            scale={1.03}
            threshold={0.1}
            delay={0.1} // staggers behind panel 1
          >
            <Card className="bg-[#0a0a1a] border border-cyan-400/20 shadow-[0_0_15px_#00ffff22] relative">
              <CardHeader>
                <CardTitle className="text-cyan-300 text-center">
                  {session?.user?.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center justify-center relative">
                {/* Voice wave animation overlay */}
                {listening && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center transition-opacity duration-300">
                    <div className="flex items-end gap-1.5 h-40">
                      {voiceHeights.map((height, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-cyan-400 animate-sound-wave"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                            height: `${height}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Avatar */}
                <div className="relative w-32 h-32 mb-4">
                  {listening && (
                    <div className="absolute inset-0 bg-cyan-400 opacity-20 rounded-full blur-lg animate-pulse" />
                  )}

                  <div className="relative w-full h-full rounded-full overflow-hidden border border-cyan-400 shadow-inner">
                    <Image
                      src={
                        session?.user?.image || "https://github.com/shadcn.png"
                      }
                      alt="AI Assistant"
                      className="w-full h-full object-cover relative z-10"
                      fill
                      sizes="128px"
                      priority
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col items-center justify-center gap-2">
                <h2 className="text-sm text-white text-center">Petla Dhus</h2>

                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c0c1c] border ${
                    callActive && listening
                      ? "border-cyan-400"
                      : "border-neutral-800"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isSpeaking
                        ? "bg-cyan-400 animate-pulse"
                        : "bg-neutral-600"
                    }`}
                  />
                  <span className="text-xs text-gray-400">
                    {isSpeaking ? (
                      <TextShimmerWave className="font-mono" duration={0.38}>
                        Listening...
                      </TextShimmerWave>
                    ) : callActive ? (
                      <TextShimmerWave className="font-mono" duration={0.38}>
                        Speaking...
                      </TextShimmerWave>
                    ) : callEnded ? (
                      "Redirecting to profile..."
                    ) : (
                      "Ready"
                    )}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </AnimatedContent>
        </div>
        <div className="w-full flex justify-center gap-4 mb-10">
          <Button
            onClick={toggleCall}
            disabled={connnecting}
            className={`w-40 text-xl rounded-lg transition-colors duration-300 cursor-pointer
              ${
                callActive
                  ? "bg-destructive hover:bg-destructive/80"
                  : callEnded
                  ? "bg-cyan-600 shadow-[0_0_15px_#22d3ee66]"
                  : "bg-primary hover:bg-primary/90"
              }
          text-white relative`}
          >
            {connnecting && (
              <span className="absolute inset-0 rounded-lg animate-ping bg-cyan-300/20 opacity-75 z-0" />
            )}

            <span>
              {callActive ? (
                "EndCall"
              ) : connnecting ? (
                <TextShimmerWave className="text-lg font-mono" duration={0.38}>
                  Connecting...
                </TextShimmerWave>
              ) : callEnded ? (
                "View Profile"
              ) : (
                "Start Call"
              )}
            </span>
          </Button>
        </div>

        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="relative max-h-[200px] w-full mb-8 overflow-y-auto scroll-smooth rounded-xl border border-cyan-400/20 
             bg-[#0a0a1a]/80 backdrop-blur-md p-4 custom-scrollbar"
          >
            {/* Noise background overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
              <Noise
                patternSize={400}
                patternScaleX={4}
                patternScaleY={4}
                patternRefreshInterval={2}
                patternAlpha={15}
              />
            </div>

            {/* Message content goes here */}
            <div className="relative z-10 space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-cyan-300 mb-1">
                    {msg.role === "assistant" ? "AI JeFF Nipard" : "You"}:
                  </div>
                  <p className="text-white">{msg.content}</p>
                </div>
              ))}

              {callEnded && (
                <div className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-cyan-300 mb-1">
                    System:
                  </div>
                  <p className="text-white">
                    Your fitness program has been created! Redirecting to your
                    profile...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
