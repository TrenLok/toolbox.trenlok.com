<template>
  <div class="site-layout">
    <div class="site-layout__glow">
      <picture>
        <source srcset="~/assets/images/glow.webp" type="image/webp">
        <img
          src="~/assets/images/glow.png"
          alt=""
          width="1300"
          height="650"
          decoding="async"
          fetchpriority="low"
        >
      </picture>
    </div>
    <div class="site-layout__header">
      <w-header />
    </div>
    <main class="site-layout__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.site-layout {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__main {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  &__glow {
    position: fixed;
    left: 50%;
    z-index: -1;
    width: clamp(800px, 100vw, 1440px);
    aspect-ratio: 1440 / 900;
    transform: translateX(-50%);

    picture,
    img {
      display: block;
      width: 100%;
      height: 100%;
    }

    img {
      object-fit: cover;
    }
  }
}
</style>
