<template>
  <div class="spot" :style="style">
    <div v-if="withButton"
         class="spot-delete-btn"
         @mousedown="remove"></div>
    <slot>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    index: {
      type: Number
    },
    withButton: {
      type: Boolean,
      default: true
    },
    color: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  computed: {
    brightness () {
      let { r, g, b } = this.color
      return 0.299 * r + 0.587 * g + 0.114 * b
    },
    style () {
      if (this.color) {
        let { r, g, b, a } = this.color
        let background = `rgba(${r}, ${g}, ${b}, ${a})`
        let shadow = `rgba(${r}, ${g}, ${b}, 0.2)`
        return {
          'background-color': background,
          'box-shadow': `0px 6px 20px ${shadow}`,
          'color': this.brightness > 180 ? '#777' : '#f3f3f3'
        }
      }
      return null
    }
  },
  methods: {
    remove () {
      this.$emit('remove', {
        index: this.index
      })
    }
  }
}
</script>

<style scoped>
@keyframes shake {
  from {
    transform: rotate(-4deg);
  },
  to {
    transform: rotate(4deg);
  }
}
.spot {
  position: relative;
  background-color: transparent;
  margin: 5px;
  height: 32px;
  width: 62px;
  border-radius: 10px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.3);
  color: #777;
  font-weight: 900;
  font-size: 12px;
  line-height: 52px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  
}
.spot .spot-delete-btn {
    display: block;
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 7px;
    right: 6px;
    top: 6px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.2);
}

.v-grid-item-dragging .spot {
  animation-name: shake;
  animation-duration: 0.07s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
</style>