<template>
    <z-view label="Home" size="xxl">

      <div style="margin-left: -100px; margin-top: -60px"> 
        <img src="https://media.fromthegrapevine.com/assets/images/2017/8/earth-planet-0802.jpg.480x0_q71_crop-scale.jpg" width="800" height="500">
      </div>

      <div slot="extension">
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white ' size=s :distance="150" :angle="-65">
        </z-spot>
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white ' size=s :distance="160" :angle="-130">
        </z-spot>
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white ' size=s :distance="150" :angle="140">
        </z-spot>
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 15px;  border-color:white ' size=s :distance="130" :angle="75" />
        <z-spot class="asteroids stay" style='background-color: var(--shade-color);border-width: 6px;  border-color:white ' size=xs :distance="160" :angle="-47" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 7px;  border-color:white ' size=xs :distance="185" :angle="160"></z-spot>
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 9px;  border-color:white ' size=s :distance="130" :angle="-110" />

        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white ' size=s :distance="180" :angle="94">
        </z-spot>

        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white ' size=xs :distance="148" :angle="0">
        </z-spot>
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white' size=xs :distance=160 :angle="110">
        </z-spot>
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 1px;  border-color:white' size=xxs :distance=148 :angle="43" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 1px;  border-color:white' size=xxs :distance=122 :angle="113" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 1px;  border-color:white' size=xxs :distance=132 :angle="210" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 1px;  border-color:white' size=xxs :distance=132 :angle="-82" />
        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width:3px;  border-color:white' size=xs :distance=190 :angle="-160">
        </z-spot>

        <z-spot class="asteroids" style='background-color: var(--shade-color);border-width: 3px;  border-color:white' size=xs :distance=190 :angle="angle + 130">
        </z-spot>
      </div>
      <div slot="extension">
        <z-spot
          v-for="(itemdata, index) in data"
          ref=itemdata.id
          button
          size="l"
          class="meteor"
          :distance="160"
          :angle="35 - (270 / data.length * index)"
          @click.native="toggle(itemdata.id, itemdata)"
          :to-view="{ name: 'item', params: {model: itemdata, key: itemdata.id, textItems: text, targetEl: targetEl, top: false}}"
          :key="index">
          {{ itemdata.vtitle }}
        </z-spot>
        <z-spot
          button
          size="m"
          class="meteor"
          :distance="190"
          :angle="90"
          :to-view="{ name: 'settings' , params: {}}">
          Settings
        </z-spot>
      </div>
    </z-view>
</template>

//       <youtube :video-id="'QI9ta7qkazU'" player-width="1280px" player-height="720px" :player-vars="{autoplay: 1}"></youtube>
      // <iframe slot="media" src="model" />
<script>
// import Velocity from 'velocity-animate'
export default {
  name: 'view',
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
    data () {
      return this.$store.state.leodata
    },
    text () {
      return this.$store.state.leotext
    },
    cover () {
      return this.$store.state.cover
    }
  },
  methods: {
    toggle: function (id, data) {
      console.log('toggle')
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
      }, 1000)
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
  },
  updated () {

  }
}
</script>

<style>

.asteroids {
    pointer-events: none !important;
    opacity: 0.30;
}

.meteor {
    background-color: rgba(50, 100, 255, 0.2);
    opacity: 1.0;
}

</style>