"use client";

import React, { useState } from "react";
import moment from "moment";
import { CalendarEvent, ViewType, SlotInfo } from "../types";
import MainCalendar from "./calendar/MainCalendar";
import CalendarSidebar from "./calendar/CalendarSidebar";
import CalendarHeader from "./calendar/CalendarHeader";
import EventForm from "./calendar/EventForm";
import EventDetailView from "./calendar/EventDetailView";

interface CalendarProps {
  events?: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectSlot?: (slotInfo: SlotInfo) => void;
  onUpdateEvent?: (updatedEvent: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events = [],
  onSelectEvent = () => { },
  onSelectSlot = () => { },
  onUpdateEvent = () => { },
  onDeleteEvent = () => { },
}) => {
  const [currentDate, setCurrentDate] = useState<moment.Moment>(moment());
  const [view, setView] = useState<ViewType>("month");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterPriorities, setFilterPriorities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [eventFormData, setEventFormData] = useState<{
    event?: CalendarEvent;
    slotInfo?: SlotInfo;
  }>({});


  const handleSlotSelect = (slotInfo: SlotInfo) => {
    const newEvent: CalendarEvent = {

          id: `event-${Date.now()}`,
          title: "New Event",
          description: "",
          start: new Date(slotInfo.start),
          end: new Date(slotInfo.end),
          location: "",
          priority: "Medium",
          tags: [],
          color: "#000000",
          recurring: {
            eventId: "",
            frequency: "None",
            interval: 1,
          },
    }
    setEventFormData({ event: newEvent, slotInfo });
    setShowEventForm(true);
    onSelectSlot(slotInfo);
  };

  const navigateToToday = () => {
    setCurrentDate(moment());
  };

  const navigateToPrevious = () => {
    if (view === "month") {
      setCurrentDate(moment(currentDate).subtract(1, "month"));
    } else if (view === "week") {
      setCurrentDate(moment(currentDate).subtract(1, "week"));
    } else {
      setCurrentDate(moment(currentDate).subtract(1, "day"));
    }
  };

  const navigateToNext = () => {
    if (view === "month") {
      setCurrentDate(moment(currentDate).add(1, "month"));
    } else if (view === "week") {
      setCurrentDate(moment(currentDate).add(1, "week"));
    } else {
      setCurrentDate(moment(currentDate).add(1, "day"));
    }
  };

  // Filter events based on search query and filters
  const filteredEvents = events.filter((event) => {
    // Filter by search query
    if (
      searchQuery &&
      !event.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by tags
    if (
      filterTags.length > 0 &&
      (!event.tags || !event.tags.some((tag) => filterTags.includes(tag)))
    ) {
      return false;
    }

    // Filter by priority
    if (
      filterPriorities.length > 0 &&
      (!event.priority || !filterPriorities.includes(event.priority))
    ) {
      return false;
    }

    return true;
  });

  // Event handlers
  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
    onSelectEvent(event);
  };

  const handleAddEvent = () => {
    const now = moment();
    const start = moment(currentDate).hour(now.hour()).minute(0).second(0);
    const end = moment(start).add(1, "hour");

    const slotInfo: SlotInfo = {
      start: start.toDate(),
      end: end.toDate(),
      slots: [],
      action: "select"
    };

    setEventFormData({ slotInfo });
    setShowEventForm(true);
    onSelectSlot(slotInfo);
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    onUpdateEvent(event);
    setSelectedEvent(null);
    setShowEventForm(false);
    setShowEventDetail(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    onDeleteEvent(eventId);
    setSelectedEvent(null);
    setShowEventForm(false);
    setShowEventDetail(false);
  };

  const handleCloseEventForm = () => {
    setShowEventForm(false);
    setEventFormData({});
  };

  const handleCloseEventDetail = () => {
    setShowEventDetail(false);
    setSelectedEvent(null);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEventFormData({ event });
    setShowEventDetail(false);
    setShowEventForm(true);
  };

  return (
    <div className="notion-calendar flex h-[calc(100vh-64px)]">
      <CalendarSidebar
        isOpen={sidebarOpen}
        events={events}
        currentDate={currentDate}
        filterTags={filterTags}
        filterPriorities={filterPriorities}
        onDateChange={setCurrentDate}
        onTagFilterChange={setFilterTags}
        onPriorityFilterChange={setFilterPriorities}
        onSelectEvent={handleEventSelect}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          searchQuery={searchQuery}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNavigateToPrevious={navigateToPrevious}
          onNavigateToToday={navigateToToday}
          onNavigateToNext={navigateToNext}
          onViewChange={setView}
          onSearchChange={setSearchQuery}
          onAddEvent={handleAddEvent}
        />
        <div className="flex-1 overflow-auto">
          <MainCalendar
            events={filteredEvents}
            currentDate={currentDate}
            view={view}
            onSelectEvent={handleEventSelect}
            onSelectSlot={handleSlotSelect}
          />
        </div>
      </div>
      <EventForm
        event={eventFormData.event}
        isOpen={showEventForm}
        onClose={handleCloseEventForm}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
      {selectedEvent && (
        <EventDetailView
          event={selectedEvent}
          isOpen={showEventDetail}
          onClose={handleCloseEventDetail}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
