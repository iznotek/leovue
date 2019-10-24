<template>
  <div class="panes-container">
    <div class="left-pane unselectable"
         :style="leftPaneStyle"
         id="left-pane">
      <div :style="{position:'relative', overflow: 'hidden', height: 'calc(100vh - 33px)'}">
        <div class="inner-container">
          <div style="height: calc(100vh - 33px);padding-top:0px">
            <slot name="left"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="panes-separator"
         id="panes-separator">
      <div v-if="connected" class="noselect" style="margin-top: calc(0vh);">
        <ballmenu class="split-ball"/>
        <div class="split-left"
            v-show="showLeftButton"
            @click="slide('left')">
          <!-- <icon name="bulletarrow" /> -->
          <img :src="require(`@/assets/icons/bullet-arrow.svg`)" :style="style" width="95"/>
        </div>
        <div class="split-right"
            v-show="showRightButton"
            @click="slide('right')">
          <!-- <icon name="bulletarrow" /> -->
          <img :src="require(`@/assets/icons/bullet-arrow.svg`)" :style="style" width="95"/>
        </div>
      </div>
    </div>
    <div id="right-pane" class="right-pane" v-bind:style="rightPaneStyle">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
  import BallMenu from './BallMenu'
  const util = require('../util.js')

  let leftPane
  let rightPane
  let paneSep
  export default {
    name: 'splitpane',
    props: {
      leftPaneStyle: String
    },
    components: {
      ballmenu: BallMenu
    },
    data: function () {
      return {
        showLeftButton: true,
        showRightButton: true,
        leftPaneWidth: 0,
        rightPaneWidth: 0,
        mode: 'split',
        color: 'white'
      }
    },
    methods: {
      slide: function (direction) {
        if (this.mode === 'split') {
          if (direction === 'left') {
            this.leftPaneWidth = leftPane.style.width
            this.rightPaneWidth = rightPane.style.width
            leftPane.style.width = 0
            rightPane.style.width = '100%'
            this.showLeftButton = false
            this.showRightButton = true
            this.mode = 'left'
          } else {
            this.leftPaneWidth = leftPane.style.width
            this.rightPaneWidth = rightPane.style.width
            rightPane.style.width = 0
            leftPane.style.width = '100%'
            this.showLeftButton = true
            this.showRightButton = false
            this.mode = 'right'
          }
        } else if (this.mode === 'left') {
          if (direction === 'right') {
            leftPane.style.width = this.leftPaneWidth
            rightPane.style.width = this.rightPaneWidth
            this.showRightButton = true
            this.showLeftButton = true
            this.mode = 'split'
          }
        } else if (this.mode === 'right') {
          if (direction === 'left') {
            leftPane.style.width = this.leftPaneWidth
            rightPane.style.width = this.rightPaneWidth
            this.showRightButton = true
            this.showLeftButton = true
            this.mode = 'split'
          }
        }
        this.$store.state.leftPaneWidth = leftPane.style.width
      }
    },
    computed: {
      connected: function () {
        return this.$store.state.connected
      },
      xshowRightButton: function () {
        if (!leftPane) { return }
        return !leftPane.style.width
      },
      rightPaneStyle: function () {
        let width = window.lconfig.rightPaneWidth
        width = width || '100%'
        return { width }
      },
      style: function () {
        return '-webkit-filter: opacity(0.5) drop-shadow(0 0 0 ' + this.color + '); filter: opacity(0.5) drop-shadow(0 0 0' + this.color + '); z-index=2000;'
        //       return '-webkit-mask: url(/assets/icons/bullet-arrow.svg) no-repeat 100% 100%;
        //   mask: url(star.svg) no-repeat 100% 100%;
        //   -webkit-mask-size: cover;
        //   mask-size: cover;
        //   background-color: yellow;
        // }
        // return 'color: ' + this.color + ';'
      }
    },
    mounted: function () {
      leftPane = document.getElementById('left-pane')
      rightPane = document.getElementById('right-pane')
      paneSep = document.getElementById('panes-separator')
      // The script below constrains the target to move horizontally between a left and a right virtual boundaries.
      // - the left limit is positioned at 10% of the screen width
      // - the right limit is positioned at 90% of the screen width
      const leftLimit = 0
      const rightLimit = 90

      let vm = this
      paneSep.sdrag(function (el, pageX, startX, pageY, startY, fix) {
        fix.skipX = true
        if (!vm.connected) return
        if (pageX < window.innerWidth * leftLimit / 100) {
          pageX = window.innerWidth * leftLimit / 100
          fix.pageX = pageX
        }
        if (pageX > window.innerWidth * rightLimit / 100) {
          pageX = window.innerWidth * rightLimit / 100
          fix.pageX = pageX
        }
        let cur = pageX / window.innerWidth * 100
        if (cur < 0) {
          cur = 0
        }
        if (cur > window.innerWidth) {
          cur = window.innerWidth
        }
        let right = (100 - cur - 1)
        let rightpix = right * window.innerWidth / 100
        leftPane.style.width = cur + '%'
        rightPane.style.width = right + '%'
        vm.$store.state.leftPaneWidth = leftPane.style.width
        vm.$store.state.rightPaneWidth = rightpix
        // vm.$store.state.leftPaneLeft = cur / 2 + '%'
        // vm.$store.state.leftPaneLeft = (cur - 50) + '%'
      }, null, 'horizontal')

      // paneSep.style.left = paneSep.style.left
      // paneSep.css('left', '+=' + 1)

      // function refresh () {
      //   vm.$store.state.leftPaneLeft = '-200px'
      //   vm.$store.state.leftPaneWidth = '70%'
      //   vm.$store.state.rightPaneWidth = window.lconfig.contentPaneWidth || '700px'
      // }
      // this.$store.state.leftPaneLeft = '-200px'
      // this.leftPaneWidth = parseInt(window.lconfig.leftPaneWidth) + '%'
      // this.rightPaneWidth = 100 - parseInt(window.lconfig.leftPaneWidth) + '%'
      // leftPane.style.width = '0%'
      // rightPane.style.width = '100%'
      leftPane.style.width = parseInt(window.lconfig.leftPaneWidth) + '%'
      rightPane.style.width = 100 - parseInt(window.lconfig.leftPaneWidth) + '%'
      // this.$store.state.leftPaneWidth = window.lconfig.leftPaneWidth
      this.slide('right')
      // this.$store.state.leftPaneWidth = leftPane.style.width
      // if (vm.$store.state.leftPaneWidth) {
      //   leftPane.style.width = vm.$store.state.leftPaneWidth
      // } else {
      //   vm.$store.state.leftPaneWidth = leftPane.style.width
      // }
      // leftPane.style.width = vm.$store.state.leftPaneWidth

      // setTimeout(refresh, 100)
    },
    updated () {
    },
    watch: {
      '$store.state.currentItem': {
        handler: function (val, oldVal) {
          if (val) {
            var theme = this.$store.state.themes[val.id]
            if (theme && theme.background && theme.background.theme) {
              var color = util.rgbaFromTheme(theme.background.theme, 1.0)
              this.color = color
            }
          }
        },
        deep: true,
        immediate: true
      },
      '$store.state.leftPaneWidth': {
        handler: function (val, oldVal) {
          if (val !== oldVal && leftPane !== undefined) {
            val = parseInt(val)
            leftPane.style.width = val + '%'
            rightPane.style.width = 100 - val + '%'

            if (val === 0) {
              this.showRightButton = true
              this.showLeftButton = false
              this.mode = 'left'
            } else if (val === 100) {
              this.showRightButton = false
              this.showLeftButton = true
              this.mode = 'right'
            } else {
              this.showRightButton = true
              this.showLeftButton = true
              this.mode = 'split'
            }
          }
        },
        deep: true,
        immediate: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .panes-container {
    display: flex;
    width: 100%;
    height: 100%;
  }
  .left-pane {
    background: transparent;
    transition: width 0.2s
  }
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Opera and Firefox */
  }
  .panes-separator {
    width: 14px;
    z-index: 5000;
    background: transparent;
    position: relative;
    cursor: col-resize;
    //background-image: url('../assets/vertical.png');
   // background-repeat: no-repeat;
   // background-position: 50% 46%;
    //border-left: 1px solid #ddd;
    //border-right: 1px solid #ddd;
  }
  .panes-container,
  .panes-separator,
  .left-pane,
  .right-pane {
    margin: 0;
    padding: 0;
  }
  .right-pane {
    overflow: hidden;
    transition: width 0.2s
  }
  #left-pane {
    z-index: 1000;
    //overflow-y: auto;
    // padding-top: 33px;
  }
  .split-left, .split-right {
    color: #fff;
    cursor: pointer;
  }
  .split-left {
    position: absolute;
    transform: rotate(180deg);
    margin-top: 0px; 
    margin-left: -57px;
  }
  .split-right {
    position: absolute;
    margin-top: 0px; 
    margin-left: -25px;
  }
  .split-ball {
    position: absolute;
    margin-top: 22px; 
    margin-left: -18px; 
  }
</style>
