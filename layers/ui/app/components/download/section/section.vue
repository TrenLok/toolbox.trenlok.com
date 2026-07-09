<template>
  <section class="download-section">
    <header class="download-section__header">
      <div class="download-section__icon">
        <slot name="icon" />
      </div>
      <h2 class="download-section__title">
        <slot name="title" />
      </h2>
    </header>
    <div class="download-section__items">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.download-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 700px;

  &__header {
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 0 0 6px;
    font-size: 18px;
    border-bottom: 1px solid var(--color-border-section);
  }

  &__icon {
    display: flex;
  }

  &__title {
    margin: 0;
    font-weight: 600;
  }

  &__items {
    display: flex;
    gap: 10px;
  }
}
</style>
