import { useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronRightSmall,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCalendar } from "@/lib/calendar-store";
import { useTaskStore } from "@/lib/task-store";
import { TaskModal } from "@/components/Tasks/TaskModal";
import { cn } from "@/lib/utils";
import styles from "./CalendarSidebar.module.scss";

const DAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
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

const categoryColors = [
  { id: "personal", label: "Личные", color: "#039be5", checked: true },
  { id: "work", label: "Работа", color: "#7986cb", checked: true },
  { id: "meeting", label: "Встречи", color: "#33b679", checked: true },
  { id: "reminder", label: "Напоминания", color: "#f6bf26", checked: true },
  { id: "other", label: "Другие", color: "#f4511e", checked: true },
];

export function CalendarSidebar() {
  const { view, setView, setEventModalOpen } = useCalendar();
  const { setTaskModalOpen, taskLists } = useTaskStore();
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());
  const [isMyCalendarsExpanded, setIsMyCalendarsExpanded] = useState(true);
  const [isTaskListsExpanded, setIsTaskListsExpanded] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState<string[]>([
    "personal",
    "work",
    "meeting",
    "reminder",
    "other",
  ]);

  const navigateMiniCalendar = (direction: "prev" | "next") => {
    const newDate = new Date(miniCalendarDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setMiniCalendarDate(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setView({ ...view, currentDate: date });
  };

  const toggleCategory = (categoryId: string) => {
    setVisibleCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  // Generate mini calendar
  const currentMonth = miniCalendarDate.getMonth();
  const currentYear = miniCalendarDate.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const startDate = new Date(firstDay);
  // Adjust for Monday start (getDay() returns 0 for Sunday, 1 for Monday, etc.)
  const dayOfWeek = firstDay.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(startDate.getDate() - daysToSubtract);

  const calendarDays = [];
  const currentDay = new Date(startDate);

  for (let week = 0; week < 6; week++) {
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    calendarDays.push(weekDays);

    if (
      currentDay.getMonth() !== currentMonth &&
      weekDays[6].getMonth() !== currentMonth
    ) {
      break;
    }
  }

  const today = new Date();

  return (
    <div className={styles.sidebarContainer}>
      {/* Create button */}
      <div className={styles.createSection}>
        <DropdownMenu>
          <DropdownMenuTrigger className={styles.createButton}>
            <Plus />
            Создать
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={styles.dropdownContent}>
            <DropdownMenuItem
              onClick={() => setEventModalOpen(true)}
              className={styles.dropdownItem}
            >
              <Plus />
              Событие
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTaskModalOpen(true)}
              className={styles.dropdownItem}
            >
              <CheckSquare />
              Задача
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mini Calendar */}
      <div className={styles.miniCalendarSection}>
        <div className={styles.miniCalendarContainer}>
          {/* Mini calendar header */}
          <div className={styles.miniCalendarHeader}>
            <h3 className={styles.miniCalendarTitle}>
              {MONTHS[currentMonth]} {currentYear}
            </h3>
            <div className={styles.miniCalendarNav}>
              <button
                className={styles.miniNavButton}
                onClick={() => navigateMiniCalendar("prev")}
              >
                <ChevronLeft />
              </button>
              <button
                className={styles.miniNavButton}
                onClick={() => navigateMiniCalendar("next")}
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Mini calendar grid */}
          <div className={styles.miniCalendarGrid}>
            {/* Days header */}
            <div className={styles.miniCalendarWeek}>
              {DAYS_SHORT.map((day) => (
                <div key={day} className={styles.miniDayHeader}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            {calendarDays.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.miniCalendarWeek}>
                {week.map((date, dayIndex) => {
                  const isCurrentMonth = date.getMonth() === currentMonth;
                  const isToday =
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
                  const isSelected =
                    date.getDate() === view.currentDate.getDate() &&
                    date.getMonth() === view.currentDate.getMonth() &&
                    date.getFullYear() === view.currentDate.getFullYear();

                  return (
                    <button
                      key={`${weekIndex}-${dayIndex}`}
                      onClick={() => handleDateSelect(date)}
                      className={cn(
                        styles.miniDay,
                        isCurrentMonth
                          ? styles.currentMonth
                          : styles.otherMonth,
                        isToday && styles.today,
                        isSelected && !isToday && styles.selected,
                      )}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Calendars Section */}
      <div className={styles.sectionContainer}>
        <button
          onClick={() => setIsMyCalendarsExpanded(!isMyCalendarsExpanded)}
          className={cn(
            styles.sectionHeader,
            isMyCalendarsExpanded && styles.expanded,
          )}
        >
          {isMyCalendarsExpanded ? <ChevronDown /> : <ChevronRightSmall />}
          <span className={styles.sectionTitle}>Мои календари</span>
        </button>

        <div
          className={cn(
            styles.sectionList,
            isMyCalendarsExpanded ? styles.expanded : styles.collapsed,
          )}
        >
          {categoryColors.map((category) => (
            <div
              key={category.id}
              className={styles.listItem}
              style={{ "--item-color": category.color } as React.CSSProperties}
            >
              <Checkbox
                id={category.id}
                checked={visibleCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
                className={styles.listItemCheckbox}
              />
              <div className={styles.listItemColor} />
              <span className={styles.listItemLabel}>{category.label}</span>
              <button className={styles.listItemMenu} />
            </div>
          ))}
        </div>
      </div>

      {/* Task Lists Section */}
      <div className={styles.sectionContainer}>
        <button
          onClick={() => setIsTaskListsExpanded(!isTaskListsExpanded)}
          className={cn(
            styles.sectionHeader,
            isTaskListsExpanded && styles.expanded,
          )}
        >
          {isTaskListsExpanded ? <ChevronDown /> : <ChevronRightSmall />}
          <span className={styles.sectionTitle}>Задачи</span>
        </button>

        <div
          className={cn(
            styles.sectionList,
            isTaskListsExpanded ? styles.expanded : styles.collapsed,
          )}
        >
          {taskLists.map((list) => (
            <div
              key={list.id}
              className={styles.taskListItem}
              onClick={() => setTaskModalOpen(true)}
            >
              <CheckSquare />
              <div
                className={styles.taskListColor}
                style={{ backgroundColor: list.color }}
              />
              <span className={styles.taskListLabel}>{list.name}</span>
            </div>
          ))}
        </div>
      </div>

      <TaskModal />
    </div>
  );
}
