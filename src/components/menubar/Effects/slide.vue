<template>
    <div>
        <MenuBar ref="menubar" v-bind="this.$attrs" @openMenu="openMenu" @closeMenu="closeMenu">
            <slot></slot>
        </MenuBar>
    </div>
</template>

<script>
  import MenuBar from './MenuBar'
  export default {
    name: 'slide',
    components: {
      MenuBar: MenuBar
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


