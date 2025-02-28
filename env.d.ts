// env.d.ts
declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_NAVER_CLIENT_ID: string;
    NEXT_PUBLIC_NAVER_CLIENT_SECRET: string;
    NEXT_PUBLIC_API_URL: string;
  }
}
