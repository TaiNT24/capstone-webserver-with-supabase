import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.REACT_APP_PUBLIC_SUPABASE_URL,
  process.env.REACT_APP_PUBLIC_SUPABASE_KEY
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjIyNjA3MTA1LCJleHAiOjE5MzgxODMxMDV9.cyBPtsY2EBcRLWPHEmL9nSdUqglFzPv4tZlmPaF3sEw"
);
