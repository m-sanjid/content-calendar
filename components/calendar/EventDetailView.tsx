"use client";

import React from "react";
import moment from "moment";
import { 
  IconCalendar, 
  IconMapPin, 
  IconTag, 
  IconFlag, 
  IconX, 
  IconEdit,
  IconTrash,
  IconRepeat,
  IconAlignLeft
} from "@tabler/icons-react";
import { CalendarEvent } from "../../types";
import { Button } from "../ui/button";

interface EventDetailViewProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !event) return null;

  const formatDateRange = () => {
    const start = moment(event.start);
    const end = moment(event.end);
    
    if (event.allDay) {
      if (start.isSame(end, 'day')) {
        return `${start.format('dddd, MMMM D, YYYY')} (All day)`;
      } else {
        return `${start.format('MMM D, YYYY')} - ${end.format('MMM D, YYYY')} (All day)`;
      }
    } else {
      if (start.isSame(end, 'day')) {
        return `${start.format('dddd, MMMM D, YYYY')} ${start.format('h:mm A')} - ${end.format('h:mm A')}`;
      } else {
        return `${start.format('MMM D, YYYY h:mm A')} - ${end.format('MMM D, YYYY h:mm A')}`;
      }
    }
  };

  const getPriorityColor = () => {
    switch (event.priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-neutral-500';
    }
  };

  const getEventColor = () => {
    const colorMap: Record<string, string> = {
      red: "bg-red-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      orange: "bg-orange-500",
      teal: "bg-teal-500",
      indigo: "bg-indigo-500",
    };
    
    return event.color && colorMap[event.color] ? colorMap[event.color] : 'bg-blue-500';
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className={`p-4 flex justify-between items-center`}>
            <div className={`p-4 ${getEventColor()} rounded-lg`}/>
          <h2 className="text-lg font-semibold">{event.title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full cursor-pointer hover:bg-accent dark:hover:bg-neutral-400"
          >
            <IconX size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Date and Time */}
          <div className="flex items-start">
            <IconCalendar size={20} className="mr-3 mt-1 text-neutral-500 flex-shrink-0" />
            <div>
              <div className="font-medium">{formatDateRange()}</div>
              {event.isRecurring && (
                <div className="text-sm text-neutral-500 flex items-center mt-1">
                  <IconRepeat size={16} className="mr-1" />
                  Repeats {event.recurringPattern}
                </div>
              )}
            </div>
          </div>
          
          {/* Location */}
          {event.location && (
            <div className="flex items-start">
              <IconMapPin size={20} className="mr-3 mt-1 text-neutral-500 flex-shrink-0" />
              <div className="font-medium">{event.location}</div>
            </div>
          )}
          
          {/* Description */}
          {event.description && (
            <div className="flex items-start">
              <IconAlignLeft size={20} className="mr-3 mt-1 text-neutral-500 flex-shrink-0" />
              <div className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{event.description}</div>
            </div>
          )}
          
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex items-start">
              <IconTag size={20} className="mr-3 mt-1 text-neutral-500 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {event.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Priority */}
          {event.priority && (
            <div className="flex items-start">
              <IconFlag size={20} className="mr-3 mt-1 text-neutral-500 flex-shrink-0" />
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full ${getPriorityColor()} mr-2`}></span>
                <span className="capitalize">{event.priority} priority</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-2">
          <Button   
            variant={"outline"}
            onClick={() => onDelete(event.id)}
            className="flex items-center rounded-full gap-1 hover:bg-neutral-400"
          >
            <IconTrash size={16} className="mr-1" />
            Delete
          </Button>
          
          <Button
            onClick={() => onEdit(event)}
            className="rounded-full flex items-center"
          >
            <IconEdit size={16} className="mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailView; 