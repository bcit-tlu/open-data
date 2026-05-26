import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  import('./init').then(({ initAnalytics }) => initAnalytics());
}

export function onRouteDidUpdate({ location }: { location: { pathname: string } }): void {
  if (ExecutionEnvironment.canUseDOM) {
    import('./init').then(({ logEvent }) => {
      logEvent('page_view', { url: location.pathname });
    });
  }
}
