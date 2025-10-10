// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kolciyzkvvcwzegsomww.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbGNpeXprdnZjd3plZ3NvbXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzNiXzI1LCJleHAiOjIwNDg5MDI1fQ.p6HbwCX03iGW9qBSAUAbOutfZt0TBnBVxeEXs9iLdnaxwTg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

