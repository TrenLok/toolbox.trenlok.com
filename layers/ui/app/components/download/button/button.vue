<template>
  <ui-button-or-anchor
    :class="classNames"
    :href="href"
    :is-disabled="isDisabled"
    @click="emit('click', $event)"
  >
    <span class="download-button__content">
      <span class="download-button__title">
        <slot name="title" />
      </span>
      <span class="download-button__format">
        <slot name="format" />
      </span>
    </span>
  </ui-button-or-anchor>
</template>

<script setup lang="ts">
import { flag, useBMC } from '@rhapsodic/bem-classnames-vue';
import type { ButtonOrAnchorEmits, ButtonOrAnchorProps } from '../../button/or-anchor';

const props = withDefaults(defineProps<ButtonOrAnchorProps>(), {
  isDisabled: false,
  href: undefined,
});

const emit = defineEmits<ButtonOrAnchorEmits>();

const classNames = useBMC(props, 'download-button', {
  isDisabled: flag('state', 'disabled'),
});
</script>

<style scoped lang="scss">
.download-button {
  --download-button__background: var(--color-surface-download);

  position: relative;
  display: inline-block;
  padding: 15px 25px;
  color: var(--color-control-text);
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  background-color: var(--download-button__background);
  border: none;
  border-radius: 12px;
  transition: .2s ease-out;
  transition-property: background-color;

  &:hover,
  &:focus-visible {
    --download-button__background: var(--color-surface-download-hover);
  }

  &:active {
    --download-button__background: var(--color-surface-download-active);
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
  }

  &__format {
    color: var(--color-text-subtle);
  }

  &_state {
    &_disabled {
      pointer-events: none;
      opacity: .6;
    }
  }
}
</style>
