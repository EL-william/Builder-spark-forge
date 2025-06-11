import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-store";
import { CreateEventInput } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
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
  work: "#3b82f6",
  personal: "#10b981",
  meeting: "#8b5cf6",
  reminder: "#f59e0b",
  other: "#6b7280",
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
      category: "other",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const allDay = watch("allDay");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

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
        category: "other",
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
        title: "Event updated",
        description: "Your event has been updated successfully.",
      });
    } else {
      addEvent(eventData);
      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      });
    }

    setEventModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      toast({
        title: "Event deleted",
        description: "Your event has been deleted.",
      });
      setEventModalOpen(false);
    }
  };

  return (
    <Dialog open={isEventModalOpen} onOpenChange={setEventModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter event description (optional)"
              {...register("description")}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={watch("category")}
              onValueChange={(value) => setValue("category", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="allDay"
              checked={allDay}
              onCheckedChange={(checked) => setValue("allDay", checked)}
            />
            <Label htmlFor="allDay">All day event</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setValue("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setValue("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {!allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="startTime"
                    type="time"
                    className="pl-10"
                    {...register("startTime")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endTime">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="endTime"
                    type="time"
                    className="pl-10"
                    {...register("endTime")}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div>
              {selectedEvent && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Event
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEventModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedEvent ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
