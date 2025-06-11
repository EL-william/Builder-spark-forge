import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CalendarGrid } from "./CalendarGrid";
import { useCalendar } from "@/lib/calendar-store";

// Mock the calendar store
vi.mock("@/lib/calendar-store", () => ({
  useCalendar: vi.fn(() => ({
    view: { type: "month", currentDate: new Date(2024, 11, 15) },
    setView: vi.fn(),
    getEventsForDate: vi.fn(() => []),
    setEventModalOpen: vi.fn(),
    setSelectedEvent: vi.fn(),
  })),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("CalendarGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders calendar grid correctly", () => {
    renderWithRouter(<CalendarGrid />);

    // Check if month header is rendered
    expect(screen.getByText(/Декабрь 2024/)).toBeInTheDocument();

    // Check if "Today" button is rendered
    expect(screen.getByText("Сегодня")).toBeInTheDocument();

    // Check if days of week are rendered
    expect(screen.getByText("Вс")).toBeInTheDocument();
    expect(screen.getByText("Пн")).toBeInTheDocument();
    expect(screen.getByText("Сб")).toBeInTheDocument();
  });

  it("navigates to previous month when previous button is clicked", () => {
    const mockSetView = vi.fn();
    const mockUseCalendar = useCalendar as any;
    mockUseCalendar.mockReturnValue({
      view: { type: "month", currentDate: new Date(2024, 11, 15) },
      setView: mockSetView,
      getEventsForDate: vi.fn(() => []),
      setEventModalOpen: vi.fn(),
      setSelectedEvent: vi.fn(),
    });

    renderWithRouter(<CalendarGrid />);

    const prevButton = screen.getAllByRole("button")[0]; // First button should be prev
    fireEvent.click(prevButton);

    expect(mockSetView).toHaveBeenCalled();
  });

  it("opens event modal when day is clicked", () => {
    const mockSetEventModalOpen = vi.fn();
    const mockUseCalendar = useCalendar as any;
    mockUseCalendar.mockReturnValue({
      view: { type: "month", currentDate: new Date(2024, 11, 15) },
      setView: vi.fn(),
      getEventsForDate: vi.fn(() => []),
      setEventModalOpen: mockSetEventModalOpen,
      setSelectedEvent: vi.fn(),
    });

    renderWithRouter(<CalendarGrid />);

    // Find a day cell and click it
    const dayCell = screen.getByText("15");
    fireEvent.click(dayCell.closest("div")!);

    expect(mockSetEventModalOpen).toHaveBeenCalledWith(true);
  });
});
