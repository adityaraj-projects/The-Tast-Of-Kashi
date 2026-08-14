import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Please verify your environment variables."
  );
}

const url = supabaseUrl || "https://dummy.supabase.co";
const key = supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy";

export const supabase = createClient(url, key);

export function isMockMode(): boolean {
  const isDev = (import.meta as any).env.MODE === "development";
  const useMock = (import.meta as any).env.VITE_USE_MOCK_AUTH === "true";
  return isDev && useMock;
}
