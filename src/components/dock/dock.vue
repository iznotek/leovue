<template>
  <grid class="dock"
  :draggable="true"
  :sortable="true"
  :items="colors"
  :height="50"
  :width="60">
  @change="change"
  @remove="remove"
  @click="click"
  @sort="sort"
  <template slot="cell" slot-scope="props">
    <spot :color="props.item"
          :index="props.index"
          :with-button="true"
          @remove="props.remove()"/>
  </template>
</grid>
</template>

<script>
import Spot from './spot'
const util = require('../../util.js')

const randomInt = (fr, to) => {
  return Math.round(fr + Math.random() * to)
}

const generateRGBColors = (count, color) => {
  return Array.apply(null, new Array(count)).map((none, i) => {
    return {
      r: color.r,
      g: color.g,
      b: color.b,
      a: color.a
    }
  })
}

// const generateRandomRGBColors = (count) => {
//   return Array.apply(null, new Array(count)).map((none, i) => {
//     return {
//       r: randomInt(0, 255),
//       g: randomInt(0, 255),
//       b: randomInt(0, 255)
//     }
//   })
// }

const generateGrayColors = (count) => {
  let random = randomInt(15, 51)
  return Array.apply(null, new Array(count)).map((none, i) => {
    return {
      r: random,
      g: random,
      b: random,
      a: 0.5
    }
  })
}

export default {
  name: 'Dock',
  data () {
    let colors = generateGrayColors(7)
    return {
      colors,
      selected: null
    }
  },
  components: {
    spot: Spot
  },
  methods: {
    click ({ items, index }) {
      let value = items.find(v => v.index === index)
      this.selected = value.item
      console.log(this.selected)
    },
    change (event) {
      console.log('change', event)
    },
    remove (event) {
      console.log('remove', event)
    },
    sort (event) {
      console.log('sort', event)
    }
  },
  watch: {
    '$store.state.currentItem': {
      handler: function (val, oldVal) {
        if (val) {
          var deep = this.$store.getters.getDeepLookForNode(val)
          if (deep && deep.look && deep.look.theme) {
            var color = util.rgbaObjectFromTheme(deep.look.theme, 0.7)
            // this.color = color
            this.colors = generateRGBColors(7, color)
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="sass" scoped>
.dock
  margin-top: -30px
  margin-left: 230px
  width: 700px
</style>