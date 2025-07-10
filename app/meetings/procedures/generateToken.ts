import { auth } from "@/auth";
import { GeneratedAvatarUri } from "@/components/genrateAvatarDataUri";
import { streamVideo } from "@/lib/streamVideo";

export async function createStreamToken(): Promise<string> {
  const session = await auth();

  if (!session || !session.user?.id || !session.user?.name) {
    throw new Error("Unauthorized or missing user info");
  }

  await streamVideo.upsertUsers([
    {
      id: session.user.id,
      name: session.user.name,
      role: "admin",
      image:
        session.user.image ??
        GeneratedAvatarUri({ seed: session.user.name, variant: "initials" }),
    },
  ]);

  return streamVideo.generateUserToken({
    user_id: session.user.id,
  });
}
