export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const timeSlots = Array.from({ length: 24 }, (_, i) => i);

export const statusColors = {
	"Not Started": "bg-neutral-100 border-neutral-400",
	"In Progress": "bg-yellow-100 border-yellow-400",
	Completed: "bg-green-100 border-green-400",
};

export const priorityColors = {
	Low: "bg-blue-100 border-blue-400",
	Medium: "bg-orange-100 border-orange-400",
	High: "bg-red-100 border-red-400",
};

export type ViewType = "month" | "week" | "day";
export interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	color?: string;
	tags?: string[];
	status?: "Not Started" | "In Progress" | "Completed";
	priority?: "Low" | "Medium" | "High";
}

export interface CalendarProps {
	events?: CalendarEvent[];
	onSelectEvent?: (event: CalendarEvent) => void;
	onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
	onCreateEvent?: (slotInfo: { start: Date; end: Date }) => void;
}
