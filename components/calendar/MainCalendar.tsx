"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import { IconPlus, IconMapPin } from "@tabler/icons-react";
import { CalendarEvent, ViewType, SlotInfo } from "../../types";

interface MainCalendarProps {
  events: CalendarEvent[];
  currentDate: moment.Moment;
  view: ViewType;
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectSlot: (slotInfo: SlotInfo) => void;
}

const MainCalendar: React.FC<MainCalendarProps> = ({
  events,
  currentDate,
  view,
  onSelectEvent,
  onSelectSlot,
}) => {
  // State for drag and drop functionality
  const [draggingEvent, setDraggingEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  // Helper functions
  const getEventsByDate = (date: moment.Moment) => {
    return events.filter((event) => {
      const eventStart = moment(event.start);
      return eventStart.isSame(date, "day");
    });
  };

  const getEventStyle = (event: CalendarEvent) => {
    const defaultColor = "border-l-4 border-black bg-black/20 backdrop-blur-sm dark:bg-white/20 dark:border-white";
    const colorMap: Record<string, string> = {
      red: "border-l-4 border-red-500 bg-red-500/20 backdrop-blur-sm",
      green: "border-l-4 border-green-500 bg-green-500/20 backdrop-blur-sm",
      blue: "border-l-4 border-blue-500 bg-blue-500/20 backdrop-blur-sm",
      yellow: "border-l-4 border-yellow-500 bg-yellow-500/20 backdrop-blur-sm",
      purple: "border-l-4 border-purple-500 bg-purple-500/20 backdrop-blur-sm",
      pink: "border-l-4 border-pink-500 bg-pink-500/20 backdrop-blur-sm",
      orange: "border-l-4 border-orange-500 bg-orange-500/20 backdrop-blur-sm",
      teal: "border-l-4 border-teal-500 bg-teal-500/20 backdrop-blur-sm",
      indigo: "border-l-4 border-indigo-500 bg-indigo-500/20 backdrop-blur-sm",
    };

    return event.color && colorMap[event.color]
      ? colorMap[event.color]
      : defaultColor;
  };

  const handleSlotClick = (date: moment.Moment, hour?: number) => {
    const start =
      hour !== undefined
        ? moment(date).hour(hour).minute(0).second(0)
        : moment(date).hour(9).minute(0).second(0);

    const end = moment(start).add(1, "hour");

    onSelectSlot({
      start: start.toDate(),
      end: end.toDate(),
    });
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectEvent(event);
  };

  const handleDragStart = (event: CalendarEvent, e: React.DragEvent) => {
    setDraggingEvent(event);
    // Set data for drag operation
    e.dataTransfer.setData("text/plain", event.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    date: moment.Moment,
    hour: number,
    e: React.DragEvent,
  ) => {
    e.preventDefault();
    const slotId = `${date.format("YYYY-MM-DD")}-${hour}`;
    setHoveredSlot(slotId);
  };

  const handleDrop = (
    date: moment.Moment,
    hour: number,
    e: React.DragEvent,
  ) => {
    e.preventDefault();
    setHoveredSlot(null);

    if (!draggingEvent) return;

    const eventId = e.dataTransfer.getData("text/plain");
    if (eventId !== draggingEvent.id) return;

    // Calculate the time difference between original start and end
    const originalStart = moment(draggingEvent.start);
    const originalEnd = moment(draggingEvent.end);
    const duration = originalEnd.diff(originalStart);

    // Create new start and end times
    const newStart = moment(date).hour(hour).minute(0).second(0);
    const newEnd = moment(newStart).add(duration, "milliseconds");

    // Create updated event
    const updatedEvent: CalendarEvent = {
      ...draggingEvent,
      start: newStart.toDate(),
      end: newEnd.toDate(),
    };

    // Call the onSelectEvent with the updated event
    onSelectEvent(updatedEvent);
    setDraggingEvent(null);
  };

  const handleDragEnd = () => {
    setDraggingEvent(null);
    setHoveredSlot(null);
  };

  // Render functions for different views
  const renderMonthView = () => {
    const startOfMonth = moment(currentDate).startOf("month");
    const endOfMonth = moment(currentDate).endOf("month");
    const startDate = moment(startOfMonth).startOf("week");
    const endDate = moment(endOfMonth).endOf("week");

    const weeks = [];
    let week = [];
    const day = startDate.clone();

    while (day.isSameOrBefore(endDate, "day")) {
      for (let i = 0; i < 7; i++) {
        week.push(day.clone());
        day.add(1, "day");
      }
      weeks.push(week);
      week = [];
    }

    return (
      <div className="month-view h-full flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-700">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (dayName, index) => (
              <div
                key={index}
                className="p-2 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400"
              >
                {dayName}
              </div>
            ),
          )}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 grid grid-rows-6">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 h-full">
              {week.map((day, dayIndex) => {
                const isCurrentMonth = day.month() === currentDate.month();
                const isToday = day.isSame(moment(), "day");
                const dayEvents = getEventsByDate(day);

                return (
                  <div
                    key={dayIndex}
                    onClick={() => handleSlotClick(day)}
                    className={`
                      border-r border-b border-neutral-200 dark:border-neutral-700 p-1 
                      ${isCurrentMonth ? "bg-white dark:bg-neutral-800" : "bg-neutral-50 dark:bg-neutral-900"}
                      ${isToday ? "border-l-4 border-l-black backdrop-blur-sm dark:bg-white/20 dark:border-l-white" : ""}
                      relative overflow-hidden h-full
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={`
                          text-sm font-medium rounded-sm w-6 h-6 flex items-center justify-center
                          ${isToday ? "bg-black text-white dark:bg-white dark:text-black" : ""}
                          ${!isCurrentMonth ? "text-neutral-400 dark:text-neutral-600" : ""}
                        `}
                      >
                        {day.date()}
                      </span>

                      {isCurrentMonth && (
                        <button
                          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSlotClick(day);
                          }}
                        >
                          <IconPlus size={14} />
                        </button>
                      )}
                    </div>

                    <div className="mt-1 space-y-1 max-h-[calc(100%-2rem)] overflow-y-auto">
                      {dayEvents.slice(0, 5).map((event) => (
                        <div
                          key={event.id}
                          onClick={(e) => handleEventClick(event, e)}
                          draggable
                          onDragStart={(e) => handleDragStart(event, e)}
                          onDragEnd={handleDragEnd}
                          className={`
                            text-xs p-1 rounded truncate cursor-pointer
                            ${getEventStyle(event)}
                            hover:opacity-90 transition-opacity
                          `}
                        >
                          {event.allDay
                            ? "All day: "
                            : `${moment(event.start).format("h:mm A")}: `}
                          {event.title}
                        </div>
                      ))}

                      {dayEvents.length > 5 && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 pl-1">
                          +{dayEvents.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = moment(currentDate).startOf("week");
    const endOfWeek = moment(currentDate).endOf("week");
    const days = [];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    for (let i = 0; i < 7; i++) {
      days.push(moment(startOfWeek).add(i, "days"));
    }

    return (
      <div className="week-view h-full flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b border-neutral-200 dark:border-neutral-700">
          <div className="p-2 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400 border-r border-neutral-200 dark:border-neutral-700">
            Time
          </div>
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                p-2 text-center text-sm font-medium 
                ${day.isSame(moment(), "day") ? "bg-blue-50 dark:bg-blue-900/20" : ""}
              `}
            >
              <div>{day.format("ddd")}</div>
              <div
                className={`text-lg ${day.isSame(moment(), "day") ? "font-bold" : ""}`}
              >
                {day.date()}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8 divide-x divide-neutral-200 dark:divide-neutral-700 min-h-full">
            {/* Time column */}
            <div className="time-column">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-16 border-b border-neutral-200 dark:border-neutral-700 pr-2 text-right text-xs text-neutral-500 dark:text-neutral-400"
                >
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                        ? "12 PM"
                        : `${hour - 12} PM`}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className="day-column relative">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => handleSlotClick(day, hour)}
                    onDragOver={(e) => handleDragOver(day, hour, e)}
                    onDrop={(e) => handleDrop(day, hour, e)}
                    className={`
                      h-16 border-b border-neutral-200 dark:border-neutral-700 relative
                      ${hoveredSlot === `${day.format("YYYY-MM-DD")}-${hour}` ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                      ${day.isSame(moment(), "day") && hour === moment().hour() ? "bg-blue-50 dark:bg-blue-900/10" : ""}
                    `}
                  >
                    {/* Current time indicator */}
                    {day.isSame(moment(), "day") &&
                      hour === moment().hour() && (
                        <div
                          className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                          style={{ top: `${(moment().minute() / 60) * 100}%` }}
                        >
                          <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1"></div>
                        </div>
                      )}
                  </div>
                ))}

                {/* Events */}
                {getEventsByDate(day).map((event) => {
                  const eventStart = moment(event.start);
                  const eventEnd = moment(event.end);

                  // Only show events for this day
                  if (!eventStart.isSame(day, "day")) return null;

                  const startHour =
                    eventStart.hour() + eventStart.minute() / 60;
                  const endHour = eventEnd.hour() + eventEnd.minute() / 60;
                  const duration = endHour - startHour;

                  // Skip all-day events as they would be shown in a separate row
                  if (event.allDay) return null;

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(event, e)}
                      draggable
                      onDragStart={(e) => handleDragStart(event, e)}
                      onDragEnd={handleDragEnd}
                      className={`
                        absolute left-0 right-0 mx-1 rounded px-2 py-1 overflow-hidden cursor-pointer
                        ${getEventStyle(event)} text-white
                        hover:opacity-90 transition-opacity
                      `}
                      style={{
                        top: `${startHour * 4}rem`,
                        height: `${duration * 4}rem`,
                        zIndex: 5,
                      }}
                    >
                      <div className="text-xs font-medium truncate">
                        {event.title}
                      </div>
                      <div className="text-xs opacity-90 truncate">
                        {eventStart.format("h:mm A")} -{" "}
                        {eventEnd.format("h:mm A")}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsByDate(currentDate);

    return (
      <div className="day-view h-full flex flex-col">
        {/* Day header */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 p-3 text-center">
          <div className="text-lg font-medium">
            {currentDate.format("dddd")}
          </div>
          <div
            className={`text-2xl font-bold ${currentDate.isSame(moment(), "day") ? "text-blue-500" : ""}`}
          >
            {currentDate.format("MMMM D, YYYY")}
          </div>
        </div>

        {/* All-day events */}
        {dayEvents.some((event) => event.allDay) && (
          <div className="border-b border-neutral-200 dark:border-neutral-700 p-2">
            <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              All-day
            </div>
            <div className="space-y-1">
              {dayEvents
                .filter((event) => event.allDay)
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                    className={`
                      p-2 rounded text-sm cursor-pointer
                      ${getEventStyle(event)} text-white
                      hover:opacity-90 transition-opacity
                    `}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Time grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 min-h-full">
            {hours.map((hour) => (
              <div key={hour} className="relative">
                <div
                  onClick={() => handleSlotClick(currentDate, hour)}
                  onDragOver={(e) => handleDragOver(currentDate, hour, e)}
                  onDrop={(e) => handleDrop(currentDate, hour, e)}
                  className={`
                    h-16 border-b border-neutral-200 dark:border-neutral-700 pl-16 relative
                    ${hoveredSlot === `${currentDate.format("YYYY-MM-DD")}-${hour}` ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                    ${currentDate.isSame(moment(), "day") && hour === moment().hour() ? "bg-blue-50 dark:bg-blue-900/10" : ""}
                  `}
                >
                  <div className="absolute left-0 top-0 w-16 pr-2 text-right text-xs text-neutral-500 dark:text-neutral-400">
                    {hour === 0
                      ? "12 AM"
                      : hour < 12
                        ? `${hour} AM`
                        : hour === 12
                          ? "12 PM"
                          : `${hour - 12} PM`}
                  </div>

                  {/* Current time indicator */}
                  {currentDate.isSame(moment(), "day") &&
                    hour === moment().hour() && (
                      <div
                        className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                        style={{ top: `${(moment().minute() / 60) * 100}%` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1"></div>
                      </div>
                    )}
                </div>

                {/* Events */}
                {dayEvents
                  .filter((event) => {
                    if (event.allDay) return false;
                    const eventStart = moment(event.start);
                    return eventStart.hour() === hour;
                  })
                  .map((event) => {
                    const eventStart = moment(event.start);
                    const eventEnd = moment(event.end);
                    const startMinute = eventStart.minute() / 60;
                    const duration = eventEnd.diff(eventStart, "minutes") / 60;

                    return (
                      <div
                        key={event.id}
                        onClick={(e) => handleEventClick(event, e)}
                        draggable
                        onDragStart={(e) => handleDragStart(event, e)}
                        onDragEnd={handleDragEnd}
                        className={`
                          absolute left-16 right-2 rounded px-3 py-1 overflow-hidden cursor-pointer
                          ${getEventStyle(event)} text-white
                          hover:opacity-90 transition-opacity
                        `}
                        style={{
                          top: `${(hour + startMinute) * 4}rem`,
                          height: `${duration * 4}rem`,
                          zIndex: 5,
                        }}
                      >
                        <div className="text-sm font-medium">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {eventStart.format("h:mm A")} -{" "}
                          {eventEnd.format("h:mm A")}
                        </div>
                        {event.location && (
                          <div className="text-xs opacity-90 flex items-center">
                            <IconMapPin size={12} className="mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render the appropriate view
  return (
    <div className="main-calendar h-full">
      {view === "month" && renderMonthView()}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}
    </div>
  );
};

export default MainCalendar;
