<template>
  <svg
    class="icon"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <slot :color="color" />
    <defs>
      <linearGradient :id="gradientId">
        <slot name="stops">
          <stop offset="0%" stop-color="currentColor" />
          <stop offset="100%" stop-color="currentColor" />
        </slot>
      </linearGradient>
    </defs>
  </svg>
</template>

<script setup lang="ts">
const id = useId();
const gradientId = computed(() => `icon-gradient-${id}`);
const color = computed(() => `url(#${gradientId.value})`);
</script>

<style scoped lang="scss">
.icon {
  & :deep(stop) {
    transition: stop-color .1s ease-out;
    stop-color: currentColor;

    &:first-child {
      stop-color: var(--icon__gradient-color-1, currentColor);
    }

    &:last-child {
      stop-color: var(--icon__gradient-color-2, currentColor);
    }
  }
}
</style>
