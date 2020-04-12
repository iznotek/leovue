
<template>
  <div class="treeview">
    <ul class="very-pane" :style="ulStyle">
      <div v-for="(itemdata, index) in data">
        <item
          class="item"
          v-if="isVisible(itemdata)"
          :model="itemdata"
          :top="getTop(index)"
          :textItems="text"
          :targetEl="target.el">
        </item>
      </div>
    </ul>
  </div>
</template>
<br/>

<script>
  import Item from './Item'

  let target = {el: true, v: null}
  export default {
    name: 'treeview',
    components: {
      item: Item
    },
    data: function () {
      return {
        target: target
      }
    },
    methods: {
      isVisible: function (itemdata) {
        if (/^@cover/.test(itemdata.name)) { return false } // theme node hided
        return true
      },
      getTop (index) {
        if (!index) {
          return this.top
        }
      }
    },
    computed: {
      ulStyle () {
        const p = window.lconfig.leftPanePadding || '0'
        // const c = window.lconfig.leftPaneBackground || '#fff'
        return `padding-left:${p};`
      },
      top () {
        // if (this.$store.state.leodata.length > 1) { return false }
        if (window.lconfig.firstNodeAsTitle === false) { return false }
        return true
      },
      data () {
        return this.$store.state.leodata && this.$store.state.leodata.length ? this.$store.state.leodata[0].children : undefined
      },
      text () {
        return this.$store.state.leotext
      }
    }

  }
</script>
<br/>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
.treeview
  margin: 0
  padding-top: 33px;
  margin-left: 100px
  height: 100%
  width: 100%
  color: #dddddd
  z-index: 2000
  
.very-pane
  ul
    padding: 0
    padding-left: 70px
    line-height: 1.4em
    margin-bottom: 0px
    list-style-type: none
  li
    list-style-type: none
    white-space: nowrap
    min-width: 760px
    margin-bottom: 4px
    margin-top: 4px
  li > div
    padding-left: 1px
</style>
