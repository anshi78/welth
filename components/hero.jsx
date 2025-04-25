"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";

const HeroSection = () => {
  const imageRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const imageElement = imageRef.current;
      if (!imageElement) return;

      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-2xl md:text-4xl lg:text-[105px] pb-6 gradient-title">
          Manage Your Finances <br /> with Intelligence
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      <div className="hero-image-wrapper mt-10">
        <div ref={imageRef} className="hero-image transition-transform duration-500">
          <Image
            src="/banner.jpeg"
            width={1100}
            height={720}
            alt="Dashboard Preview"
            className="rounded-lg shadow-2xl border mx-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
