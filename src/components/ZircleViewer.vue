
<template>
  <div class="zircleviewer">
    <splitpane :leftPaneStyle="leftPaneStyle">
      <div slot="left">
        <z-canvas id="zcanvas" :views='$options.views' :style="{width: left}">
        </z-canvas>
      </div>
      <contentpane slot="right"></contentpane>
    </splitpane>
  </div>
</template>

<br/>

<script>
  import Settings from './ZircleSettings'
  import Item from './ZircleItem'
  import View from './ZircleView'
  import ContentPane from './ContentPane'
  import SplitPane from './SplitPane'
  
  let target = {
    el: true,
    v: null
  }
  let zcanvas
  export default {
    name: 'zircleviewer',
    components: {
      contentpane: ContentPane,
      splitpane: SplitPane
    },
    views: {
      item: Item,
      itemNext: Item,
      view: View,
      settings: Settings
    },
    mounted () {
      this.$zircle.config({
        mode: 'full',
        style: {
          theme: 'black',
          mode: 'dark'
        },
        debug: true
      })
      this.$zircle.setView('view')
      zcanvas = document.getElementById('zcanvas')
      zcanvas.style.backgroundColor = 'rgba(0, 0, 0, 0.0)'
    },
    updated () {},
    data: function () {
      return {
        target: target
      }
    },
    methods: {
      getTop (index) {
        if (!index) {
          return this.top
        }
      }
    },
    computed: {
      left () {
        return this.$store.state.leftPaneWidth
      },
      ulStyle () {
        const p = '0'
        // const c = window.lconfig.leftPaneBackground || '#fff'
        const u = 'static/images/bubble.png'
        return `padding:${p}; background-image: url(${u});`
      },
      leftPaneStyle () {
        const w = window.lconfig.leftPaneWidth || '420px'
        // const c = 'rgba(0, 0, 0, 0.5)'
        // const u = 'static/images/chou.jpg'
        return `width:${w};` // background-color: ${c};
      },
      top () {
        // if (this.$store.state.leodata.length > 1) { return false }
        if (window.lconfig.firstNodeAsTitle === false) {
          return false
        }
        return true
      },
      data () {
        return this.$store.state.leodata
      },
      text () {
        return this.$store.state.leotext
      }
    },
    watch: {
      '$store.state.leftPaneWidth': {
        handler: function (val, oldVal) {
          let zcanvas = document.getElementById('zcanvas')
          if (zcanvas !== undefined && zcanvas !== null) {
            zcanvas.style.width = val
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
.zircleviewer
  margin: 0
  height: 100%
</style>

<style lang="css">
.title {
    margin-left: 5%;
    position: absolute;
    width: 90%;
    color: #454545;
    font-weight: 700;
    font-size: 32px;
    z-index: 9999;
    opacity: 1;
    line-height: 1.02em;
    pointer-events: none !important;
}
.footer {
    margin-left: 5%;
    position: absolute;
    bottom: 20px;
    width: 90%;
    font-size: 32px;
    pointer-events: none !important;
    color: #454545;
    z-index: 9999;
    opacity: 1;
    text-align: center;
}
.title.home {
    text-align: center;
}
</style>