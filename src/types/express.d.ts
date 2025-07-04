import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    userEmail?: string;
    userName?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export {};