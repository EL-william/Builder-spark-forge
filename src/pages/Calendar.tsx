import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Layout/Navbar";
import { CalendarGrid } from "@/components/Calendar/CalendarGrid";
import { CalendarSidebar } from "@/components/Calendar/CalendarSidebar";
import { EventModal } from "@/components/Calendar/EventModal";
import { useAuth } from "@/lib/auth";

export default function Calendar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <CalendarSidebar />
        <CalendarGrid />
        <EventModal />
      </div>
    </div>
  );
}
