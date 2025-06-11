export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  category: "work" | "personal" | "meeting" | "reminder" | "other";
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CalendarView {
  type: "month" | "week" | "day";
  currentDate: Date;
}

export type CreateEventInput = Omit<
  CalendarEvent,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateEventInput = Partial<CreateEventInput> & { id: string };
