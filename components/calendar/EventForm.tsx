"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import { 
  IconCalendar, 
  IconMapPin, 
  IconTag, 
  IconFlag, 
  IconX, 
  IconPlus,
  IconTrash,
  IconRepeat,
  IconAlignLeft
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { CalendarEvent, Priority, RecurringFrequency } from "../../types";

interface EventFormProps {
  event?: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  userId: string; 
}

const priorityOptions: Array<{ value: Priority, label: string, color: string }> = [
  { value: "Low", label: "Low", color: "bg-blue-500" },
  { value: "Medium", label: "Medium", color: "bg-yellow-500" },
  { value: "High", label: "High", color: "bg-red-500" }
];

const tagSuggestions = [
  "work", "personal", "important", "meeting", "deadline", 
  "travel", "health", "learning", "family", "social", 
  "project", "client", "presentation", "review"
];

const colorOptions = [
  { value: "blue", color: "bg-blue-500" },
  { value: "red", color: "bg-red-500" },
  { value: "green", color: "bg-green-500" },
  { value: "yellow", color: "bg-yellow-500" },
  { value: "purple", color: "bg-purple-500" },
  { value: "pink", color: "bg-pink-500" },
  { value: "orange", color: "bg-orange-500" },
  { value: "teal", color: "bg-teal-500" },
  { value: "indigo", color: "bg-indigo-500" }
];

