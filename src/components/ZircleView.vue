<template>
    <z-view size="xxl">
      <section slot="media"> 
         <parallax-container>
        <parallax-element :parallaxStrength="20" :type="'depth'"> 
        <div v-anime="{ rotate: '360', easing: 'linear', backgroundColor: 'transparent', duration: 200000, loop: true }"> 
          <img src="static/arkom/earth.jpg" width="475px" height="475px">
        </div>
         </parallax-element>
        </parallax-container> 
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
          ref=amodel.id
          button
          size="l"
          class="meteor"
          :style="style(amodel, index)"
          :distance="175 - 50 * Math.cos( (-90 + (data.length > 7 ? 360 : 180) / data.length * index) * 3.14 / 180.0 )"
          :angle="(-90 + (data.length > 7 ? 360 : 180) / data.length * index) + angle"
          @click.native="toggle(amodel.id, amodel)"
          :to-view="{ name: 'item0', params: {depth: 1, model: amodel, key: amodel.id, textItems: text, targetEl: target, top: false}}"
          :key="index">
            {{ amodel.vtitle }}
            <section slot="image"> <!-- v-html="spot(amodel, 50)"> -->
              <div class="transition" :style="style(amodel, index)"> 
                <img class="transition" :style="{'opacity': opacity(amodel,0.5)}" :src="spotimage(amodel)" height="100%"> 
              </div>
            </section>
            <section slot="extension">
              <z-spot 
                v-for="(subdata, ichild) in amodel.children"
                v-if="isVisible(subdata)"
                :angle="(-90 + 180 / amodel.children.length * ichild) - angle * 2"
                :distance="107"
                class="planetoide"
                style="background-color: rgba(255,255,255,1.0);border: none;"
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
      myContent: ''
    }
  },
  computed: {
    item () {
      return this.$store.state.zitem
    },
    data () {
      return this.$store.state.leodata
    },
    text () {
      return this.$store.state.leotext
    },
    cover () {
      return this.$store.state.cover
    },
    angle () {
      return this.$store.state.angle
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
      if (/^@theme/.test(itemdata.name)) { return false } // theme node hided
      if (/^@cover/.test(itemdata.name)) { return false } // theme node hided
      return true
    },
    opacity: function (itemdata, alpha = 1) {
      return alpha // (itemdata.id === this.$store.state.currentItem.id) ? alpha : alpha
    },
    spotimage: function (itemdata) {
      if (itemdata) {
        var theme = this.$store.state.themes[itemdata.id]
        if (theme && theme.background.spot) {
          return theme.background.spot
        } else {
          return require(`@/assets/spot.png`) // 'static/arkom/spot.png'
        }
      }
      return false
    },
    style: function (itemdata, index = 0) {
      var style = '' // "background-color: orange; border-width: 4px; border-color: var(--background-color);"
      if (itemdata) {
        // if (itemdata.id === this.$store.state.currentItem.id) {
        //   style = 'border-width: 20px; border-color:#ff0'
        // }
        var color
        var theme = this.$store.state.themes[itemdata.id]
        index = index > 0 ? index - 1 : index
        if (theme && theme.background.theme) {
          color = util.rgbaFromTheme(theme.background.theme)
          // console.log(itemdata.id + ' : ' + index, '  :  ', color)
          style = 'background-color: ' + color + ';'
        } else if (this.$store.state.theme) {
          // console.log(this.$store.state.theme)
          color = util.rgbaFromTheme(this.$store.state.theme.background.theme, 1, 30 * index)
          // console.log(itemdata.id + ' : ' + index, '  :  ', color)
          style = 'background-color: ' + color + ';'
        }
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
    }
  },
  mounted () {
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
  } // ,
  // watch: {
  //   '$store.state.currentItem': {
  //     handler: function (val, oldVal) {
  //       this.model = this.$store.state.leodata
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // }
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
}

.comete {
    // background-color: rgba(255, 255, 255, 0.2);
    opacity: 0.01;
}
</style>