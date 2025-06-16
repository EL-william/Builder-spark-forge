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
import styles from "./CalendarGrid.module.scss";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
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
  // Adjust for Monday start (getDay() returns 0 for Sunday, 1 for Monday, etc.)
  const dayOfWeek = firstDayOfMonth.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(startDate.getDate() - daysToSubtract);

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

  const getCategoryClass = (category: CalendarEvent["category"]) => {
    return styles[category] || styles.other;
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Calendar Header */}
      <div className={styles.calendarHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.navigationButtons}>
            <button
              className={styles.navButton}
              onClick={() => navigateMonth("prev")}
            >
              <ChevronLeft />
            </button>
            <button
              className={styles.navButton}
              onClick={() => navigateMonth("next")}
            >
              <ChevronRight />
            </button>
          </div>

          <button className={styles.todayButton} onClick={goToToday}>
            Сегодня
          </button>

          <h1 className={styles.calendarTitle}>
            {MONTHS[currentMonth]} {currentYear}
          </h1>
        </div>

        <div className={styles.headerRight}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={styles.viewSelector}>
                <span>
                  {view.type === "month"
                    ? "Месяц"
                    : view.type === "week"
                      ? "Неделя"
                      : view.type === "day"
                        ? "День"
                        : "Год"}
                </span>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
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

          <button className={styles.moreButton}>
            <MoreHorizontal />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className={styles.daysHeader}>
        {DAYS.map((day, _index) => (
          <div key={day} className={styles.dayHeader}>
            <div className={styles.dayName}>{day}</div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={styles.calendarGrid}>
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
                key={`${weekIndex}-${_dayIndex}`}
                className={cn(
                  styles.dayCell,
                  !isCurrentMonth && styles.otherMonth,
                )}
                onClick={() => handleDayClick(date)}
              >
                {/* Date number */}
                <div className={styles.dayHeader}>
                  <span
                    className={cn(styles.dayNumber, isToday && styles.today)}
                  >
                    {date.getDate()}
                  </span>
                </div>

                {/* Events */}
                <div className={styles.dayEvents}>
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        styles.event,
                        getCategoryClass(event.category),
                      )}
                      onClick={(e) => handleEventClick(event, e)}
                      title={`${event.startTime ? event.startTime + " " : ""}${event.title}`}
                    >
                      {!event.allDay && event.startTime && (
                        <span className={styles.eventTime}>
                          {event.startTime}
                        </span>
                      )}
                      {event.title}
                    </div>
                  ))}

                  {dayEvents.length > 3 && (
                    <div className={styles.moreEvents}>
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
