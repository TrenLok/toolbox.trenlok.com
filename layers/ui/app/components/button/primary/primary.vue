<template>
  <ui-button-or-anchor
    :class="classNames"
    :is-disabled="isDisabled"
    :href="href"
    @click="emit('click', $event)"
  >
    <span class="button-primary__holder">
      <template v-if="$slots.icon">
        <span class="button-primary__icon">
          <slot name="icon" />
        </span>
      </template>
      <template v-if="$slots.default">
        <span class="button-primary__text">
          <slot />
        </span>
      </template>
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

const classNames = useBMC(props, 'button-primary', {
  isDisabled: flag('state', 'disabled'),
});
</script>

<style scoped lang="scss">
.button-primary {
  --button-primary__background: var(--color-control-primary);

  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: var(--color-control-primary-text);
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  background-color: var(--button-primary__background);
  border: none;
  border-radius: 12px;
  transition: .3s ease-out;
  transition-property: color, background-color;

  &:hover,
  &:focus-visible {
    &:not(.button-primary_state_disabled) {
      --button-primary__background: var(--color-control-primary-hover);
    }
  }

  &:active {
    &:not(.button-primary_state_disabled) {
      --button-primary__background: var(--color-control-primary-active);
    }
  }

  &__holder {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  &__icon {
    display: flex;
    font-size: 14px;
  }

  &__text {
    text-align: center;
  }

  &_state {
    &_disabled {
      opacity: .6;
    }
  }
}
</style>
