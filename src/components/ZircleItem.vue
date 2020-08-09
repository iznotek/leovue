<template>
    <z-view 
      v-if="model" 
      size="xxl" 
      class="meteor" 
      :style="style(model)">

      <section slot="image"> 
        <div class="transition" :style="style(model)"> 
          <img class="transition" :style="{'opacity': opacity(model, 0.8)}" :src="spotimage(model)" height="475px"> 
        </div>
      </section>

      <section slot="media">
        <fade-transition v-if="mediaready" :duration="1000" :delay="2000" v-show='mediaFade'>
          <div style="margin-top: 12px;"> 
            <youtube :video-id="media(model)" player-width="780" player-height="500" @ready="onMediaReady" @ended="onMediaEnded" :player-vars="{ controls: 0, showinfo: 0, rel: 0, color: 'white' }"></youtube>
          </div>
        </fade-transition>

        <div v-if="!mediaready" style="height: 75px" />
        <!-- <div v-if="!mediaready" :class="current(model) ? 'current-label-background current-label-bottom' : 'current-label-background current-label-bottom-hide'" > -->
        <div v-if="!mediaready" :class="'current-label-background current-label-bottom'" >
          <a style="font-size: 25px; color: #eee; text-decoration: none;">
            {{ model.vtitle }} 
          </a>
        </div>
      </section>

      <section slot="extension">
        <div v-if="$mq !== 'sm'" class="adjust description" :style="{color: 'rgba(255,255,255,0.5)'}">
        <!--<div class="adjust description" :style="{color: $store.state.darkmode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}"> -->
          <textra :data="description" :timer="1" filter="bottom-top" />
        </div>
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
        <!-- <z-spot 
          v-if="selected(model)"
          style='background-color: rgba(0,0,0,0);border-width:0px;' 
          size='m' 
          :distance="84" 
          :angle="-60">
            <img :src="require(`@/assets/logo.png`)" width="95"/>
        </z-spot> -->

        <z-spot v-if="$store.state.connected && $store.state.currentItem.id === model.id"
          button 
          @click.native="$modal.show('jsoneditor')" 
          class="meteor" 
          :style="style(model)"
          size=s
          :distance="100" 
          :angle="180">
          <icon class="icon" name="cog"></icon>
        </z-spot> 
        <z-spot v-if="mediaready"
          button 
          @click.native="mediaswitch" 
          class="meteor" 
          :style="style(model)"
          size=s
          :distance="100" 
          :angle="160">
          <icon class="icon" :name="!mediaFade ? 'play' : 'stop'"></icon>
        </z-spot> 
        <z-spot v-if="mediaready && mediaVolume > 0 && mediaFade"
          button 
          @click.native="mediaswitchaudio" 
          class="meteor" 
          :style="style(model)"
          size=s
          :distance="100" 
          :angle="140">
          <icon class="icon" :name="!mediaMute ? 'volume-up' : 'volume-mute'"></icon>
        </z-spot> 
        
        <z-spot
          v-for="(amodel, index) in data.children"
          v-if="isVisible(data, amodel)"
          :ref="ref(data.id, amodel.id)"
          button
          :size="size(amodel, data.children.length, index)"
          class="meteor"
          :style="style(amodel, index)"
          :distance="distance(amodel, data.children.length, index)"
          :angle="angle(amodel, data.children.length, index)" 
          @click.native="toggle(amodel)"
          :to-view="isDataFolder(amodel) ? { name: zitem, params: { depth: zdepthinc, model: amodel, key: amodel.id, textItems: textItems, targetEl: target, top: false}} : {}"
          :key="amodel.id">
      
            <div style="height: 100px" />
            <div :class="'current-label-background current-label-bottom2-hide'">
              <!-- <div :class="current(amodel) ? 'current-label-background current-label-bottom2' : 'current-label-background current-label-bottom2-hide'">
            
              <span>{{ amodel.vtitle }}</span> -->
              <div style="font-size: 15px; color: #eee; text-decoration: none; width: 150px; margin: auto;">
                {{ amodel.vtitle }} 
              </div>
            </div>
    
            <section slot="image" style="height: 100%; width: 100%;">
              <div style="height: 100%; width: 100%;" :style="style(amodel, index)"> 
                <img class="zcentered" :style="{'opacity': opacity(amodel,0.5)}" :src="spotimage(amodel)" height="100%" > 
              </div>
            </section>
           
            <section slot="extension">
                <!-- <z-spot 
                v-if="selected(amodel)"
                style='background-color: rgba(0,0,0,0);border-width:0px;' 
                size='s' 
                :distance="77" 
                :angle="-60">
                  <img :src="require(`@/assets/logo.png`)" width="55"/>
              </z-spot> -->
              <z-spot 
                v-for="(subdata, ichild) in amodel.children"
                v-if="isVisible(amodel, subdata)"
                :angle="(-90 + 180 / amodel.children.length * ichild) + tweenangle * 2"
                :distance="110"
                :style="style(subdata, ichild, amodel)"
                class="planetoide2"
                size="xxs"
                :key="ichild">
              </z-spot>
            </section>
        </z-spot>
      </section>
    </z-view>
