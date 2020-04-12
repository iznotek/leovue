<template>
  <div> <!-- v-html="menu"> -->
    <radial-menu
      class="radial"
      :style="{backgroundColor: color, color: 'white'}"
      :itemSize="50"
      :radius="120"
      :size="50"
      :angle-restriction="-180">
        <radial-menu-item 
          v-for="(item, index) in items" 
          :key="index" 
          :style="{backgroundColor: color, color: 'white'}"
          @click="() => handleClick(item)">
          <span>{{item}}</span>
        </radial-menu-item>
    </radial-menu> 
    <fade-transition :duration="1000" v-show="$store.state.loading">
      <orbit-spinner
        style="position: absolute; left: -5px; top: -5px"
        :animation-duration="3000"
        :size="60"
        color="#fff"
      />
    </fade-transition> 
    <!-- <spring-spinner
      style="position: absolute; left: -2px; top: -2px"
      :animation-duration="3000"
      :size="54"
      color="#fff"
    /> -->
    <div class="logo" @click="open()">
      <img src="/static/images/logo.png" width="55"/>
    </div>
      <!-- <div style="color: rgba(0,0,0,0.6); margin-top: 16px;">{{ lastClicked }}</div> -->
  </div>
</template>

<style scoped>
  .radial {
    position: absolute; 
    left: 0px; 
    top:0px;
    -webkit-transition: 3s all ease;
    -moz-transition: 3s all ease;
    transition: 3s all ease;
  }
  .logo {
    position: absolute;
    transform: rotate(0deg);
    margin-top: -2px; 
    margin-left: -2px; 
  }
</style>

<script>
import { RadialMenu, RadialMenuItem } from './button/radial'
import { SpringSpinner, OrbitSpinner } from 'epic-spinners'
// const BloomingMenu = require('blooming-menu')
const util = require('../util.js')

export default {
  name: 'app',
  components: {
    RadialMenu,
    RadialMenuItem,
    SpringSpinner,
    OrbitSpinner
  },
  data () {
    return {
      color: 'white',
      items: ['you', 'will', 'be', 'here', 'a', 'world'],
      lastClicked: 'click on something!',
      bloomingMenu: null
    }
  },
  mounted () {
    // this.bloomingMenu = new BloomingMenu({
    //   startAngle: 0,
    //   endAngle: 315,
    //   radius: 100,
    //   itemsNum: 8
    // })
    // console.log(BloomingMenu)
    // console.log(this.bloomingMenu)
  },
  methods: {
    open () {

    },
    handleClick (item) {
      this.lastClicked = item
    },
    menu () {
      // return this.bloomingMenu.render()
    }
  },
  watch: {
    '$store.state.currentItem': {
      handler: function (val, oldVal) {
        if (val) {
          var deep = this.$store.getters.getDeepLookForNode(val)
          if (deep && deep.look && deep.look.theme) {
            var color = util.rgbaFromTheme(deep.look.theme, 0.7)
            this.color = color
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>