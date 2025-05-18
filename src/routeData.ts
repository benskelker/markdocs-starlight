import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware(({ locals }) => {
  const { entry, headings } = locals.starlightRoute; 
  const firstH1 = headings?.find((h) => h.depth === 1)?.text;
  if (firstH1) entry.data.title = firstH1; 
});
