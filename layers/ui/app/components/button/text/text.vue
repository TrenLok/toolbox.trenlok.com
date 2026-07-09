<template>
  <ui-button-or-anchor
    :class="classNames"
    :href="href"
    :is-disabled="isDisabled"
    @click="emit('click', $event)"
  >
    <span class="button-text__content">
      <slot />
    </span>
  </ui-button-or-anchor>
</template>

<script setup lang="ts">
import { flag, useBMC } from '@rhapsodic/bem-classnames-vue';
import type { ButtonOrAnchorEmits, ButtonOrAnchorProps } from '../or-anchor';

const props = withDefaults(defineProps<ButtonOrAnchorProps>(), {
  isDisabled: false,
  href: undefined,
});

const emit = defineEmits<ButtonOrAnchorEmits>();

const classNames = useBMC(props, 'button-text', {
  isDisabled: flag('state', 'disabled'),
});
</script>

<style scoped lang="scss">
.button-text {
  --button-text__color: var(--color-link);

  position: relative;
  display: inline-block;
  color: var(--button-text__color);
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: none;
  transition: .2s ease-out;
  transition-property: color;

  &:hover,
  &:focus-visible {
    --button-text__color: var(--color-link-hover);
  }

  &:active {
    --button-text__color: var(--color-link-active);
  }

  &__content {
    display: flex;
    align-items: center;
    line-height: normal;
  }

  &_state {
    &_disabled {
      pointer-events: none;
      opacity: .6;
    }
  }
}
</style>
