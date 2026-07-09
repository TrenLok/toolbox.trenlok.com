<template>
  <header class="header">
    <div class="header__logo">
      <slot name="logo" />
    </div>
    <nav class="header__nav">
      <slot name="nav" />
    </nav>
  </header>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
