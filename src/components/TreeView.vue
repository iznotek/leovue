
<template>
  <div class="treeview">
    <ul v-if="space" class="very-pane" :style="ulStyle">
      <item
          class="item"
          v-if="isVisible(space)"
          :model="space"
          :top="false"
          :textItems="text"
          :targetEl="target.el">
      </item>
      <!-- <div v-for="(itemdata, index) in space.children">
        <item
          class="item"
          v-if="isVisible(itemdata)"
          :model="itemdata"
          :top="getTop(index)"
          :textItems="text"
          :targetEl="target.el">
        </item>
      </div> -->
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
        graph: null,
        target: target
      }
    },
    methods: {
      isVisible: function (itemdata) {
        if (!itemdata) { return false }
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
      space () {
        return this.graph
      },
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
    },
    watch: {
      '$store.state.space': {
        handler: function (val, oldVal) {
          if (val) {
            // console.log('Look for space: ' + val, this)
            let agraph = null
            if (this.$store.state.leodata && this.$store.state.leodata.length) {
              this.$store.state.leodata.forEach((data) => {
                if (data.vtitle.includes(val.name)) {
                  agraph = data
                }
              })
            } else {
              // console.log('load a graph first !!')
            }

            if (!agraph) {
              this.graph = this.$store.state.leodata[0]
              console.log('Fallback at id: ', this.graph.id)
            } else {
              this.graph = agraph
              // console.log('Found at id: ', this.graph.id)
            }
            // console.log(this.graph)

            // only at startup
            // console.log(this.graph.id, this.$store.state.currentItem.id)
            // if (this.$store.state.currentItem.id <= 0) {
            //   var id = this.graph.id
            //   this.$store.dispatch('setCurrentItem', {id})
            // }
          }
        },
        deep: true,
        immediate: true
      }
    }
  }
</script>
<br/>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
.treeview
  margin: 0
  padding-top: 150px
  padding-left: 100px
  padding-bottom: 135px
  height: 100%
  width: 100%
  color: #dddddd
  z-index: 2000
  overflow-y: auto
  overflow-x: auto
  
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
