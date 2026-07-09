<template>
  <ui-header class="w-header">
    <template #logo>
      <w-logo
        class="w-header__logo"
        aria-label="VSCode Toolbox home"
      />
    </template>
    <template #nav>
      <ui-button-text
        href="https://github.com/TrenLok/vscode-toolbox"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </ui-button-text>
    </template>
  </ui-header>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.w-header {
  padding: 20px;

  &__logo {
    font-size: 25px;
  }
}
</style>
