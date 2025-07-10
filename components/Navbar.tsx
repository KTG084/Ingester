"use client";
import React, { useRef, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import useClickOutside from "@/hooks/useClickOutside";
import { ArrowLeft, Search, User } from "lucide-react";

import type { Transition } from "framer-motion";
const transition: Transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.2,
};

function BButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      className="relative flex h-8 w-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-cyan-400/20 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

import { useEffect } from "react";

import { HomeIcon, Bolt, LogOut, Bot, Video, PiggyBank } from "lucide-react";
import {
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
} from "@/components/motion-primitives/dock";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { showToast } from "@/lib/toaster";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { GeneratedAvatar } from "./generatedAvatar";

const data = [
  {
    title: "Home",
    icon: (
      <HomeIcon className="h-full w-full text-white dark:text-neutral-300" />
    ),
    href: "/",
  },
  {
    title: "Agents",
    icon: <Bot className="h-full w-full text-white dark:text-neutral-300" />,
    href: "/agents",
  },
  {
    title: "Meetings",
    icon: <Video className="h-full w-full text-white dark:text-neutral-300" />,
    href: "/meetings",
  },
  {
    title: "Pro Plan",
    icon: (
      <PiggyBank className="h-full w-full text-white dark:text-neutral-300" />
    ),
    href: "#",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const login_requiredToast = searchParams.get("toast");
  const toastShown = useRef(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!toastShown.current) {
      if (login_requiredToast === "login_required") {
        showToast.warning("Please login to continue");
        toastShown.current = true;
      }
    }
  }, [login_requiredToast]);

  useEffect(() => {
    const toast = localStorage.getItem("toast");
    if (!toast) return;

    switch (toast) {
      case "login_success":
        showToast.success("You have logged in");
        break;
      case "register_success":
        showToast.success("You are registered successfully");
        break;
      case "logged_out":
        showToast.warning("You are logged out");
        break;
      case "agent_success":
        showToast.success("Agent created successfully");
        break;
      case "meeting_success":
        showToast.success("Meeting created successfully");
        break;
    }

    localStorage.removeItem("toast");
  }, []);

  return (
    <nav
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50
  w-full max-w-5xl px-6 py-2.5
  bg-[#0a0a1a]/20 backdrop-blur-lg
  border border-cyan-400/20
  rounded-2xl shadow-[0_4px_30px_#00ffff33]
  flex items-center justify-between text-white"
    >
      <div className="flex items-center justify-between w-full gap-4">
        <div className="cursor-pointer text-lg font-semibold whitespace-nowrap">
          AI-गुरु
        </div>

        {/* Dock */}
        <div className="absolute mb-1 left-1/2 transform -translate-x-1/2">
          <Dock
            className="bg-transparent items-end pb-3 "
            magnification={60}
            panelHeight={70}
          >
            {data.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <DockItem
                  key={idx}
                  className={cn(
                    "aspect-square rounded-full cursor-pointer border",
                    "bg-[#0a0a1a]/40 border-cyan-400/20 hover:shadow-[0_0_11px_4px_#00ffff33]",
                    pathname === item.href &&
                      "bg-[#0a0a1a]/80 border-cyan-400/60 shadow-[0_0_15px_#00ffff55]"
                  )}
                >
                  <DockLabel>{item.title}</DockLabel>
                  <DockIcon>{item.icon}</DockIcon>
                </DockItem>
              </Link>
            ))}
          </Dock>
        </div>

        {/* Right Side: Button or Avatar Dropdown */}
        <div className="shrink-0 flex">
          {(pathname === "/hello" || pathname === "/agents") && (
            <div className="relative mr-4" ref={containerRef}>
              <MotionConfig transition={transition}>
                <motion.div
                  animate={{ width: isOpen ? 200 : 33 }}
                  className={cn(
                    "h-8  flex items-center border rounded-xl transition-all duration-300 overflow-hidden",
                    "bg-[#0a0a1a]/40 border-cyan-400/20 backdrop-blur-md shadow-[0_0_8px_#00ffff22]"
                  )}
                >
                  {!isOpen ? (
                    <BButton
                      onClick={() => setIsOpen(true)}
                      ariaLabel="Search notes"
                    >
                      <Search className="h-5 w-5 text-white hover:text-cyan-300 transition" />
                    </BButton>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <BButton
                        onClick={() => setIsOpen(false)}
                        ariaLabel="Back"
                      >
                        <ArrowLeft className="h-5 w-5 text-white hover:text-cyan-300 transition" />
                      </BButton>
                      <input
                        autoFocus
                        placeholder="Search..."
                        className="bg-transparent text-white placeholder:text-white/60 w-full focus:outline-none text-sm"
                      />
                    </div>
                  )}
                </motion.div>
              </MotionConfig>
            </div>
          )}

          {status === "unauthenticated" && (
            <Link href="/auth/login">
              <Button
                className="bg-[#0a0a1a]/60 
          backdrop-blur-md 
          border border-cyan-400/30 
          text-white 
          px-5
          rounded-xl 
          shadow-[0_0_8px_#00ffff33] 
          hover:shadow-[0_0_11px_4px_#00ffff88] 
          hover:text-cyan-200
          transition-all duration-300 cursor-pointer"
              >
                Login
              </Button>
            </Link>
          )}

          {status === "authenticated" && (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 bg-[#0a0a1a]/40 backdrop-blur-md border border-cyan-400/20 rounded-full shadow-[0_0_10px_#00ffff33] hover:shadow-[0_0_11px_4px_#00ffff66] transition-all duration-300">
                {session.user.image ? (
                  <Avatar className="h-6.5 w-6.5 shadow-[0_0_6px_#00ffff33] transition-shadow duration-300">
                    <AvatarImage
                      src={session?.user?.image}
                      className="rounded-full object-cover"
                    />
                  </Avatar>
                ) : (
                  <GeneratedAvatar
                    seed={session.user.name}
                    className="h-6.5 w-6.5 shadow-[0_0_6px_#00ffff33] transition-shadow duration-300"
                    variant="initials"
                  />
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-[#0a0a1a]/40 backdrop-blur-lg rounded-xl mt-3 border border-cyan-400/20 shadow-[0_0_25px_#00ffff22] text-white w-40 p-2 animate-in fade-in zoom-in-95">
                <DropdownMenuLabel className="text-white font-semibold px-3 pb-1">
                  {session.user?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20 my-1" />

                <DropdownMenuItem className="flex items-center gap-2 hover:bg-cyan-800/30 px-3 py-2 rounded-md transition-all">
                  <User className="w-4 h-4 text-cyan-400" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 hover:bg-cyan-800/30 px-3 py-2 rounded-md transition-all">
                  <Bolt className="w-4 h-4 text-cyan-400" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={async () => {
                    localStorage.setItem("toast", "logged_out");
                    await signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-2 text-red-400 hover:bg-red-500/20 px-3 py-2 rounded-md transition-all"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
