import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAffiliates = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [userEarnings, setUserEarnings] = useState(null);
  const [referrals, setReferrals] = useState(null);

  useEffect(() => {
    loadAffiliates();
    loadUserEarnings();
  }, []);

  const loadAffiliates = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAffiliates(data || []);
    } catch (error) {
      console.error('Error loading affiliates:', error);
    }
  };

  const loadUserEarnings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('affiliate_earnings')
        .select('*')
        .eq('affiliate_id', user.id);
      
      if (error) throw error;
      
      const total = data?.reduce((sum, earning) => sum + earning.amount, 0) || 0;
      const thisMonth = data?.filter(earning => 
        new Date(earning.created_at).getMonth() === new Date().getMonth()
      ).reduce((sum, earning) => sum + earning.amount, 0) || 0;

      setUserEarnings({ total, thisMonth });
    } catch (error) {
      console.error('Error loading earnings:', error);
    }
  };

  const registerAffiliate = async (affiliateData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('affiliates')
        .insert([{
          ...affiliateData,
          user_id: user.id,
          status: 'pending',
          commission_rate: 0.2 // 20% commission
        }]);
      
      if (error) throw error;
      await loadAffiliates();
      return data;
    } catch (error) {
      console.error('Error registering affiliate:', error);
      throw error;
    }
  };

  const generateAffiliateLink = () => {
    const baseUrl = window.location.origin;
    const affiliateCode = 'ABC123'; // This should be user-specific
    return `${baseUrl}?ref=${affiliateCode}`;
  };

  return {
    affiliates,
    userEarnings,
    referrals,
    registerAffiliate,
    generateAffiliateLink,
    loadAffiliates
  };
};