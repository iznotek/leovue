<template>
  <div> <!-- v-html="menu"> -->
    <radial-menu
      class="radial"
      @click="open()"
      :style="{backgroundColor: color, color: 'white'}"
      :itemSize="50"
      :radius="120"
      :size="50"
      :angle-restriction="-180">
        <radial-menu-item 
          v-for="(item, index) in getItems()" 
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
    <div v-if="!text" class="logo" @click="signIn()">
      <img src="/static/images/logo.png" width="55"/>
    </div>
    <div v-else class="text" v-html="caption">
    </div>
    <!-- <div v-if="text" class="blur">
    </div> -->
      <!-- <div style="color: rgba(0,0,0,0.6); margin-top: 16px;">{{ lastClicked }}</div> -->
  </div>
</template>

<style scoped>
  .blur {
     position: absolute;
    text-align: center;
    margin-top: 13px; 
    margin-left: -5px; 
    width: 60px;
    -webkit-box-shadow: 0px 0px 50px 0px;
    -moz-box-shadow: 0px 0px 50px 0px;
    box-shadow: 0px 0px 50px 0px;
  }
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
    text-align: center;
    margin-top: -2px; 
    margin-left: -2px; 
    color: #000;
  }
  .text {
    position: absolute;
    text-align: center;
    margin-top: 13px; 
    margin-left: -5px; 
    width: 60px;
    color: #000;
  }
</style>

<script>
import { RadialMenu, RadialMenuItem } from './button/radial'
import OrbitSpinner from './spinner/orbit'
// const BloomingMenu = require('blooming-menu')
const util = require('../util.js')

export default {
  name: 'app',
  components: {
    RadialMenu,
    RadialMenuItem,
    OrbitSpinner
  },
  props: {
    caption: String
  },
  data () {
    return {
      color: 'white',
      text: null,
      items: {
        guest: ['you', 'will', 'be', 'here', 'a', 'world'],
        user: ['give', 'a', 'space', 'save', 'the', 'time']
      },
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
    getItems () {
      return !this.$store.state.connected ? this.items.guest : this.items.user
    },
    open () {
    },
    handleClick (item) {
      this.lastClicked = item
      if (item === 'here' && this.$bs) {
        if (!this.$bs.isUserSignedIn()) {
          this.$bs.redirectToSignIn()
        }
      }
      if (item === 'save' && this.$bs) {
        this.$bs.save({
          data: this.$store.state.leodata,
          text: this.$store.state.leotext,
          json: this.$store.state.leojson,
          cover: this.$store.state.cover
        })
      }
    },
    menu () {
      // return this.bloomingMenu.render()
    }
  },
  computed: {
    connected () {
      return this.$store.state.connected
    }
  },
  watch: {
    'caption': {
      handler: function (val, oldVal) {
        if (val) {
          this.text = val
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