import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Layout/Navbar";
import { CalendarGrid } from "@/components/Calendar/CalendarGrid";
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">
        <CalendarGrid />
        <EventModal />
      </main>
    </div>
  );
}
