<template>
  <div :style="style" @onClick="click" :class="{ active, present, 'impress-step': true }">
    <component v-if="step.component" :is="step.component" :props="step.props" />
    <div v-html="content" />
  </div>
</template>

<script>
import { translate, rotate, scale } from '../utils'

export default {
  props: ['step', 'index', 'active', 'present'],

  methods: {
    click () {
      this.$parent.$emit('impress:goto', this.index)
    }
  },

  computed: {
    style () {
      const { step } = this
      const transform = `${translate(step.translate)}
        ${rotate(step.rotate)} ${scale(step.scale)}`
      return { transform }
    },
    content () {
      return this.step.content
    }
  }
}
</script>

<style lang="scss">
.impress-step {
  font-size: 30px;
  transition: opacity 1s;
  position: absolute;
  transform-origin: center center 0px;
  transform-style: preserve-3d;
  will-change: opactiy;
  opacity: 0.3;

  &.active {
    opacity: 1;
  }
}

</style>
