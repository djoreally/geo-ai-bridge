
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/lib/analytics';

export function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    analytics.page(location.pathname, {
      search: location.search,
      hash: location.hash,
    });
  }, [location]);

  return null;
}
