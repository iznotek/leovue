<template>
    <z-view size="xxl" class="meteor">
      <section slot="image"> 
       <!-- <kinesis-container>
        <kinesis-element :strength="10" :type="'depth'"> <!--<div v-anime="{ rotate: '360', easing: 'linear', backgroundColor: 'transparent', duration: 200000, loop: true }">  -->
     
        <div> 
          <img :src="spotimage(root[0])" height="475px"> 
        </div>
       <!-- </kinesis-element>
        </kinesis-container> -->
      </section>

      <section slot="extension">
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
      </section>
      <section v-if="connected" slot="extension">
        <z-spot
          v-for="(amodel, index) in data"
          v-if="isVisible(amodel)"
          :ref="ref(amodel.id)"
          button
          size="l"
          class="meteor"
          :style="style(amodel, index)"
          :distance="distance(data, index)"
          :angle="angle(data, index)" 
          @click.native="toggle(amodel.id, amodel)"
          :to-view="{ name: 'item0', params: {depth: 1, model: amodel, key: amodel.id, textItems: text, targetEl: target, top: false}}"
          :key="index">
            <a style="font-size: 25px">
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
import {TweenLite, Power2} from 'gsap/TweenMax' // Elastic, Back,
import _ from 'lodash'
const util = require('../util.js')

export default {
  name: 'zview',
  props: {
    model: Object,
    targetEl: Boolean,
    textItems: Object,
    top: Boolean,
    accordion: Boolean,
    prefix: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      reset: true,
      openFlag: false,
      hasRibbon: false,
      inline: true,
      closearrow: false,
      myContent: '',
      currentView: '',
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
    item () {
      return this.$store.state.zitem
    },
    root () {
      return this.$store.state.leodata
    },
    data () {
      return this.$store.state.leodata ? this.$store.state.leodata[0].children : undefined
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
    }
  },
  methods: {
    isVisible: function (itemdata) {
      if (itemdata.id === 1) { return false }
      if (/^@cover/.test(itemdata.name)) { return false } // theme node hided
      return true
    },
    opacity: function (itemdata, alpha = 1) {
      return alpha // (itemdata.id === this.$store.state.currentItem.id) ? alpha : alpha
    },
    spotimage: function (itemdata) {
      if (itemdata) {
        var deep = this.$store.state.deeps[itemdata.id]
        if (deep && deep.look.spot) {
          return deep.look.spot
        } else {
          return require(`@/assets/spot.png`) // 'static/arkom/spot.png'
        }
      }
      return false
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
        var pdeep = parentdata ? this.$store.state.deeps[parentdata.id] : null
        var deep = this.$store.state.deeps[itemdata.id]

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
      repeat: -1
    })
    this.tween2 = TweenLite.to(this.mov2, 1, {
      angle: -7,
      ease: Power2.easeOut,
      repeat: -1
    })

    setInterval(this.checkViewChanged, 200)

    this.model = this.$store.state.leodata
    this.textItems = this.$store.state.leotext
    this.targetEl = true
    this.top = true
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
  watch: {
    '$route' (to, from) {
      var fromid = from.path.split('/')[2]
      var toid = to.path.split('/')[2]

      if (this.$store.state.currentItem.id === toid) return

      var childs = this.data.map(child => child.id)
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