"use client";
import Demo from "@/components/Demo";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/auth/sync")
        .then((res) => res.json())
        .then((data) => console.log("User synced:", data))
        .catch((err) => console.error("Error syncing user:", err));
    }
  }, [isSignedIn]);
  return (
    <div>
      <Hero />
      <Demo />
      <Features />
      <Pricing />
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
