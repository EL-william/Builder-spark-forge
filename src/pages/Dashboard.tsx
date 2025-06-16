import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, CheckSquare, TrendingUp, Clock } from "lucide-react";
import { Navbar } from "@/components/Layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventDigest } from "@/components/Calendar/EventDigest";
import { useAuth } from "@/lib/auth";
import { useCalendar } from "@/lib/calendar-store";
import { useTaskStore } from "@/lib/task-store";
import { format, addDays } from "date-fns";
import { ru } from "date-fns/locale";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const { events, getEventsForDate } = useCalendar();
  const { tasks, getPendingTasks, getCompletedTasks } = useTaskStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const todayEvents = getEventsForDate(today);
  const tomorrowEvents = getEventsForDate(tomorrow);
  const pendingTasks = getPendingTasks();
  const completedTasks = getCompletedTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-gray-900">
            Добро пожаловать! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Вот что у вас запланировано на{" "}
            {format(today, "d MMMM yyyy", { locale: ru })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                События сегодня
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                {tomorrowEvents.length} завтра
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Активные задачи
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {completedTasks.length} выполнено
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего событий
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">В календ��ре</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего задач</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground">Создано задач</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Быстрые действия
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/calendar">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Открыть календарь
                </span>
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/settings">Настройки</Link>
            </Button>
          </div>
        </div>

        {/* Event Digests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              События на завтра
            </h2>
            <EventDigest type="daily" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              План на неделю
            </h2>
            <EventDigest type="weekly" />
          </div>
        </div>
      </div>
    </div>
  );
}
