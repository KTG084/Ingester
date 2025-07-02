import HeroSection from "@/components/HeroSection";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden text-white">
      <section className="relative py-24 flex-grow max-w-7xl mx-auto">
        <HeroSection />
      </section>
    </div>
  );
};

export default page;
