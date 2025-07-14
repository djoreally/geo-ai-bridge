
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

class Analytics {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = import.meta.env.PROD && !!import.meta.env.VITE_ANALYTICS_KEY;
  }

  track(event: AnalyticsEvent) {
    if (!this.isEnabled) {
      console.log('Analytics Event:', event);
      return;
    }

    // Replace with your analytics provider (PostHog, Mixpanel, etc.)
    try {
      // Example: posthog.capture(event.name, event.properties);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  page(pageName: string, properties?: Record<string, any>) {
    this.track({
      name: 'Page Viewed',
      properties: {
        page: pageName,
        ...properties,
      },
    });
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (!this.isEnabled) {
      console.log('Analytics Identify:', { userId, traits });
      return;
    }

    try {
      // Example: posthog.identify(userId, traits);
    } catch (error) {
      console.error('Analytics identify error:', error);
    }
  }
}

export const analytics = new Analytics();
export default analytics;
