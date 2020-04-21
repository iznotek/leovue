<template>
    <div > <!-- v-blur="blurConfig" -->
      <!-- <lazy-img :src="current" /> <!-- :placeholder="current" /> -->
      <!-- <div class="cesium" v-if="use.map">
        <cesium-viewer :animation="cesium.animation" :timeline="cesium.timeline" @ready="ready">
        </cesium-viewer>
      </div> -->
      <!--<player v-if="use.player" />-->

     <!-- <flux style="z-index:1"
        :options="fluxOptions"
        :images="fluxImages"
        :transitions="fluxTransitions"
        :transitionOptions="fluxTransitionOptions"
        ref="slider">
      </flux> -->
      <div class="background" >
        <flux v-mousefollower class="element" style="z-index:1"
          :options="flux.options"
          :images="fluxImages"
          :transitions="flux.transitions"
          ref="slider">
        </flux> 
       <!--  <fade-transition :duration="fluxOptions.duration" :delay="fluxOptions.delay" v-show='!fade.next'>

        </fade-transition>
        <fade-transition :duration="fluxOptions.duration" :delay="fluxOptions.delay" v-show='fade.next'>
        </fade-transition> -->
      </div>
    <!-- <transition name="fade"> -->
     <!--   <Component :is="background" backgroundColor="rgba(0,0,0,0)" ></Component> -->
    <!--  </transition> -->

      <!--<vr v-if="use.vr" style="z-index:2"/>-->
      <!-- <youtube style="z-index:2" :video-id="'QI9ta7qkazU'" player-width="100%" player-height="100%" :player-vars="{autoplay: 1}"></youtube> -->
      <!-- <youtube style="z-index:2" :video-id="'QI9ta7qkazU'" width="100%" height="100%" :player-vars="{autoplay: 1}"></youtube> -->
    </div>
</template>


<script>
// import { VueFlux, Transitions } from 'vue-flux'
import {
  VueFlux
} from 'vue-flux'

// import Player from './VideoPlayer'
// import VR from './VR'

export default {
  name: 'background',
  components: {
    flux: VueFlux // ,
    // player: Player,
    // vr: VR
  },
  data () {
    return {
      requiredList: [],
      required: 0,
      index: 0,
      length: 0,
      use: {
        map: true,
        player: false,
        slider: true,
        vr: false
      },
      flux: {
        options: {
          allowToSkipTransition: false,
          allowFullscreen: true,
          autoplay: false
        },
        images: [],
        transitions: [ 'fade' ]
      },
      fluxOptions: {
        autoplay: false,
        delay: 100,
        duration: 2000,
        autohideTime: 0,
        infinite: false
      },
      // fluxCaptions: [
      //   'cool', 'cool'
      // ],
      fluxImages: [
        window.lconfig.dashboardImage
        // 'http://www.bianoti.com/wp-content/uploads/2015/11/Background-Pictures-17206-1920x1200-px-fond-ecran.jpg'
      ],
      // fluxCaptions: {
      //    autoplay: true
      // },
      // fluxTransitions: Transitions,
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
      if (this.$refs.slider !== undefined && this.requiredList.length) {
        // console.log(this.requiredList)
        var required = this.requiredList[0]
        if (this.$refs.slider.Images && this.$refs.slider.Images.current && this.$refs.slider.Images.current.index === required.index) {
          // console.log('check', required.index)
          this.index = required.index
          this.requiredList.shift()
          if (this.requiredList.length) {
            this.requiredList = [this.requiredList.pop()] // keep the last only
          } else return
        } else { // if (required.index !== this.required) {
          // console.log('mov', required.index)
          // console.log('mov', this.required, this.$refs.slider.image2Index, this.$refs.slider.image1Index, this.$refs.slider.Images.current.index)
          this.$refs.slider.show(required.index, 'fade') // this.requiredTransition)
          this.required = required.index
        }
        setTimeout(this.check, 500)
      }
    },
    getBack (model) {
      var backs = []
      if (model.deep && model.deep.look && model.deep.look.dash) {
        backs.push(model.deep.look.dash)
      }
      // console.log(model)
      model.children.forEach((child) => {
        backs = backs.concat(this.getBack(child))
      })
      return backs
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
    // itemOdd () {
    //   if (this.fade.indexOdd > -1)
    //     return [this.fade.items[this.fade.indexOdd]]
    //   else
    //     return []
    // },
    // itemEven () {
    //   if (this.fade.indexEven > -1)
    //     return [this.fade.items[this.fade.indexEven]]
    //   else
    //     return []
    // },
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
    '$store.state.space': {
      handler: function (val, oldVal) {
        var backs = [window.lconfig.dashboardImage]
        if (val) {
          if (this.$store.state.leodata && this.$store.state.leodata.length) {
            this.$store.state.leodata.forEach((child) => {
              if (child.vtitle.includes(val)) {
                backs = backs.concat(this.getBack(child))
              }
            })
            backs = [...new Set(backs)] // remove duplicate
          }
        }
        // console.log(backs)
        this.fluxImages = backs
      },
      deep: true,
      immediate: true
    },
    '$store.state.currentItem': {
      handler: function (val, oldVal) {
        if (val) {
          var deep = this.$store.getters.getDeepLookForNode(val)
          if (deep && deep.look) {
            var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
            var transition = isChrome ? 'fade' : deep.look.transition || 'fade'
            var index = this.fluxImages.indexOf(deep.look.dash)
            if (index > -1) {
              // console.log(this.requiredList)
              this.requiredList.push({index: index, transition: transition})

              // this.$refs.slider.show(this.required, 'fade')
              // console.log(deep.look.dash, index)
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
  bottom: 0;
  position: absolute;
  overflow: hidden;
  background: linear-gradient(174deg, rgba(2,0,36,1) 0%, rgba(9,22,121,1) 35%, rgba(0,212,255,1) 100%);
  background-size: cover;
  object-fit: fill;
}
.element {
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  position: absolute;
}
.cesium {
  width: 100%;
  height: 400px;
  z-index: 1000;
}
</style>