</template>

<script>
import Velocity from 'velocity-animate'
import _ from 'lodash'
// import {TweenLite, Power2} from 'gsap' // Elastic, Back,

const util = require('../util.js')

export default {
  name: 'zitem',
  props: {
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
      model: undefined,
      reset: true,
      openFlag: false,
      hasRibbon: false,
      inline: true,
      closearrow: false,
      myContent: '',
      depth: -1,
      currentView: '',
      mediaPlayer: null,
      mediaFade: false,
      mediaReady: false,
      mediaVolume: 50,
      mediaMute: true,
      mediaAutoPlay: false,
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
  mounted () {
    // this.tween = TweenLite.to(this.mov, 1, {
    //   angle: 0,
    //   ease: Power2.easeOut,
    //   repeat: 0
    // })
    // this.tween2 = TweenLite.to(this.mov2, 1, {
    //   angle: -7,
    //   ease: Power2.easeOut,
    //   repeat: 0
    // })
    setInterval(this.checkViewChanged, 200)

    if (this.$zircle.getParams() !== undefined) { // } && this.depth === -1) {
      this.model = this.$zircle.getParams().model
      this.depth = this.$zircle.getParams().depth

      var id = this.model.id
      var view = this.$zircle.getCurrentViewName()
      this.$store.commit('ZIRCLE_VIEW', {view: view, id: id})

      // console.log(this.$zircle.getCurrentViewName())
      // console.log('id :', id)
      // console.log('depth :', this.depth)
      // console.log(this.model.children.length)
      // console.log('')
    } else {
      // this.model = undefined
    }
  },
  updated () {
    // if (this.$zircle.getParams() !== undefined) {
    //   this.model = this.$zircle.getParams().model
    //   this.depth = this.$zircle.getParams().depth
    // }
    // if (this.$zircle.getParams() !== undefined) {
    //   this.model = this.$zircle.getParams().model
    // }
    // let openItemIds = this.$store.state.openItemIds.slice(0) // clone openid array
    // if (!this.isOpen) {
    //   openItemIds.push(this.model.id)
    // } else {
    //   openItemIds = openItemIds.filter(id => id !== this.model.id)
    //   this.closearrow = true
    // }

    // // const ul = this.$el.getElementsByClassName('child-items')[0]
    // this.$store.commit('OPEN_ITEMS', {openItemIds})
    // this.myContent = this.$store.state.contentItems[this.model.id]
  },
  computed: {
    // id: function () {
    //   return this.prefix + (this.model !== undefined && this.model.hasOwnProperty('id')) ? this.model.id : 'undefined'
    // },
    description: function () {
      if (this.model && this.model.deep && this.model.deep.look && this.model.deep.look.desc) {
        return [this.model.deep.look.desc]
      }
      return ['']
    },
    target: function () {
      return this.targetEl
    },
    nid: function () {
      return this.prefix + '_' + this.model.id
    },
    data: function () {
      if (this.model === undefined) {
        var empty = {children: []}
        return empty
      }
      return this.model
    },
    ready: function () {
      return this.model !== undefined
    },
    tweenangle () {
      var mov = this.movSwap ? this.mov.angle : this.mov2.angle // this.$store.state.angle
      if (this.model !== undefined) {
        return mov
      }
      return 0
      // if (this.$store.state.currentItemPathMapIds.findIndex(id => id === this.model.id) % 2 === 0) {
      //   return mov
      // } else {
      //   return -7 + mov
      // }
    },
    content: function () {
      // if (this.$zircle.getParams() !== undefined) {
      //   this.model = this.$zircle.getParams().model
      // }

      let openItemIds = this.$store.state.openItemIds.slice(0) // clone openid array
      if (!this.isOpen) {
        openItemIds.push(this.model.id)
      } else {
        openItemIds = openItemIds.filter(id => id !== this.model.id)
        this.closearrow = true
      }
      this.myContent = this.$store.state.contentItems[this.model.id]

      // var spot = this.spot(this.model)
      // if (spot !== false) {
      //   return spot
      // }
      // const ul = this.$el.getElementsByClassName('child-items')[0]
      // this.$store.commit('OPEN_ITEMS', {openItemIds})
      return this.myContent
    },
    arrowIcon: function () {
      return window.lconfig.itemArrow || '▶'
    },
    isFolder: function () {
      // console.log(this.model.name)
      if (/\.leo\)$/.test(this.model.name)) { return true } // subtree
      if (/^@outline/.test(this.model.name)) { return true } // outline
      return this.model.children && this.model.children.length
    },
    isClosedSibling: function () {
      if (this.isOpen) { return ' open' }
      const nextSiblings = JSON.search(this.$store.state.leodata, '//*[id="' + this.model.id + '"]/following-sibling::*')
      const prevSiblings = JSON.search(this.$store.state.leodata, '//*[id="' + this.model.id + '"]/preceding-sibling::children')
      var foo = nextSiblings.length + '_' + prevSiblings.length
      return foo
      // check if any siblings are open
      // if yes then return true
      // else return false
    },
    hasOpenSibling: function () {
      if (!this.accordion) { return false }
      // don't need this for standalone component e.g. kanban
      if (this.model.parent) { return false }
      // TODO: this is slow, need to refactor, possibly replace defiant wth parent pointer on item
      // if (this.isOpen) { return ' open' }
      if (!this.isOpen) { return }
      const nextSiblings = JSON.search(this.$store.state.leodata, '//*[id="' + this.model.id + '"]/following-sibling::*')
      const prevSiblings = JSON.search(this.$store.state.leodata, '//*[id="' + this.model.id + '"]/preceding-sibling::children')
      let siblings = nextSiblings.concat(prevSiblings)
      siblings = siblings.map(s => s.id)
      let hasOpen = false
      const ids = this.$store.state.openItemIds
      siblings.forEach(sid => {
        if (ids.indexOf(sid + '') > -1) { hasOpen = true }
      })
      hasOpen = false
      // if parent prop has been set, get siblings from there. This will be case when
      // item is working off of cloned subset of the leo file, not the full tree
      if (this.model.parent) {
        let siblings = this.model.parent.children
        if (siblings.length > 1) { hasOpen = true }
      }
      return hasOpen
      // check if any siblings are open
      // if yes then return true
      // else return false
    },
    isOpen: function () {
      const ids = this.$store.state.openItemIds
      let open = false
      if (this.model !== undefined && ids.indexOf(this.model.id + '') !== -1) { open = true }
      return open
    },
    isOpenInline: function () {
      return this.$route.name === 'ANode'
      // return true
      // return this.isOpen && this.$route.name === 'ANode'
    },
    isOpenA: function () {
      if (_.has(this.model, 'o')) {
        return this.closearrow
      }
      return this.isOpen && !this.closearrow
    },
    active: function () {
      // TODO: change ids to strings
      if (this.model === undefined) { return false }
      if (this.$store.state.currentPage.id) {
        return this.$store.state.currentPage.id === this.model.id
      }
      return this.$store.state.currentItem.id === this.model.id
    },
    activeBackgroundColor: function () {
      const bg = window.lconfig.activeBackgroundColor || '#01FF70'
      if (this.active) {
        return bg
      }
      return '#ffffff'
    },
    zitem: function () {
      // console.log('item' + this.depth)
      if (this.depth !== -1) {
        return 'item' + this.depth
      }
      return ''
    },
    zdepthinc: function () {
      return this.depth + 1
    },
    mediaready: function () {
      return this.model && this.hasmedia(this.model) && this.$store.state.currentItem.id === this.model.id
    }
  },
  methods: {
    onMediaReady: function (event) {
      this.mediaPlayer = event.target
      this.mediaPlayer.setVolume(this.mediaMute ? 0 : this.mediaVolume)
      this.mediaFade = this.mediaAutoPlay
      if (this.mediaAutoPlay) this.mediaPlayer.playVideo()
    },
    onMediaEnded: function (event) {
      this.mediaFade = false
    },
    hasmedia: function (itemdata) {
      if (itemdata) {
        var deep = itemdata.deep
        if (deep && deep.look && deep.look.media) {
          this.mediaVolume = deep.look.volume || 50
          this.mediaMute = this.mediaVolume === 0
          this.mediaAutoPlay = deep.look.autoplay || false
          return true
        }
      }
      this.mediaMute = true
      this.mediaAutoPlay = false
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
    mediaswitch: function () {
      this.mediaFade = !this.mediaFade
      if (this.mediaPlayer) {
        if (this.mediaFade) {
          this.mediaPlayer.playVideo()
        } else {
          this.mediaPlayer.pauseVideo()
        }
      }
    },
    mediaswitchaudio: function () {
      this.mediaMute = !this.mediaMute
      if (this.mediaPlayer) {
        this.mediaPlayer.setVolume(this.mediaMute ? 0 : this.mediaVolume)
      }
    },
    checkViewChanged () {
      let currentView = this.$zircle.getCurrentViewName() // this.$zircle.resolveComponent(this.$zircle.getComponentList(), this.$zircle.getCurrentViewName())
      if (currentView !== this.currentView) {
        this.currentView = currentView

        // var id = this.$store.state.zircle[currentView]
        // let vm = this
        // if (this.model !== undefined) {
        //   if (id === this.model.id) {
        //     setTimeout(() => {
        //       this.movSwap = !this.movSwap
        //       if (!this.movSwap) {
        //         vm.tween2.seek(0)
        //       } else {
        //         vm.tween.seek(0)
        //       }
        //     }, 500)
        //   }
        // }
      }
    },
    isDataFolder: function (itemdata) {
      // console.log(this.model.name)
      if (/\.leo\)$/.test(itemdata.name)) { return true } // subtree
      if (/^@outline/.test(itemdata.name)) { return true } // outline
      let nbVisibleItems = 1
      // for (let i = 0; i < itemdata.children.length; i++) {
      //   if (this.isVisible(itemdata.children[i])) {
      //     nbVisibleItems += 1
      //   }
      // }
      return nbVisibleItems > 0
      // return itemdata.children && itemdata.children.length
    },
    isVisible: function (parentData, itemdata) {
      if (/^@page/.test(parentData.name)) { return false } // outline
      return itemdata !== undefined
    },
    hasTheme: function (itemdata) {
      return itemdata && itemdata.deep && itemdata.deep.look
    },
    ref: function (id, sid) {
      return id + '_zspot_' + sid
    },
    distance: function (itemdata, length, index) {
      let look = (itemdata && itemdata.deep && itemdata.deep.look) ? itemdata.deep.look : {}
      if (look.distance !== undefined) return look.distance
      let factor = parseInt(this.$store.state.leftPaneWidth)
      factor = 50 - factor
      factor = factor < 0 ? 0 : factor * 2
      let amount = 1 - 2 * Math.abs(((-length / 2.0) + index) * 2.0 / length)
      return 125 - factor * amount / 3
    },
    angle: function (itemdata, length, index) {
      let look = (itemdata && itemdata.deep && itemdata.deep.look) ? itemdata.deep.look : {}
      if (look.angle !== undefined) return look.angle
      let amount = (length > 7 ? 360.0 : length > 5 ? 230.0 : length > 3 ? 180.0 : 150.0) / length
      return -15 * length + amount * index - this.tweenangle
    },
    size: function (itemdata, length, index) {
      let look = (itemdata && itemdata.deep && itemdata.deep.look) ? itemdata.deep.look : {}
      if (look.size !== undefined) return look.size
      return 'l'
    },
    current: function (itemdata) {
      if (itemdata) {
        return itemdata.id === this.$store.state.currentItem.id
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
        var pdeep = parentdata ? parentdata.deep : null
        var deep = itemdata.deep
        // console.log(itemdata, deep.look.theme)
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
    opacity: function (itemdata, alpha = 1) {
      return alpha // (itemdata.id === this.$store.state.currentItem.id) ? alpha : alpha
    },
    selected: function (itemdata) {
      return (itemdata.id === this.$store.state.currentItem.id)
    },
    spot: function (itemdata, alpha = 100) {
      var spot = this.spotimage(itemdata)
      var style = 'transition: all 1s ease; -webkit-transition: all 1s ease;'
      // var style = (itemdata.id === this.$store.state.currentItem.id) ? ' border-color:#ff0' : ''
      alpha = (itemdata.id === this.$store.state.currentItem.id) ? alpha + 50 : alpha
      return '<div class="transition" style="' + style + ' margin-left: -0px; margin-top: -0px; opacity:' + alpha / 100.0 + ';"> <img src="' + spot + '" height="100%"> </div>'
    },
    spotstyle: function (itemdata, alpha = 100) {
      var spot = this.spotimage(itemdata)
      return '<div style="margin-left: -0px; margin-top: -0px; opacity:' + alpha / 100.0 + ';filter:alpha(opacity=' + alpha + ');"> <img src="' + spot + '"height="100%"> </div>'
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
      return false
    },
    load: function () {
      this.toggle(this.model)
    },
    toggle: function (itemdata) {
      // console.log('toggle')
      var id = itemdata.id
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

      let openItemIds = this.$store.state.openItemIds.slice(0) // clone openid array
      if (!this.isOpen) {
        openItemIds.push(this.model.id)
      } else {
        openItemIds = openItemIds.filter(id => id !== this.model.id)
        this.closearrow = true
      }

      // const ul = this.$el.getElementsByClassName('child-items')[0]
      // console.log(openItemIds)
      this.$store.commit('OPEN_ITEMS', {openItemIds})

      if (this.model.page) {
        // TODO: this is duplicate of code in store
        let page = this.model.page
        this.$store.dispatch('setCurrentItem', {id: page.pid})
        this.$store.dispatch('setCurrentPageSection', {id: page.id})
        const sectionId = `x${page.pid}-${page.id}`
        const sectionEl = document.getElementById(sectionId)
        const container = document.getElementById('content-inner-containerb')
        Velocity(sectionEl, 'scroll', { container })
        console.log('page', page)
        return
      }
      this.$store.dispatch('setCurrentItem', {id})
      this.myContent = this.$store.state.contentItems[this.model.id]
    }
  },
  events: {
    deepUpdate (deep) {
      if (deep) {
        this.model.deep = deep
      }
    }
  },
  watch: {
    '$store.state.currentItem': {
      handler: function (val, oldVal) {
        if (val) {
          this.mediaFade = false
          // this.mediaReady = false this.model && this.model.id === val.id && this.hasmedia(this.model)
          // if (val.id !== this.model.id) {
          //   this.mediaReady = false
          // } else {
          //   setTimeout(() => {
          //     console.log(this.$store.state.currentItem, this.model)
          //     if (val.id === this.model.id) {
          //       this.mediaReady = this.hasmedia(this.model)
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
    '$route' (to, from) {
      var fromid = from.path.split('/')[2]
      var toid = to.path.split('/')[2]

      if (this.$store.state.currentItem.id === toid) return

      var childs = this.data.children.map(child => child.id)
      if (!childs.includes(toid)) return
      if (this.data.id !== fromid) return

      // console.log('item: ', this.data.id, fromid, toid)
      const parent = JSON.search(this.$store.state.leodata, '//*[id="' + toid + '"]/parent::*')
      if (parent && parent[0]) {
        const parentid = parent[0].id
        // console.log('test: ', fromid, parentid)
        if (fromid === parentid) {
          let child = _.find(this.data.children, child => child.id === toid)
          // console.log('goto', this.zitem, child, this.$refs[this.ref(this.data.id, child.id)][0])
          this.$store.dispatch('setCurrentItem', {id: toid})
          const refs = this.$refs[this.ref(this.data.id, child.id)]
          if (child && refs && refs.length) {
            this.$zircle.toView({
              to: this.zitem, // string. Required,
              fromSpot: refs[0],
              params: { depth: this.zdepthinc,
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
    },
    '$store.state.contentItemsUpdateCount': {
      handler: function (val, oldVal) {
        if (!this.isOpenInline) { return }
        if (val > 0 && val !== oldVal) {
          const text = this.$store.state.contentItems[this.model.id]
          this.myContent = text
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>


<style>

</style>