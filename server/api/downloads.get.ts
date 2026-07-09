import { getDownloadsResponse } from '../utils/downloads';

const downloadsResponseCacheMaxAge = 60 * 10;

export default defineCachedEventHandler(async (event) => {
  setHeader(event, 'cache-control', `public, max-age=${downloadsResponseCacheMaxAge}`);

  return await getDownloadsResponse();
}, {
  maxAge: downloadsResponseCacheMaxAge,
  swr: true,
});
