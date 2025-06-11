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

const DAYS_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
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
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

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
    <div className="w-64 bg-white h-full overflow-y-auto">
      {/* Create button */}
      <div className="p-6 pb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-14 text-base font-medium shadow-md hover:shadow-lg transition-all">
              <Plus className="h-5 w-5 mr-3" />
              Создать
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => setEventModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Событие
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTaskModalOpen(true)}>
              <CheckSquare className="h-4 w-4 mr-2" />
              Задача
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mini Calendar */}
      <div className="px-4 pb-6">
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          {/* Mini calendar header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              {MONTHS[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                onClick={() => navigateMiniCalendar("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                onClick={() => navigateMiniCalendar("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mini calendar grid */}
          <div className="space-y-1">
            {/* Days header */}
            <div className="grid grid-cols-7 gap-0">
              {DAYS_SHORT.map((day) => (
                <div
                  key={day}
                  className="text-xs text-gray-600 text-center py-1 font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            {calendarDays.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-0">
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
                      className={`
                        h-8 w-8 text-xs rounded-full hover:bg-gray-100 transition-colors
                        ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                        ${isToday ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                        ${isSelected && !isToday ? "bg-blue-100 text-blue-600" : ""}
                      `}
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
      <div className="px-4">
        <div className="mb-4">
          <button
            onClick={() => setIsMyCalendarsExpanded(!isMyCalendarsExpanded)}
            className="flex items-center w-full text-left py-2 px-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            {isMyCalendarsExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-600 mr-2" />
            ) : (
              <ChevronRightSmall className="h-4 w-4 text-gray-600 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-900">
              Мои календари
            </span>
          </button>

          {isMyCalendarsExpanded && (
            <div className="ml-6 mt-2 space-y-1">
              {categoryColors.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center py-1 px-2 hover:bg-gray-50 rounded-md group"
                >
                  <Checkbox
                    id={category.id}
                    checked={visibleCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                    className="mr-3 data-[state=checked]:bg-white data-[state=checked]:border-gray-400"
                    style={{
                      accentColor: category.color,
                    }}
                  />
                  <div
                    className="w-3 h-3 rounded-sm mr-3 flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {category.label}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-full"
                  >
                    <span className="text-gray-500 text-xs">⋮</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Lists Section */}
      <div className="px-4 pb-4">
        <div className="mb-4">
          <button
            onClick={() => setIsTaskListsExpanded(!isTaskListsExpanded)}
            className="flex items-center w-full text-left py-2 px-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            {isTaskListsExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-600 mr-2" />
            ) : (
              <ChevronRightSmall className="h-4 w-4 text-gray-600 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-900">Задачи</span>
          </button>

          {isTaskListsExpanded && (
            <div className="ml-6 mt-2 space-y-1">
              {taskLists.map((list) => (
                <div
                  key={list.id}
                  className="flex items-center py-1 px-2 hover:bg-gray-50 rounded-md group cursor-pointer"
                  onClick={() => setTaskModalOpen(true)}
                >
                  <CheckSquare className="h-4 w-4 mr-3 text-gray-600" />
                  <div
                    className="w-3 h-3 rounded-sm mr-3 flex-shrink-0"
                    style={{ backgroundColor: list.color }}
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {list.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskModal />
    </div>
  );
}
