<template>
  <div ref="slideshow" class="slideshow" tabindex="1" @keyup.right.space="impressNextStep" @keyup.left="impressPrevStep">
    <impress-viewport v-if="ready" ref="impress" :steps="steps" :config="config" :astyle="astyle" ></impress-viewport>

     <div style="position:absolute; top: 90%; margin-left: 50%; z-index: 6005;">
        <ball-menu class="split-ball" :caption="caption"/>
        <div class="arrow-left"
            v-show="true"
            @click="impressPrevStep">
 
          <img :src="require(`@/assets/icons/bullet-arrow.svg`)" class="transition" :style="aastyle" width="95"/>
        </div>
        <div class="arrow-right"
            v-show="true"
            @click="impressNextStep">
   
          <img :src="require(`@/assets/icons/bullet-arrow.svg`)" class="transition" :style="aastyle" width="95"/>
        </div>
      </div> 
  </div>
</template>

<script>
import jsyaml from 'js-yaml'
import BallMenu from './BallMenu'
const util = require('../util.js')

export default {
  // components: {
  //   CustomCom,
  // },
  components: {
    BallMenu
  },
  props: {
    item: Object
  },
  computed: {
    astyle () {
      var style = {}
      if (this.color) {
        var color1 = util.rgbaFromTheme(this.color, 0.8)
        var color2 = util.rgbaFromTheme(this.color, 0.5)
        style.background = 'linear-gradient(175deg, ' + color1 + ' 0%, ' + color2 + ' 100%)'
      }
      return style
    },
    aastyle: function () {
      var style = {}
      if (this.color) {
        return '-webkit-filter: opacity(0.5) drop-shadow(0 0 0 ' + this.color + '); filter: opacity(0.5) drop-shadow(0 0 0' + this.color + '); z-index=2000;'
      }
      return style
    }
  },
  methods: {
    impressPrevStep () {
      this.$refs.impress.prevStep()
      this.doCaption()
    },
    impressNextStep () {
      this.$refs.impress.nextStep()
      this.doCaption()
    },
    load (content) {
      try {
        this.ready = false
        let content = this.item.content || ''
        let slide = jsyaml.load(content.replace('@language yaml', ''))
        if (slide) {
          // console.log(slide)
          this.config = slide.config
          this.steps = slide.steps

          var deep = this.item.item.obj.deep
          this.color = util.rgbaFromTheme(deep.look.theme)

          if (this.config.preset) {
            if (this.config.preset === 'dna') {
              this.steps = this.dna(this.steps)
            }
            if (this.config.preset === 'ball') {
              this.steps = this.ball(this.steps)
            }
            if (this.config.preset === 'slide') {
              this.steps = this.slide(this.steps)
            }
          }

          setTimeout(() => {
            this.ready = true
            this.$refs.slideshow.focus()
            this.$nextTick(() => { this.doCaption() })
          }, 100)
        }
      } catch (error) { console.log(error) }
    },
    doCaption () {
      this.caption = (this.$refs.impress.getIndex() + 1) + '/' + this.$refs.impress.nbSteps()
    },
    dna (steps) {
      const rets = []
      const radius = 1500

      let initDegree = 0
      const zStep = 400
      const degreeStep = 45

      for (let i = 0; i < steps.length; i += 1) {
        rets.push({
          rotateX: 90,
          rotateY: 180 - initDegree,
          x: Math.sin((initDegree * Math.PI) / 180) * radius,
          y: Math.cos((initDegree * Math.PI) / 180) * radius,
          z: i * zStep,
          content: steps[i].content
        })
        initDegree -= degreeStep
      }
      return rets
    },
    ball (steps) {
    },
    slide (steps) {
    }
  },

  mounted () {
    // if (this.content) {
    //   this.load(this.content)
    // }
    // this.$refs.slideshow.focus()
  },
  watch: {
    'item': {
      handler: function (val, oldVal) {
        if (val) {
          this.load(val)
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      ready: false,
      color: 'white',
      caption: '',
      config: {
        width: 800,
        height: 800,
        transitionDuration: 1200,
        perspective: 800
      },
      steps: [{
        x: 500,
        y: 0,
        content: 'Hint: press space, right key to next step, left to prev step',
        id: 'firstStep'
      },
      // {
      //   x: 0,
      //   y: -300,
      //   scale: 2,
      //   // component: CustomCom,
      //   // props: {
      //   //   myname: 'abc',
      //   // },
      //   transitionDuration: 1000
      //   // transitionTimingFunction: 'linear', // default 'ease'
      // },
      {
        x: 1000,
        y: -500,
        z: 200,
        rotateX: 45,
        scale: 3,
        content: '<h2> badaboom </h2>',
        id: 'xRotateStep'
      },
      {
        x: 0,
        y: 0,
        rotate: 45,
        content: 'z rotate step',
        id: 'zRotateStep'
      },
      {
        x: 0,
        y: 1000,
        z: 900,
        scale: 5,
        content: 'overview',
        id: 'overview'
      }]
    }
  }
}
</script>

<style lang="scss">
.impress-step {
  width: 650px;
  background-color: rgba(100, 100, 100, 0.3);
  border-radius: 50px;
  padding: 50px;
  text-align: center;
  cursor: pointer;
  border: solid 0px;
  -webkit-transition: all 2s ease;
  transition: all 2s ease;

  &.active {
    border: solid 3px;
    -webkit-box-shadow: 0px 10px 50px 0px;
    -moz-box-shadow: 0px 10px 50px 0px;
    box-shadow: 0px 10px 50px 0px;
  }
}

.impress-viewport.overview .impress-step:not(.active) {
  opacity: 0;
}
.impress-step.active {
  cursor: auto;
}

</style>

<style>
  .arrow-left, .arrow-right {
    color: #fff;
    cursor: pointer;
  }
  .transition {
    -webkit-transition: 3s all ease;
    -moz-transition: 3s all ease;
    transition: 3s all ease;
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
  .split-ball {
    position: absolute;
    margin-top: 22px; 
    margin-left: -18px; 
    cursor: pointer;
  }

</style>
