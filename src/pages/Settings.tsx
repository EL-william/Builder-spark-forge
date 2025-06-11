import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/Layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TelegramSettings } from "@/components/Settings/TelegramSettings";
import { useAuth } from "@/lib/auth";

export default function Settings() {
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-gray-900 flex items-center">
            <SettingsIcon className="h-8 w-8 mr-3" />
            Настройки
          </h1>
          <p className="text-gray-600 mt-2">
            Управляйте настройками календаря и уведомлений
          </p>
        </div>

        <Tabs defaultValue="telegram" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="telegram" className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Telegram
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Уведомления
            </TabsTrigger>
            <TabsTrigger value="timezone" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Часовой пояс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="telegram">
            <TelegramSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Настройки уведомлений
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600">
                  Настройки уведомлений будут доступны после подключения
                  Telegram бота.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timezone">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Часовой пояс
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600">
                  Настройки часового пояса будут применяться ко всем событиям и
                  задачам. Текущий часовой пояс:{" "}
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
