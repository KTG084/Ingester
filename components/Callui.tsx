"use client";
import { Agents, Meetings, User } from "@prisma/client";
import React, { useEffect, useState } from "react";

import { GeneratedAvatarUri } from "./genrateAvatarDataUri";

import {
  Call,
  CallingState,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import CallInterface from "./CallInterface";

type ExtendedMeeting = Meetings & {
  agent: Agents;
  user: User;
};
type Props = {
  meetingData: ExtendedMeeting;
  token: string;
};

const Callui = ({ meetingData, token }: Props) => {
  const [client, setclient] = useState<StreamVideoClient>();
  useEffect(() => {
    let _client: StreamVideoClient;

    const initClient = async () => {
      _client = StreamVideoClient.getOrCreateInstance({
        apiKey: process.env.NEXT_PUBLIC_VIDEO_API_KEY!,
        user: {
          id: meetingData.user.id,
          name: meetingData.user.name ?? "Kaaran Dada",
          image:
            meetingData.user.image ??
            GeneratedAvatarUri({
              seed: meetingData.user.name ?? "Anonymous",
              variant: "initials",
            }),
        },
        tokenProvider: async () => token,
      });

      await _client.connectUser(
        {
          id: meetingData.user.id,
          name: meetingData.user.name ?? "Kaaran Dada",
          image:
            meetingData.user.image ??
            GeneratedAvatarUri({
              seed: meetingData.user.name ?? "Anonymous",
              variant: "initials",
            }),
        },
        token
      );

      setclient(_client);
    };

    initClient();

    return () => {
      _client.disconnectUser();
      setclient(undefined);
    };
  }, [token, meetingData.user]);

  const [call, setcall] = useState<Call>();

  useEffect(() => {
    if (!client) return;

    const _call = client.call("default", meetingData.id);
    _call.camera.disable();
    _call.microphone.disable();
    setcall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
        _call.endCall();
        setcall(undefined);
      }
    };
  }, [client, meetingData.id]);

  if (!client || !call) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>Loading Call...</p>
        </div>
      </div>
    );
  }
  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <CallInterface meetingData={meetingData} />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
};

export default Callui;
