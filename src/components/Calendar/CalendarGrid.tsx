import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-store";
import { CalendarEvent } from "@/lib/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function CalendarGrid() {
  const {
    view,
    setView,
    getEventsForDate,
    setEventModalOpen,
    setSelectedEvent,
  } = useCalendar();
  const [currentDate, setCurrentDate] = useState(view.currentDate);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of the month and calculate how many days from previous month to show
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  // Generate calendar days
  const calendarDays = [];
  const currentDay = new Date(startDate);

  for (let week = 0; week < 6; week++) {
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    calendarDays.push(weekDays);

    // Stop if we've covered the entire month and the week ends
    if (
      currentDay.getMonth() !== currentMonth &&
      weekDays[6].getMonth() !== currentMonth
    ) {
      break;
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setView({ ...view, currentDate: newDate });
  };

  const handleDayClick = (date: Date) => {
    const events = getEventsForDate(date);
    if (events.length === 1) {
      setSelectedEvent(events[0]);
      setEventModalOpen(true);
    } else if (events.length === 0) {
      // Create new event for this date
      setSelectedEvent(null);
      setEventModalOpen(true);
    }
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  const getCategoryColor = (category: CalendarEvent["category"]) => {
    const colors = {
      work: "bg-blue-500",
      personal: "bg-green-500",
      meeting: "bg-purple-500",
      reminder: "bg-yellow-500",
      other: "bg-gray-500",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {MONTHS[currentMonth]} {currentYear}
          </h1>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              setCurrentDate(today);
              setView({ ...view, currentDate: today });
            }}
          >
            Today
          </Button>
        </div>

        <Button onClick={() => setEventModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b">
        {DAYS.map((day) => (
          <div
            key={day}
            className="p-3 text-sm font-medium text-gray-700 text-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((week, weekIndex) =>
          week.map((date, dayIndex) => {
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();
            const dayEvents = getEventsForDate(date);

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "min-h-[120px] p-2 border-r border-b cursor-pointer hover:bg-gray-50 transition-colors",
                  !isCurrentMonth && "bg-gray-50 text-gray-400",
                )}
                onClick={() => handleDayClick(date)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isToday &&
                        "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs",
                    )}
                  >
                    {date.getDate()}
                  </span>
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity",
                        getCategoryColor(event.category),
                      )}
                      onClick={(e) => handleEventClick(event, e)}
                      title={event.title}
                    >
                      <div className="truncate">
                        {!event.allDay && event.startTime && (
                          <span className="mr-1">{event.startTime}</span>
                        )}
                        {event.title}
                      </div>
                    </div>
                  ))}

                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
