import { StreamClient } from "@stream-io/node-sdk";

export const streamVideo = new StreamClient(
  process.env.NEXT_PUBLIC_VIDEO_API_KEY!,
  process.env.NEXT_PUBLIC_VIDEO_SECRET_API_KEY!
);
