import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-store";
import { CalendarEvent } from "@/lib/types";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";
import { ru } from "date-fns/locale";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeeklyView() {
  const {
    view,
    setView,
    getEventsForDate,
    setEventModalOpen,
    setSelectedEvent,
  } = useCalendar();
  const [currentDate, setCurrentDate] = useState(view.currentDate);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const today = new Date();

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate =
      direction === "prev"
        ? subWeeks(currentDate, 1)
        : addWeeks(currentDate, 1);
    setCurrentDate(newDate);
    setView({ ...view, currentDate: newDate });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setView({ ...view, currentDate: today });
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    setSelectedEvent(null);
    setEventModalOpen(true);
  };

  const getCategoryColor = (category: CalendarEvent["category"]) => {
    const colors = {
      work: "#7986cb",
      personal: "#039be5",
      meeting: "#33b679",
      reminder: "#f6bf26",
      other: "#f4511e",
    };
    return colors[category] || colors.other;
  };

  const getEventPosition = (event: CalendarEvent, date: Date) => {
    if (!event.startTime || event.allDay) return null;

    const [startHour, startMin] = event.startTime.split(":").map(Number);
    const [endHour, endMin] = (event.endTime || event.startTime)
      .split(":")
      .map(Number);

    const startPos = (startHour + startMin / 60) * 60; // 60px per hour
    const duration = (endHour + endMin / 60 - (startHour + startMin / 60)) * 60;

    return { top: startPos, height: Math.max(duration, 30) };
  };

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek("prev")}
              className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek("next")}
              className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={goToToday}
            className="text-gray-700 hover:bg-gray-100 px-4 py-2 text-sm font-medium"
          >
            Сегодня
          </Button>

          <h1 className="text-2xl font-normal text-gray-800">
            {format(weekStart, "d MMM", { locale: ru })} -{" "}
            {format(weekEnd, "d MMM yyyy", { locale: ru })}
          </h1>
        </div>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="w-16"></div> {/* Time column */}
        {weekDays.map((day) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={day.toISOString()}
              className="p-4 text-center border-l border-gray-100"
            >
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                {format(day, "EEE", { locale: ru })}
              </div>
              <div
                className={cn(
                  "text-2xl font-normal mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full",
                  isToday ? "bg-blue-600 text-white" : "text-gray-700",
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Week Grid */}
      <div className="flex-1 overflow-y-auto max-h-[600px]">
        <div className="grid grid-cols-8 relative">
          {/* Time column */}
          <div className="w-16 bg-gray-50">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-15 border-b border-gray-100 flex items-start justify-end pr-2 pt-1"
                style={{ height: "60px" }}
              >
                {hour > 0 && (
                  <span className="text-xs text-gray-500">
                    {hour.toString().padStart(2, "0")}:00
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDate(day);

            return (
              <div
                key={day.toISOString()}
                className="border-l border-gray-100 relative"
                style={{ minHeight: "1440px" }} // 24 hours * 60px
              >
                {/* Time slots */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-15 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                    style={{ height: "60px" }}
                    onClick={() => handleTimeSlotClick(day, hour)}
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const position = getEventPosition(event, day);
                  if (!position) return null;

                  return (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1 px-2 py-1 rounded text-white text-xs cursor-pointer hover:opacity-80 transition-opacity z-10"
                      style={{
                        top: position.top,
                        height: position.height,
                        backgroundColor: getCategoryColor(event.category),
                        minHeight: "20px",
                      }}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      {position.height > 40 && event.description && (
                        <div className="truncate opacity-80 text-xs">
                          {event.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
