<template>
  <div style='position: absolute; margin-top: 33px; height: 100%; z-index: 6999;'>
      <vue-accordion :items="items" :styles="styles"></vue-accordion>
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
    width () {
      return this.$store.state.leftPaneWidth || '1000px'
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
    '$store.state.deeps': {
      handler: function (val, oldVal) {
        var spaces = []
        if (val) {
          Object.keys(val).forEach(id => {
            let deep = val[id]
            if (deep.look.space) {
              let item = JSON.search(this.$store.state.leodata, '//*[id="' + id + '"]')
              if (item) {
                item = item[0]
                if (item) {
                  var space = {
                    text: deep.look.space,
                    title: item.vtitle,
                    image: deep.look.spot,
                    id: id,
                    color: util.rgbaFromTheme(deep.look.theme || 'black', 0.8)
                  }
                  spaces.push(space)
                }
              }
            }
          })
        }
        this.items = spaces
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