const EventForm: React.FC<EventFormProps> = ({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
  userId
}) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority>("Medium");
  const [color, setColor] = useState<string>("blue");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>("weekly");
  const [tagInput, setTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [filteredTagSuggestions, setFilteredTagSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(event.start);
      setEndDate(event.end);
      setAllDay(event.allDay || false);
      setLocation(event.location || "");
      setDescription(event.description || "");
      setTags(event.tags || []);
      setPriority(event.priority || "Medium");
      setColor(event.color || "blue");
      setIsRecurring(!!event.recurring);
      setRecurringFrequency(event.recurring?.frequency || "weekly");
    } else {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      setTitle("");
      setStartDate(now);
      setEndDate(oneHourLater);
      setAllDay(false);
      setLocation("");
      setDescription("");
      setTags([]);
      setPriority("Medium");
      setColor("blue");
      setIsRecurring(false);
      setRecurringFrequency("weekly");
    }
  }, [event]);

  // Filter tag suggestions based on input
  useEffect(() => {
    if (tagInput) {
      const filtered = tagSuggestions.filter(
        tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag)
      );
      setFilteredTagSuggestions(filtered);
    } else {
      setFilteredTagSuggestions([]);
    }
  }, [tagInput, tags]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value);
    setStartDate(newStartDate);
    
    // If end date is before new start date, update it
    if (endDate < newStartDate) {
      setEndDate(newStartDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value);
    setEndDate(newEndDate);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newStartDate = new Date(startDate);
    newStartDate.setHours(hours, minutes);
    setStartDate(newStartDate);
    
    // If end time is before new start time on the same day, update it
    if (
      endDate.getDate() === newStartDate.getDate() &&
      endDate.getMonth() === newStartDate.getMonth() &&
      endDate.getFullYear() === newStartDate.getFullYear() &&
      endDate < newStartDate
    ) {
      const newEndDate = new Date(newStartDate);
      newEndDate.setHours(newStartDate.getHours() + 1);
      setEndDate(newEndDate);
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newEndDate = new Date(endDate);
    newEndDate.setHours(hours, minutes);
    setEndDate(newEndDate);
  };

  const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isAllDay = e.target.checked;
    setAllDay(isAllDay);
    
    if (isAllDay) {
      // Set times to start and end of day
      const newStartDate = new Date(startDate);
      newStartDate.setHours(0, 0, 0, 0);
      
      const newEndDate = new Date(endDate);
      newEndDate.setHours(23, 59, 59, 999);
      
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
    setShowTagSuggestions(false);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedEvent: CalendarEvent = {
      id: event?.id || `event-${Date.now()}`,
      title,
      start: startDate,
      end: endDate,
      allDay,
      location: location || undefined,
      description: description || undefined,
      tags: tags.length > 0 ? tags : [],
      priority,
      color,
      userId,
      recurring: isRecurring ? {
        frequency: recurringFrequency,
        eventId: event?.recurring?.eventId || event?.id || `event-${Date.now()}`,
        ...(event?.recurring?.id ? { id: event.recurring.id } : {})
      } : null
    };
    
    onSave(updatedEvent);
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{event ? 'Edit Event' : 'Create Event'}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <IconX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Date and Time */}
          <div className="space-y-2">
            <div className="flex items-center">
              <IconCalendar size={20} className="mr-2 text-neutral-500" />
              <span className="text-sm font-medium">Date & Time</span>
            </div>
            
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="allDay"
                checked={allDay}
                onChange={handleAllDayChange}
                className="mr-2"
              />
              <label htmlFor="allDay" className="text-sm">All day</label>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={moment(startDate).format('YYYY-MM-DD')}
                  onChange={handleStartDateChange}
                  className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-sm"
                  required
                />
              </div>
              
              {!allDay && (
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={moment(startDate).format('HH:mm')}
                    onChange={handleStartTimeChange}
                    className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-sm"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs text-neutral-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={moment(endDate).format('YYYY-MM-DD')}
                  onChange={handleEndDateChange}
                  className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-sm"
                  required
                />
              </div>
              
              {!allDay && (
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">End Time</label>
                  <input
                    type="time"
                    value={moment(endDate).format('HH:mm')}
                    onChange={handleEndTimeChange}
                    className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-sm"
                    required
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Recurring */}
          <div className="space-y-2">
            <div className="flex items-center">
              <IconRepeat size={20} className="mr-2 text-neutral-500" />
              <span className="text-sm font-medium">Recurring</span>
            </div>
            
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="recurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="recurring" className="text-sm">Repeat this event</label>
            </div>
            
            {isRecurring && (
              <select
                value={recurringFrequency}
                onChange={(e) => setRecurringFrequency(e.target.value as RecurringFrequency)}
                className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            )}
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <div className="flex items-center">
              <IconMapPin size={20} className="mr-2 text-neutral-500" />
              <span className="text-sm font-medium">Location</span>
            </div>
            
            <input
              type="text"
              placeholder="Add location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-sm"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center">
              <IconAlignLeft size={20} className="mr-2 text-neutral-500" />
              <span className="text-sm font-medium">Description</span>
            </div>
            
            <textarea
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-sm min-h-[100px]"
            />
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center">
              <IconTag size={20} className="mr-2 text-neutral-500" />
              <span className="text-sm font-medium">Tags</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <div 
                  key={tag} 
                  className="flex items-center bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded-full text-xs"
                >
                  <span>{tag}</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    <IconX size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add tags"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    setShowTagSuggestions(true);
                  }}
                  onKeyDown={handleTagKeyDown}
                  onFocus={() => setShowTagSuggestions(true)}
                  className="flex-1 p-2 border border-neutral-300 dark:border-neutral-600 rounded-l-lg bg-white dark:bg-neutral-800 text-sm"
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
                  {filteredTagSuggestions.map(tag => (
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
          
          {/* Priority */}
          <div className="space-y-2">
            <div className="flex items-center">
              <IconFlag size={20} className="mr-2 text-neutral-500" />
              <span className="text-sm font-medium">Priority</span>
            </div>
            
            <div className="flex gap-2">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                    priority === option.value 
                      ? `${option.color} text-white border-transparent` 
                      : 'border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Color */}
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-sm font-medium">Color</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`w-8 h-8 rounded-full ${option.color} ${
                    color === option.value ? 'ring-2 ring-offset-2 ring-neutral-400' : ''
                  }`}
                  aria-label={`Select ${option.value} color`}
                />
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
            {event && onDelete ? (
              <Button
                type="button"
                onClick={handleDelete}
                className="rounded-full"
              >
                <IconTrash size={16} className="mr-1" />
                Delete
              </Button>
            ) : (
              <div></div>
            )}
            
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                className="rounded-full"
              >
                {event ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;