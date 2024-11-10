import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUBAURL!,
  process.env.SUBASECRET!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
