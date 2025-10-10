// 📁 src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kolciyzkuvcwzegsomww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbGNpeXprdXZjd3plZ3NvbXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODY0NTAsImV4cCI6MjA2NjM2MjQ1MH0.n6HbwCXo3lGW9gBSAUAbOufZf9UBmEvkeEX891dnswg';

export const supabase = createClient(supabaseUrl, supabaseKey);
