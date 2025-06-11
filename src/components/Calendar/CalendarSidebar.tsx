import { useState } from "react";
import { CalendarDays, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCalendar } from "@/lib/calendar-store";

const categoryFilters = [
  { id: "work", label: "Work", color: "#3b82f6" },
  { id: "personal", label: "Personal", color: "#10b981" },
  { id: "meeting", label: "Meeting", color: "#8b5cf6" },
  { id: "reminder", label: "Reminder", color: "#f59e0b" },
  { id: "other", label: "Other", color: "#6b7280" },
];

export function CalendarSidebar() {
  const { view, setView, setEventModalOpen } = useCalendar();
  const [visibleCategories, setVisibleCategories] = useState<string[]>([
    "work",
    "personal",
    "meeting",
    "reminder",
    "other",
  ]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setView({ ...view, currentDate: date });
    }
  };

  const toggleCategory = (categoryId: string) => {
    setVisibleCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 space-y-6">
      {/* Create Event Button */}
      <Button
        onClick={() => setEventModalOpen(true)}
        className="w-full"
        size="lg"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Event
      </Button>

      {/* Mini Calendar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <CalendarDays className="h-4 w-4 mr-2" />
            Quick Navigation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <Calendar
            mode="single"
            selected={view.currentDate}
            onSelect={handleDateSelect}
            className="rounded-md border-0"
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Category Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Event Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categoryFilters.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={visibleCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-normal cursor-pointer"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* View Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant={view.type === "month" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setView({ ...view, type: "month" })}
            >
              Month
            </Button>
            <Button
              variant={view.type === "week" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setView({ ...view, type: "week" })}
            >
              Week
            </Button>
            <Button
              variant={view.type === "day" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setView({ ...view, type: "day" })}
            >
              Day
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
