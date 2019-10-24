<template>
  <vquickmenu class="quickmenu"
              :menu-count="getCount"
              :icon-class="icons" 
              :menu-url-list="list" 
              :background-color="backgroundColor" 
              :color="color" 
              :position="position" 
              :is-open-new-tab="getIsOpenNewTab" 
              @process="handleQuick"> 
  </vquickmenu> 
</template>

<script>
import quickMenu from 'vue-quick-menu'

export default {
  name: 'quickmenu',
  components: {
    vquickmenu: quickMenu
  },
  data () {
    return {
      count: 2,
      icons: ['fa fa-github', 'fa fa-comment'],
      list: [{'isLink': false}, {'isLink': false}],
      backgroundColor: 'rgba(20, 40, 100, 0.7)', // #1724D5',
      color: '#ffffff',
      position: 'top-left',
      isOpenNewTab: false
    }
  },
  methods: {
    handleQuick (key) {
      if (key === 1) {
        // console.log('please send me an email')
        this.$events.fire('show', {type: 'tree'})
      }
      if (key === 0) {
        // window.open('https://github.com/AshleyLv/vue-quick-menu')
        this.$events.fire('show', {type: 'graph'})
      }
    }
  },
  computed: {
    getCount () {
      return Number(this.count)
    },
    getIsOpenNewTab () {
      return Boolean(this.isOpenNewTab)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.quick-menu {
  z-index: 1024;
  position: absolute;
  margin-top: 15px;
  margin-left: -15px;
}
</style>
