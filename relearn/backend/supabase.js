import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://jefnyfppaqtvxnprjcpi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_JLMdo_E6j6PR-UbyWWUKqA_g4tSHd6Y";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);