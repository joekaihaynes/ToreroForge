// App-wide settings, read from environment variables (see frontend/.env.example).
// Vite only exposes variables that start with VITE_.

export const config = {
  // 'mock' = local fixtures (Semester 1). 'live' = the Node.js API.
  dataSource: import.meta.env.VITE_DATA_SOURCE ?? 'mock',
  // Base URL of the Node.js API, used when dataSource is 'live'.
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
};

export const isLive = config.dataSource === 'live';