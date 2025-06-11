import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-store";
import { CalendarEvent } from "@/lib/types";
import { WeeklyView } from "./WeeklyView";

const DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const VIEW_OPTIONS = [
  { value: "day", label: "День" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
  { value: "year", label: "Год" },
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

  // If weekly view is selected, render WeeklyView component
  if (view.type === "week") {
    return <WeeklyView />;
  }

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of the month and calculate how many days from previous month to show
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
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

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setView({ ...view, currentDate: today });
  };

  const handleDayClick = (date: Date) => {
    const events = getEventsForDate(date);
    if (events.length === 0) {
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
      work: "#7986cb",
      personal: "#039be5",
      meeting: "#33b679",
      reminder: "#f6bf26",
      other: "#f4511e",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="flex-1 bg-white">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-6">
          {/* Navigation buttons */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
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
            {MONTHS[currentMonth]} {currentYear}
          </h1>
        </div>

        {/* View selector */}
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 px-4">
                <span className="mr-2">
                  {view.type === "month"
                    ? "Месяц"
                    : view.type === "week"
                      ? "Неделя"
                      : view.type === "day"
                        ? "День"
                        : "Год"}
                </span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {VIEW_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() =>
                    setView({ ...view, type: option.value as any })
                  }
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {DAYS.map((day, index) => (
          <div
            key={day}
            className="p-4 text-xs font-medium text-gray-600 text-center border-r border-gray-100 last:border-r-0"
          >
            <div className="text-gray-500 uppercase tracking-wider text-xs font-medium mb-1">
              {day}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((week, weekIndex) =>
          week.map((date, _dayIndex) => {
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
                  "min-h-[120px] p-2 border-r border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative",
                  !isCurrentMonth && "bg-gray-50",
                  "last:border-r-0",
                )}
                onClick={() => handleDayClick(date)}
              >
                {/* Date number */}
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={cn(
                      "text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full",
                      isCurrentMonth ? "text-gray-900" : "text-gray-400",
                      isToday && "bg-blue-600 text-white",
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
                      className="text-xs px-2 py-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity truncate"
                      style={{
                        backgroundColor: getCategoryColor(event.category),
                      }}
                      onClick={(e) => handleEventClick(event, e)}
                      title={`${event.startTime ? event.startTime + " " : ""}${event.title}`}
                    >
                      {!event.allDay && event.startTime && (
                        <span className="mr-1">{event.startTime}</span>
                      )}
                      {event.title}
                    </div>
                  ))}

                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium px-2">
                      ещё {dayEvents.length - 3}
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
