import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Trash2, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/lib/task-store";
import { CreateTaskInput } from "@/lib/task-types";
import { useToast } from "@/hooks/use-toast";

const taskSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  dueTime: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  list: z.string().min(1, "Выберите список"),
});

type TaskForm = z.infer<typeof taskSchema>;

export function TaskModal() {
  const {
    isTaskModalOpen,
    setTaskModalOpen,
    selectedTask,
    addTask,
    updateTask,
    deleteTask,
    taskLists,
  } = useTaskStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "medium",
      list: "Мои задачи",
    },
  });

  const dueDate = watch("dueDate");
  const priority = watch("priority");

  useEffect(() => {
    if (selectedTask) {
      reset({
        title: selectedTask.title,
        description: selectedTask.description || "",
        dueDate: selectedTask.dueDate
          ? new Date(selectedTask.dueDate)
          : undefined,
        dueTime: selectedTask.dueTime || "",
        priority: selectedTask.priority,
        list: selectedTask.list,
      });
    } else {
      reset({
        title: "",
        description: "",
        dueDate: undefined,
        dueTime: "",
        priority: "medium",
        list: "Мои задачи",
      });
    }
  }, [selectedTask, reset]);

  const onSubmit = (data: TaskForm) => {
    const taskData: CreateTaskInput = {
      ...data,
      completed: false,
    };

    if (selectedTask) {
      updateTask({ ...taskData, id: selectedTask.id });
      toast({
        title: "Задача обновлена",
        description: "Ваша задача успешно обновлена.",
      });
    } else {
      addTask(taskData);
      toast({
        title: "Задача создана",
        description: "Ваша задача успешно создана.",
      });
    }

    setTaskModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      toast({
        title: "Задача удалена",
        description: "Ваша задача была удалена.",
      });
      setTaskModalOpen(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "text-gray-600",
      medium: "text-yellow-600",
      high: "text-red-600",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      low: "Низкий приоритет",
      medium: "Средний приоритет",
      high: "Высокий приоритет",
    };
    return labels[priority as keyof typeof labels] || labels.medium;
  };

  return (
    <Dialog open={isTaskModalOpen} onOpenChange={setTaskModalOpen}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-medium">
            {selectedTask ? "Изменить задачу" : "Новая задача"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTaskModalOpen(false)}
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
                placeholder="Название задачи"
                {...register("title")}
                className="text-lg border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Textarea
                placeholder="Описание (необязательно)"
                {...register("description")}
                className="border-0 p-0 min-h-[60px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
              />
            </div>

            {/* Due date and time */}
            <div className="flex items-start space-x-4">
              <Calendar className="h-5 w-5 text-gray-400 mt-3" />
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">
                      Срок выполнения
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground",
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dueDate
                            ? format(dueDate, "d MMMM", { locale: ru })
                            : "Выбрать дату"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarPicker
                          mode="single"
                          selected={dueDate}
                          onSelect={(date) => setValue("dueDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Время</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="time"
                        {...register("dueTime")}
                        className="pl-10"
                        disabled={!dueDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center space-x-4">
              <div className="w-5 h-5" /> {/* Spacer */}
              <div className="flex-1">
                <Label className="text-sm text-gray-600">Приоритет</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setValue("priority", value as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <span className="text-gray-600">Низкий приоритет</span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className="text-yellow-600">Средний приоритет</span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className="text-red-600">Высокий приоритет</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Task List */}
            <div className="flex items-center space-x-4">
              <div className="w-5 h-5" /> {/* Spacer */}
              <div className="flex-1">
                <Label className="text-sm text-gray-600">Список</Label>
                <Select
                  value={watch("list")}
                  onValueChange={(value) => setValue("list", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskLists.map((list) => (
                      <SelectItem key={list.id} value={list.name}>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: list.color }}
                          />
                          <span>{list.name}</span>
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
              {selectedTask && (
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
                onClick={() => setTaskModalOpen(false)}
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
