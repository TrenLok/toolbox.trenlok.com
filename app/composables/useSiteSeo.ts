export const SITE_NAME = 'VSCode Toolbox';
export const SITE_TITLE = 'VSCode Toolbox - Lightweight Project Manager for VS Code, VSCodium and Coder';
export const SITE_DESCRIPTION = 'VSCode Toolbox is a lightweight project manager for Visual Studio Code, VSCodium and Coder projects, helping developers open local workspaces faster on Windows and macOS.';
const SITE_IMAGE = '/og.jpg';
const SITE_KEYWORDS = [
  'VSCode Toolbox',
  'Visual Studio Code',
  'VS Code',
  'VSCodium',
  'Coder',
  'Coder projects',
  'project manager',
  'workspace manager',
  'developer tools',
  'productivity tools',
  'Windows',
  'macOS',
].join(', ');

export function useSiteSeo(): void {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const siteUrl = String(runtimeConfig.public.siteUrl).replace(/\/$/, '');
  const canonicalUrl = computed(() => `${siteUrl}${route.path}`);
  const siteImageUrl = `${siteUrl}${SITE_IMAGE}`;

  useHead({
    titleTemplate: (titleChunk) => {
      if (titleChunk) {
        if (titleChunk.includes(SITE_NAME)) {
          return `${titleChunk}`;
        }

        return `${titleChunk} - ${SITE_NAME}`;
      }

      return SITE_NAME;
    },
    meta: [
      {
        name: 'keywords',
        content: SITE_KEYWORDS,
      },
      {
        name: 'author',
        content: 'TrenLok',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: ['Windows', 'macOS'],
          url: siteUrl,
          image: siteImageUrl,
          author: {
            '@type': 'Person',
            name: 'TrenLok',
          },
        }),
      },
    ],
  });

  useSeoMeta({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    ogTitle: SITE_NAME,
    ogDescription: SITE_DESCRIPTION,
    ogUrl: canonicalUrl,
    ogLocale: 'en_US',
    ogImage: siteImageUrl,
    ogImageAlt: SITE_NAME,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogSiteName: SITE_NAME,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: SITE_NAME,
    twitterDescription: SITE_DESCRIPTION,
    twitterImage: siteImageUrl,
    twitterImageAlt: SITE_NAME,
  });
}
