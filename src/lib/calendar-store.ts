import { create } from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";
import {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
  CalendarView,
} from "./types";

interface CalendarStore {
  events: CalendarEvent[];
  view: CalendarView;
  selectedEvent: CalendarEvent | null;
  isEventModalOpen: boolean;

  // Actions
  addEvent: (event: CreateEventInput) => void;
  updateEvent: (event: UpdateEventInput) => void;
  deleteEvent: (eventId: string) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setEventModalOpen: (open: boolean) => void;
  setView: (view: CalendarView) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForDateRange: (startDate: Date, endDate: Date) => CalendarEvent[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCalendar = create<CalendarStore>()(
  persist(
    (set, get) => ({
      events: [],
      view: {
        type: "month",
        currentDate: new Date(),
      },
      selectedEvent: null,
      isEventModalOpen: false,

      addEvent: (eventInput: CreateEventInput) => {
        const now = new Date();
        const event: CalendarEvent = {
          ...eventInput,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          events: [...state.events, event],
        }));
      },

      updateEvent: (eventUpdate: UpdateEventInput) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventUpdate.id
              ? { ...event, ...eventUpdate, updatedAt: new Date() }
              : event,
          ),
        }));
      },

      deleteEvent: (eventId: string) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== eventId),
        }));
      },

      setSelectedEvent: (event: CalendarEvent | null) => {
        set({ selectedEvent: event });
      },

      setEventModalOpen: (open: boolean) => {
        set({ isEventModalOpen: open });
        if (!open) {
          set({ selectedEvent: null });
        }
      },

      setView: (view: CalendarView) => {
        set({ view });
      },

      getEventsForDate: (date: Date) => {
        const events = get().events;
        return events.filter((event) => {
          const eventDate = new Date(event.startDate);
          return (
            eventDate.getFullYear() === date.getFullYear() &&
            eventDate.getMonth() === date.getMonth() &&
            eventDate.getDate() === date.getDate()
          );
        });
      },

      getEventsForDateRange: (startDate: Date, endDate: Date) => {
        const events = get().events;
        return events.filter((event) => {
          const eventStart = new Date(event.startDate);
          const eventEnd = new Date(event.endDate);
          return eventStart <= endDate && eventEnd >= startDate;
        });
      },
    }),
    {
      name: "calendar-storage",
      partialize: (state) => ({ events: state.events }),
    },
  ),
);
