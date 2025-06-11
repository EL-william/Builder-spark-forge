import { Calendar, Menu, Settings, HelpCircle, Grid3x3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center px-6 relative z-50">
      <div className="flex items-center w-full">
        {/* Left section - Hamburger menu and Logo */}
        <div className="flex items-center space-x-4 min-w-0 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>

          <Link to="/calendar" className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-gray-700" />
            <span className="text-xl text-gray-700 font-normal hidden sm:block">
              Calendar
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1 ml-8">
            <Button
              variant="ghost"
              asChild
              className="text-gray-700 hover:bg-gray-100"
            >
              <Link to="/dashboard">Панель</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="text-gray-700 hover:bg-gray-100"
            >
              <Link to="/calendar">Календарь</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="text-gray-700 hover:bg-gray-100"
            >
              <Link to="/settings">Настройки</Link>
            </Button>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Поиск"
              className="w-full h-12 pl-16 pr-4 bg-gray-50 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Grid3x3 className="h-5 w-5 text-gray-600" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-gray-100 ml-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
              <div className="p-6 text-center border-b">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarFallback className="bg-blue-600 text-white text-2xl font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-lg font-medium text-gray-900">
                  {user.name}
                </div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Управление аккау��том Google
                </Button>
              </div>

              <div className="p-2">
                <DropdownMenuItem className="h-12 px-4 text-gray-700 hover:bg-gray-50">
                  Добавить ещё один аккаунт
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="h-12 px-4 text-gray-700 hover:bg-gray-50"
                  onClick={logout}
                >
                  Выйти
                </DropdownMenuItem>
              </div>

              <div className="p-4 border-t bg-gray-50 text-xs text-gray-600 text-center">
                <div className="flex justify-center space-x-4">
                  <a href="#" className="hover:text-gray-800">
                    Конфиденциальность
                  </a>
                  <a href="#" className="hover:text-gray-800">
                    Условия
                  </a>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
