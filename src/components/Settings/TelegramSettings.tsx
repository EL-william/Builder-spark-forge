import { useState } from "react";
import { MessageCircle, Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface TelegramSettings {
  isConnected: boolean;
  botUsername: string;
  chatId?: string;
  notifications: {
    eventReminders: boolean;
    dailyDigest: boolean;
    weeklyDigest: boolean;
    eventInvites: boolean;
  };
}

export function TelegramSettings() {
  const [settings, setSettings] = useState<TelegramSettings>({
    isConnected: false,
    botUsername: "@CalendarBot",
    notifications: {
      eventReminders: true,
      dailyDigest: true,
      weeklyDigest: true,
      eventInvites: true,
    },
  });

  const [authCode, setAuthCode] = useState("");
  const { toast } = useToast();

  const handleConnect = () => {
    if (authCode.length >= 6) {
      setSettings((prev) => ({
        ...prev,
        isConnected: true,
        chatId: "123456789",
      }));
      toast({
        title: "Telegram подключен!",
        description: "Теперь вы будете получать уведомления в Telegram.",
      });
      setAuthCode("");
    }
  };

  const handleDisconnect = () => {
    setSettings((prev) => ({
      ...prev,
      isConnected: false,
      chatId: undefined,
    }));
    toast({
      title: "Telegram отключен",
      description: "Уведомления в Telegram больше не будут отправляться.",
    });
  };

  const copyBotUsername = () => {
    navigator.clipboard.writeText(settings.botUsername);
    toast({
      title: "Скопировано!",
      description: "Имя бота скопировано в буфер обмена.",
    });
  };

  const updateNotificationSetting = (
    key: keyof TelegramSettings["notifications"],
    value: boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
            Интеграция с Telegram
            {settings.isConnected && (
              <Badge
                variant="secondary"
                className="ml-2 bg-green-100 text-green-800"
              >
                <Check className="h-3 w-3 mr-1" />
                Подключено
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!settings.isConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">
                  Как подключить Telegram:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                  <li>
                    Найдите бота в Telegram:{" "}
                    <code className="bg-white px-1 rounded">
                      {settings.botUsername}
                    </code>
                  </li>
                  <li>Нажмите "Старт" или отправьте команду /start</li>
                  <li>Скопируйте код авторизации, который отправит бот</li>
                  <li>Вставьте код в поле ниже</li>
                </ol>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  value={settings.botUsername}
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={copyBotUsername}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://t.me/${settings.botUsername.replace("@", "")}`,
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="authCode">Код авторизации</Label>
                <div className="flex space-x-2">
                  <Input
                    id="authCode"
                    placeholder="Введите код от бота"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleConnect}
                    disabled={authCode.length < 6}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Под��лючить
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-900">
                      Telegram успешно подключен
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      Chat ID:{" "}
                      <code className="bg-white px-1 rounded">
                        {settings.chatId}
                      </code>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Отключить
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {settings.isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Настройки уведомлений</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="eventReminders">Напоминания о событиях</Label>
                <p className="text-sm text-gray-600">
                  Получать уведомления за 15 минут до события
                </p>
              </div>
              <Switch
                id="eventReminders"
                checked={settings.notifications.eventReminders}
                onCheckedChange={(checked) =>
                  updateNotificationSetting("eventReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dailyDigest">Ежедневный дайджест</Label>
                <p className="text-sm text-gray-600">
                  Сводка событий на завтра каждый вечер в 20:00
                </p>
              </div>
              <Switch
                id="dailyDigest"
                checked={settings.notifications.dailyDigest}
                onCheckedChange={(checked) =>
                  updateNotificationSetting("dailyDigest", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyDigest">Еженедельный дайджест</Label>
                <p className="text-sm text-gray-600">
                  Сводка событий на неделю каждое воскресенье
                </p>
              </div>
              <Switch
                id="weeklyDigest"
                checked={settings.notifications.weeklyDigest}
                onCheckedChange={(checked) =>
                  updateNotificationSetting("weeklyDigest", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="eventInvites">Приглашения на события</Label>
                <p className="text-sm text-gray-600">
                  Уведомления о новых приглашениях на события
                </p>
              </div>
              <Switch
                id="eventInvites"
                checked={settings.notifications.eventInvites}
                onCheckedChange={(checked) =>
                  updateNotificationSetting("eventInvites", checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
