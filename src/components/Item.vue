<template>
  <div class="back" :style="{backgroundImage: selectedImage}">
  <div class="block" :style="{background: selectedColor}">
    <li :id="prefix + model.id"
        :nid="nid"
        v-bind:class="{'unselected-sibling': hasOpenSibling}">
      <div class="item-box"
          :class="{bold: isFolder, topItem: top}"
          >
        <div>
          <div @click="toggle" v-bind:class="{'icon-bracket': top}" class="icon-b" v-if="isFolder">
            <div class="arrow" v-bind:class="{arrowdown: isOpenA}">
              <!-- {{arrowIcon}} -->
              <img :src="require(`@/assets/icons/bullet-arrow.svg`)" width="16">
            </div>
          </div>
          <!-- <editor :id="'editor-'+nid" v-if="isEditable" v-bind:editable="model.name" /> -->
          <div class="leo-box"></div>
          <div v-if="!isFolder" class="leaf-button"></div>
          <span @click="toggle" class="otitle">{{model.vtitle}}</span>
        </div>
      </div>
      <!-- <div v-if="isEditable" class="inline">
        <div class="content">
          <codemirror class="code-directive" v-model="myDirectives" :options="cmOption"></codemirror>
          <div class="icon-tab">
            <div @click="toEditor('code')" class="icon icon-bracket">
              code
            </div>
            <div @click="toEditor('html')" class="icon icon-bracket">
              html
            </div>
            <div @click="toEditor('md')" class="icon icon-bracket">
              md
            </div>
          </div>
          <codemirror v-if="editorType === 'code'" v-model="myLeo" :options="cmOption"></codemirror>
          <medium-editor v-if="editorType === 'md'" :text="myLeo"/>
          <editor v-if="editorType === 'html'" v-bind:editable="myLeo" />
        </div>
      </div> -->
      <div v-show="isOpen" class="child-items">
        <div v-if="isOpenInline" v-html="myContent"
            class="inline">
        </div>
        <ul v-if="isFolder">
          <item
            class="item"
            v-for="amodel in model.children"
            v-if="isVisible(amodel)"
            :model="amodel"
            :prefix="prefix"
            :key="amodel.id"
            :textItems="textItems"
            :accordion="accordion"
            :targetEl="targetEl">
          </item>
        </ul>
        <div v-show="isOpenInline" class="hshim"></div>
      </div>
    </li>
  </div>
  </div>
</template>

<script>
// import Editor from './editor/Editor'
import Velocity from 'velocity-animate'
import _ from 'lodash'

// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'

// import MediumEditor from 'vue2-medium-editor'
// import 'medium-editor/dist/css/medium-editor.css'
// import 'vue2-medium-editor/src/themes/default.css'

// import { codemirror } from 'vue-codemirror'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/mode/markdown/markdown.js'
// import 'codemirror/theme/monokai.css'

const util = require('../util.js')

// const util = require('../util.js')
// import { getLanguage, removeFirstLine } from '../utils.js'

