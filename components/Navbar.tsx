"use client";

import React, { useEffect, useRef } from "react";

import {
  Activity,
  Component,
  HomeIcon,
  Package,
  User,
  Bolt,
  LogOut,
} from "lucide-react";
import {
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
} from "@/components/motion-primitives/dock";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { showToast } from "@/lib/toaster";
import { useSearchParams } from "next/navigation";

const data = [
  {
    title: "Home",
    icon: (
      <HomeIcon className="h-full w-full text-white dark:text-neutral-300" />
    ),
    href: "#",
  },
  {
    title: "Products",
    icon: (
      <Package className="h-full w-full text-white dark:text-neutral-300" />
    ),
    href: "#",
  },
  {
    title: "Components",
    icon: (
      <Component className="h-full w-full text-white dark:text-neutral-300" />
    ),
    href: "#",
  },
  {
    title: "Activity",
    icon: (
      <Activity className="h-full w-full text-white dark:text-neutral-300" />
    ),
    href: "#",
  },
];

const Navbar = () => {
  const searchParams = useSearchParams();
  const toast = searchParams.get("toast");
  const toastShown = useRef(false);

  useEffect(() => {
    if (!toastShown.current) {
      if (toast === "register_success") {
        showToast.success("You are registered successfully");
        toastShown.current = true;
      } else if (toast === "login_success") {
        showToast.success("You have logged in");
        toastShown.current = true;
      } else if (toast === "login_required") {
        showToast.warning("Please login to continue");
        toastShown.current = true;
      }
    }
  }, [toast]);

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
          websitename
        </div>

        {/* Dock */}
        <div className="absolute mb-1 left-1/2 transform -translate-x-1/2">
          <Dock
            className="bg-transparent items-end pb-3 "
            magnification={60}
            panelHeight={70}
          >
            {data.map((item, idx) => (
              <DockItem
                key={idx}
                className="aspect-square rounded-full cursor-pointer bg-[#0a0a1a]/40 border border-cyan-400/20 hover:shadow-[0_0_11px_4px_#00ffff33]"
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>{item.icon}</DockIcon>
              </DockItem>
            ))}
          </Dock>
        </div>

        {/* Right Side: Button or Avatar Dropdown */}
        <div className="shrink-0 flex">
          {true && (
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

          {false && (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 ml-2 bg-[#0a0a1a]/40 backdrop-blur-md border border-cyan-400/10 rounded-full shadow-[0_0_10px_#00ffff33] hover:shadow-[0_0_11px_4px_#00ffff66] transition-all duration-300">
                <Avatar className="h-6.5 w-6.5 shadow-[0_0_6px_#00ffff33] transition-shadow duration-300">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    className="rounded-full object-cover"
                  />
                  <AvatarFallback className="text-white bg-[#0a0a1a]/70 font-semibold">
                    KM
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-[#0a0a1a]/40 backdrop-blur-lg rounded-xl mt-3 border border-cyan-400/20 shadow-[0_0_25px_#00ffff22] text-white w-38 p-2 animate-in fade-in zoom-in-95">
                <DropdownMenuLabel className="text-white font-semibold px-3 pb-1">
                  Karan
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
                  onClick={() => {
                    // signOut({ callbackUrl: "/?toast=logged_out" });
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
