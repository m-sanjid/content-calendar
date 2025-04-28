import moment from "moment";
import { CalendarEvent } from "@/types";

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const timeSlots = Array.from({ length: 24 }, (_, i) => i);

export const isToday = (day: moment.Moment): boolean =>
  day.isSame(moment(), "day");

export const isCurrentMonth = (
  day: moment.Moment,
  currentDate: moment.Moment,
): boolean => day.isSame(currentDate, "month");

export const isSelectedDay = (
  day: moment.Moment,
  selectedDay: moment.Moment | null,
): boolean => (selectedDay ? day.isSame(selectedDay, "day") : false);

export const formatTimeLabel = (hour: number): string => {
  return hour === 0
    ? "12 AM"
    : hour < 12
      ? `${hour} AM`
      : hour === 12
        ? "12 PM"
        : `${hour - 12} PM`;
};

export const getDaysForMonthView = (currentDate: moment.Moment) => {
  const startOfMonth = currentDate.clone().startOf("month").startOf("week");
  const endOfMonth = currentDate.clone().endOf("month").endOf("week");

  return Array.from(
    { length: endOfMonth.diff(startOfMonth, "days") + 1 },
    (_, i) => startOfMonth.clone().add(i, "days"),
  );
};

export const getDaysForWeekView = (currentDate: moment.Moment) => {
  const startOfWeek = currentDate.clone().startOf("week");
  return Array.from({ length: 7 }, (_, i) =>
    startOfWeek.clone().add(i, "days"),
  );
};

export const getEventsForDay = (
  day: moment.Moment,
  events: CalendarEvent[],
): CalendarEvent[] => {
  const dateKey = day.format("YYYY-MM-DD");
  return events.filter((event) => {
    // Handle regular events
    if (moment(event.start).format("YYYY-MM-DD") === dateKey) {
      return true;
    }

    // Handle recurring events
    if (event.recurrence) {
      return doesRecurringEventOccurOnDate(event, day);
    }

    return false;
  });
};

export const getEventsForTimeSlot = (
  day: moment.Moment,
  hour: number,
  events: CalendarEvent[],
): CalendarEvent[] => {
  const startTime = day.clone().hour(hour).minute(0).second(0);
  const endTime = startTime.clone().add(59, "minutes").add(59, "seconds");

  const regularEvents = events.filter((event) => {
    const eventStart = moment(event.start);
    const eventEnd = moment(event.end);

    // Check if the event overlaps with this hour
    return (
      (eventStart.isSame(startTime) ||
        eventStart.isBetween(startTime, endTime) ||
        eventStart.isBefore(startTime)) &&
      (eventEnd.isSame(endTime) ||
        eventEnd.isBetween(startTime, endTime) ||
        eventEnd.isAfter(endTime))
    );
  });

  // Get recurring events for this time slot
  const recurringEvents = events
    .filter((event) => event.recurrence)
    .filter((event) => doesRecurringEventOccurOnDate(event, day))
    .filter((event) => {
      const eventStart = moment(event.start);
      const adjustedStart = day
        .clone()
        .hour(eventStart.hour())
        .minute(eventStart.minute())
        .second(eventStart.second());

      const eventDuration = moment.duration(
        moment(event.end).diff(moment(event.start)),
      );

      const adjustedEnd = adjustedStart.clone().add(eventDuration);

      return (
        adjustedStart.hour() === hour ||
        (adjustedStart.hour() < hour && adjustedEnd.hour() >= hour)
      );
    });

  return [...regularEvents, ...recurringEvents];
};

export const doesRecurringEventOccurOnDate = (
  event: CalendarEvent,
  date: moment.Moment,
): boolean => {
  if (!event.recurrence) return false;

  const rule = event.recurrence;
  const eventStart = moment(event.start);

  // Check if date is before the event start or after the recurrence end date
  if (
    date.isBefore(eventStart, "day") ||
    (rule.endDate && date.isAfter(moment(rule.endDate), "day"))
  ) {
    return false;
  }

  const interval = rule.interval || 1;

  switch (rule.frequency) {
    case "daily":
      const daysDiff = date.diff(eventStart, "days");
      return daysDiff % interval === 0;

    case "weekly":
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        // Event occurs on specific days of week
        return rule.daysOfWeek.includes(date.day());
      } else {
        // Event occurs every X weeks on the same day
        const weeksDiff = date.diff(eventStart, "weeks");
        return weeksDiff % interval === 0 && date.day() === eventStart.day();
      }

    case "monthly":
      const monthsDiff = date.diff(eventStart, "months");
      return monthsDiff % interval === 0 && date.date() === eventStart.date();

    case "yearly":
      const yearsDiff = date.diff(eventStart, "years");
      return (
        yearsDiff % interval === 0 &&
        date.month() === eventStart.month() &&
        date.date() === eventStart.date()
      );

    default:
      return false;
  }
};
