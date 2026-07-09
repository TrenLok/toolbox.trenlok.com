<template>
  <div
    class="download-page"
    aria-labelledby="download-page-title"
  >
    <section
      class="download-page__header"
      aria-labelledby="download-page-title"
    >
      <ui-title id="download-page-title">
        Download VSCode Toolbox
      </ui-title>
      <div class="download-page__info">
        <p
          v-if="versionLabel"
          class="download-page__version"
        >
          {{ versionLabel }}
        </p>
        <template v-if="downloads?.changelogUrl">
          <ui-button-text
            :href="downloads.changelogUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            View changelog
          </ui-button-text>
        </template>
      </div>
    </section>
    <div class="download-page__versions">
      <ui-download-section
        v-for="section in sections"
        :key="section.id"
      >
        <template #icon>
          <iui-windows v-if="section.id === 'windows'" />
          <iui-macos v-else-if="section.id === 'macos'" />
        </template>
        <template #title>
          {{ section.title }}
        </template>
        <template #default>
          <ui-download-button
            v-for="item in section.items"
            :key="item.id"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <template #title>
              {{ item.title }}
            </template>
            <template #format>
              {{ item.format }}
            </template>
          </ui-download-button>
        </template>
      </ui-download-section>
    </div>
    <footer class="download-page__footer">
      Another version can be found on
      <template v-if="downloads?.repositoryUrl">
        <ui-button-text
          :href="downloads.repositoryUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </ui-button-text>
      </template>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { DownloadsResponse } from '~~/shared/types/downloads';

const pageDescription = 'Download VSCode Toolbox for Windows and macOS.';

definePageMeta({
  sitemap: {
    changefreq: 'weekly',
    priority: 0.8,
  },
});

useSeoMeta({
  title: 'Download',
  description: pageDescription,
  ogTitle: 'Download VSCode Toolbox',
  ogDescription: pageDescription,
  twitterTitle: 'Download VSCode Toolbox',
  twitterDescription: pageDescription,
});

const { data: downloads, error } = await useFetch<DownloadsResponse>('/api/downloads', {
  key: 'downloads',
});

if (error.value) {
  console.error('Failed to load downloads data', error.value);
}

const sections = computed(() => downloads.value?.sections ?? []);
const resolvedVersion = computed(() => {
  const manifestVersion = downloads.value?.version;

  if (manifestVersion) {
    return manifestVersion;
  }

  return downloads.value?.releaseTag;
});

const versionLabel = computed(() => {
  if (!resolvedVersion.value) {
    return;
  }

  return `Latest (${resolvedVersion.value})`;
});
</script>

<style scoped lang="scss">
.download-page {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  &__info {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  &__version {
    color: var(--color-text-muted);
    font-size: 14px;
  }

  &__versions {
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
    width: 100%;
    padding: 0 30px;
  }

  &__footer {
    color: var(--color-text-muted);
  }
}
</style>
