"use client";
import { Agents, Meetings, User } from "@prisma/client";
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import AnimatedContent from "./AnimatedContent";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { TextShimmerWave } from "./motion-primitives/text-shimmer-wave";
import { GeneratedAvatarUri } from "./genrateAvatarDataUri";
import {
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { CallingState } from "@stream-io/video-react-sdk";
import { showToast } from "@/lib/toaster";

type ExtendedMeeting = Meetings & {
  agent: Agents;
  user: User;
};

const CallInterface = ({ meetingData }: { meetingData: ExtendedMeeting }) => {
  const {
    useCameraState,
    useMicrophoneState,
    useParticipants,
    useLocalParticipant,
    useRemoteParticipants,
  } = useCallStateHooks();
  const call = useCall();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const { camera, isMute: isCameraMuted } = useCameraState();
  const { microphone, isMute: isMicMuted } = useMicrophoneState();

  const [voiceHeights, setVoiceHeights] = useState<number[]>([
    50, 50, 50, 50, 50,
  ]);

  const isCallActive = call!.state.callingState === CallingState.JOINED;
  const isConnecting = call!.state.callingState === CallingState.JOINING;
  const isCallEnded = call!.state.callingState === CallingState.LEFT;

  // Voice animation effect
  useEffect(() => {
    if (isCallActive) {
      const interval = setInterval(() => {
        setVoiceHeights(
          Array.from({ length: 5 }, () => Math.random() * 40 + 40)
        );
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isCallActive]);

  const handleJoinCall = async () => {
    if (!call) return;

    try {
      await call.join();
    } catch (error) {
      console.error("Failed to join call:", error);
      showToast.error("Failed to join call");
    }
  };

  const handleLeaveCall = async () => {
    if (!call) return;

    try {
      await call.leave();
    } catch (error) {
      console.error("Failed to leave call:", error);
      showToast.error("Failed to leave call");
    }
  };

  const isLocalSpeaking = localParticipant?.isSpeaking ?? false;
  const isRemoteSpeaking = remoteParticipants.some((p) => p.isSpeaking);

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto pb-6">
      <div className="container mx-auto mt-6 px-4 h-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <AnimatedContent
            distance={80}
            direction="vertical"
            reverse={false}
            duration={0.4}
            ease="easeOutCubic"
            initialOpacity={0}
            animateOpacity
            scale={1.05}
            threshold={0.1}
            delay={0.15}
          >
            <div className="flex justify-center items-center gap-3 mb-8">
              <Video className="w-12 h-12 text-cyan-400/90 drop-shadow-lg" />
              <h1 className="text-4xl font-medium text-white/95 tracking-tight">
                {meetingData.name}
              </h1>
            </div>
          </AnimatedContent>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-10">
          <AnimatedContent
            distance={100}
            direction="horizontal"
            reverse={true}
            duration={0.6}
            ease="easeOutQuart"
            initialOpacity={0}
            animateOpacity
            scale={1.03}
            threshold={0.1}
            delay={0.1}
          >
            <Card className="bg-[#0a0a1a] border border-cyan-400/20 shadow-[0_0_15px_#00ffff22] relative">
              <CardHeader>
                <CardTitle className="text-cyan-300 text-center">
                  {meetingData.agent.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center justify-center relative">
                {/* Video Display - FIXED: Removed broken condition */}
                <div className="w-full h-64 rounded-xl overflow-hidden relative mb-4 bg-gray-900 border border-cyan-500">
                  <div className="w-full h-full flex items-center justify-center">
                    {isRemoteSpeaking && (
                      <div className="absolute w-26 h-26 bg-cyan-400 opacity-20 rounded-full blur-lg animate-pulse" />
                    )}
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-400">
                      <Image
                        src={GeneratedAvatarUri({
                          seed: meetingData.agent.name,
                          variant: "botttsNeutral",
                        })}
                        alt="Agent Avatar"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Voice wave animation overlay */}
                  {isRemoteSpeaking && (
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
                </div>
              </CardContent>

              <CardFooter className="flex flex-col items-center justify-center gap-2">
                <h2 className="text-sm text-white text-center">
                  {meetingData.agent.instructions}
                </h2>

                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c0c1c] border ${
                    isRemoteSpeaking ? "border-cyan-400" : "border-neutral-800"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isRemoteSpeaking
                        ? "bg-cyan-400 animate-pulse"
                        : "bg-neutral-600"
                    }`}
                  />
                  <span className="text-xs text-gray-400">
                    {isRemoteSpeaking ? (
                      <TextShimmerWave className="font-mono" duration={0.38}>
                        Speaking...
                      </TextShimmerWave>
                    ) : isCallActive ? (
                      <TextShimmerWave className="font-mono" duration={0.38}>
                        Listening...
                      </TextShimmerWave>
                    ) : isCallEnded ? (
                      "Call Ended"
                    ) : (
                      "Waiting..."
                    )}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </AnimatedContent>

          {/* User Panel */}
          <AnimatedContent
            distance={100}
            direction="horizontal"
            reverse={false}
            duration={0.6}
            ease="easeOutQuart"
            initialOpacity={0}
            animateOpacity
            scale={1.03}
            threshold={0.1}
            delay={0.1}
          >
            <Card className="bg-[#0a0a1a] border border-cyan-400/20 shadow-[0_0_15px_#00ffff22] relative">
              <CardHeader>
                <CardTitle className="text-cyan-300 text-center">
                  {meetingData.user.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center justify-center relative">
                {/* Video Display */}
                <div className="w-full h-64 rounded-xl overflow-hidden relative mb-4 bg-gray-900 border border-cyan-500">
                  {localParticipant && !isCameraMuted ? (
                    <VideoPreview />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {isLocalSpeaking && (
                        <div className="absolute w-26 h-26 bg-cyan-400 opacity-20 rounded-full blur-lg animate-pulse" />
                      )}
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-400">
                        <Image
                          src={
                            meetingData.user.image ??
                            GeneratedAvatarUri({
                              seed: meetingData.user.name ?? "Anonymous",
                              variant: "initials",
                            })
                          }
                          alt="User Avatar"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Voice wave animation overlay */}
                  {isLocalSpeaking && (
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
                </div>
              </CardContent>

              <CardFooter className="flex flex-col items-center justify-center gap-2">
                <h2 className="text-sm text-white text-center">You</h2>

                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c0c1c] border ${
                    isLocalSpeaking ? "border-cyan-400" : "border-neutral-800"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isLocalSpeaking
                        ? "bg-cyan-400 animate-pulse"
                        : "bg-neutral-600"
                    }`}
                  />
                  <span className="text-xs text-gray-400">
                    {isLocalSpeaking ? (
                      <TextShimmerWave className="font-mono" duration={0.38}>
                        Speaking...
                      </TextShimmerWave>
                    ) : isCallActive ? (
                      <TextShimmerWave className="font-mono" duration={0.38}>
                        Listening...
                      </TextShimmerWave>
                    ) : isCallEnded ? (
                      "Call Ended"
                    ) : (
                      "Ready"
                    )}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </AnimatedContent>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {!isCallActive && !isConnecting && !isCallEnded && (
            <button
              onClick={handleJoinCall}
              className="
      flex items-center gap-2 px-5 py-2.5 
      bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 
      text-white font-semibold rounded-lg 
      shadow-md hover:shadow-lg transition-all 
      hover:from-cyan-400 hover:to-cyan-500 
      active:scale-[0.97] border border-cyan-400/30
    "
            >
              <Phone className="w-5 h-5" />
              Join Call
            </button>
          )}

          {isCallActive && (
            <div className="flex justify-center gap-3 mb-8">
              {/* Camera Toggle */}
              <button
                onClick={() => camera.toggle()}
                className={`
        flex items-center justify-center p-3 rounded-xl transition-all
        ${
          isCameraMuted
            ? "bg-gradient-to-r from-red-500/30 to-red-600/40  shadow-red-500/20"
            : "bg-gradient-to-r from-gray-600/90 to-gray-700/90 shadow-gray-500/20"
        }
        text-white font-medium
        shadow-md hover:shadow-lg
        active:scale-[0.97] border
        ${isCameraMuted ? "border-red-400/30" : "border-gray-400/30"}
        hover:brightness-110
      `}
              >
                {isCameraMuted ? (
                  <VideoOff className="w-5 h-5" />
                ) : (
                  <Video className="w-5 h-5" />
                )}
              </button>

              {/* Microphone Toggle */}
              <button
                onClick={() => microphone.toggle()}
                className={`
        flex items-center justify-center p-3 rounded-xl transition-all
        ${
          isMicMuted
            ? "bg-gradient-to-r from-red-500/30 to-red-600/40  shadow-red-500/20"
            : "bg-gradient-to-r from-gray-600/90 to-gray-700/90 shadow-gray-500/20"
        }
        text-white font-medium
        shadow-md hover:shadow-lg
        active:scale-[0.97] border
        ${isMicMuted ? "border-red-400/30" : "border-gray-400/30"}
        hover:brightness-110
      `}
              >
                {isMicMuted ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              {/* Leave Call Button */}
              <button
                onClick={handleLeaveCall}
                className="
        flex items-center gap-2 px-5 py-3 rounded-xl transition-all
        bg-gradient-to-r from-red-500/30 to-red-600/40 
        text-white font-semibold
        shadow-md hover:shadow-lg hover:shadow-red-500/30
        active:scale-[0.97] border border-red-400/30
        hover:brightness-110
      "
              >
                <PhoneOff className="w-5 h-5" />
                Leave Call
              </button>
            </div>
          )}

          {isConnecting && (
            <div
              className="flex items-center gap-3 justify-center px-5 py-3 rounded-xl
    bg-gradient-to-r from-blue-500/90 to-blue-600/90
    text-white font-medium
    shadow-md hover:shadow-lg hover:shadow-blue-500/30
    border border-blue-400/30
  "
            >
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm font-medium">
            {isCallActive && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {participants.length} participant
                {participants.length !== 1 ? "s" : ""} in call
              </span>
            )}
            {isConnecting && "Connecting to call..."}
            {isCallEnded && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                Call ended
              </span>
            )}
            {!isCallActive && !isConnecting && !isCallEnded && "Ready to join"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
