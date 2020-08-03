<template>
  <div style='position: absolute; margin-top: 0px; height: 100%; z-index: 6999;'>
      <vue-accordion :items="items" :styles="styles" @selected="selected"></vue-accordion>
  </div>
</template>

<script>
import Accordion from './accordion/vue-accordion'
const util = require('../util.js')

export default {
  name: 'spacemenu',
  components: {
    'vue-accordion': Accordion
  },
  methods: {
    selected (item) {
      // console.log(item)
      var vm = this
      function cb (url = null) {
        if (url) {
          vm.$store.dispatch('loadStone', {filename: url, route: vm.$route})
        }
      }
      if (process.env.NODE_ENV === 'production' && window.lconfig.api && window.lconfig.seed) {
        util.seedStone(window.lconfig.seeder, item.title, cb)
      } else {
        util.urlCheck(window.location.origin + '/static/stones/' + window.lconfig.stone + '/deep/spaces/' + item.title + '/index.leo', cb)
      }
    },
    width () {
      return this.$store.state.leftPaneWidth || '1000px'
    },
    populate (space, manifest) {
      if (space && manifest) {
        var aspace = {
          title: space,
          text: manifest.description || '',
          image: manifest.image,
          url: manifest.url,
          color: util.rgbaFromTheme(manifest.color || 'black', 0.8)
        }
        this.items.push(aspace)
      }
    }
  },
  computed: {
    styles () {
      return {
        div: {
          width: this.div.width + 'px', // this.width(),
          height: '100vh', // this.div.height + 'px',
          margin: this.div.center ? '0 auto' : '0',
          position: 'fixed',
          left: '0px'
        },
        li: {
          borderColor: '#FFF',
          borderStyle: 'solid',
          borderWidth: this.panel.border + 'px',
          padding: this.panel.padding + 'px'
        },
        h2: {
          fontSize: this.titles.font + 'px',
          color: this.titles.color
        },
        p: {
          fontSize: this.texts.font + 'px',
          marginTop: this.texts.margin + 'px',
          color: this.titles.color
        }
      }
    }
  },
  data () {
    return {
      div: {
        width: 100,
        height: 100,
        center: false
      },
      panel: {
        border: 0,
        padding: 0
      },
      texts: {
        font: 15,
        margin: 0
      },
      titles: {
        font: 20,
        color: 'white'
      },
      items: [{
        title: 'First',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ',
        url: '#',
        image: 'https://unsplash.it/650/350/?image=111'
      }]
    }
  },
  watch: {
    '$store.state.leodata': {
      handler: function (val, oldVal) {
        var spaces = []
        if (val && val.length) {
          // console.log(val)
          // only peek the first @space node
          var item = val[0] // .forEach(item => {
          let deep = item.deep
          // console.log(item)
          if (deep && deep.look) {
            // then the links eventualy
            if (deep.look.spaces) {
              deep.look.spaces.forEach(space => {
                util.seedCheck(window.lconfig.api + '/' + window.lconfig.seed, space, this.populate)
              })
            }
          }
          // })
        }
        // console.log(spaces)
        this.items = spaces
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

