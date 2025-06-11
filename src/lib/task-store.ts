import { create } from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";
import {
  Task,
  TaskList,
  CreateTaskInput,
  UpdateTaskInput,
  CreateTaskListInput,
  UpdateTaskListInput,
} from "./task-types";

interface TaskStore {
  tasks: Task[];
  taskLists: TaskList[];
  selectedTask: Task | null;
  isTaskModalOpen: boolean;
  isTaskListModalOpen: boolean;

  // Task actions
  addTask: (task: CreateTaskInput) => void;
  updateTask: (task: UpdateTaskInput) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  setSelectedTask: (task: Task | null) => void;
  setTaskModalOpen: (open: boolean) => void;

  // Task list actions
  addTaskList: (taskList: CreateTaskListInput) => void;
  updateTaskList: (taskList: UpdateTaskListInput) => void;
  deleteTaskList: (taskListId: string) => void;
  setTaskListModalOpen: (open: boolean) => void;

  // Getters
  getTasksByList: (listName: string) => Task[];
  getCompletedTasks: () => Task[];
  getPendingTasks: () => Task[];
  getTasksForDate: (date: Date) => Task[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Default task lists
const defaultTaskLists: TaskList[] = [
  {
    id: "1",
    name: "Мои задачи",
    color: "#039be5",
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Работа",
    color: "#7986cb",
    isDefault: false,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Личные",
    color: "#33b679",
    isDefault: false,
    createdAt: new Date(),
  },
];

// Sample tasks
const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Купить продукты",
    description: "Молоко, хлеб, яйца",
    completed: false,
    dueDate: new Date(2024, 11, 16),
    dueTime: "18:00",
    priority: "medium",
    list: "Мои задачи",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Отправить отчет",
    description: "Квартальный отчет для руководства",
    completed: false,
    dueDate: new Date(2024, 11, 20),
    priority: "high",
    list: "Работа",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Записаться к врачу",
    completed: true,
    priority: "low",
    list: "Личные",
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: new Date(),
  },
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: sampleTasks,
      taskLists: defaultTaskLists,
      selectedTask: null,
      isTaskModalOpen: false,
      isTaskListModalOpen: false,

      addTask: (taskInput: CreateTaskInput) => {
        const now = new Date();
        const task: Task = {
          ...taskInput,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },

      updateTask: (taskUpdate: UpdateTaskInput) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskUpdate.id
              ? { ...task, ...taskUpdate, updatedAt: new Date() }
              : task,
          ),
        }));
      },

      deleteTask: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },

      toggleTaskComplete: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  completed: !task.completed,
                  completedAt: !task.completed ? new Date() : undefined,
                  updatedAt: new Date(),
                }
              : task,
          ),
        }));
      },

      setSelectedTask: (task: Task | null) => {
        set({ selectedTask: task });
      },

      setTaskModalOpen: (open: boolean) => {
        set({ isTaskModalOpen: open });
        if (!open) {
          set({ selectedTask: null });
        }
      },

      addTaskList: (taskListInput: CreateTaskListInput) => {
        const now = new Date();
        const taskList: TaskList = {
          ...taskListInput,
          id: generateId(),
          createdAt: now,
        };

        set((state) => ({
          taskLists: [...state.taskLists, taskList],
        }));
      },

      updateTaskList: (taskListUpdate: UpdateTaskListInput) => {
        set((state) => ({
          taskLists: state.taskLists.map((list) =>
            list.id === taskListUpdate.id
              ? { ...list, ...taskListUpdate }
              : list,
          ),
        }));
      },

      deleteTaskList: (taskListId: string) => {
        const state = get();
        const taskList = state.taskLists.find((list) => list.id === taskListId);
        if (taskList?.isDefault) return; // Cannot delete default list

        set((state) => ({
          taskLists: state.taskLists.filter((list) => list.id !== taskListId),
          tasks: state.tasks.filter((task) => task.list !== taskList?.name),
        }));
      },

      setTaskListModalOpen: (open: boolean) => {
        set({ isTaskListModalOpen: open });
      },

      getTasksByList: (listName: string) => {
        const tasks = get().tasks;
        return tasks.filter((task) => task.list === listName);
      },

      getCompletedTasks: () => {
        const tasks = get().tasks;
        return tasks.filter((task) => task.completed);
      },

      getPendingTasks: () => {
        const tasks = get().tasks;
        return tasks.filter((task) => !task.completed);
      },

      getTasksForDate: (date: Date) => {
        const tasks = get().tasks;
        return tasks.filter((task) => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return (
            taskDate.getFullYear() === date.getFullYear() &&
            taskDate.getMonth() === date.getMonth() &&
            taskDate.getDate() === date.getDate()
          );
        });
      },
    }),
    {
      name: "task-storage",
      partialize: (state) => ({
        tasks: state.tasks,
        taskLists: state.taskLists,
      }),
    },
  ),
);
