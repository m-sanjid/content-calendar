export type ViewType = "month" | "week" | "day";

export interface CalendarProps {
	events?: CalendarEvent[];
	onSelectEvent?: (event: CalendarEvent) => void;
	onSelectSlot?: (slotInfo: SlotInfo) => void;
	onUpdateEvent?: (updatedEvent: CalendarEvent) => void;
}

export interface SlotInfo {
	start: Date;
	end: Date;
	slots: Date[];
	action: "select" | "click" | "doubleClick";
}

export interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	description?: string;
	location?: string;
	allDay?: boolean;
	tags: string[];
	priority: "Low" | "Medium" | "High";
	color?: string;
	userId?: string;
	recurring?: RecurringSettings| null;
}

export interface RecurringSettings {
	id?: string;
	eventId: string;
	frequency: RecurringFrequency | "None";
  }
  
export type RecurringFrequency = "daily" | "weekly" | "biweekly" | "monthly" | "yearly" | "None";

export type Priority = "Low" | "Medium" | "High";

export interface ContentEvent {
	id?: string;
	title: string;
	platform: string;
	date: Date;
	time: string;
	content: string;
	tags: string[];
	userId?: string;
  }