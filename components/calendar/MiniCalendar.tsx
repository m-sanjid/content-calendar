"use client";

import React from "react";
import moment from "moment";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { CalendarEvent } from "../../types";

interface MiniCalendarProps {
  currentDate: moment.Moment;
  events: CalendarEvent[];
  onDateChange: (date: moment.Moment) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  currentDate,
  events,
  onDateChange,
}) => {
  // Helper functions
  const getDaysInMonth = (date: moment.Moment) => {
    const startOfMonth = moment(date).startOf("month");
    const endOfMonth = moment(date).endOf("month");
    const startDay = startOfMonth.day(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get days from previous month to fill the first row
    const prevMonthDays = Array.from({ length: startDay }, (_, i) => {
      return moment(startOfMonth).subtract(startDay - i, "days");
    });
    
    // Get days in the current month
    const daysInMonth = Array.from({ length: endOfMonth.date() }, (_, i) => {
      return moment(startOfMonth).add(i, "days");
    });
    
    // Get days from next month to fill the last row
    const totalDaysDisplayed = Math.ceil((startDay + endOfMonth.date()) / 7) * 7;
    const nextMonthDays = Array.from({ length: totalDaysDisplayed - (prevMonthDays.length + daysInMonth.length) }, (_, i) => {
      return moment(endOfMonth).add(i + 1, "days");
    });
    
    return [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  };

  const isToday = (day: moment.Moment): boolean => day.isSame(moment(), "day");
  const isCurrentMonth = (day: moment.Moment): boolean => day.isSame(currentDate, "month");
  const isSelectedDate = (day: moment.Moment): boolean => day.isSame(currentDate, "day");
  
  const hasEventsOnDay = (day: moment.Moment): boolean => {
    return events.some(event => {
      const eventStart = moment(event.start);
      return eventStart.isSame(day, "day");
    });
  };

  const handleDateClick = (day: moment.Moment) => {
    onDateChange(day);
  };

  const miniCalendarDate = moment(currentDate);
  const days = getDaysInMonth(miniCalendarDate);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="mini-calendar bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{miniCalendarDate.format("MMMM YYYY")}</span>
        <div className="flex space-x-1">
          <button 
            onClick={() => onDateChange(moment(currentDate).subtract(1, "month"))}
            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <IconChevronLeft size={16} />
          </button>
          <button 
            onClick={() => onDateChange(moment(currentDate).add(1, "month"))}
            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map(day => (
          <div key={day} className="text-xs text-center text-neutral-500 font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day)}
            className={`
              w-6 h-6 text-xs flex items-center justify-center rounded-sm relative
              ${isToday(day) ? 'bg-black text-white dark:bg-white dark:text-black' : ''}
              ${isSelectedDate(day) && !isToday(day) ? 'bg-neutral-200 dark:bg-neutral-700' : ''}
              ${!isCurrentMonth(day) ? 'text-neutral-400 dark:text-neutral-600' : ''}
              ${hasEventsOnDay(day) && !isToday(day) && !isSelectedDate(day) ? 'font-bold' : ''}
              hover:bg-neutral-200 dark:hover:bg-neutral-700
            `}
          >
            {day.date()}
            {hasEventsOnDay(day) && !isToday(day) && !isSelectedDate(day) && (
              <div className="absolute bottom-0 w-1 h-1 bg-black dark:bg-white rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar; 