"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useRouter } from "next/navigation";
import type { Engine } from "tsparticles-engine";

const HeroSection = () => {
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesInit = async (main: Engine) => {
    await loadSlim(main);
  };
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`antialiased relative min-h-screen text-white`}>
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: false,
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            particles: {
              color: {
                value: "#00FFFF",
              },
              links: {
                color: "#00FFFF",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.3,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      {/* Floating Agents - Only render on client */}
      {isClient && (
        <div className="absolute inset-0 z-10 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30"
              initial={{
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height,
                width: 40 + Math.random() * 80,
                height: 40 + Math.random() * 80,
              }}
              animate={{
                y: [0, 100, 0],
                x: [0, Math.random() * 100 - 50, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Content */}
      <section className="relative z-20 py-24 flex-grow flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Meet Your{" "}
                  <span className="text-cyan-400">Digital Agents</span> in Real
                  Time
                </h1>
                <p className="text-xl text-gray-300 mb-10 max-w-lg">
                  Intelligent AI agents that collaborate, discuss, and solve
                  problems through natural conversations. Experience the future
                  of meetings today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={() => router.push("/meetings")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full font-semibold text-lg shadow-lg shadow-cyan-500/30"
                  >
                    Start Free Meeting
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-transparent border-2 border-cyan-500 rounded-full font-semibold text-lg"
                  >
                    See How It Works
                  </motion.button>
                </div>
              </motion.div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="relative">
                {/* Agent Meeting Visualization */}
                <div className="relative bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 aspect-video flex items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 h-full">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="bg-gradient-to-b from-cyan-800/20 to-cyan-950/50 rounded-xl flex flex-col items-center justify-center p-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.2 + 0.4 }}
                        >
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
                          <div className="h-2 bg-cyan-500/30 rounded-full w-3/4 mb-2"></div>
                          <div className="h-2 bg-cyan-500/30 rounded-full w-1/2"></div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Active conversation lines */}
                  <div className="absolute inset-0">
                    <svg viewBox="0 0 500 300" className="w-full h-full">
                      <motion.path
                        d="M120,150 Q200,100 280,150 T440,150"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeDasharray="10,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                      <motion.path
                        d="M120,180 Q200,230 280,180 T440,180"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeDasharray="10,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 2,
                          delay: 0.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#00FFFF"
                            stopOpacity="0"
                          />
                          <stop
                            offset="50%"
                            stopColor="#00FFFF"
                            stopOpacity="1"
                          />
                          <stop
                            offset="100%"
                            stopColor="#00FFFF"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Floating chat bubbles */}
                <motion.div
                  className="absolute -top-6 -right-6 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl p-4 w-48 shadow-lg shadow-cyan-500/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <div className="flex items-start gap-2">
                    <div className="bg-cyan-300 rounded-full w-8 h-8"></div>
                    <div>
                      <div className="font-medium">Alex</div>
                      <div className="text-xs mt-1">
                        Let&apos;s discuss Q3 goals
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 w-48 shadow-lg shadow-blue-500/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-300 rounded-full w-8 h-8"></div>
                    <div>
                      <div className="font-medium">Taylor</div>
                      <div className="text-xs mt-1">
                        I have the analytics ready
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
