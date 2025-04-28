"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import { 
  IconCalendar, 
  IconClock, 
  IconTag, 
  IconX, 
  IconPlus,
  IconTrash,
  IconAlignLeft
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { ContentEvent } from "@/types";



interface ContentCalendarFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: ContentEvent | null) => void;
  onDelete?: (eventId: string) => void;
  event?: ContentEvent;
  userId?: string;
}

const platforms = ["Twitter", "Facebook", "LinkedIn", "Instagram", "YouTube", "TikTok", "Pinterest"];

const ContentCalendarForm: React.FC<ContentCalendarFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  event,
  userId 
}) => {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("Twitter");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("12:00");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Common social media hashtags
  const tagSuggestions = [
    "marketing", "socialmedia", "trending", "digital", "brand", 
    "business", "engagement", "community", "content", "strategy"
  ];

  // Filter tag suggestions based on input
  const filteredTagSuggestions = tagInput 
    ? tagSuggestions.filter(tag => 
        tag.toLowerCase().includes(tagInput.toLowerCase()) && 
        !tags.includes(tag)
      )
    : [];

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setPlatform(event.platform || "Twitter");
      setDate(new Date(event.date || new Date()));
      setTime(event.time || "12:00");
      setContent(event.content || "");
      setTags(event.tags || []);
    } else {
      // Reset form for new event
      setTitle("");
      setPlatform("Twitter");
      setDate(new Date());
      setTime("12:00");
      setContent("");
      setTags([]);
    }
  }, [event, isOpen]);

  const handleSave = () => {
    const updatedEvent: ContentEvent = {
      id: event?.id || `content-${Date.now()}`,
      title,
      platform,
      date,
      time,
      content,
      tags,
      userId
    };
    onSave(updatedEvent);
    onClose();
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
    } else {
      onSave(null); // Fallback to the original pattern
    }
    onClose();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      if (!tags.includes(tagInput)) {
        setTags([...tags, tagInput]);
      }
      setTagInput("");
      setShowTagSuggestions(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
    setShowTagSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSelectTagSuggestion = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 pb-3">
          <h2 className="text-lg font-semibold">{event ? "Edit Content" : "Create Content"}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              placeholder="Content title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Platform */}
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500"
            >
              {platforms.map((plat) => (
                <option key={plat} value={plat}>{plat}</option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <IconCalendar size={16} className="text-neutral-500" />
                </div>
                <input
                  type="date"
                  value={moment(date).format("YYYY-MM-DD")}
                  onChange={(e) => setDate(new Date(e.target.value))}
                  className="w-full p-2 pl-10 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <IconClock size={16} className="text-neutral-500" />
                </div>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 pl-10 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <div className="relative">
              <div className="absolute top-3 left-3">
                <IconAlignLeft size={16} className="text-neutral-500" />
              </div>
              <textarea
                placeholder="Enter your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 pl-10 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 min-h-[120px] focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            {platform === "Twitter" && (
              <div className="text-xs text-right mt-1 text-neutral-500">
                {280 - content.length} characters remaining
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center mb-1">
              <IconTag size={16} className="mr-1 text-neutral-500" />
              <label className="text-sm font-medium">Tags</label>
            </div>
            <div className="flex flex-wrap gap-2 mt-1 mb-2">
              {tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    <IconX size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add tags..."
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    setShowTagSuggestions(true);
                  }}
                  onKeyDown={handleTagKeyDown}
                  onFocus={() => setShowTagSuggestions(true)}
                  className="flex-1 p-2 border border-neutral-300 dark:border-neutral-600 rounded-l-lg bg-white dark:bg-neutral-800"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-neutral-500 hover:bg-neutral-600 text-white px-3 rounded-r-lg"
                >
                  <IconPlus size={16} />
                </button>
              </div>
              
              {showTagSuggestions && filteredTagSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {filteredTagSuggestions.map((tag) => (
                    <div
                      key={tag}
                      onClick={() => handleSelectTagSuggestion(tag)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer text-sm"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          {event && (
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="rounded-full"
            >
              <IconTrash size={16} className="mr-1" /> Delete
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button 
              variant="secondary" 
              onClick={onClose}
              className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="rounded-full"
            >
              {event ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCalendarForm;