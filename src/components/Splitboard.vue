<template>
  <div>
    <!-- <modelviewer/> -->
    <!-- <modalsettings/> -->
    <deep-editor/> 
    <type-menu v-if="ready"/>
    <space-menu v-if="ready && this.$store.state.spacemenu && !config.static"/>
    <!-- <chatmenu v-if="connected && config.comments"/>
    <chat v-if="config.chats && connected"/> -->

   <splitpanes 
      ref="splitpanes"
      vertical
      @pane-maximize="maximized($event)"
      @resize="resize($event)" 
      @resized="resize($event)" 
      style="position: fixed; top: 0px; left: 0px; bottom: 0px; right: 0px; padding-top: 40px; transition: 0s; width: 100%"
      >
      <pane v-if="left" :size="sizes.left" :class="$store.state.darkmode ? 'dark' : 'light'">
        <zircle-viewer style="z-index: 6002;"></zircle-viewer> 
      </pane> 
      <pane v-if="ready && center" :size="sizes.center">
        <content-pane style="z-index: 6002;"></content-pane> 
      </pane>
      <!-- <pane v-if="connected && right && (comments || meeting)" :size="sizes.right">
        <splitpanes horizontal>
          <pane v-if="comments" size="70">
            <comments style="z-index: 6003;"></comments>  
          </pane>
          <pane v-if="meeting" size="30">
            <meeting style="z-index: 6004;" ></meeting>
          </pane>
        </splitpanes>
      </pane> -->
    </splitpanes>

    <div v-if="ready" class="noselect" style="position:fixed; top: 40px; margin-left: -5px; z-index: 6005;" :style="{left: leftBall}">
        <ball-menu class="split-ball"/>
        <div class="arrow-left"
            v-show="showLeftButton"
            @click="slide('left')">
 
          <img :src="require(`@/assets/icons/bullet-arrow.svg`)" class="transition" :style="astyle" width="95"/>
        </div>
        <div class="arrow-right"
            v-show="showRightButton"
            @click="slide('right')">
   
          <img :src="require(`@/assets/icons/bullet-arrow.svg`)" class="transition" :style="astyle" width="95"/>
        </div>

        <middle-menu v-if="false" class="middle-menu"/>
      </div> 
  </div>
</template>

