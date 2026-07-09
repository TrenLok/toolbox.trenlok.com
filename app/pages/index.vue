<template>
  <div
    class="index-page"
    aria-labelledby="index-page-title"
  >
    <section
      class="index-page__header"
      aria-labelledby="index-page-title"
    >
      <w-logo class="index-page__logo" aria-label="VSCode Toolbox" />
      <div class="index-page__header-text">
        <ui-title id="index-page-title">
          VSCode Toolbox
        </ui-title>
        <p class="index-page__description">
          A lightweight project manager for Visual Studio Code
        </p>
      </div>
    </section>
    <div class="index-page__links">
      <ui-button-primary :href="primaryDownloadHref">
        <template #icon>
          <iui-macos v-if="primaryDownloadPlatform === 'macos'" />
          <iui-windows v-else />
        </template>
        <template #default>
          {{ primaryDownloadLabel }}
        </template>
      </ui-button-primary>
      <nuxt-link
        :to="{ name: 'download' }"
        v-slot="{ href, navigate }"
        custom
      >
        <ui-button-text :href="href" @click="navigate">
          Other platform
        </ui-button-text>
      </nuxt-link>
    </div>
    <figure class="index-page__screenshot">
      <picture>
        <source srcset="~/assets/images/screenshot.webp" type="image/webp">
        <img
          src="~/assets/images/screenshot.png"
          alt="VSCode Toolbox interface preview"
          width="396"
          height="407"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        >
      </picture>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { SITE_DESCRIPTION, SITE_TITLE } from '~/composables/useSiteSeo';
import type { DownloadItem, DownloadSection, DownloadsResponse } from '~~/shared/types/downloads';

definePageMeta({
  sitemap: {
    changefreq: 'monthly',
    priority: 1,
  },
});

useSeoMeta({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  ogTitle: SITE_TITLE,
  ogDescription: SITE_DESCRIPTION,
  twitterTitle: SITE_TITLE,
  twitterDescription: SITE_DESCRIPTION,
});

const { data: downloads, error } = await useFetch<DownloadsResponse>('/api/downloads', {
  key: 'downloads',
});

if (error.value) {
  console.error('Failed to load downloads data', error.value);
}

const router = useRouter();
const downloadPageHref = router.resolve({ name: 'download' }).href;
const { isAppleSilicon, isMacIntel, isMacOS } = usePlatform();

const sections = computed(() => downloads.value?.sections ?? []);
const windowsSection = computed(() => findSection(sections.value, 'windows'));
const macosSection = computed(() => findSection(sections.value, 'macos'));
const primarySection = computed(() => {
  if (isMacOS.value && macosSection.value) {
    return macosSection.value;
  }

  return windowsSection.value
    ?? macosSection.value
    ?? sections.value.find((section) => section.items.length > 0)
    ?? null;
});

const primaryDownload = computed(() => {
  if (!primarySection.value) {
    return null;
  }

  if (primarySection.value.id === 'macos') {
    return pickMacOsDownload(primarySection.value.items, {
      preferAppleSilicon: isAppleSilicon.value,
      preferIntel: isMacIntel.value,
    });
  }

  if (primarySection.value.id === 'windows') {
    return pickWindowsDownload(primarySection.value.items);
  }

  return primarySection.value.items[0] ?? null;
});

const primaryDownloadHref = computed(() => primaryDownload.value?.href ?? downloadPageHref);
const primaryDownloadPlatform = computed(() => {
  return primarySection.value?.id === 'macos' ? 'macos' : 'windows';
});
const primaryDownloadLabel = computed(() => {
  if (primarySection.value?.id === 'macos') {
    return 'Download for macOS';
  }

  return 'Download for Windows';
});

function findSection(sectionsList: DownloadSection[], sectionId: DownloadSection['id']): DownloadSection | null {
  return sectionsList.find((section) => section.id === sectionId && section.items.length > 0) ?? null;
}

function pickMacOsDownload(
  items: DownloadItem[],
  options: {
    preferAppleSilicon: boolean;
    preferIntel: boolean;
  },
): DownloadItem | null {
  return items.toSorted((left, right) => getMacOsPriority(left, options) - getMacOsPriority(right, options))[0] ?? null;
}

function getMacOsPriority(
  item: DownloadItem,
  options: {
    preferAppleSilicon: boolean;
    preferIntel: boolean;
  },
): number {
  const normalizedTitle = item.title.toLowerCase();
  const isIntel = normalizedTitle.includes('intel') || normalizedTitle.includes('x64');
  const isArmBuild = normalizedTitle.includes('apple silicon') || normalizedTitle.includes('arm64');

  if (options.preferAppleSilicon) {
    if (isArmBuild) {
      return 0;
    }

    if (isIntel) {
      return 1;
    }
  }

  if (options.preferIntel) {
    if (isIntel) {
      return 0;
    }

    if (isArmBuild) {
      return 1;
    }
  }

  if (isIntel) {
    return 0;
  }

  if (isArmBuild) {
    return 1;
  }

  return 2;
}

function pickWindowsDownload(items: DownloadItem[]): DownloadItem | null {
  return items.toSorted((left, right) => getWindowsPriority(left) - getWindowsPriority(right))[0] ?? null;
}

function getWindowsPriority(item: DownloadItem): number {
  if (item.format === '.exe') {
    return 0;
  }

  return 1;
}
</script>

<style scoped lang="scss">
.index-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  &__header {
    display: flex;
    flex-direction: column;
    gap: clamp(15px, 2vw, 35px);
    align-items: center;
  }

  &__logo {
    font-size: clamp(80px, 13vw, 100px);
  }

  &__header-text {
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  &__description {
    font-size: clamp(15px, 2.5vw, 20px);
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__screenshot {
    width: .9215em;
    height: 1em;
    margin: 0;
    font-size: clamp(330px, 55vw, 445px);

    &:deep(img) {
      object-fit: contain;
      object-position: top;
    }
  }
}
</style>
