"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getShareURL } from "@/utils/share";

export function ShareModal({ text, url }: { text: string; url: string }) {
  const [selectedPlatform, setSelectedPlatform] = useState<"twitter" | "linkedin" | "facebook">("twitter");

  return (
    <Dialog>
        <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>
      <DialogTrigger className="p-2 bg-gray-700 text-white rounded">Share Post</DialogTrigger>
      <DialogContent>
        <h2 className="text-xl font-bold">Preview Post</h2>
        <p className="mt-2">{text}</p>

        <div className="mt-4 flex gap-2">
          <button
            className={`p-2 rounded ${selectedPlatform === "twitter" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedPlatform("twitter")}
          >
            Twitter
          </button>
          <button
            className={`p-2 rounded ${selectedPlatform === "linkedin" ? "bg-blue-700 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedPlatform("linkedin")}
          >
            LinkedIn
          </button>
          <button
            className={`p-2 rounded ${selectedPlatform === "facebook" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedPlatform("facebook")}
          >
            Facebook
          </button>
        </div>

        <button
          className="mt-4 p-2 bg-green-500 text-white rounded"
          onClick={() => window.open(getShareURL(selectedPlatform, text, url), "_blank")}
        >
          Open {selectedPlatform} Share
        </button>
      </DialogContent>
    </Dialog>
  );
}
