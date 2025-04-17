"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";


const SchedulePost = () => {
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const handleSchedule = async () => {
    try {
      await axios.post("/api/posts", { content, scheduledAt });
      toast("Post scheduled successfully!");
      setContent("");
      setScheduledAt("");
    } catch (error) {
      toast.error("Error scheduling post.");
    }
  };

  return (
    <div>
      <h2>Schedule a Post</h2>
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your post content..."
      />
      <input 
        type="datetime-local" 
        value={scheduledAt} 
        onChange={(e) => setScheduledAt(e.target.value)} 
      />
      <button onClick={handleSchedule}>Schedule</button>
    </div>
  );
};

export default SchedulePost;
