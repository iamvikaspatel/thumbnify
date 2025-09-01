"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Header = ({ resetToFormMode }: { resetToFormMode: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const sections = [
      { id: "features" },
      { id: "how-it-works" },
      { id: "testimonials" },
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Header height offset + 150px

      const currentSection = sections.findLast((sectionInfo) => {
        const section = document.getElementById(sectionInfo.id);
        if (!section) return false;
        return scrollPosition >= section.offsetTop;
      });

      if (currentSection) {
        setActiveSection(`#${currentSection.id}`);
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => activeSection === path;
  const isHomePage = pathname === "/";

  return (
    <header
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full ${
        isHomePage
          ? "max-w-6xl transition-all duration-300"
          : "max-w-4xl transition-all duration-300"
      } mx-auto`}
    >
      <div className="flex justify-between items-center px-6 py-4 bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all duration-300">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-secondary/5 to-accent/8 pointer-events-none rounded-2xl" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

        {/* Enhanced Logo */}
        <Link href="/" className="relative z-10 group/logo">
          <div className="flex items-center gap-3 transition-all duration-300 group-hover/logo:scale-105">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Thumbnify Logo"
                width={40}
                height={40}
                className="transition-transform duration-300 group-hover/logo:rotate-12"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg blur-lg opacity-0 group-hover/logo:opacity-50 transition-opacity duration-300 scale-110"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent tracking-tight">
              Thumbnify
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {isHomePage && (
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="#features"
              className={`relative px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${
                isActive("#features")
                  ? "text-primary-foreground bg-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className={`relative px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${
                isActive("#how-it-works")
                  ? "text-primary-foreground bg-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className={`relative px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${
                isActive("#testimonials")
                  ? "text-primary-foreground bg-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Testimonials
            </Link>
          </div>
        )}

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-9 h-9 rounded-md border border-border hover:border-ring transition-colors duration-200",
                },
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-muted transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 bg-card/90 backdrop-blur-md border border-border/50 rounded-lg shadow-lg">
          <nav className="flex flex-col gap-1">
            {isHomePage && (
              <>
                <Link
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-3 px-3 rounded-md font-medium transition-all duration-200 cursor-pointer ${
                    isActive("#features")
                      ? "text-primary-foreground bg-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-3 px-3 rounded-md font-medium transition-all duration-200 cursor-pointer ${
                    isActive("#how-it-works")
                      ? "text-primary-foreground bg-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  How It Works
                </Link>
                <Link
                  href="#testimonials"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-3 px-3 rounded-md font-medium transition-all duration-200 cursor-pointer ${
                    isActive("#testimonials")
                      ? "text-primary-foreground bg-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Testimonials
                </Link>
              </>
            )}
            <SignedOut>
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border">
                <SignInButton>
                  <button className="text-left py-3 px-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md font-medium transition-all duration-200 cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="py-3 px-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-center">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
