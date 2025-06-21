declare namespace NodeJS {
  export interface ProcessEnv {
    VITE_SUPABASE_URL: string;
    VITE_API_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_SUPABASE_SERVICE_ROLE_KEY: string;
  }
}
