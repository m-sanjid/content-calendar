"use client"
import React, { useState } from "react";
import { ShareModal } from "@/components/ShareModal";
import Dashboard from "@/components/Dashboard";
import ContentCalendarForm from "@/components/content/ContentForm";
import { ContentEvent } from "@/types";
import SchedulePost from "@/components/content/SchedulePost";
import ScheduledPosts from "@/components/content/ScheduledPosts";

const Home = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ContentEvent | null>(null);
  const [events, setEvents] = useState<ContentEvent[]>([]);

  const handleSave = (event: ContentEvent | null) => {
    if (!event) return;
    
    if (events.some(e => e.id === event.id)) {
      // Update existing event
      setEvents(events.map(e => e.id === event.id ? event : e));
    } else {
      // Add new event
      setEvents([...events, event]);
    }
  };

  const handleDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };


  return <div>
    <div className="text-center">
      <h1 className="text-2xl font-bold text-neutral-600 dark:text-neutral-300">Content Cal</h1>
      <p className="text-neutral-600 dark:text-neutral-300">Manage your content calendar with ease</p>
    </div>
    <div>
      <h1>Manage contents</h1>
      <div>
        <ShareModal text="Check out my latest post!" url="https://example.com/post/123" />
      </div>
      <Dashboard />
    </div>
    <div>
      <button onClick={() => {
        setSelectedEvent(null); // For creating new event
        setIsFormOpen(true);
      }}>
        Create New Content
      </button>

      {/* List your events here, with an edit button for each */}
      <div>
        {events.map(event => (
          <div key={event.id}>
            {event.title} - {event.platform}
            <button onClick={() => {
              setSelectedEvent(event);
              setIsFormOpen(true);
            }}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>

      <ContentCalendarForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        event={selectedEvent}
        userId="user123" 
      />
      <div>
      <h1>Content Scheduler</h1>
      <SchedulePost />
      <ScheduledPosts />
      </div>
  </div>;
};

export default Home;
