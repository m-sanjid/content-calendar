"use client";

import React, { useState, useEffect } from "react";
import Calendar from "@/components/Calendar";
import { CalendarEvent, SlotInfo } from "@/types";
import { useAuth } from "@clerk/nextjs";
import LoadingBounce from "@/components/LoadingBounce";

export default function CalendarPage() {
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const { userId, isLoaded } = useAuth();

	useEffect(() => {
		const fetchEvents = async () => {
			if (!isLoaded || !userId) return;
			try {
				setIsLoading(true);
				const response = await fetch("/api/events");
				if (!response.ok) throw new Error("Failed to fetch events");
				const data = await response.json();

				const formattedEvents = data.map((event: any) => ({
					...event,
					start: new Date(event.startTime),
					end: new Date(event.endTime),
					allDay:
						isSameDay(new Date(event.startTime), new Date(event.endTime)) &&
						isAllDay(new Date(event.startTime), new Date(event.endTime)),
				}));
				setEvents(formattedEvents);
			} catch (error) {
				console.error("Error fetching events:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvents();
	}, [userId, isLoaded]);

	const isSameDay = (date1: Date, date2: Date) =>
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate();

	const isAllDay = (start: Date, end: Date) =>
		start.getHours() === 0 &&
		start.getMinutes() === 0 &&
		end.getHours() === 23 &&
		end.getMinutes() === 59;

	const handleSelectSlot = (slotInfo: SlotInfo) => {
		console.log("Selected slot:", slotInfo);
	};

	const handleSelectEvent = (event: CalendarEvent) => {
		setSelectedEvent(event);
		console.log("Selected event:", event);
	};

	const handleUpdateEvent = async (updatedEvent: CalendarEvent) => {
		try {
			const isNewEvent =
				!updatedEvent.id || updatedEvent.id.startsWith("event-");
			const eventId = updatedEvent.id || `event-${Date.now()}`;

			const response = await fetch(
				`/api/events${isNewEvent ? "" : `/${eventId}`}`,
				{
					method: isNewEvent ? "POST" : "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...updatedEvent,
						startTime: updatedEvent.start,
						endTime: updatedEvent.end,
					}),
				},
			);
			if (!response.ok) throw new Error("Failed to save event");

			const savedEvent = await response.json();
			setEvents((prevEvents) =>
				isNewEvent
					? [...prevEvents, savedEvent]
					: prevEvents.map((e) => (e.id === eventId ? savedEvent : e)),
			);
		} catch (error) {
			console.error("Error saving event:", error);
		}
	};

	const handleDeleteEvent = async (eventId: string) => {
		try {
			const response = await fetch(`/api/events/${eventId}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete event");
			setEvents((prevEvents) =>
				prevEvents.filter((event) => event.id !== eventId),
			);
		} catch (error) {
			console.error("Error deleting event:", error);
		}
	};

	if (!isLoaded || isLoading) {
		return (
			<div className="flex justify-center items-center h-full">
				{isLoaded ? <LoadingBounce /> : "Loading authentication..."}
			</div>
		);
	}

	return (
		<div className="h-full">
			<Calendar
				events={events}
				onSelectEvent={handleSelectEvent}
				onSelectSlot={handleSelectSlot}
				onUpdateEvent={handleUpdateEvent}
				onDeleteEvent={handleDeleteEvent}
			/>
		</div>
	);
}
