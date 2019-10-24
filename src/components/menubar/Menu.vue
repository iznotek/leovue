<template>
    <div>
      <component ref="menutype" :is="currentMenu" :right="side === 'right' ? true: false"> 
        <slot name='left'/>
      </component> 
      <div id="page-wrap">
        <slot name='right'/>
      </div> 
    </div>
</template>

<script>
import Slide from './Effects/slide'
import Bubble from './Effects/bubble'
import Reveal from './Effects/reveal'
import Push from './Effects/push'
import Elastic from './Effects/elastic'
import FallDown from './Effects/fallDown'
import PushRotate from './Effects/pushRotate'
import Stack from './Effects/stack'
import ScaleRotate from './Effects/scaleRotate'
import ScaleDown from './Effects/scaleDown'

export default {
  name: 'menu-wrap',
  components: {
    slide: Slide,
    bubble: Bubble,
    elastic: Elastic,
    push: Push,
    pushrotate: PushRotate,
    scaledown: ScaleDown,
    scalerotate: ScaleRotate,
    reveal: Reveal,
    stack: Stack,
    falldown: FallDown
  },
  data () {
    return {
      currentMenu: 'slide',
      side: 'left',
      isOpen: false
    }
  },
  methods: {
    toggle: function (state = null) {
      if (state !== null) {
        this.$refs.menutype.$refs.menubar.open(state)
      }
    }
  }
}
</script>

<style scope>
</style>

