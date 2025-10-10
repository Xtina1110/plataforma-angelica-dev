import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Affiliate tracking
export const trackAffiliateClick = async (affiliateCode, page) => {
  try {
    const { data, error } = await supabase
      .from('affiliate_clicks')
      .insert([{
        affiliate_code: affiliateCode,
        page,
        timestamp: new Date().toISOString(),
        ip_address: 'anonymous' // For privacy
      }]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
  }
};

// User engagement tracking
export const trackUserEngagement = async (userId, action, metadata = {}) => {
  try {
    const { data, error } = await supabase
      .from('user_engagement')
      .insert([{
        user_id: userId,
        action,
        metadata,
        timestamp: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking engagement:', error);
  }
};

export default supabase;