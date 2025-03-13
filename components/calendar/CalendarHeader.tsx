"use client";

import React, { useState } from "react";
import moment from "moment";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconList,
  IconLayoutGrid,
  IconPlus,
  IconSearch,
  IconLayoutSidebar,
  IconLayoutSidebarFilled
} from "@tabler/icons-react";
import { ViewType } from "../../types";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "motion/react";

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
  const [hover,setHover] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleSidebar}
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
            aria-label="Toggle sidebar"
          >
            {hover?<IconLayoutSidebarFilled size={20}/>:<IconLayoutSidebar size={20} />}
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

          <div 
            className="flex border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden relative"
          >
            {toggleButtons.map((i) => (
              <div key={i.title}>
                <button
                  onMouseEnter={() => setHoveredButton(i.title)}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => onViewChange(i.title)}
                  className={`p-2 ${view === i.title ? "bg-neutral-200 dark:bg-neutral-700" : "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"}`}
                  aria-label={`${i.title} view`}
                >
                  {i.icon}
                </button>
                <AnimatePresence>
                  {hoveredButton === i.title && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-semibold fixed top-32 px-2 bg-black/5 dark:bg-white/20 rounded-full"
                    >
                      {i.title}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
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

const toggleButtons = [
  { 
    title:"month",
    icon: <IconCalendar size={20} />,
  }, {
    title:"week",
    icon: <IconLayoutGrid size={20} />,
  }, {
    title: "day",
    icon: <IconList size={20}/>
  }
]
