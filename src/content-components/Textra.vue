<template>
  <div class="textra">
    <div class="mainTextra" v-html="currentWord" :style="mainStyleComputed"></div>
  </div>
</template>

<script>
export default {
  name: 'Textra',
  props: {
    data: {
      type: Array,
      required: true
    },
    filter: {
      type: String,
      default: 'simple'
    },
    timer: {
      type: Number,
      default: 2
    },
    swap: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: null
    },
    blur: {
      type: Boolean,
      default: false
    },
    infinite: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultStyle: 'transition: all 1s;',
      currentWord: this.data[0],
      previousTime: 0,
      liStl: null,
      liBlur: null,
      liColor: null,
      dataCounter: 0,
      animationID: null,
      blurs: ['filter:blur(10px);', 'filter:blur(1px);'],
      filters: {
        simple: ['opacity:0;', 'opacity:1;'],
        'bottom-top': [
          'transform:translateY(10px);opacity:0;',
          'transform:translateY(0px);opacity:1;'
        ],
        'top-bottom': [
          'transform:translateY(-10px);opacity:0;',
          'transform:translateY(0px);opacity:1;'
        ],
        'right-left': [
          'transform:translateX(10px);opacity:0;',
          'transform:translateX(0px);opacity:1;'
        ],
        'left-right': [
          'transform:translateX(-10px);opacity:0;',
          'transform:translateX(0px);opacity:1;'
        ],
        press: ['letter-spacing: 4px;opacity:0;', 'opacity:1;'],
        scale: ['transform:scaleY(1.4);opacity:0;', 'opacity:1;'],
        flash: [
          'transform:skewX(-70deg);opacity:0;',
          'transform:skewX(0deg);opacity:1;'
        ],
        flip: [
          'transform:rotateX(-180deg);opacity:0;',
          'transform:rotate(0deg);opacity:1;'
        ]
      }
    }
  },
  computed: {
    mainStyleComputed () {
      return this.defaultStyle + this.liStl + this.liColor + this.liBlur
    }
  },
  methods: {
    run (currentTime) {
      if (this.dataCounter < 0) {
        this.dataCounter = 0
        this.previousTime = currentTime
      }
      if (this.previousTime + (this.timer * 1000) < currentTime) {
        // hiding
        if (this.swap) {
          if (this.dataCounter < this.data.length) {
            this.liStl = this.filters[this.filter][0]
            if (this.blur) this.liBlur = this.blurs[0]
          }
        } else {
          this.liStl = this.filters[this.filter][0]
          if (this.blur) this.liBlur = this.blurs[0]
        }
      }
      if (this.previousTime + (this.timer * 1000) + 1000 < currentTime) {
        // showing
        this.previousTime = currentTime

        if (this.swap) {
          if (this.dataCounter < this.data.length) {
            this.currentWord = this.data[this.dataCounter++]
          } else {
            ++this.dataCounter
          }
        } else {
          this.currentWord = this.data[++this.dataCounter]
        }
        this.liStl = this.filters[this.filter][1]
        if (this.color) this.liColor = 'color:' + this.color + ';'
        if (this.blur) this.liBlur = this.blurs[1]

        if (this.dataCounter === this.data.length) {
          if (this.infinite) {
            this.dataCounter = 0
            this.currentWord = this.data[this.dataCounter]
          } else {
            // stopping animation
            return
          }
        }
      }
      this.animationID = window.requestAnimationFrame(this.run.bind(this))
    }
  },
  created () {
    const that = this
    this.animationID = window.requestAnimationFrame(this.run.bind(that))
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.animationID)
  },
  watch: {
    data (newValue, oldValue) {
      if (this.swap) {
        this.dataCounter = -1
        this.liStl = this.filters[this.filter][0]
        if (this.blur) this.liBlur = this.blurs[0]

        const that = this
        this.animationID = window.requestAnimationFrame(this.run.bind(that))
      }
    }
  }
}
</script>

<style scoped>
.textra {
  height: auto;
  width: auto;
  display: block;
}
</style>