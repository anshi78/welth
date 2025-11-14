import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "../lib/checkUser";
import Image from "next/image";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full bg-indigo via-white to-purple /90 backdrop-blur-xl z-50 border-b border-gray-800/50 shadow-lg shadow-black/5">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        
      {/* Left side - Login button */}
<div className="flex items-center space-x-4">
  <SignedOut>
    <SignInButton forceRedirectUrl="/dashboard">
      <Button 
        className="relative bg-white text-black border-2 border-gray-200 font-semibold px-6 overflow-hidden transition-none"
      >
        <span className="relative z-10 flex items-center gap-2">
          Login
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0"></div>
      </Button>
    </SignInButton>
  </SignedOut>

  <SignedIn>
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-25"></div>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-10 h-10 ring-2 ring-indigo-500/50",
          },
        }}
      />
    </div>
  </SignedIn>
</div>

       

        {/* Right side buttons */}
        <div className="flex items-center space-x-3">
          <SignedIn>
            <Link href="/dashboard">
                <Button className="group relative flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 font-semibold overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <LayoutDashboard size={18} className="group-hover:rotate-12 transition-transform" />
                  <span className="hidden md:inline font-medium">Dashboard</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button className="group relative flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 font-semibold overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <PenBox size={18} className="group-hover:rotate-12 transition-transform" />
                  <span className="hidden md:inline">Add Transaction</span>
                </span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </Button>
            </Link>
          </SignedIn>
        </div>
      </nav>

      {/* Subtle bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
    </header>
  );
};

export default Header;