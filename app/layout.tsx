import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Particles from "@/components/Particles";
import Navbar from "@/components/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentic App",
  description: "A modern app enhanced with interactive particles using Next.js",
};
import AnimatedContent from "@/components/AnimatedContent";
import ClickSpark from "@/components/ClickSpark";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <body
          className={`antialiased relative min-h-screen p-0 bg-gradient-to-b from-[#0f0f1c] via-[#0a0a1a] to-[#000] text-white ${geistSans.variable} ${geistMono.variable}`}
        >
          <SessionProvider>
            <ClickSpark>
              <Toaster richColors />
              <AnimatedContent
                distance={80} // slightly less intense motion
                direction="vertical"
                reverse={true}
                duration={0.4} // slightly longer, smoother
                ease="easeOutCubic" // more natural easing
                initialOpacity={0}
                animateOpacity
                scale={1.05} // subtle, avoids "zoomy" feel
                threshold={0.1}
                delay={0.15}
              >
                <Navbar />
              </AnimatedContent>
              <main className="flex-grow pt-24">{children}</main>
              <Footer />
            </ClickSpark>
          </SessionProvider>
          {/* Background Particles */}
          <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
            <Particles
              particleColors={["#00FFFF"]}
              particleCount={6000}
              particleSpread={30}
              speed={0.05}
              particleBaseSize={250}
              moveParticlesOnHover={true}
              alphaParticles={true}
              disableRotation={true}
            />
          </div>
        </body>
      </html>
    </>
  );
}
