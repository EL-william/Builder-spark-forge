import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCalendar } from "@/lib/calendar-store";
import { useTaskStore } from "@/lib/task-store";
import { CalendarEvent } from "@/lib/types";
import { Task } from "@/lib/task-types";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import { ru } from "date-fns/locale";

interface DigestProps {
  type: "daily" | "weekly";
  date?: Date;
}

export function EventDigest({ type, date = new Date() }: DigestProps) {
  const { getEventsForDateRange, getEventsForDate } = useCalendar();
  const { getTasksForDate, getPendingTasks } = useTaskStore();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (type === "daily") {
      const tomorrow = addDays(date, 1);
      setEvents(getEventsForDate(tomorrow));
      setTasks(getTasksForDate(tomorrow));
    } else {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      setEvents(getEventsForDateRange(weekStart, weekEnd));
      setTasks(
        getPendingTasks().filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) >= weekStart &&
            new Date(task.dueDate) <= weekEnd,
        ),
      );
    }
  }, [
    type,
    date,
    getEventsForDate,
    getEventsForDateRange,
    getTasksForDate,
    getPendingTasks,
  ]);

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

  const getPriorityColor = (priority: Task["priority"]) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[priority];
  };

  const groupEventsByDate = (events: CalendarEvent[]) => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    events.forEach((event) => {
      const dateKey = format(new Date(event.startDate), "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  };

  const formatTime = (event: CalendarEvent) => {
    if (event.allDay) return "Весь день";
    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    return event.startTime || "";
  };

  if (type === "daily") {
    const tomorrow = addDays(date, 1);

    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            События на завтра
            <span className="ml-2 text-lg font-normal text-gray-600">
              {format(tomorrow, "d MMMM", { locale: ru })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {events.length === 0 && tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>На завтра пока ничего не запланировано</p>
              <p className="text-sm">Хорошее время для отдыха! 🎉</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Events */}
              {events.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    События ({events.length})
                  </h4>
                  <div className="space-y-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                          style={{
                            backgroundColor: getCategoryColor(event.category),
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900 truncate">
                            {event.title}
                          </h5>
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(event)}
                            {event.description && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="truncate">
                                  {event.description}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {tasks.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Задачи ({tasks.length})
                  </h4>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <h5 className="font-medium text-gray-900 truncate mr-2">
                              {task.title}
                            </h5>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority === "high"
                                ? "Высокий"
                                : task.priority === "medium"
                                  ? "Средний"
                                  : "Низкий"}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1 truncate">
                              {task.description}
                            </p>
                          )}
                          {task.dueTime && (
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.dueTime}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Weekly digest
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const groupedEvents = groupEventsByDate(events);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          План на неделю
          <span className="ml-2 text-lg font-normal text-gray-600">
            {format(weekStart, "d MMM", { locale: ru })} -{" "}
            {format(weekEnd, "d MMM", { locale: ru })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 && tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>На этой неделе пока ничего не запланировано</p>
          </div>
        ) : (
          <div className="space-y-4">
            {weekDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayEvents = groupedEvents[dateKey] || [];
              const dayTasks = tasks.filter(
                (task) =>
                  task.dueDate &&
                  format(new Date(task.dueDate), "yyyy-MM-dd") === dateKey,
              );

              if (dayEvents.length === 0 && dayTasks.length === 0) return null;

              return (
                <div key={dateKey} className="border-l-4 border-blue-200 pl-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {format(day, "EEEE, d MMMM", { locale: ru })}
                  </h4>

                  <div className="space-y-2">
                    {dayEvents.map((event) => (
                      <div key={event.id} className="flex items-center text-sm">
                        <div
                          className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                          style={{
                            backgroundColor: getCategoryColor(event.category),
                          }}
                        />
                        <span className="font-medium mr-2">
                          {formatTime(event)}
                        </span>
                        <span className="text-gray-700">{event.title}</span>
                      </div>
                    ))}

                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center text-sm ml-5"
                      >
                        <span className="text-gray-500 mr-2">☐</span>
                        <span className="text-gray-700">{task.title}</span>
                        {task.dueTime && (
                          <span className="text-gray-500 ml-2">
                            ({task.dueTime})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