<script>
  import BallMenu from './BallMenu'
  import { Splitpanes, Pane } from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import ContentPane from './ContentPane'
  import ZircleViewer from './ZircleViewer'
  import MiddleMenu from './MiddleMenu'
  // import Comments from './Comments.vue'
  // import Meeting from './meeting/Meeting.vue'

  import SpaceMenu from './SpaceMenu'
  import TypeMenu from './TypeMenu'
  // import Chat from './chat/Chat'
  // import ChatMenu from './ChatMenu'
  // modals
  // import Settings from './modals/Settings'
  import DeepEditor from './modals/DeepEditor'

  const util = require('../util.js')

  export default {
    name: 'splitboard',
    props: {
      leftPaneStyle: String
    },
    components: {
      BallMenu,
      MiddleMenu,
      ContentPane,
      Splitpanes,
      Pane,
      ZircleViewer,
      SpaceMenu,
      TypeMenu,
      DeepEditor
      // Comments,
      // Meeting
    },
    data: function () {
      return {
        init: false,
        comments: true,
        meeting: false,
        showLeftButton: true,
        showRightButton: true,
        left: true,
        center: true,
        right: false,
        sizes: {
          left: 100,
          center: 0,
          right: 0
        },
        lock: false,
        saved: [],
        mode: 'split',
        color: 'white'
      }
    },
    methods: {
      maximize: function (id) {
        let totalMinSizes = 0
        var panes = this.$refs.splitpanes.panes
        panes = panes.map((pane, i) => {
          this.saved[i] = pane.size
          pane.size = i === id ? pane.max : pane.min
          if (i !== id) totalMinSizes += pane.min
          return pane
        })
        panes[id].size -= totalMinSizes
        this.$refs.splitpanes.panes = panes
        this.$refs.splitpanes.$emit('pane-maximize', panes[id])
      },
      restore: function (sizes) {
        if (!this.$refs.splitpanes) return
        var panes = this.$refs.splitpanes.panes
        panes = panes.map((pane, i) => {
          pane.size = sizes[i]
          return pane
        })
        this.$refs.splitpanes.panes = panes
        this.resize(panes)
        // this.$store.state.leftPaneWidth = sizes[0] + '%'
        // this.$refs.splitpanes.$emit('pane-maximize', panes[id])
        // console.log(sizes)
      },
      maximized: function (id) {
        // if (!this.left) this.$store.state.leftPaneWidth = '0%'
        // var panes = this.$refs.splitpanes.panes
        // if (panes.length > 2) this.sizes.right = panes[2].size
        // if (panes.length > 1) this.sizes.center = panes[1].size
        // if (panes.length > 0) this.sizes.left = panes[0].size
        // console.log(this.sizes)
        // this.$store.state.leftPaneWidth = this.$refs.splitpanes.panes[0].size + '%'
        // console.log(id)
      },
      resize: function (data) {
        if (data) {
          if (data.length > 2) this.sizes.right = data[2].size
          if (data.length > 1) this.sizes.center = data[1].size
          if (data.length > 0) this.sizes.left = data[0].size
          // if (!isNaN(data[0].size)) {
          //   this.$store.state.leftPaneWidth = data[0].size + '%'
          // }
          // console.log(data)
        }
      },
      slide: function (direction) {
        if (this.mode === 'split') {
          if (direction === 'left') {
            this.maximize(1)
            this.showLeftButton = false
            this.showRightButton = true
            this.mode = 'left'
            setTimeout(() => { this.sizes.left = 0 }, 100)
          } else {
            this.maximize(0)
            this.showLeftButton = true
            this.showRightButton = false
            this.mode = 'right'
            setTimeout(() => { this.sizes.left = 100 }, 100)
          }
        } else if (this.mode === 'left') {
          if (direction === 'right') {
            this.restore(this.saved)
            this.showRightButton = true
            this.showLeftButton = true
            this.mode = 'split'
          }
        } else if (this.mode === 'right') {
          if (direction === 'left') {
            this.restore(this.saved)
            this.showRightButton = true
            this.showLeftButton = true
            this.mode = 'split'
          }
        }
      }
    },
    computed: {
      leftBall: function () {
        return this.sizes.left + '%'
      },
      connected: function () {
        return this.$store.state.connected
      },
      ready: function () {
        return this.$store.state.ready
      },
      astyle: function () {
        return '-webkit-filter: opacity(0.5) drop-shadow(0 0 0 ' + this.color + '); filter: opacity(0.5) drop-shadow(0 0 0' + this.color + '); z-index=2000;'
        //       return '-webkit-mask: url(/assets/icons/bullet-arrow.svg) no-repeat 100% 100%;
        //   mask: url(star.svg) no-repeat 100% 100%;
        //   -webkit-mask-size: cover;
        //   mask-size: cover;
        //   background-color: yellow;
        // }
        // return 'color: ' + this.color + ';'
      },
      config () {
        return window.lconfig
      }
    },
    mounted: function () {
      setInterval(() => {
        if (this.$store.state.spacemenu && (this.$refs.splitpanes.panes[0].size === 0 || this.mode === 'left')) {
          this.$store.commit('SPACEMENU', false)
        } else if (!this.$store.state.spacemenu && this.mode !== 'left' && (this.$refs.splitpanes.panes[0].size !== 0)) {
          this.$store.commit('SPACEMENU', true)
        }
      }, 100)
    },
    updated: function () {
    },
    events: {
      chatMenuClick (action) {
        if (action) {
          if (action.name === 'comments') {
            this.comments = !this.comments
          }
          if (action.name === 'meeting') {
            this.meeting = !this.meeting
          }
        }
      },
      chatMenuToggle (state) {
        if (state) {
          // this.type = !state.active ? 'circle' : 'tree'
          // this.$refs.menubar.toggle(state.active)
          // this.type = 'tree'
        }
      }
    },
    watch: {
      '$store.state.ready': {
        handler: function (val, oldVal) {
          if (val) {
            // setTimeout(() => {
            //   var size = parseInt(this.$store.state.leftPaneWidth) + 1
            //   this.restore([size, (100 - size)])
            // }, 1000)
          }
        },
        deep: true,
        immediate: true
      },
      '$store.state.currentItem': {
        handler: function (val, oldVal) {
          if (val) {
            var deep = this.$store.getters.getDeepLookForNode(val)
            if (deep && deep.look && deep.look.theme) {
              var color = util.rgbaFromTheme(deep.look.theme, 1.0)
              this.color = color
            }
          }
        },
        deep: true,
        immediate: true
      },
      '$store.state.leftPaneWidth': {
        handler: function (val, oldVal) {
          if (val !== oldVal) {
            val = parseInt(val)

            var size = parseInt(val) + 1
            this.restore([size, (100 - size)])

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

<style lang="scss">
.splitpanes {
  &__pane {
    .splitpanes--vertical & {transition: width 0s ease-out;}
    .splitpanes--horizontal & {transition: height 0s ease-out;}
  }
}
</style>

<style>
  .splitpanes__splitter {
    z-index: 5000;
  }

  .splitpanes--vertical {
    z-index: 5000;
    transition: all 0s;
  }

  .splitpanes--horizontal {
    z-index: 5000;
    transition: all 0s;
  }

  .splitpanes--vertical > .splitpanes__splitter {
    min-width: 14px;
    background: transparent;
     -webkit-box-shadow: 0px 10px 30px rgba(0,0,0,1.0);
    -moz-box-shadow: 0px 10px 30px rgba(0,0,0,1.0);
    box-shadow: 0px 10px 30px rgba(0,0,0,1.0); 
  }

  .splitpanes--horizontal > .splitpanes__splitter {
    min-height: 14px;
    background: transparent;
  }
</style> 

<style scoped>

  .footer {
      position: relative;
      min-height: 150px;
  }
  .footer-content {
      position: absolute;
      bottom: -85vh;
      width: 100%;
      height: 150px;
      font-size: 32px;
      pointer-events: none !important;
      z-index: 9999;
      opacity: 1;
      text-align: center;
      -webkit-box-shadow: 0px -10px 30px rgba(0,0,0,0.85);
      -moz-box-shadow: 0px -10px 30px rgba(0,0,0,0.85);
      box-shadow: 0px -10px 30px rgba(0,0,0,0.85);
  }

  .dark {
    transition: 0.5s background ease;
    background: rgba(0,0,0,0.5);
    /* background: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%); /* Black*/
  }
  .light {
    transition: 0.5s background ease;
    background: rgba(255,255,255,0.5);
    /* background: linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%); /* Black*/
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
  .arrow-left, .arrow-right {
    color: #fff;
    cursor: pointer;
  }
  .transition {
    -webkit-transition: 3s all ease;
    -moz-transition: 3s all ease;
    transition: 3s all ease;
  }
  .arrow-left {
    position: absolute;
    transform: rotate(180deg);
    margin-top: 0px; 
    margin-left: -57px;
  }
  .arrow-right {
    position: absolute;
    margin-top: 0px; 
    margin-left: -25px;
  }
  .split-ball {
    position: absolute;
    margin-top: 22px; 
    margin-left: -18px; 
    cursor: pointer;
  }

  .middle-menu {
    position: absolute;
    margin-top: 120px; 
    margin-left: 47px; 
  }
</style>
