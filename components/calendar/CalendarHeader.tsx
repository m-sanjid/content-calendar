"use client";

import React from "react";
import moment from "moment";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconList,
  IconLayoutGrid,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { ViewType } from "../../types";
import { Button } from "../ui/button";

interface CalendarHeaderProps {
  currentDate: moment.Moment;
  view: ViewType;
  searchQuery: string;
  onToggleSidebar: () => void;
  onNavigateToPrevious: () => void;
  onNavigateToToday: () => void;
  onNavigateToNext: () => void;
  onViewChange: (view: ViewType) => void;
  onSearchChange: (query: string) => void;
  onAddEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  searchQuery,
  onToggleSidebar,
  onNavigateToPrevious,
  onNavigateToToday,
  onNavigateToNext,
  onViewChange,
  onSearchChange,
  onAddEvent,
}) => {
  const getHeaderTitle = () => {
    if (view === "month") {
      return currentDate.format("MMMM YYYY");
    } else if (view === "week") {
      const startOfWeek = moment(currentDate).startOf("week");
      const endOfWeek = moment(currentDate).endOf("week");
      if (startOfWeek.month() === endOfWeek.month()) {
        return `${startOfWeek.format("MMM D")} - ${endOfWeek.format("D, YYYY")}`;
      } else if (startOfWeek.year() === endOfWeek.year()) {
        return `${startOfWeek.format("MMM D")} - ${endOfWeek.format("MMM D, YYYY")}`;
      } else {
        return `${startOfWeek.format("MMM D, YYYY")} - ${endOfWeek.format("MMM D, YYYY")}`;
      }
    } else {
      return currentDate.format("dddd, MMMM D, YYYY");
    }
  };

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
            aria-label="Toggle sidebar"
          >
            <IconList size={20} />
          </button>

          <h1 className="text-xl font-semibold">{getHeaderTitle()}</h1>

          <div className="flex space-x-1 ml-4">
            <button
              onClick={onNavigateToPrevious}
              className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Previous"
            >
              <IconChevronLeft size={20} />
            </button>
            <button
              onClick={onNavigateToToday}
              className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm"
            >
              Today
            </button>
            <button
              onClick={onNavigateToNext}
              className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Next"
            >
              <IconChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 w-64"
            />
            <IconSearch
              size={16}
              className="absolute left-2.5 top-3 text-neutral-400"
            />
          </div>

          <div className="flex border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewChange("day")}
              className={`p-2 ${view === "day" ? "bg-neutral-200 dark:bg-neutral-700" : "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"}`}
              aria-label="Day view"
            >
              <IconList size={20} />
            </button>
            <button
              onClick={() => onViewChange("week")}
              className={`p-2 ${view === "week" ? "bg-neutral-200 dark:bg-neutral-700" : "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"}`}
              aria-label="Week view"
            >
              <IconLayoutGrid size={20} />
            </button>
            <button
              onClick={() => onViewChange("month")}
              className={`p-2 ${view === "month" ? "bg-neutral-200 dark:bg-neutral-700" : "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"}`}
              aria-label="Month view"
            >
              <IconCalendar size={20} />
            </button>
          </div>

          <Button
            onClick={onAddEvent}
            className="p-2 rounded-full flex items-center dark:bg-neutral-800 dark:text-white"
          >
            <IconPlus size={20} className="mr-1" />
            <span>New Event</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
