import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface GeneratedAvatarProps {
  seed: string | null | undefined;
  variant: "botttsNeutral" | "initials";
}

export const GeneratedAvatarUri = ({
  seed,
  variant,
}: GeneratedAvatarProps) => {
  const avatarSeed = seed ?? undefined;

  let avatar;

  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
      seed: avatarSeed,
    });
  } else {
    avatar = createAvatar(initials, {
      seed: avatarSeed,
      fontWeight: 500,
      fontSize: 42,
    });
  }

  return avatar.toDataUri()
};
