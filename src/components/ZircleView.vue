<template>
    <z-view 
      size="xxl" 
      class="meteor" 
      :style="style(space)">

      <section slot="image"> 
       <!-- <kinesis-container>
        <kinesis-element :strength="10" :type="'depth'"> <!--<div v-anime="{ rotate: '360', easing: 'linear', backgroundColor: 'transparent', duration: 200000, loop: true }">  -->
     
        <!-- <div> 
          <img :src="spotimage(space)" height="475px"> 
        </div> -->
        <div class="transition" :style="style(space)"> 
          <img class="transition" :style="{'opacity': opacity(space, 0.9)}" :src="spotimage(space)" height="475px"> 
        </div>
       <!-- </kinesis-element>
        </kinesis-container> -->
      </section>

      <section slot="media" v-if="mediaready"> 
        <fade-transition :duration="2000" :delay="2000" v-show='mediaFade'>
          <div style="margin-top: 12px;"> 
            <!-- <video-player :src="media(space)" @ready="onMediaReady" @ended="onMediaEnded"></video-player> -->
            <youtube :video-id="media(space)" player-width="780" player-height="500" @ready="onMediaReady" @ended="onMediaEnded" :player-vars="{ controls: 0, showinfo: 0, rel: 0 }"></youtube>
          </div>
        </fade-transition>
      </section>

      <section slot="extension">
        <div class="adjust description" :style="{color: $store.state.darkmode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}">
          <textra :data="description" :timer="1" filter="bottom-top" />
        </div>

        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white ' size=s :distance="150" :angle="-65" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white ' size=s :distance="160" :angle="-130" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white ' size=s :distance="150" :angle="140" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 15px; border-color:white ' size=s :distance="130" :angle="75" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 6px;  border-color:white ' size=xs :distance="160" :angle="-47" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 7px;  border-color:white ' size=xs :distance="185" :angle="160" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 9px;  border-color:white ' size=s :distance="130" :angle="-110" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white ' size=s :distance="180" :angle="94" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white ' size=xs :distance="148" :angle="0" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white' size=xs :distance="160" :angle="110" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 1px;  border-color:white' size=xxs :distance="148" :angle="43" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 1px;  border-color:white' size=xxs :distance="122" :angle="113" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 1px;  border-color:white' size=xxs :distance="132" :angle="210" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 1px;  border-color:white' size=xxs :distance="132" :angle="-82" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width:3px;   border-color:white' size=xs :distance="190" :angle="-160" />

        <z-spot 
          v-if="!mediaFade"
          button 
          @click.native="load()" 
          class="comete" 
          style='background-color: var(--shade-color);border-width:3px;  border-color:white' 
          size=xxl 
          :distance="0" 
          :angle="0">
        </z-spot> 
        <z-spot v-if="$store.state.connected && space && $store.state.currentItem.id === space.id"
          button 
          @click.native="$modal.show('jsoneditor')" 
          class="meteor" 
          :style="style(space)"
          size=s
          :distance="100" 
          :angle="180">
          <icon class="icon" name="cog"></icon>
        </z-spot> 
        <z-spot v-if="mediaready"
          button 
          @click.native="mediaReady = true" 
          class="meteor" 
          :style="style(space)"
          size=s
          :distance="100" 
          :angle="150">
          <icon class="icon" name="play"></icon>
        </z-spot> 
      </section>
      <section v-if="$store.state.ready && space" slot="extension">
        <z-spot
          v-for="(amodel, index) in space.children"
          v-if="isVisible(amodel)"
          :ref="ref(amodel.id)"
          button
          size="l"
          class="meteor"
          :style="style(amodel, index)"
          :distance="distance(space.children, index)"
          :angle="angle(space.children, index)" 
          @click.native="toggle(amodel.id, amodel)"
          :to-view="{ name: 'item0', params: {depth: 1, model: amodel, key: amodel.id, textItems: text, targetEl: target, top: false}}"
          :key="index">
            <a style="font-size: 25px; color: #eee; text-decoration: none;">
                {{ amodel.vtitle }} 
            </a>
            <section slot="image" style="height: 100%; width: 100%;"> <!-- v-html="spot(amodel, 50)"> -->
              <div style="height: 100%; width: 100%;" :style="style(amodel, index)"> 
                <img class="zcentered" :style="{'opacity': opacity(amodel,0.5)}" :src="spotimage(amodel)" height="100%"> 
              </div>
            </section>
            <section slot="extension">
              <z-spot 
                v-for="(subdata, ichild) in amodel.children"
                v-if="isVisible(subdata)"
                :angle="(-90 + 180 / amodel.children.length * ichild) - tweenangle * 2"
                :distance="110"
                class="planetoide"
                :style="style(subdata, ichild, amodel)"
                size="xxs"
                :key="ichild">
              </z-spot>
            </section>
        </z-spot>
        <!-- <z-spot
          button
          size="m"
          class="meteor"
          :distance="200"
          :angle="120"
          :to-view="{ name: 'settings' , params: {}}">
          ...
        </z-spot> -->
      </section>
    </z-view>
