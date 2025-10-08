// Type definitions for Supabase Edge Functions

declare global {
  namespace Deno {
    export const env: {
      get(key: string): string | undefined;
    };
  }
}

// Make sure Request parameter is properly typed
export interface SupabaseRequest extends Request {
  json(): Promise<any>;
  headers: Headers;
  method: string;
}

export {};
