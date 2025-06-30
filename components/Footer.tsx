import Link from "next/link";
import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/70 backdrop-blur-sm w-full mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <p className="text-center md:text-left mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Agentic App. All rights reserved.
        </p>
        <div className="flex gap-6 items-center">
          <Link
            href="https://github.com/KTG084"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <FaGithub className="text-lg" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
          <Link
            href="https://mail.google.com/mail/?view=cm&fs=1&to=karanjyoti_ug_23@civil.nits.ac.in"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <SiGmail className="text-lg" />
            <span className="hidden sm:inline">Email</span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/karanjyoti-medhi-204822290/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <FaLinkedin className="text-lg" />
            <span className="hidden sm:inline">LinkedIn</span>
          </Link>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