</template>

<script>
import {TweenLite, Power2} from 'gsap' // Elastic, Back,
// import VideoPlayer from './VideoPlayer' // Elastic, Back,
import _ from 'lodash'
const util = require('../util.js')

export default {
  name: 'zview',
  // components: {
  //   VideoPlayer
  // },
  props: {
    model: Object,
    textItems: Object,
    targetEl: {
      type: Boolean,
      default: true
    },
    top: {
      type: Boolean,
      default: true
    },
    accordion: Boolean,
    prefix: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      edeep: null,
      graph: null,
      reset: true,
      openFlag: false,
      hasRibbon: false,
      inline: true,
      closearrow: false,
      myContent: '',
      currentView: '',
      mediaFade: false,
      mediaReady: false,
      tween: undefined,
      tween2: undefined,
      movSwap: false,
      mov: {
        angle: -7
      },
      mov2: {
        angle: 0
      }
    }
  },
  computed: {
    description: function () {
      if (this.space && this.space.deep && this.space.deep.look && this.space.deep.look.desc) {
        return [this.space.deep.look.desc]
      }
      return ['']
    },
    item () {
      return this.$store.state.zitem
    },
    root () {
      return this.$store.state.leodata
    },
    space () {
      return this.graph
    },
    text () {
      return this.$store.state.leotext
    },
    cover () {
      return this.$store.state.cover
    },
    // angle () {
    //   return this.$store.state.angle
    // },
    tweenangle () {
      var mov = this.movSwap ? this.mov.angle : this.mov2.angle // this.$store.state.angle
      return mov
      // if (this.$store.state.currentItemPathMapIds.findIndex(id => id === this.model.id) % 2 === 0) {
      //   return mov
      // } else {
      //   return -7 + mov
      // }
    },
    target () {
      return this.targetEl
    },
    connected () {
      return this.$store.state.connected
    },
    mediaready () {
      return this.space && this.hasmedia(this.space) && this.$store.state.currentItem.id === this.space.id
    }
  },
  methods: {
    onMediaReady: function (event) {
      // event.target.setVolume(100);
      event.target.playVideo()
      this.mediaFade = true
    },
    onMediaEnded: function (event) {
      this.mediaFade = false
    },
    isVisible: function (itemdata) {
      if (itemdata.id === 1) { return false }
      if (/^@cover/.test(itemdata.name)) { return false } // theme node hided
      return true
    },
    opacity: function (itemdata, alpha = 1) {
      return alpha // (itemdata.id === this.$store.state.currentItem.id) ? alpha : alpha
    },
    hasmedia: function (itemdata) {
      if (itemdata) {
        var deep = itemdata.deep
        if (deep && deep.look && deep.look.media) {
          return true
        }
      }
      return false
    },
    media: function (itemdata) {
      if (itemdata) {
        var deep = itemdata.deep
        if (deep && deep.look && deep.look.media) {
          return deep.look.media
        }
      }
      return ''
    },
    spotimage: function (itemdata) {
      if (itemdata) {
        var deep = itemdata.deep
        if (deep && deep.look && deep.look.spot) {
          return deep.look.spot
        } else {
          return require(`@/assets/spot.png`)
        }
      }
      return '/static/images/spot.jpg'
    },
    style: function (itemdata, index = 0, parentdata = null) {
      var style = '' // "background-color: orange; border-width: 4px; border-color: var(--background-color);"
      if (itemdata) {
        if (itemdata.id === this.$store.state.currentItem.id) {
          style = 'border-width: 3px; border-color:white; '
        } else {
          style = 'border-width: 0px; border-color:white; '
        }
        var color = 'blue'
        var gdeep = this.$store.state.deep
        var pdeep = parentdata ? parentdata.deep : null
        var deep = itemdata.deep

        index = index > 0 ? index - 1 : index
        if (deep && deep.look && deep.look.theme) {
          color = util.rgbaFromTheme(deep.look.theme)
        } else if (pdeep && pdeep.look && pdeep.look.theme) {
          color = util.rgbaFromTheme(pdeep.look.theme, 1, 30 * index)
        } else if (gdeep && gdeep.look && gdeep.look.theme) {
          color = util.rgbaFromTheme(gdeep.look.theme, 1, 30 * index)
        }

        style += 'background-color: ' + color + ';'
      }
      return style
    },
    load: function () {
      this.toggle(this.space)
    },
    toggle: function (id, data) {
      // console.log('toggle')
      if (window.lconfig.githubRibbon) {
        const ribbon = document.getElementsByClassName('github-ribbon')
        if (ribbon && ribbon[0]) {
          ribbon[0].style.display = 'none'
          window.lconfig.githubRibbon = false
        }
      }
      const cover = document.getElementById('cover-page')
      if (cover) {
        cover.style.display = 'none'
      }

      // toggle the open/close state of the item
      let openItemIds = this.$store.state.openItemIds.slice(0) // clone openid array
      if (!this.isOpen) {
        openItemIds.push(id)
      } else {
        openItemIds = openItemIds.filter(id => id !== this.model.id)
        this.closearrow = true
      }

      // this.$zircle.toView({
      //   to: 'item',
      //   fromSpot: id, // Optional,
      //   params: {model: data, key: id, textItems: this.textItems, targetEl: this.targetEl, top: false}
      // })

      // const ul = this.$el.getElementsByClassName('child-items')[0]
      let vm = this
      setTimeout(function () {
        vm.$store.commit('OPEN_ITEMS', {openItemIds})
        vm.$store.dispatch('setCurrentItem', {id})
      }, 100)
    },
    hasTheme: function (itemdata) {
      return itemdata && itemdata.deep && itemdata.deep.look
    },
    ref: function (id) {
      return 'zspot_' + id
    },
    distance: function (data, index) {
      let length = data.length
      let factor = parseInt(this.$store.state.leftPaneWidth)
      factor = 50 - factor
      factor = factor < 0 ? 0 : factor * 2
      let amount = 1 - 2 * Math.abs(((-length / 2.0) + index) * 2.0 / length)
      return 125 - factor * amount / 3
    },
    angle: function (data, index) {
      let length = data.length
      let amount = (length > 7 ? 360.0 : 180.0) / length
      return -100 + amount * index - this.tweenangle
    },
    checkViewChanged () {
      let vm = this
      let currentView = this.$zircle.getCurrentViewName() // this.$zircle.resolveComponent(this.$zircle.getComponentList(), this.$zircle.getCurrentViewName())
      if (currentView !== this.currentView) {
        this.currentView = currentView
        var id = this.$store.state.zircle[currentView]

        if (id === undefined) {
          // console.log(this.model.id, '   ', id, '  ', this.movSwap)
          setTimeout(() => {
            this.movSwap = !this.movSwap
            if (!this.movSwap) {
              vm.tween2.seek(0)
            } else {
              vm.tween.seek(0)
            }
          }, 500)
        }
      }
    }
  },
  mounted () {
    this.tween = TweenLite.to(this.mov, 1, {
      angle: 0,
      ease: Power2.easeOut,
      repeat: 0
    })
    this.tween2 = TweenLite.to(this.mov2, 1, {
      angle: -7,
      ease: Power2.easeOut,
      repeat: 0
    })

    setInterval(this.checkViewChanged, 200)

    // if (this.$store.state.leodata.length >= 0) {
    //   this.$store.dispatch('setCurrentItem', this.$store.state.leodata[0].id)
    // // console.log(this.model)
    // }

    // var view = this.$zircle.getCurrentViewName()
    // this.$store.commit('ZIRCLE_VIEW', {view: view, id: 'cover'})
  },
  updated () {
    // console.log('ZircleView update')
  },
  // watch: {
  //   '$store.state.currentItem': {
  //     handler: function (val, oldVal) {
  //       this.model = this.$store.state.leodata
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // }
  events: {
    deepUpdate (deep) {
      if (deep) {
        this.space.deep = deep
      }
    }
  },
  watch: {
    '$store.state.currentItem': {
      handler: function (val, oldVal) {
        if (val) {
          this.mediaFade = false
          // if (this.space && val.id !== this.space.id) {
          //   this.mediaReady = false
          // } else {
          //   setTimeout(() => {
          //     if (this.$store.state.currentItem.id === this.space.id) {
          //       this.mediaReady = this.hasmedia(this.space)
          //     } else {
          //       this.mediaReady = false
          //     }
          //   }, 1000)
          // }
        }
      },
      deep: true,
      immediate: true
    },
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
    },
    '$route' (to, from) {
      var fromid = from.path.split('/')[2]
      var toid = to.path.split('/')[2]

      if (this.$store.state.currentItem.id === toid) return
      if (!this.graph) return

      var childs = this.graph.children.map(child => child.id)
      if (!childs.includes(toid)) return

      // console.log('v item: ', fromid, toid)
      const parent = JSON.search(this.$store.state.leodata, '//*[id="' + toid + '"]/parent::*')
      if (parent && parent[0]) {
        const parentid = parent[0].id
        // console.log('v test: ', fromid, parent, parentid)
        if (fromid === parentid) {
          let child = _.find(this.data, child => child.id === toid)
          // console.log('v goto', 'item0', child, this.$refs[this.ref(child.id)])
          this.$store.dispatch('setCurrentItem', {id: toid})
          const refs = this.$refs[this.ref(child.id)]
          if (child && refs && refs.length) {
            this.$zircle.toView({
              to: 'item0',
              fromSpot: refs[0],
              params: { depth: 1,
                model: child,
                key: child.id,
                textItems: this.textItems,
                targetEl: this.targetEl,
                top: false
              }
            })
          }
        }
      }
    }
  }
}
</script>

<style>

.asteroids {
    pointer-events: none !important;
    opacity: 0.10;
}

.planetoide {
    pointer-events: none !important;
    background-color: rgba(255, 255, 255, 1.0);
    opacity: 0.3;
    border: none;
}

.planetoide2 {
    pointer-events: none !important;
    background-color: rgba(255, 255, 255, 1.0);
    opacity: 0.3;
    border: none;
}

.meteor {
    // background-color: rgba(20, 40, 100, 0.7);
    opacity: 1.0;
    border-width: 0px;
}

.comete {
    // background-color: rgba(255, 255, 255, 0.2);
    opacity: 0.01;
}

.transition {
  transition: all 2s ease;
  -webkit-transition: all 2s ease;
}

.zcentered {
  object-fit: cover;
  height: 100%;
  width: 100%;    
  display: block;
  margin: auto auto;
}
</style>