export default {
  name: 'item',
  components: {
    // Editor,
    // codemirror // ,
    // MediumEditor
  },
  props: {
    model: Object,
    targetEl: Boolean,
    textItems: Object,
    top: Boolean,
    accordion: Boolean,
    prefix: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      reset: true,
      openFlag: false,
      hasRibbon: true,
      inline: false,
      closearrow: false,
      editorType: 'code',
      myContent: '',
      myLeo: '',
      myLang: '',
      myDirectives: '',
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: false,
        line: true,
        mode: 'text/x-markdown',
        theme: 'monokai'
      }
    }
  },
  computed: {
    html: function () {
      if (!this.editor) return ''
      return this.editor.getHTML()
    },
    arrowIcon: function () {
      return window.lconfig.itemArrow || '▶'
    },
    selectedImage: function () {
      // var color = 'rgba(0,0,0,0.5)'
      if (this.model) {
        var deep = this.$store.state.deeps[this.model.id]
        if (deep && deep.look && deep.look.spot) {
          return 'url(' + deep.look.spot + ')'
        }
      }
      return ''
    },
    selectedColor: function () {
      // var color = 'rgba(0,0,0,0.5)'
      let decal = 50
      let alpha = 0.8
      let alpha2 = 0.8
      let angle = 165
      let color = ''
      let color2 = ''
      if (this.model) {
        var deep = this.$store.getters.getDeepLookForNode(this.model)
        if (deep && deep.look && deep.look.theme) {
          color = util.rgbaFromTheme(deep.look.theme, alpha, this.active ? decal : -decal)
          color2 = util.rgbaFromTheme('black', alpha2, this.active ? decal : -decal)
          return 'linear-gradient(' + angle + 'deg, ' + color + ' 0%, ' + color2 + ' 100%)'
        }
      }
      color = util.rgbaFromObject({r: 0, g: 0, b: 0, a: 1.0}, alpha, this.active ? decal : -decal)
      color2 = util.rgbaFromObject({r: 0, g: 0, b: 0, a: 1.0}, alpha2, this.active ? decal : -decal)
      return 'linear-gradient(' + angle + 'deg, ' + color + ' 0%, ' + color2 + ' 100%)'
    },
    isFolder: function () {
      if (/\.leo\)$/.test(this.model.name)) { return true } // subtree
      if (/^@outline/.test(this.model.name)) { return true } // outline
      let nbVisibleItems = 0
      for (let i = 0; i < this.model.children.length; i++) {
        if (this.isVisible(this.model.children[i])) {
          nbVisibleItems += 1
        }
      }
      return nbVisibleItems > 0
      // return this.model.children && this.model.children.length
    },
    isClosedSibling: function () {
      if (this.isOpen) { return ' open' }
      const nextSiblings = JSON.search(this.$store.state.leodata, '//*[id="' + this.model.id + '"]/following-sibling::*')
      const prevSiblings = JSON.search(this.$store.state.leodata, '//*[id="' + this.model.id + '"]/preceding-sibling::children')
      var foo = nextSiblings.length + '_' + prevSiblings.length
      return foo
      // check if any siblings are open
      // if yes then return true
      // else return false
    },
    hasOpenSibling: function () {
      if (!this.accordion) { return false }
      // don't need this for standalone component e.g. kanban
      if (this.model.parent) { return false }
      // TODO: this is slow, need to refactor, possibly replace defiant wth parent pointer on item
      // if (this.isOpen) { return ' open' }
      if (!this.isOpen) { return }
      const nextSiblings = JSON.search(this.$store.state.leodata, '//*[id="' + this.model.id + '"]/following-sibling::*')
      const prevSiblings = JSON.search(this.$store.state.leodata, '//*[id="' + this.model.id + '"]/preceding-sibling::children')
      let siblings = nextSiblings.concat(prevSiblings)
      siblings = siblings.map(s => s.id)
      let hasOpen = false
      const ids = this.$store.state.openItemIds
      siblings.forEach(sid => {
        if (ids.indexOf(sid + '') > -1) { hasOpen = true }
      })
      hasOpen = false
      // if parent prop has been set, get siblings from there. This will be case when
      // item is working off of cloned subset of the leo file, not the full tree
      if (this.model.parent) {
        let siblings = this.model.parent.children
        if (siblings.length > 1) { hasOpen = true }
      }
      return hasOpen
      // check if any siblings are open
      // if yes then return true
      // else return false
    },
    // id with prefix
    nid: function () {
      return this.prefix + '_' + this.model.id
    },
    isEditable: function () {
      return this.isOpen && this.active
    },
    isOpen: function () {
      const ids = this.$store.state.openItemIds
      let open = true
      if (ids.indexOf(this.model.id + '') === -1) { open = false }
      return open
    },
    isOpenInline: function () {
      return this.$route.name === 'ANode'
      // return true
      // return this.isOpen && this.$route.name === 'ANode'
    },
    isOpenA: function () {
      if (_.has(this.model, 'o')) {
        return this.closearrow
      }
      return this.isOpen && !this.closearrow
    },
    active: function () {
      // TODO: change ids to strings
      if (!this.model) { return }
      if (this.$store.state.currentPage.id) {
        return this.$store.state.currentPage.id === this.model.id
      }
      return this.$store.state.currentItem.id === this.model.id
    },
    activeBackgroundColor: function () {
      const bg = window.lconfig.activeBackgroundColor || '#01FF70'
      if (this.active) {
        return bg
      }
      return '#ffffff'
    }
  },
  methods: {
    isVisible: function (itemdata) {
      if (/^@cover/.test(itemdata.name)) { return false }
      return true
    },
    toEditor: function (lang) {
      this.editorType = lang
    },
    toggle: function () {
      if (window.lconfig.githubRibbon) {
        const ribbon = document.getElementsByClassName('github-ribbon')
        if (ribbon && ribbon[0]) {
          ribbon[0].style.display = 'none'
          window.lconfig.githubRibbon = false
        }
      }
      const cover = document.getElementById('cover-page')
      if (cover) {
        cover.style.display = 'none'
      }
      // set vtitle if it has been set elsewhere
      if (this.model.vtitle) {
        this.vtitle = this.model.vtitle
      }
      // if (this.isEdited) {
      //   return
      // }
      // toggle the tree node
      let duration = 0
      const easing = 'linear'
      this.reset = false // TODO: remove

      // if (this.model.parent) {
      //   return this.toggleN()
      // }
      // toggle the open/close state of the item
      let openItemIds = this.$store.state.openItemIds.slice(0) // clone openid array
      if (!this.isOpen) {
        openItemIds.push(this.model.id)
      } else {
        openItemIds = openItemIds.filter(id => id !== this.model.id)
        this.closearrow = true
      }

      const ul = this.$el.getElementsByClassName('child-items')[0]
      if (!this.isOpen) {
        Velocity(ul, 'slideDown', {duration, easing}).then(els => {
          this.$store.commit('OPEN_ITEMS', {openItemIds})
          if (this.accordion) {
            this.closeSiblings(easing, 'Up')
          }
        })
      } else if (this.model.id === this.$store.state.currentItem.id) {
        Velocity(ul, 'slideUp', {duration, easing}).then(els => {
          this.$store.commit('OPEN_ITEMS', {openItemIds})
          this.closearrow = false
          if (this.accordion) {
            this.closeSiblings(easing, 'Down')
          }
        })
      }
      const id = this.model.id
      if (this.model.page) {
        // TODO: this is duplicate of code in store
        let page = this.model.page
        this.$store.dispatch('setCurrentItem', {id: page.pid})
        this.$store.dispatch('setCurrentPageSection', {id: page.id})
        const sectionId = `x${page.pid}-${page.id}`
        const sectionEl = document.getElementById(sectionId)
        const container = document.getElementById('content-inner-containerb')
        Velocity(sectionEl, 'scroll', { container })
        console.log('page', page)
        return
      }
      if (this.model.presentation) {
        let presentation = this.model.presentation
        let id = this.model.presentation.pid
        this.$store.dispatch('setCurrentItem', {id})

        let _toPageF = () => {
          const iframe = document.getElementsByTagName('iframe')[0]
          if (!presentation.hasOwnProperty('index')) { return }
          if (!iframe.contentWindow) {
            console.log('NO IFRAME CONTENT WINDOW')
          }
          if (iframe.contentWindow.Reveal) {
            console.log('going to page:', presentation.index)
            iframe.contentWindow.Reveal.slide(presentation.index, 0)
          } else {
            console.log(iframe.contentWindow.document)
            console.log('no reveal')
          }
        }
        window.setTimeout(_toPageF, 1)
        return
      }
      // if (!this.targetEl) { return }
      this.$store.dispatch('setCurrentItem', {id})
      // this.$store.dispatch('setCurrentItem', {id})
    },
    toggleN: function () {
      // toggle the tree node
      let duration = 0
      const easing = 'linear'
      this.reset = false // TODO: remove
      const ul = this.$el.getElementsByClassName('child-items')[0]
      if (!this.model.o) {
        Velocity(ul, 'slideDown', {duration, easing}).then(els => {
          this.model.o = !this.model.o
          this.closearrow = this.model.o
          if (this.accordion) {
            this.closeSiblingsN(easing, 'Up')
          }
        })
      } else {
        Velocity(ul, 'slideUp', {duration, easing}).then(els => {
          console.log('slideup')
          this.model.o = !this.model.o
          this.closearrow = this.model.o
          if (this.accordion) {
            this.closeSiblingsN(easing, 'Down')
          }
        })
      }
      // if (!this.targetEl) { return }
    },
    // close siblings if in accordion mode
    closeSiblings: function (easing, direction) {
      const duration = 500
      const nextSiblings = JSON.search(this.$store.state.leodata, '//*[id="' + this.model.id + '"]/following-sibling::*')
      const prevSiblings = JSON.search(this.$store.state.leodata, '//*[id="' + this.model.id + '"]/preceding-sibling::children')
      let siblings = nextSiblings.concat(prevSiblings)
      siblings = siblings.map(s => s.id)
      // const id = this.model.id
      siblings.forEach(sid => {
        // if (sid === id) { return }
        let el = document.getElementById(sid)
        el.style.display = 'none'
        Velocity(el, 'slide' + direction, {duration, easing}).then(els => {
        })
      })
    },
    closeSiblingsN: function (easing, direction) {
      const duration = 500
      let siblings = _.clone(this.model.parent.children)
      siblings = siblings.map(s => s.id)
      const id = this.model.id
      siblings.forEach(sid => {
        if (sid === id) { return }
        let nid = this.prefix + '' + sid
        // let el = document.querySelectorAll('li[nid = ' + nid + ']')[0]
        let el = document.getElementById(nid)
        Velocity(el, 'slide' + direction, {duration, easing}).then(els => {
        }).catch(e => console.log(e))
      })
    }
  },
  watch: {
    '$store.state.contentItemsUpdateCount': {
      handler: function (val, oldVal) {
        // if (!this.isOpenInline) { return }
        if (val > 0 && val !== oldVal) {
          // const text = this.$store.state.contentItems[this.model.id]
          // this.myContent = text
          // const leo = this.textItems[this.model.t]
          // this.myLang = util.getLanguage(leo)
          // this.myDirectives = util.getDirectives(leo)
          // this.myLeo = util.removeDirectives(leo)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
  },
  updated () {
  }
}
</script>


<style lang="scss" scoped>
$black: rgba(0,0,0,0.5);
$selected: rgba(50,50,50,0.5);
$dkblack: #333;
$mdblack: rgba(150,150,150,0.5);
$ltblack: #444;
$grey: #888;
$width: 350px;

section {
  transform: translateX(70px);
}

.back {
  -webkit-box-shadow: 10px 10px 36px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 10px 10px 36px 0px rgba(0,0,0,0.75);
  box-shadow: 10px 10px 36px 0px rgba(0,0,0,0.75);
  border-radius: 20px;
  width: $width;

  // .back {
  //   width: 200px;
  //   .back .back {
  //     width: 300px;
  //     .back .back {
  //       width: 235px;
  //     }
  //   }
  // }

  background-repeat: no-repeat;
	background-position: center center;
  background-size: cover;
  background-blend-mode: overlay;
  background-attachment: absolute;
  filter: opacity(90%);
}

.block {
  background-color: $black;
  border: 1px solid;
  border-color: $mdblack;
  // border-bottom-color: $ltblack;

  button {
    background: $dkblack;
    border: 1px solid $ltblack;
    &:focus {
      outline: 1px dashed $ltblack;
    }
  }
}

.block {
  font-size: 14px;
  position: relative;
  display: block;
  padding: 4px 40px 4px 10px;
  margin: 5px 0;
  width: $width;
  transition: 0.5s all ease;
  // font-family: 'Space Mono', monospace;
  text-align: left;
  border-radius: 20px;
  button {
    cursor: pointer;
    border-radius: 2px;
  }
  // .block {
  //   width: 200px;
  //   .block .block {
  //     width: 300px;
  //     .block .block {
  //       width: 235px;
  //     }
  //   }
  // }
}

.block button.info,
.block .block button.info {
  // font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  position: absolute;
  right: 8px;
  background: #42b983;
  padding: 3px 8px;
  font-size: 12px;
  color: white;
  margin-top: -1px;
  letter-spacing: 0.05em;
  cursor: pointer;
  border: none;
}

@media only screen and (max-width: 600px) {
  section {
    transform: translateX(20px) !important;
  }

  .block,
  .block .block .block .block {
    font-size: 12px;
    width: $width !important;
  }

  .block button.info,
  .block .block button.info {
    font-size: 9px;
  }
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
$contentBorderColor: #ccc
.topItem
  margin-bottom: 10px
  SPAN
    font-size: 30px
    line-height: 1.5
  .icon-bracket
    // display: none
.topItemIcon
  vertical-align: top
  padding-left: 20px
  margin-right: -10px
  // display: none
.icon-tab
  display: inline-block
.icon
  float: left
  padding: 5px
.icon-b
  display: inline-block
  padding-left: 3px
  padding-right: 3px
.icon-bracket
  //display: none
  height: 26px
  vertical-align: middle
  padding-bottom: 8px
  padding-left: 0
  .arrow
    display: inline-block
    height: 100%
    vertical-align: middle
    padding-bottom: 2px
    width: 20px
.arrow
  -webkit-transition: all .1s ease
  transition: all .1s ease
  text-align: center
  display: inline-block
  width: 11px
  height: 21px
  margin-top: 2px
  font-family: FontAwesome
.arrowdown
  -webkit-transform: rotate(90deg)
  transform: rotate(90deg)
.item
  cursor: pointer
  width: 100%
.bold
  font-weight: bold
.iactive
  background-color: rgba(30,30,30,0.8)  //#01FF70 //#81ff00
  max-width: 300px
.iactive.topItem
    background-color: rgba(30,30,30,0.8)
.activeb
  background: #81ff00
  font-weight: bold
.inline .content
  max-width: 760px
  background: rgba(255,255,255,0.8)
  color: #333
  white-space: normal
  padding: 30px
  padding-top: 20px
  padding-bottom: 20px
  //margin-top: 4px
  margin-bottom: 16px
  border: 6px solid $contentBorderColor
  border-radius: 4px
  // box-shadow: -4px 0 8px -4px rgba(31, 31, 31, 0.8)
.vinline
  max-width: 700px
  white-space: normal
  padding: 0
  padding-top: 0
  padding-bottom: 0
  margin-top: 4px
  margin-bottom: 16px
  height: 600px
  width: 760px
  border: 1px solid $contentBorderColor
  border-radius: 4px
  overflow: auto
// box-shadow: -4px 0 8px -4px rgba(31, 31, 31, 0.8)
.hshim
  height: 15px
.otitle
  padding-left: 4px
.child-items
  margin: 0
  padding: 0
.unselected-sibling
  background-color: yellow
  height: 0
  overflow: hidden
  -webkit-transition: height 0s ease
  transition: height 0s ease
.leo-box
  display: none
.accordion
  margin-top: 40px
.code-directive .CodeMirror
  height: 100px
  margin-bottom: 20px
</style>

<!--
<style lang="css">
@import url('https://assets-cdn.github.com/assets/gist-embed-1baaff35daab552f019ad459494450f1.css');

.medium-editor-container * {
    outline: none;
    box-sizing: border-box;
}

.medium-editor-container {
    height: 100%;
    margin: 0 auto;
    position: relative;
    padding: 2rem 0;
    font-size: 1.2rem;
}

.medium-editor-container p, 
.medium-editor-container h1, 
.medium-editor-container h2,
.medium-editor-container h3,
.medium-editor-container h4,
.medium-editor-container h5,
.medium-editor-container h6,
.medium-editor-container ul,
.medium-editor-container ol,
.medium-editor-container blockquote {
    max-width: 1000px;
    margin: 0 auto;
}
.medium-editor-container ul,
.medium-editor-container ol {
    margin-left: auto !important;
    padding-left: 30px;
}

.medium-editor-container .medium-editor-element:empty, .medium-editor-container .medium-editor-placeholder {
    max-width: 1000px;
    margin: 0 auto;
}

.medium-editor-container .editor {
    max-width: 1000px;
    margin: 0 auto;
}

.medium-editor-container .medium-editor-placeholder::after {
    color: #BBB;
    max-width: 1000px;
    margin: 0 auto;
    display: block;
}

.medium-editor-container .editor.has-content {
    max-width: 100%;
    margin: 0 auto;
}

.medium-editor-container .editor.has-content.medium-editor-placeholder::after {
    display: none;
}


.medium-editor-container h1 {
    font-size: 2.5em;
    margin-bottom: 0.1em;
}

.medium-editor-container h2 {
    font-size: 2.2em;
    margin-top: 0.2em;
    margin-bottom: 0.1em;
}

.medium-editor-container h3 {
    font-size: 1.9em;
    margin-top: 0.2em;
    margin-bottom: 0.1em;
}

.medium-editor-container h4 {
    font-size: 1.6em;
    margin-top: 0.2em;
    margin-bottom: 0.1em;
}

.medium-editor-container h5 {
    font-size: 1.3em;
    margin-top: 0.2em;
    margin-bottom: 0.1em;
}

.medium-editor-container h6 {
    font-size: 1em;
    margin-bottom: 0.1em;
}

.medium-editor-container p {
    margin-bottom: 1em;
}
.medium-editor-container ul {
    margin-left: 30px;
    list-style: disc;
}
.medium-editor-container ul li {
    margin-bottom: 0.5em
}
.medium-editor-container ol {
    margin-left: 30px;
}
.medium-editor-container ol li {
    margin-bottom: 0.5em
}

.medium-editor-container iframe{
    width: 1px;
    min-width: 100%;
}

.medium-editor-container blockquote {
    border-left: 3px solid #3B3E3E;
    padding-left: 30px;
    margin-bottom: 1.5em;
    margin-top: 1.5em;
    font-style: italic;
}

.medium-toolbar-arrow-under:after {
    border-color: #222526 transparent transparent transparent;
    top: 48px;
}

.medium-toolbar-arrow-over:before {
    border-color: transparent transparent #222526 transparent;
}

.medium-editor-toolbar {
    background-color: #222526;
    border: 1px solid #222526;
    border-radius: 4px;
}

.medium-editor-toolbar li button {
    background-color: transparent;
    border: none;
    border-right: 1px solid #222526;
    box-sizing: border-box;
    color: #fff;
    height: 48px;
    min-width: 48px;
    -webkit-transition: background-color .2s ease-in, color .2s ease-in;
    transition: background-color .2s ease-in, color .2s ease-in;
}

.medium-editor-toolbar li button:hover {
    background-color: transparent;
    color: #00BD6A;
}

.medium-editor-toolbar li .medium-editor-button-first {
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
}

.medium-editor-toolbar li .medium-editor-button-last {
    border-bottom-right-radius: 4px;
    border-right: none;
    border-top-right-radius: 4px;
}

.medium-editor-toolbar li .medium-editor-button-active {
    background-color: transparent;
    color: #00BD6A;
}

.medium-editor-toolbar-form {
    background: #222526;
    border-radius: 4px;
    color: #fff;
}

.medium-editor-toolbar-form .medium-editor-toolbar-input {
    background: #222526;
    color: #fff;
    height: 48px;
}

.medium-editor-toolbar-form .medium-editor-toolbar-input::-webkit-input-placeholder {
    color: #fff;
    color: rgba(255, 255, 255, 0.8);
}

.medium-editor-toolbar-form .medium-editor-toolbar-input:-moz-placeholder {
    /* Firefox 18- */
    color: #fff;
    color: rgba(255, 255, 255, 0.8);
}

.medium-editor-toolbar-form .medium-editor-toolbar-input::-moz-placeholder {
    /* Firefox 19+ */
    color: #fff;
    color: rgba(255, 255, 255, 0.8);
}

.medium-editor-toolbar-form .medium-editor-toolbar-input:-ms-input-placeholder {
    color: #fff;
    color: rgba(255, 255, 255, 0.8);
}

.medium-editor-toolbar-form a {
    color: #fff;
}

.medium-editor-toolbar-anchor-preview {
    background: #222526;
    border-radius: 4px;
    color: #fff;
}

.medium-editor-placeholder:after {
    color: #222526;
}

.medium-editor-container * {
    outline: none;
}

.medium-editor-container .insert-image-container {
    display: flex;
    position: fixed;
    left: 100px;
    top: 100px;
    transform: translate(-54px, -7px);
}

.medium-editor-container .insert-image-container .btn-toggle {
    border: 1px solid #DDD;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 16px;
    color: #555;
    background-color: #FFF;
}

.medium-editor-container .image-handler {
    display: flex;
    position: fixed;
    left: 50%;
    top: 100px;
    transform: translate(-50%, -20px);
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    padding-left: 10px;
    padding-right: 10px;
}

.medium-editor-container .image-handler .btn-toggle {
    border: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 16px;
    color: #FFF;
    background-color: transparent;
}

.medium-editor-container .image-handler .btn-toggle img {
    display: block;
    width: 100%;
    height: auto;
}

.medium-editor-container .image-handler .btn-toggle:hover {
    cursor: pointer;
    color: #00BD6A;
}

.medium-editor-container .insert-image-container .insert-image-menu {
    display: flex;
}
.medium-editor-container .insert-image-container .insert-image-menu .btn-toggle {
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.medium-editor-container .editor-image {
    display: block;
    max-width: 1000px;
    margin: 2rem auto;
}

.medium-editor-container .editor-image img {
    width: 100%;
    height: auto;
    display: block;
}

.medium-editor-container .editor-image-description {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
    margin-bottom: 2rem;
    margin-top: -1rem;
    font-size: 0.8rem;
    color: #999;
    position: relative;
}

.medium-editor-container .editor-image-description.is-empty::after { 
    content: "Image Description";
    color: #BBB;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.medium-editor-container .editor-image + .editor-image-description.is-empty {
    display: none;
}

.medium-editor-container .editor-image.is-focus + .editor-image-description.is-empty {
    display: block;
}

.medium-editor-container .editor-image img:hover {
    cursor: pointer;
}
.medium-editor-container .editor-image.is-expand {
    max-width: 1200px;
}
.medium-editor-container .editor-image.is-full {
    max-width: 100%;
}
.medium-editor-container .editor-image input {
    margin: 0 auto;
    border: 0;
    display: block;
    font-size: 0.7rem;
    padding: 0.5rem;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    color: #888;
    margin-bottom: 2rem;
}

.medium-editor-container .editor-embed-container.is-inactive {
    display: none;
}

.medium-editor-container .editor-embed-input.is-inactive {
    display: none;
}

.medium-editor-container .editor-embed > a {
    display: none;
}
</style> -->