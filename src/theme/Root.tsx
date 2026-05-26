import React, { lazy, Suspense } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

const AnalyticsProvider = lazy(() =>
  import('../analytics/AnalyticsContext').then((m) => ({ default: m.AnalyticsProvider }))
);

export default function Root({ children }: { children: React.ReactNode }) {
  const isBrowser = useIsBrowser();
  if (!isBrowser) {
    return <>{children}</>;
  }
  return (
    <Suspense fallback={<>{children}</>}>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </Suspense>
  );
}
