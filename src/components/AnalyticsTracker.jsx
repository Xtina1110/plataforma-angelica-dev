import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../utils/analytics';

/**
 * Analytics Tracker Component
 * Automatically tracks page views when routes change
 */
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const pagePath = location.pathname + location.search;
    const pageTitle = document.title;
    
    analytics.pageView(pagePath, pageTitle);
    
    // Track specific sections if in dashboard
    if (location.pathname === '/dashboard' && location.search) {
      const params = new URLSearchParams(location.search);
      const section = params.get('section');
      if (section) {
        analytics.track('dashboard_section_view', {
          section,
          path: pagePath
        });
      }
    }
  }, [location]);

  return null; // This component doesn't render anything
}

export default AnalyticsTracker;

