<template>
  <div>
    <!-- <modelviewer/> -->
    <!-- <modalsettings/> -->
    <app-header v-if="!isMobile"/>
    <deep-editor v-if="ready && !isMobile"/>
    <type-menu v-if="ready && !isMobile"/>
    <space-menu v-if="ready && this.$store.state.spacemenu && !config.static"/>
    <chat-menu v-if="ready && !isMobile && config.comments"/> <!--
    <chat v-if="config.chats && connected"/> -->

   <splitpanes 
      ref="splitpanes"
      :horizontal="isMobile"
      @pane-maximize="maximized($event)"
      @resize="resize($event)" 
      @resized="resize($event)" 
      style="position: fixed; top: 0px; left: 0px; bottom: 0px; right: 0px; padding-top: 0px; transition: 0s; width: 100%"
      >
      <pane v-if="left" :size="sizes.left" :class="$store.state.darkmode ? 'dark' : 'dark'">
        <zircle-viewer style="z-index: 6002;"></zircle-viewer> 
      </pane> 
      <pane v-if="ready && center" :size="sizes.center">
      
        <splitpanes 
          ref="splitsocial"
          vertical
          style=""
          >
          <pane>
            <splitpanes horizontal>
              <pane size="100">
                <content-pane style="z-index: 6002;"></content-pane> 
              </pane>
              <!-- <pane v-if="meeting && meetingUrl" size="40">
                <iframe style="z-index: 6004;" :src="meetingUrl" allow="display-capture; geolocation ; microphone ; camera *"></iframe>
              </pane> -->
            </splitpanes>
          </pane> 
          <pane v-if="ready && right && (comments || meeting)" :size="30"> <!--  -->
            <splitpanes horizontal>
              <pane v-if="meeting" size="30">
                <meeting style="z-index: 6004;" ></meeting>
              </pane> 
              <pane v-if="comments" size="100">
                <comments style="z-index: 6003;"></comments>  
              </pane>
            </splitpanes>
          </pane> 
        </splitpanes>
      </pane>

    </splitpanes>

    <div v-if="ready">
      <div v-if="!isMobile" id="ballMenu" @mouseenter="ballEnter" @mouseleave="ballLeave"
        class="noselect" style="position:fixed; transition: top 0.7s ease; top: -100px; margin-left: -50px; z-index: 7005;" :style="{left: leftBall}">
        <div class="selector">
          <ball-menu class="split-ball" @enter="ballMenuEnter" @leave="ballMenuLeave"/>
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
        </div>
        <middle-menu v-if="false" class="middle-menu"/>
      </div> 
      <div v-else class="noselect" style="position:fixed; right: 43px; margin-top: -45px; z-index: 7005;" :style="{top: leftBall}">
        <ball-menu class="split-ball"/>
        <div class="arrow-top"
            v-show="showLeftButton"
            @click="slide('left')">
 
          <img :src="require(`@/assets/icons/bullet-arrow.svg`)" class="transition" :style="astyle" width="95"/>
        </div>
        <div class="arrow-bottom"
            v-show="showRightButton"
            @click="slide('right')">
   
          <img :src="require(`@/assets/icons/bullet-arrow.svg`)" class="transition" :style="astyle" width="95"/>
        </div>

        <middle-menu v-if="false" class="middle-menu"/>
      </div> 
    </div>
  </div>
</template>

