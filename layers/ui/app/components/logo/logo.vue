<template>
  <nuxt-link
    :to="{ name: 'index' }"
    class="logo"
  >
    <slot />
  </nuxt-link>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.logo {
  display: block;

  :deep(picture) {
    display: block;
    width: 1em;
    height: 1em;
  }
}
</style>
