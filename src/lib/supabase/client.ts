"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type GenericRow = Record<string, unknown>;

type GenericTable = {
  Row: GenericRow;
  Insert: GenericRow;
  Update: GenericRow;
  Relationships: [];
};

type AdminDatabase = {
  public: {
    Tables: Record<string, GenericTable>;
    Views: Record<string, GenericTable>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let browserClient: SupabaseClient<AdminDatabase> | null = null;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase ist nicht konfiguriert. Bitte NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY setzen.");
  }

  browserClient ??= createClient<AdminDatabase>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });

  return browserClient;
}
