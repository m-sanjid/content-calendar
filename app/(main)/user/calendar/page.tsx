"use client";
import React, { useState } from "react";
import moment from "moment";
import BigCalendar from "@/components/Calendar2";
import Calendar from "@/components/Calendar";

interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	allDay?: boolean;
}

const CalendarPage = () => {
	const [events, setEvents] = useState<CalendarEvent[]>([]);

	const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
		const startTime = moment(start).format("MMM D, YYYY h:mm A");
		const endTime = moment(end).format("h:mm A");
		const timeDisplay = `${startTime} - ${endTime}`;

		const title = window.prompt(`Enter event title for: ${timeDisplay}`);

		if (title) {
			setEvents([
				...events,
				{
					id: Date.now().toString(),
					start,
					end,
					title,
				},
			]);
		}
	};

	const handleSelectEvent = (event: CalendarEvent) => {
		const startTime = moment(event.start).format("MMM D, YYYY h:mm A");
		const endTime = moment(event.end).format("h:mm A");
		const timeDisplay = `${startTime} - ${endTime}`;

		if (
			window.confirm(
				`Event: ${event.title}\nTime: ${timeDisplay}\n\nDelete this event?`,
			)
		) {
			setEvents(events.filter((e) => e.id !== event.id));
		}
	};

	return (
		<div className="min-h-screen w-full mx-auto flex flex-col gap-10 px-6 pt-20">
			<h1 className="text-2xl font-bold text-center">Calendar Application</h1>

			<div className="p-4 bg-blue-600 rounded-md max-w-5xl w-full mx-auto">
				<div className="bg-white rounded-md overflow-hidden shadow-lg">
					<BigCalendar
						events={events}
						onSelectSlot={handleSelectSlot}
						onSelectEvent={handleSelectEvent}
					/>
				</div>
			</div>
			<div>
				<Calendar />
			</div>

			<div className="max-w-5xl w-full mx-auto p-4 bg-white rounded-md shadow-lg">
				<h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
				{events.length > 0 ? (
					<ul className="divide-y">
						{events
							.sort((a, b) => moment(a.start).diff(moment(b.start)))
							.map((event) => (
								<li key={event.id} className="py-3 flex justify-between">
									<div>
										<h3 className="font-medium">{event.title}</h3>
										<p className="text-sm text-neutral-500">
											{moment(event.start).format("MMMM D, YYYY h:mm A")} -{" "}
											{moment(event.end).format("h:mm A")}
										</p>
									</div>
									<button
										onClick={() => handleSelectEvent(event)}
										className="text-red-500 hover:text-red-700"
									>
										Delete
									</button>
								</li>
							))}
					</ul>
				) : (
					<p className="text-neutral-500 italic">No events scheduled</p>
				)}
			</div>
		</div>
	);
};

export default CalendarPage;
