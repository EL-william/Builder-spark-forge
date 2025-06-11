export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  dueTime?: string;
  priority: "low" | "medium" | "high";
  list: string; // task list name
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
}

export type CreateTaskInput = Omit<
  Task,
  "id" | "createdAt" | "updatedAt" | "completedAt"
>;
export type UpdateTaskInput = Partial<CreateTaskInput> & { id: string };

export type CreateTaskListInput = Omit<TaskList, "id" | "createdAt">;
export type UpdateTaskListInput = Partial<CreateTaskListInput> & { id: string };
