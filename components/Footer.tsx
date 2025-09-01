"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left side - Logo and Made with text */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Thumbnify Logo"
                  width={32}
                  height={32}
                  className="transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                Thumbnify
              </span>
            </Link>
            <div className="hidden sm:block w-px h-6 bg-border/50" />
            <p className="text-sm text-muted-foreground">
              Made with <span className="text-red-500">❤️</span> by{" "}
              <Link href="https://github.com/Rithb898" className="font-medium text-foreground">Rith</Link>
            </p>
          </div>

          {/* Right side - Social media icons */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="https://x.com/rithcoderr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 group"
                aria-label="Follow on Twitter"
              >
                <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              </Link>
              <Link
                href="https://github.com/Rithb898"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 group"
                aria-label="View on GitHub"
              >
                <Github className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/rith-banerjee/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 group"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile layout adjustments */}
        <div className="sm:hidden mt-4 pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            © 2024 Thumbnify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
