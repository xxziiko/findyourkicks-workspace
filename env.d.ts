// env.d.ts
declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_TOSS_CLIENT_KEY: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    TOSS_SECRET_KEY: string;
  }
}
