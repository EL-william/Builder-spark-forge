import { Calendar, Menu, Settings, HelpCircle, Grid3x3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import styles from "./Navbar.module.scss";

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* Left section - Hamburger menu and Logo */}
        <div className={styles.navbarLeft}>
          <button className={styles.menuButton}>
            <Menu />
          </button>

          <Link to="/calendar" className={styles.logoLink}>
            <Calendar />
            <span className={styles.logoText}>Calendar</span>
          </Link>

          <div className={styles.navLinks}>
            <Link to="/dashboard" className={styles.navLink}>
              Панель
            </Link>
            <Link to="/calendar" className={styles.navLink}>
              Календарь
            </Link>
            <Link to="/settings" className={styles.navLink}>
              Настройки
            </Link>
          </div>
        </div>

        {/* Center section - Search */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <Input
              type="text"
              placeholder="Поиск"
              className={styles.searchInput}
            />
            <div className={styles.searchIcon}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right section - Settings, Help, Apps, Profile */}
        <div className={styles.navbarRight}>
          <button className={styles.iconButton}>
            <HelpCircle />
          </button>

          <button className={styles.iconButton}>
            <Settings />
          </button>

          <button className={styles.iconButton}>
            <Grid3x3 />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={styles.profileButton}>
                <Avatar className={styles.avatar}>
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={styles.dropdownContent}
              align="end"
              forceMount
            >
              <div className={styles.profileHeader}>
                <Avatar className={styles.profileAvatar}>
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={styles.profileName}>{user.name}</div>
                <div className={styles.profileEmail}>{user.email}</div>
                <Button
                  variant="outline"
                  size="sm"
                  className={styles.manageButton}
                >
                  Управление аккаунтом Google
                </Button>
              </div>

              <div className={styles.dropdownMenu}>
                <DropdownMenuItem className={styles.dropdownItem}>
                  Добавить ещё один аккаунт
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={styles.dropdownItem}
                  onClick={logout}
                >
                  Выйти
                </DropdownMenuItem>
              </div>

              <div className={styles.dropdownFooter}>
                <div className={styles.footerLinks}>
                  <a href="#">Конфиденциальность</a>
                  <a href="#">Условия</a>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
