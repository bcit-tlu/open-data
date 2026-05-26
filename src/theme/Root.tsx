import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  const { AnalyticsProvider } = require('../analytics/AnalyticsContext');
  return <AnalyticsProvider>{children}</AnalyticsProvider>;
}

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <BrowserOnly fallback={<>{children}</>}>
      {() => <AnalyticsWrapper>{children}</AnalyticsWrapper>}
    </BrowserOnly>
  );
}
