import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Clock, MapPin, Trash2, Edit3, Users, Copy } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-store";
import { CreateEventInput } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const eventSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  allDay: z.boolean(),
  category: z.enum(["work", "personal", "meeting", "reminder", "other"]),
});

type EventForm = z.infer<typeof eventSchema>;

const categoryColors = {
  work: "#7986cb",
  personal: "#039be5",
  meeting: "#33b679",
  reminder: "#f6bf26",
  other: "#f4511e",
};

const categoryLabels = {
  work: "Работа",
  personal: "Личные",
  meeting: "Встречи",
  reminder: "Напоминания",
  other: "Другие",
};

export function EventModal() {
  const {
    isEventModalOpen,
    setEventModalOpen,
    selectedEvent,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useCalendar();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      allDay: false,
      category: "personal",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const allDay = watch("allDay");
  const category = watch("category");

  useEffect(() => {
    if (selectedEvent) {
      // Editing existing event
      reset({
        title: selectedEvent.title,
        description: selectedEvent.description || "",
        startDate: new Date(selectedEvent.startDate),
        endDate: new Date(selectedEvent.endDate),
        startTime: selectedEvent.startTime || "",
        endTime: selectedEvent.endTime || "",
        allDay: selectedEvent.allDay,
        category: selectedEvent.category,
      });
    } else {
      // Creating new event
      const today = new Date();
      reset({
        title: "",
        description: "",
        startDate: today,
        endDate: today,
        startTime: "09:00",
        endTime: "10:00",
        allDay: false,
        category: "personal",
      });
    }
  }, [selectedEvent, reset]);

  const onSubmit = (data: EventForm) => {
    const eventData: CreateEventInput = {
      ...data,
      color: categoryColors[data.category],
    };

    if (selectedEvent) {
      updateEvent({ ...eventData, id: selectedEvent.id });
      toast({
        title: "Мероприятие обновлено",
        description: "Ваше мероприятие успешно обновлено.",
      });
    } else {
      addEvent(eventData);
      toast({
        title: "Мероприятие создано",
        description: "Ваше мероприятие успешно создано.",
      });
    }

    setEventModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      toast({
        title: "Мероприятие удалено",
        description: "Ваше мероприятие было удалено.",
      });
      setEventModalOpen(false);
    }
  };

  return (
    <Dialog open={isEventModalOpen} onOpenChange={setEventModalOpen}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: categoryColors[category] }}
            />
            <h2 className="text-lg font-medium">
              {selectedEvent ? "Изменить мероприятие" : "Новое мероприятие"}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEventModalOpen(false)}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="px-6 py-4 space-y-6 flex-1">
            {/* Title */}
            <div>
              <Input
                placeholder="Добавить название"
                {...register("title")}
                className="text-lg border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Time section */}
            <div className="flex items-start space-x-4">
              <Clock className="h-5 w-5 text-gray-400 mt-3" />
              <div className="flex-1 space-y-4">
                {/* All day toggle */}
                <div className="flex items-center space-x-3">
                  <Switch
                    id="allDay"
                    checked={allDay}
                    onCheckedChange={(checked) => setValue("allDay", checked)}
                  />
                  <Label htmlFor="allDay" className="text-sm">
                    Весь день
                  </Label>
                </div>

                {/* Date inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="date"
                      {...register("startDate", {
                        setValueAs: (value) =>
                          value ? new Date(value) : new Date(),
                      })}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      {...register("endDate", {
                        setValueAs: (value) =>
                          value ? new Date(value) : new Date(),
                      })}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Time inputs (only if not all day) */}
                {!allDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="time"
                      {...register("startTime")}
                      className="text-sm"
                    />
                    <Input
                      type="time"
                      {...register("endTime")}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-4">
              <MapPin className="h-5 w-5 text-gray-400 mt-3" />
              <div className="flex-1">
                <Input
                  placeholder="Добавить место"
                  className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start space-x-4">
              <Edit3 className="h-5 w-5 text-gray-400 mt-3" />
              <div className="flex-1">
                <Textarea
                  placeholder="Добавить описание"
                  {...register("description")}
                  className="border-0 p-0 min-h-[60px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Category/Calendar */}
            <div className="flex items-center space-x-4">
              <div className="w-5 h-5" /> {/* Spacer */}
              <div className="flex-1">
                <Select
                  value={category}
                  onValueChange={(value) => setValue("category", value as any)}
                >
                  <SelectTrigger className="w-full border-0 p-0 h-auto focus:ring-0 focus:ring-offset-0">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: categoryColors[category] }}
                      />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{
                              backgroundColor:
                                categoryColors[
                                  key as keyof typeof categoryColors
                                ],
                            }}
                          />
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="flex items-center space-x-2">
              {selectedEvent && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-gray-600 hover:text-red-600 h-9 px-3"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEventModalOpen(false)}
                className="h-9 px-4"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="h-9 px-6 bg-blue-600 hover:bg-blue-700"
              >
                Сохранить
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
