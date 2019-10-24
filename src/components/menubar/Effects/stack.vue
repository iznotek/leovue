<template>
    <div>
        <MenuBar v-bind="propsToPass" openMenu="openMenu" @closeMenu="closeMenu">
            <slot></slot>
        </MenuBar>
    </div>
</template>

<script>
import MenuBar from './MenuBar'
export default {
  name: 'stack',
  components: {
    MenuBar: MenuBar
  },
  data () {
    return {
      propsToPass: {
        isOpen: this.$attrs.isOpen,
        right: this.$attrs.right,
        width: this.$attrs.width,
        disableEsc: this.$attrs.disableEsc,
        noOverlay: this.$attrs.noOverlay,
        onStateChange: this.$attrs.onStateChange
      }
    }
  },
  methods: {
    openMenu () {
      this.$emit('openMenu')
    },
    closeMenu () {
      this.$emit('closeMenu')
    }
  }
}
</script>



