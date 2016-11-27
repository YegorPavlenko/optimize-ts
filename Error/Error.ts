// err.status Error in app.ts workaround

export interface Error {
  status?: number;
  message?: string;
}