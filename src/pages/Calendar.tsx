import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Layout/Navbar";
import { CalendarGrid } from "@/components/Calendar/CalendarGrid";
import { CalendarSidebar } from "@/components/Calendar/CalendarSidebar";
import { EventModal } from "@/components/Calendar/EventModal";
import { useAuth } from "@/lib/auth";
import styles from "./Calendar.module.scss";

export default function Calendar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.calendarContainer}>
      <Navbar />
      <div className={styles.calendarLayout}>
        <CalendarSidebar />
        <main className={styles.calendarMain}>
          <CalendarGrid />
          <EventModal />
        </main>
      </div>
    </div>
  );
}
