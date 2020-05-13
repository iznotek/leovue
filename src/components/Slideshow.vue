<template>
  <div ref="slideshow" class="slideshow" tabindex="1" @keyup.right.space="impressNextStep" @keyup.left="impressPrevStep">
    <impress-viewport ref="impress" :steps="steps" :config="config"></impress-viewport>
  </div>
</template>

<script>
import jsyaml from 'js-yaml'

export default {
  // components: {
  //   CustomCom,
  // },
  props: {
    content: String
  },
  methods: {
    impressPrevStep () {
      this.$refs.impress.prevStep()
    },
    impressNextStep () {
      this.$refs.impress.nextStep()
    },
    load (content) {
      try {
        // console.log(content)
        let slide = jsyaml.load(content.replace('@language yaml', ''))
        if (slide) {
          this.config = slide.config
          this.steps = slide.steps

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
        }
      } catch (error) { console.log(error) }
    },
    dna (steps) {
      const rets = []
      const radius = 1000

      let initDegree = 0
      const zStep = 80
      const degreeStep = 70

      for (let i = 0; i < steps.length; i += 1) {
        rets.push({
          rotateX: 45,
          x: Math.sin((initDegree * Math.PI) / 180) * radius,
          y: Math.cos((initDegree * Math.PI) / 180) * radius,
          z: i * zStep,
          content: steps[i].content
        })
        initDegree += degreeStep
      }
      return rets
    },
    ball (steps) {
    },
    slide (steps) {
    }
  },

  mounted () {
    if (this.content) {
      this.load(this.content)
    }
    this.$refs.slideshow.focus()
  },
  watch: {
    'content': {
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

<style>
  .impress-step {
    width: 650px;
    border: solid 1px;
    background-color: rgba(100, 100, 100, 0.3);
    border-radius: 50px;
    padding: 50px;
    text-align: center;
    cursor: pointer;
  }
  .impress-viewport.overview .impress-step:not(.active) {
    opacity: 0;
  }
  .impress-step.active {
    cursor: auto;
  }
</style>