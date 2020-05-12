<template>
  <div class="eg-theme-refuel-dark">
    <div class="eg-slideshow" style="width: 100*; height: 100%;">
      <slide> <p> poiojbijb </p> </slide>
      <div v-for="slide in availableSlides">
      <!-- <slide v-for="slide in slides"
        :enter="getTransition(slide, 'enter')"
        :leave="getTransition(slide, 'leave')"
        :enterNext="getTransition(slide, 'enterNext')"
        :enterPrev="getTransition(slide, 'enterPrev')"
        :leaveNext="getTransition(slide, 'leaveNext')"
        :leavePrev="getTransition(slide, 'leavePrev')"
        :steps="((slide.steps == undefined )? 1 : slide.steps)"
        :class='`slide-${slide.name}`'
        v-bind:key="slide.id"
      > -->
        {{ slide.content }}
      <!-- </slide> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Slideshow } from 'eagle.js'

export default {
  mixins: [Slideshow],
  props: {
    aslides: Array
  },
  data () {
    return {
      availableSlides: null
    }
  },
  mounted () {
    this.availableSlides = this.aslides
  },
  methods: {
    getTransition: function (slide, type) {
      const defaultTransitions = {
        enter: 'fadeIn',
        leave: 'fadeOut',
        enterPrev: 'fadeInLeft',
        enterNext: 'fadeInRight',
        leavePrev: 'fadeOutRight',
        leaveNext: 'fadeOutLeft'
      }
      switch (type) {
        case 'enter':
        case 'leave':
          return slide[type] === undefined
            ? defaultTransitions[type]
            : slide[type] === null
              ? null
              : slide[type]
          break
        default:
          if (slide.enter === undefined && slide.leave === undefined) {
            return slide[type] === undefined
              ? defaultTransitions[type]
              : slide[type] === null
                ? null
                : slide[type]
          } else {
            return null
          }
          break
      }
    }
  }
}
</script>