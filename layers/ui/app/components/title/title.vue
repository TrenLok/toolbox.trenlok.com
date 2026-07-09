<template>
  <h1 class="title">
    <slot />
  </h1>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.title {
  font-size: clamp(30px, 5vw, 40px);
  font-weight: 600;
}
</style>
