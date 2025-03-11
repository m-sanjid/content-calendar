"use client";

import React from "react";
import moment from "moment";
import { 
  IconFilter, 
  IconTag, 
  IconFlag, 
  IconClock, 
  IconMapPin 
} from "@tabler/icons-react";
import { CalendarEvent } from "../../types";
import MiniCalendar from "./MiniCalendar";

interface CalendarSidebarProps {
  isOpen: boolean;
  events: CalendarEvent[];
  currentDate: moment.Moment;
  filterTags: string[];
  filterPriorities: string[];
  onDateChange: (date: moment.Moment) => void;
  onTagFilterChange: (tags: string[]) => void;
  onPriorityFilterChange: (priorities: string[]) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  isOpen,
  events,
  currentDate,
  filterTags,
  filterPriorities,
  onDateChange,
  onTagFilterChange,
  onPriorityFilterChange,
  onSelectEvent,
}) => {
  // Get all unique tags and priorities from events
  const allTags = Array.from(new Set(events.flatMap(event => event.tags || [])));
  const allPriorities = Array.from(new Set(events.map(event => event.priority).filter(Boolean) as string[]));

  const handleTagFilterChange = (tag: string) => {
    if (filterTags.includes(tag)) {
      onTagFilterChange(filterTags.filter(t => t !== tag));
    } else {
      onTagFilterChange([...filterTags, tag]);
    }
  };

  const handlePriorityFilterChange = (priority: string) => {
    if (filterPriorities.includes(priority)) {
      onPriorityFilterChange(filterPriorities.filter(p => p !== priority));
    } else {
      onPriorityFilterChange([...filterPriorities, priority]);
    }
  };

  return (
    <div className={`sidebar bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 h-full overflow-y-auto transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'}`}>
      <div className="p-4">
        <div className="mb-6">
          <MiniCalendar 
            currentDate={currentDate}
            events={events}
            onDateChange={onDateChange}
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <IconFilter size={16} className="mr-2" />
            Filters
          </h3>
          
          <div className="mb-3">
            <h4 className="text-xs text-neutral-500 mb-1">Tags</h4>
            <div className="space-y-1">
              {allTags.map(tag => (
                <div key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag}`}
                    checked={filterTags.includes(tag)}
                    onChange={() => handleTagFilterChange(tag)}
                    className="mr-2"
                  />
                  <label htmlFor={`tag-${tag}`} className="text-sm flex items-center">
                    <IconTag size={14} className="mr-1 text-neutral-500" />
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-xs text-neutral-500 mb-1">Priority</h4>
            <div className="space-y-1">
              {allPriorities.map(priority => (
                <div key={priority} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`priority-${priority}`}
                    checked={filterPriorities.includes(priority)}
                    onChange={() => handlePriorityFilterChange(priority)}
                    className="mr-2"
                  />
                  <label htmlFor={`priority-${priority}`} className="text-sm flex items-center">
                    <IconFlag size={14} className="mr-1 text-neutral-500" />
                    {priority}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <IconClock size={16} className="mr-2" />
            Upcoming Events
          </h3>
          <div className="space-y-2">
            {events
              .filter(event => moment(event.start).isAfter(moment()))
              .sort((a, b) => moment(a.start).diff(moment(b.start)))
              .slice(0, 5)
              .map(event => (
                <div 
                  key={event.id} 
                  className="p-2 bg-neutral-50 dark:bg-neutral-700 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600"
                  onClick={() => onSelectEvent(event)}
                >
                  <div className="text-sm font-medium">{event.title}</div>
                  <div className="text-xs text-neutral-500 flex items-center">
                    <IconClock size={12} className="mr-1" />
                    {moment(event.start).format("MMM D, h:mm A")}
                  </div>
                  {event.location && (
                    <div className="text-xs text-neutral-500 flex items-center">
                      <IconMapPin size={12} className="mr-1" />
                      {event.location}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar; 