<template>
  <div>
    <splitpanes 
      vertical
      @resize="resize($event)" 
      @resized="resize($event)" 
      style="position: fixed; top: 0px; left: 0px; padding-top: 33px; transition: 0.2s; width: 100%"
      >
      <pane :size="sizes.left" :class="$store.state.darkmode ? 'dark' : 'light'">
        <zircle-viewer style="z-index: 6002;"></zircle-viewer> 
      </pane>
      <pane v-if="connected" :size="sizes.center">
        <content-pane style="z-index: 6002;"></content-pane> 
      </pane>
      <pane v-if="connected && (comments || meeting)" :size="sizes.right">
        <splitpanes horizontal>
          <pane v-if="comments" size="70">
            <comments style="z-index: 60003;"></comments>  
          </pane>
          <pane v-if="meeting" size="30">
            <meeting style="z-index: 6004;" ></meeting>
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>

    <div v-if="connected" class="noselect" style="position:fixed; top: 40px; margin-left: -10px; z-index: 6005;" :style="{left: $store.state.leftPaneWidth}">
        <ball-menu class="split-ball"/>
        <div class="arrow-left"
            v-show="showLeftButton"
            @click="slide('left')">
          <!-- <icon name="bulletarrow" /> -->
          <img :src="require(`@/assets/icons/bullet-arrow.svg`)" class="transition" :style="astyle" width="95"/>
        </div>
        <div class="arrow-right"
            v-show="showRightButton"
            @click="slide('right')">
          <!-- <icon name="bulletarrow" /> -->
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
  import Comments from './Comments.vue'
  import Meeting from './meeting/Meeting.vue'
  import ContentPane from './ContentPane'
  import ZircleViewer from './ZircleViewer'
  import MiddleMenu from './MiddleMenu'

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
      Comments,
      Splitpanes,
      Pane,
      ZircleViewer,
      Meeting
    },
    data: function () {
      return {
        comments: true,
        meeting: false,
        showLeftButton: true,
        showRightButton: true,
        sizes: {
          left: 40,
          center: 40,
          right: 20
        },
        saved: {},
        mode: 'split',
        color: 'white'
      }
    },
    methods: {
      resize: function (data) {
        if (data) {
          if (data.length > 2) this.sizes.right = data[2].size
          if (data.length > 1) this.sizes.center = data[1].size
          if (data.length > 0) this.sizes.left = data[0].size
          // console.log(this.sizes)
          this.$store.state.leftPaneWidth = this.sizes.left + '%'
        }
      },
      slide: function (direction) {
        if (this.mode === 'split') {
          if (direction === 'left') {
            this.saved = this.sizes
            this.sizes.left = 0
            this.sizes.center = 100 - this.sizes.right
            this.showLeftButton = false
            this.showRightButton = true
            this.mode = 'left'
          } else {
            this.saved = this.sizes
            this.sizes.center = 0
            this.sizes.left = 100
            this.showLeftButton = true
            this.showRightButton = false
            this.mode = 'right'
          }
        } else if (this.mode === 'left') {
          if (direction === 'right') {
            this.sizes = this.saved
            this.showRightButton = true
            this.showLeftButton = true
            this.mode = 'split'
          }
        } else if (this.mode === 'right') {
          if (direction === 'left') {
            this.sizes = this.saved
            this.showRightButton = true
            this.showLeftButton = true
            this.mode = 'split'
          }
        }
        // this.$store.state.leftPaneWidth = this.sizes.left
      }
    },
    computed: {
      connected: function () {
        return this.$store.state.connected
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
      }
    },
    mounted: function () {
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
          if (val !== oldVal) {
            val = parseInt(val)

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

<style>
  .splitpanes__splitter {
    z-index: 5000;
  }

  .splitpanes--vertical {
    z-index: 5000;
  }

  .splitpanes--horizontal {
    z-index: 5000;
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
