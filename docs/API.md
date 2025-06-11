# API Документация - Календарь

## Обзор

REST API для управления календарными событиями, задачами и пользователями.

**Base URL:** `http://localhost:3001/api`

## Аутентификация

Все запросы (кроме регистрации/входа) требуют JWT токен в заголовке:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Аутентификация

#### POST /auth/register

Регистрация нового пользователя

**Запрос:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Ответ:**

```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "token": "string"
}
```

#### POST /auth/login

Вход пользователя

**Запрос:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Ответ:**

```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "token": "string"
}
```

### События

#### GET /events

Получить все события пользователя

**Query параметры:**

- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Ответ:**

```json
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "startDate": "2024-01-01T09:00:00Z",
      "endDate": "2024-01-01T10:00:00Z",
      "startTime": "09:00",
      "endTime": "10:00",
      "allDay": false,
      "category": "work|personal|meeting|reminder|other",
      "color": "#3b82f6",
      "isRecurring": false,
      "recurrence": {
        "frequency": "daily|weekly|monthly|yearly",
        "interval": 1,
        "endDate": "2024-12-31T23:59:59Z"
      },
      "timezone": "Europe/Moscow",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /events

Создать новое событие

**Запрос:**

```json
{
  "title": "string",
  "description": "string",
  "startDate": "2024-01-01T09:00:00Z",
  "endDate": "2024-01-01T10:00:00Z",
  "startTime": "09:00",
  "endTime": "10:00",
  "allDay": false,
  "category": "work",
  "color": "#3b82f6",
  "isRecurring": false,
  "recurrence": {
    "frequency": "weekly",
    "interval": 1
  },
  "timezone": "Europe/Moscow"
}
```

#### PUT /events/:id

Обновить событие

#### DELETE /events/:id

Удалить событие

### Задачи

#### GET /tasks

Получить все задачи пользователя

**Ответ:**

```json
{
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "completed": false,
      "dueDate": "2024-01-01T09:00:00Z",
      "dueTime": "09:00",
      "priority": "low|medium|high",
      "list": "string",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /tasks

Создать новую задачу

#### PUT /tasks/:id

Обновить задачу

#### DELETE /tasks/:id

Удалить задачу

#### PATCH /tasks/:id/toggle

Переключить статус выполнения задачи

### Списки задач

#### GET /task-lists

Получить все списки задач

#### POST /task-lists

Создать новый список

#### PUT /task-lists/:id

Обновить список

#### DELETE /task-lists/:id

Удалить список

### Telegram интеграция

#### POST /telegram/connect

Подключить Telegram бот

**Запрос:**

```json
{
  "authCode": "string"
}
```

#### DELETE /telegram/disconnect

Отключить Telegram бот

#### PUT /telegram/settings

Обновить настройки уведомлений

**Запрос:**

```json
{
  "eventReminders": true,
  "dailyDigest": true,
  "weeklyDigest": true,
  "eventInvites": true
}
```

## Коды ошибок

- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Не найдено
- `409` - Конфликт (например, email уже существует)
- `500` - Внутренняя ошибка сервера

## Формат ошибок

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```
