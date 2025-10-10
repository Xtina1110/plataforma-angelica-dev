/**
 * Analytics utility for tracking user events
 * Supports Google Analytics, Mixpanel, and custom events
 */

class Analytics {
  constructor() {
    this.isEnabled = true;
    this.debug = process.env.NODE_ENV === 'development';
  }

  /**
   * Initialize analytics services
   */
  init() {
    // Google Analytics
    if (window.gtag) {
      this.log('Google Analytics initialized');
    }

    // Mixpanel
    if (window.mixpanel) {
      this.log('Mixpanel initialized');
    }
  }

  /**
   * Log to console in debug mode
   */
  log(...args) {
    if (this.debug) {
      console.log('[Analytics]', ...args);
    }
  }

  /**
   * Track page view
   */
  pageView(path, title) {
    if (!this.isEnabled) return;

    this.log('Page view:', path, title);

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', window.GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title
      });
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track('Page View', {
        path,
        title
      });
    }
  }

  /**
   * Track custom event
   */
  track(eventName, properties = {}) {
    if (!this.isEnabled) return;

    this.log('Event:', eventName, properties);

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track(eventName, properties);
    }

    // Custom event for internal tracking
    window.dispatchEvent(new CustomEvent('analytics-event', {
      detail: { eventName, properties }
    }));
  }

  /**
   * Track login events
   */
  trackLogin(method, success = true) {
    this.track('login', {
      method, // 'email', 'google', 'facebook'
      success,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track registration events
   */
  trackRegistration(method) {
    this.track('registration', {
      method,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track onboarding events
   */
  trackOnboarding(action, step = null) {
    this.track('onboarding', {
      action, // 'started', 'step_viewed', 'completed', 'skipped'
      step,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track form interactions
   */
  trackFormInteraction(formName, action, field = null) {
    this.track('form_interaction', {
      form: formName,
      action, // 'focus', 'blur', 'submit', 'error'
      field,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track errors
   */
  trackError(errorType, errorMessage, context = {}) {
    this.track('error', {
      type: errorType,
      message: errorMessage,
      ...context,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric, value, context = {}) {
    this.track('performance', {
      metric, // 'page_load', 'component_render', 'api_call'
      value,
      ...context,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track user properties
   */
  setUserProperties(properties) {
    if (!this.isEnabled) return;

    this.log('User properties:', properties);

    // Google Analytics
    if (window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.people.set(properties);
    }
  }

  /**
   * Identify user
   */
  identify(userId, traits = {}) {
    if (!this.isEnabled) return;

    this.log('Identify user:', userId, traits);

    // Google Analytics
    if (window.gtag) {
      window.gtag('set', { user_id: userId });
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.identify(userId);
      window.mixpanel.people.set(traits);
    }
  }

  /**
   * Track conversion
   */
  trackConversion(conversionType, value = null) {
    this.track('conversion', {
      type: conversionType,
      value,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track social login
   */
  trackSocialLogin(provider, success = true) {
    this.track('social_login', {
      provider, // 'google', 'facebook', 'apple'
      success,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track password strength
   */
  trackPasswordStrength(strength) {
    this.track('password_strength', {
      strength, // 0-4
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    this.log('Analytics', enabled ? 'enabled' : 'disabled');
  }

  /**
   * Opt out of tracking
   */
  optOut() {
    this.setEnabled(false);
    localStorage.setItem('analytics_opt_out', 'true');
  }

  /**
   * Opt in to tracking
   */
  optIn() {
    this.setEnabled(true);
    localStorage.removeItem('analytics_opt_out');
  }

  /**
   * Check if user has opted out
   */
  hasOptedOut() {
    return localStorage.getItem('analytics_opt_out') === 'true';
  }
}

// Create singleton instance
const analytics = new Analytics();

// Initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Check opt-out status
    if (analytics.hasOptedOut()) {
      analytics.setEnabled(false);
    } else {
      analytics.init();
    }
  });
}

export default analytics;

// Named exports for convenience
export const {
  track,
  trackLogin,
  trackRegistration,
  trackOnboarding,
  trackFormInteraction,
  trackError,
  trackPerformance,
  setUserProperties,
  identify,
  trackConversion,
  trackSocialLogin,
  trackPasswordStrength,
  pageView
} = analytics;

