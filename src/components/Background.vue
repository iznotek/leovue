<template>
    <div v-mousefollower class="background"> <!-- v-blur="blurConfig" -->
      <!-- <lazy-img :src="current" /> <!-- :placeholder="current" /> -->
      <!-- <div class="cesium" v-if="use.map">
        <cesium-viewer :animation="cesium.animation" :timeline="cesium.timeline" @ready="ready">
        </cesium-viewer>
      </div> -->
      <!--<player v-if="use.player" />-->

     <flux style="z-index:1"
        :options="fluxOptions"
        :images="fluxImages"
        :transitions="fluxTransitions"
        :transitionOptions="fluxTransitionOptions"
        ref="slider">
      </flux> 
    <!-- <transition name="fade"> -->
     <!--   <Component :is="background" backgroundColor="rgba(0,0,0,0)" ></Component> -->
    <!--  </transition> -->

      <!--   <v-btn @click="changeBackground('aurora')">Aurora</v-btn>
      <v-btn @click="changeBackground('smoke')">Smoke</v-btn>
      <v-btn @click="changeBackground('pipeline')">Pipeline</v-btn>
      <v-btn @click="changeBackground('coalesce')">Coalesce</v-btn>
      <v-btn @click="changeBackground('shift')">Shift</v-btn>
      <v-btn @click="changeBackground('aether')">Æther</v-btn> -->

      <!--<vr v-if="use.vr" style="z-index:2"/>-->
      <!-- <youtube style="z-index:2" :video-id="'QI9ta7qkazU'" player-width="100%" player-height="100%" :player-vars="{autoplay: 1}"></youtube> -->
      <!-- <youtube style="z-index:2" :video-id="'QI9ta7qkazU'" width="100%" height="100%" :player-vars="{autoplay: 1}"></youtube> -->
    </div>
</template>

<script>
import { VueFlux, Transitions } from 'vue-flux'

// import Player from './VideoPlayer'
// import VR from './VR'

// import Aurora from './ambient/Aurora'
// import Smoke from './ambient/Smoke'
// import Coalesce from './ambient/Coalesce'
// import Pipeline from './ambient/Pipeline'
// import Shift from './ambient/Shift'
// import Aether from './ambient/Aether'

// const backgrounds = {
//   aurora: Aurora,
//   smoke: Smoke,
//   pipeline: Pipeline,
//   coalesce: Coalesce,
//   shift: Shift,
//   aether: Aether
// }

export default {
  name: 'background',
  components: {
    // Aurora,
    // Smoke,
    // Coalesce,
    // Pipeline,
    // Shift,
    flux: VueFlux // ,
    // player: Player,
    // vr: VR
  },
  data () {
    return {
      // background: Aurora,
      required: 0,
      requiredTransition: 'transitionFade',
      index: 0,
      length: 0,
      use: {
        map: true,
        player: false,
        slider: true,
        vr: false
      },
      fluxOptions: {
        autoplay: false,
        delay: 1000,
        autohideTime: 0,
        infinite: false
      },
      // fluxCaptions: [
      //   'cool', 'cool'
      // ],
      fluxImages: [
        // '/static/images/bubble.png'
        // 'http://www.bianoti.com/wp-content/uploads/2015/11/Background-Pictures-17206-1920x1200-px-fond-ecran.jpg'
      ],
      // fluxCaptions: {
      //    autoplay: true
      // },
      fluxTransitions: Transitions,
      // fluxTransitions: {
      //   // transitionCamera: Transitions.transitionCamera,
      //   transitionFade: Transitions.transitionFade
      // },
      fluxTransitionOptions: {
        transitionCamera: {
          tileDuration: 2000,
          easing: 'ease'
        },
        transitionFade: {
          totalDuration: 2000,
          easing: 'ease-in'
        }
      },
      blurConfig: {
        isBlurred: false, // activate and deactivate blur directive example 2
        opacity: 1.0,
        filter: 'blur(5px)',
        transition: 'all 3.3s linear'
      },
      cesium: {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        fullscreenButton: true,
        infoBox: true
      }
    }
  },
  methods: {
    next () {
      this.index += 1
      if (this.index === this.fluxImages.length) {
        this.index = 0
      }
    },
    check () {
      if (this.$refs.slider !== undefined) {
        if (this.$refs.slider.index === this.required) {
          this.index = this.required
        } else {
          this.$refs.slider.showImage(this.required, this.requiredTransition)
          setTimeout(this.check, 500)
        }
      }
    },
    getThemeIdFrom (id) {
      var theme = this.$store.state.themes[id]
      if (theme && theme.background.theme) {
        return id
      }
      var pid = id
      while (pid >= 0) {
        const parent = JSON.search(this.$store.state.leodata, '//*[id="' + pid + '"]/parent::*')
        if (parent && parent[0]) {
          pid = parent[0].id
          theme = this.$store.state.themes[pid]
          if (theme && theme.background.theme) {
            return pid
          }
        } else return 0
      }
    },
    // changeAmbient (bg) {
    //   this.background = backgrounds[bg]
    // },
    ready (cesiumInstance) {
      // const {Cesium, viewer} = cesiumInstance
      // viewer.entities.add({
      //   id: '成都欢迎你',
      //   position: Cesium.Cartesian3.fromDegrees(104.06, 30.67, 100),
      //   billboard: new Cesium.BillboardGraphics({
      //     image: 'https://zouyaoji.top/vue-cesium/favicon.png',
      //     scale: 0.1
      //   }),
      //   label: new Cesium.LabelGraphics({
      //     text: 'Hello Word',
      //     font: '24px sans-serif',
      //     horizontalOrigin: 1,
      //     outlineColor: new Cesium.Color(0, 0, 0, 1),
      //     outlineWidth: 2,
      //     pixelOffset: new Cesium.Cartesian2(17, -5),
      //     style: Cesium.LabelStyle.FILL
      //   })
      // })
    }
  },
  computed: {
    current () {
      return this.fluxImages[this.index]
    },
    nextimg () {
      var index = this.index + 1
      if (index === this.fluxImages.length) {
        index = 0
      }
      return this.fluxImages[index]
    },
    blur () {
      return '30'
    }
  },
  mounted () {
    // setInterval(this.check, 500)
  },
  watch: {
    '$store.state.themes': {
      handler: function (val, oldVal) {
        var backs = [] // ['/static/images/bubble.png']
        if (val) {
          Object.keys(val).forEach(key => {
            let theme = val[key]
            if (theme.background.dash) {
              backs.push(theme.background.dash)
            }
          })
        }
        this.fluxImages = backs
      },
      deep: true,
      immediate: true
    },
    '$store.state.currentItem': {
      handler: function (val, oldVal) {
        if (val) {
          var theme = this.$store.state.themes[this.getThemeIdFrom(val.id)]
          if (theme && theme.background) {
            var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
            var transition = isChrome ? 'transitionFade' : theme.background.transition || 'transitionFade'
            var index = this.fluxImages.indexOf(theme.background.dash)
            if (index > -1) {
              this.required = index
              this.requiredTransition = transition
              if (this.$refs.slider !== undefined) {
                this.$refs.slider.showImage(index, transition)
              }
              setTimeout(this.check, 500)
            }
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss">
  .spinner {
    top: -100px;
    z-index: 0;
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.background {
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: linear-gradient(174deg, rgba(2,0,36,1) 0%, rgba(9,22,121,1) 35%, rgba(0,212,255,1) 100%);
  // background-image: url('/static/images/bubble.png');
  background-size: cover;
}
.cesium {
  width: 100%;
  height: 400px;
  z-index: 1000;
}
</style>
