/**
 * Application configuration in JavaScript
 * These settings control various aspects of the calendar application
 */

// Environment configuration
export const ENV_CONFIG = {
  development: {
    apiBaseUrl: "http://localhost:3001/api",
    enableDebugMode: true,
    logLevel: "debug",
    hotReload: true,
  },
  production: {
    apiBaseUrl: "/api",
    enableDebugMode: false,
    logLevel: "error",
    hotReload: false,
  },
  test: {
    apiBaseUrl: "http://localhost:3001/api",
    enableDebugMode: true,
    logLevel: "warn",
    hotReload: false,
  },
};

// Calendar display settings
export const CALENDAR_CONFIG = {
  // Default view settings
  defaultView: "month",
  weekStartsOn: 1, // 0 = Sunday, 1 = Monday
  hoursFormat: 24, // 12 or 24 hour format

  // Time slots for day/week view
  timeSlots: {
    start: 0, // 00:00
    end: 24, // 24:00
    interval: 60, // minutes
    slotHeight: 60, // pixels per hour
  },

  // Event colors by category
  categoryColors: {
    work: "#7986cb",
    personal: "#039be5",
    meeting: "#33b679",
    reminder: "#f6bf26",
    other: "#f4511e",
  },

  // Date format settings
  dateFormats: {
    short: "d MMM",
    long: "d MMMM yyyy",
    time: "HH:mm",
    datetime: "d MMMM yyyy, HH:mm",
  },

  // Animation settings
  animations: {
    enabled: true,
    duration: 300, // milliseconds
    easing: "ease-in-out",
  },
};

// User interface settings
export const UI_CONFIG = {
  // Theme settings
  theme: {
    default: "light",
    storageKey: "calendar-theme",
    systemPreference: true,
  },

  // Language settings
  language: {
    default: "ru",
    available: ["ru", "en"],
    storageKey: "calendar-language",
  },

  // Sidebar settings
  sidebar: {
    defaultWidth: 256, // pixels
    collapsible: true,
    rememberState: true,
  },

  // Modal settings
  modals: {
    closeOnEscape: true,
    closeOnOverlayClick: true,
    animationDuration: 200,
  },

  // Toast notifications
  notifications: {
    position: "top-right",
    duration: 4000, // milliseconds
    maxVisible: 3,
  },
};

// Feature flags
export const FEATURE_FLAGS = {
  // Core features
  weeklyView: true,
  monthlyView: true,
  dailyView: false, // Coming soon

  // Advanced features
  recurringEvents: true,
  taskManagement: true,
  telegramIntegration: true,

  // Experimental features
  aiSuggestions: false,
  voiceCommands: false,
  calendarsSync: false,

  // Third-party integrations
  googleCalendarSync: false,
  outlookSync: false,
  appleCalendarSync: false,
};

// API configuration
export const API_CONFIG = {
  // Request settings
  timeout: 10000, // milliseconds
  retryAttempts: 3,
  retryDelay: 1000, // milliseconds

  // Cache settings
  cache: {
    enabled: true,
    defaultTTL: 300000, // 5 minutes
    maxSize: 100, // number of cached responses
  },

  // Rate limiting
  rateLimit: {
    requestsPerMinute: 60,
    burstLimit: 10,
  },

  // Authentication
  auth: {
    tokenStorageKey: "calendar-auth-token",
    refreshThreshold: 300, // seconds before expiry
    autoRefresh: true,
  },
};

// Telegram bot configuration
export const TELEGRAM_CONFIG = {
  botUsername: "@CalendarBot",
  features: {
    eventReminders: true,
    dailyDigest: true,
    weeklyDigest: true,
    eventInvites: true,
  },

  // Notification timing
  reminders: {
    beforeEvent: [15, 60, 1440], // minutes before event
    dailyDigestTime: "20:00",
    weeklyDigestDay: 0, // Sunday
    weeklyDigestTime: "10:00",
  },

  // Message settings
  messages: {
    language: "ru",
    timezone: "Europe/Moscow",
    dateFormat: "d MMMM yyyy",
  },
};

// Performance settings
export const PERFORMANCE_CONFIG = {
  // Virtualization
  virtualization: {
    enabled: true,
    itemHeight: 40,
    overscan: 5,
  },

  // Lazy loading
  lazyLoading: {
    enabled: true,
    threshold: 0.1, // 10% of viewport
    rootMargin: "50px",
  },

  // Debouncing
  debounce: {
    search: 300,
    resize: 150,
    scroll: 100,
  },

  // Memory management
  memory: {
    maxCachedEvents: 1000,
    maxCachedTasks: 500,
    cleanupInterval: 600000, // 10 minutes
  },
};

// Analytics and monitoring
export const ANALYTICS_CONFIG = {
  enabled: false, // Set to true in production
  provider: "google-analytics",

  // Events to track
  trackingEvents: {
    eventCreated: true,
    eventEdited: true,
    eventDeleted: true,
    taskCreated: true,
    taskCompleted: true,
    viewChanged: true,
    settingsChanged: true,
  },

  // Error tracking
  errorTracking: {
    enabled: true,
    provider: "sentry",
    sampleRate: 0.1, // 10% of errors
  },
};

// Security settings
export const SECURITY_CONFIG = {
  // Content Security Policy
  csp: {
    enabled: true,
    reportOnly: false,
  },

  // Session management
  session: {
    timeout: 86400000, // 24 hours
    extendOnActivity: true,
    warningBefore: 300000, // 5 minutes
  },

  // Input validation
  validation: {
    maxEventTitleLength: 200,
    maxEventDescriptionLength: 2000,
    maxTaskTitleLength: 100,
    allowedFileTypes: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
    maxFileSize: 10485760, // 10MB
  },
};

// Get configuration for current environment
export function getConfig() {
  const env = process.env.NODE_ENV || "development";
  return {
    env,
    ...ENV_CONFIG[env],
    calendar: CALENDAR_CONFIG,
    ui: UI_CONFIG,
    features: FEATURE_FLAGS,
    api: API_CONFIG,
    telegram: TELEGRAM_CONFIG,
    performance: PERFORMANCE_CONFIG,
    analytics: ANALYTICS_CONFIG,
    security: SECURITY_CONFIG,
  };
}

// Validate configuration
export function validateConfig(config) {
  const errors = [];

  // Validate required settings
  if (!config.api.timeout || config.api.timeout < 1000) {
    errors.push("API timeout must be at least 1000ms");
  }

  if (
    !config.calendar.timeSlots.interval ||
    config.calendar.timeSlots.interval < 15
  ) {
    errors.push("Time slot interval must be at least 15 minutes");
  }

  if (config.ui.notifications.duration < 1000) {
    errors.push("Notification duration must be at least 1000ms");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Export default configuration
export default getConfig();