<script>
  import AppHeader from './Header'
  import BallMenu from './BallMenu'
  import { Splitpanes, Pane } from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import ContentPane from './ContentPane'
  import ZircleViewer from './ZircleViewer'
  import MiddleMenu from './MiddleMenu'
  import Comments from './Comments.vue'
  import Meeting from './Meeting.vue'

  import SpaceMenu from './SpaceMenu'
  import TypeMenu from './TypeMenu'
  // import Chat from './chat/Chat'
  import ChatMenu from './ChatMenu'
  // modals
  // import Settings from './modals/Settings'
  import DeepEditor from './modals/DeepEditor'
  /// import { Api, Http } from '../lib/bigbluebutton'

  const util = require('../util.js')

  export default {
    name: 'splitboard',
    props: {
      leftPaneStyle: String
    },
    components: {
      AppHeader,
      BallMenu,
      MiddleMenu,
      ContentPane,
      Splitpanes,
      Pane,
      ZircleViewer,
      SpaceMenu,
      TypeMenu,
      DeepEditor,
      Comments,
      ChatMenu,
      Meeting
    },
    data: function () {
      return {
        init: false,
        hasComments: false,
        showComments: false,
        meeting: false,
        showLeftButton: true,
        showRightButton: true,
        ballMenuOpened: false,
        left: true,
        center: true,
        right: true,
        sizes: {
          left: 100,
          center: 0,
          right: 20
        },
        lock: false,
        saved: [],
        mode: 'split',
        color: 'white'
      }
    },
    methods: {
      ballEnter: function () {
        const ball = document.getElementById('ballMenu')
        ball.style.top = '0px'
      },
      ballLeave: function () {
        if (!this.ballMenuOpened) {
          const ball = document.getElementById('ballMenu')
          ball.style.top = '-100px'
        }
      },
      ballMenuEnter: function () {
        this.ballMenuOpened = true
      },
      ballMenuLeave: function () {
        this.ballMenuOpened = false
      },
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

          setTimeout(() => {
            // if (!isNaN(data[0].size)) {
            this.$store.state.leftPaneWidth = this.sizes.left + '%'
            // }
          }, 100)

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
      comments: function () {
        return window.lconfig.comments && this.showComments && this.hasComments
      },
      meetingUrl: function () {
        return window.lconfig.meeting
      },
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
      },
      isMobile () {
        return this.$mq === 'sm'
      }
    },
    mounted: function () {
      // by running bbb-conf --secret on your BBB server
      // console.log(Api, Http)
      // let bbb = {Api, Http}
      // let api = bbb.api(window.lconfig.bbbServer, window.lconfig.bbbApiKey)
      // let http = api.http

      // // api module itslef is responsible for constructing URLs
      // let meetingCreateUrl = api.administration.create('deeplook', '23b537B737', {
      //   duration: 2,
      //   attendeePW: 'secret',
      //   moderatorPW: 'supersecret'
      // })

      // // http method should be used in order to make calls
      // http(meetingCreateUrl).then((result) => {
      //   console.log(result)

      //   let moderatorUrl = api.administration.join('moderator', '1', 'supersecret')
      //   let attendeeUrl = api.administration.join('attendee', '1', 'secret')
      //   console.log(`Moderator link: ${moderatorUrl}\nAttendee link: ${attendeeUrl}`)

      //   let meetingEndUrl = api.administration.end('1', 'supersecret')
      //   console.log(`End meeting link: ${meetingEndUrl}`)
      // })

      setInterval(() => {
        if (this.lock) return
        if (this.$store.state.spacemenu && (this.$refs.splitpanes.panes[0].size === 0 || this.mode === 'left')) {
          this.$store.commit('SPACEMENU', false)
        } else if (!this.$store.state.spacemenu && this.mode !== 'left' && (this.$refs.splitpanes.panes[0].size !== 0)) {
          this.$store.commit('SPACEMENU', true)
        }
      }, 500)
    },
    updated: function () {
    },
    events: {
      fabSwipeFromSlideEnter () {
        this.$store.commit('SPACEMENU', false)
        this.lock = true
      },
      fabSwipeFromSlideLeave () {
        this.$store.commit('SPACEMENU', true)
        this.lock = true
      },
      chatMenuClick (action) {
        if (action) {
          if (action.name === 'comments') {
            this.showComments = !this.showComments
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
            if (deep && deep.look) {
              if (deep.look.theme) {
                var color = util.rgbaFromTheme(deep.look.theme, 1.0)
                this.color = color
              }
              this.hasComments = deep.look.comments !== undefined ? deep.look.comments : true
            }
          }
        },
        deep: true,
        immediate: true
      },
      '$store.state.leftPaneWidth': {
        handler: function (val, oldVal) {
          if (val !== oldVal) {
            val = parseFloat(val)

            var size = parseFloat(val)
            this.restore([size, (100.0 - size)])

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
    background: rgba(0,0,0,0.3);
    -webkit-box-shadow: -10px 10px 15px rgba(0,0,0,0.5);
    -moz-box-shadow: -10px 10px 15px rgba(0,0,0,0.5);
    box-shadow: -10px 10px 15px rgba(0,0,0,0.0); 
  }

  .splitpanes--horizontal > .splitpanes__splitter {
    min-height: 44px;
    background: rgba(0,0,0,0.0);
    -webkit-box-shadow: -10px 10px 15px rgba(0,0,0,0.5);
    -moz-box-shadow: -10px 10px 15px rgba(0,0,0,0.5);
    box-shadow: -10px 10px 15px rgba(0,0,0,0.0); 
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
      -webkit-box-shadow: -10px -10px 30px rgba(0,0,0,0.85);
      -moz-box-shadow: -10px -10px 30px rgba(0,0,0,0.85);
      box-shadow: -10px -10px 30px rgba(0,0,0,0.85);
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
  .selector {
    position: absolute;
    left: -50px;
    width: 200px;
    height: 200px;
    padding-left: 95px;
  }

  .arrow-left {
    position: absolute;
    transform: rotate(180deg);
    margin-top: -6px; 
    margin-left: -57px;
  }
  .arrow-right {
    position: absolute;
    margin-top: 0px; 
    margin-left: -25px;
  }
  .arrow-top {
    position: absolute;
    transform: rotate(-90deg);
    margin-top: -20px; 
    margin-left: -38px;
  }
  .arrow-bottom {
    position: absolute;
    transform: rotate(90deg);
    margin-top: 12px; 
    margin-left: -44px;
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
