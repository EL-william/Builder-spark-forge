export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number; // every N days/weeks/months/years
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc. (for weekly)
  dayOfMonth?: number; // for monthly
  monthOfYear?: number; // for yearly
  endDate?: Date;
  count?: number; // number of occurrences
}

export interface RecurringEvent {
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
  recurrence: RecurrenceRule;
  exceptions?: Date[]; // dates to exclude
  createdAt: Date;
  updatedAt: Date;
}

export type CreateRecurringEventInput = Omit<
  RecurringEvent,
  "id" | "createdAt" | "updatedAt"
>;

export interface GeneratedEventInstance {
  id: string;
  parentId: string;
  instanceDate: Date;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  category: "work" | "personal" | "meeting" | "reminder" | "other";
  color: string;
  isRecurring: true;
}
