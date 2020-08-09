<template>
  <div  style="width:100%; height:100%;">
    
    <div v-if="connected && editable" style="position: relative;">
      <edit-menu :state="edit" style="float: right; margin-top: -35px; margin-right: -50px;" />
    </div> 

    <!-- <div v-if="connected && !edit">
      <editorjson :state="edit"  />
    </div> -->

    <div class="behind" :class="darkmode">
    <div>
      <component :is="fade.next ? fade.transitionIn : fade.transitionOut"  :duration="fade.duration" :delay="fade.next ? fade.delay : 0" v-show='fade.next'>
      <div>
        <div v-for="(item,index) in itemOdd" :key="index" 
          style="position: absolute; width: 100%; height: 100%;"
          :style="{zIndex: item.item.id === current.item.id ? 6004 : 6000}">
          
          <div v-if="textContent(item)">
                  <div id="lhandle"
                      class="handle">
                    <div class="handle-button"
                        v-show="hasPrev(item)"
                        @click="goPrev">
                      <icon class="icon"
                            name="chevron-left"></icon>
                    </div>
                  </div>
                  <div id="tlayout">
                    <div :style="{overflow: 'hidden', width: '100%', height: '100%'}">
                      <div class="inner-container" id="content-inner-container" style="width:100%; height:100%; overflow:hidden">
                        <div id="content-inner-containerb" class="right-cpane" :style="{overflowY: 'auto', height: '100%'}" v-on:scroll="onScroll" >
                          <div class="around" :class="arounddarkmode" :style="{maxWidth: cpWidth, marginLeft: 'auto', marginRight: 'auto'}">
                            
                            <!-- {position:'relative', overflow: 'hidden', width: '100%', height: '100vh'} 
                            <editorjs  v-if="edit && item.item.id === current.item.id"
                              :autofocus="editor.autofocus"
                              ref="editorjs"
                              :holderId="'editor'+item.item.id+'1'"
                              :placeholder="editor.placeholder"
                              :data="item.json || editor.initData"
                              @save="onEditorSave"
                              @ready="onEditorReady"
                              @change="onEditorSave"
                            />
                            <component v-else :is="dynComponent(item)" v-bind="$props"/> -->
                            <tip-tap v-if="edit && item.item.id === current.item.id" 
                              :item="item || editor.initData"
                              @onChange="onEditorSave"/>
                            <component v-else :is="dynComponent(item)" v-bind="$props"/> 

                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  <div id="rhandle"
                      class="handle">
                    <div class="handle-button"
                        v-show="hasNext(item)"
                        @click="goNext">
                      <icon class="icon"
                            name="chevron-right"></icon>
                    </div>
                  </div>
                </div>
                <div v-if="boardContent(item)"
                    class="frame"
                    id="bpane">
                  <div style="width:100%">
                    <!-- <editorjs  v-if="edit && item.item.id === current.item.id"
                              :autofocus="editor.autofocus"
                              ref="editorjs"
                              :holderId="'editor'+item.item.id+'2'"
                              :placeholder="editor.placeholder"
                              :data="item.json || editor.initData"
                              @save="onEditorSave"
                              @ready="onEditorReady"
                              @change="onEditorSave"
                            />
                    <component v-else :is="dynComponent(item)" v-bind="$props"/> -->
                    <tip-tap v-if="edit && item.item.id === current.item.id" 
                      :item="item || editor.initData"
                      @onChange="onEditorSave"/>
                    <component v-else :is="dynComponent(item)" v-bind="$props"/> 
                  </div>
                </div>
                <div v-if="slideContent(item)"
                    class="frame"
                    id="bpane">
                  <div style="width:100%">
                    <slideshow :item="item"/> 
                  </div>
                </div>
                <div v-if="iframeContent(item)"
                    class="frame"
                    v-html="iframeHTML(item)"
                    id="vpane">
                </div>

        </div>
        </div>
      </component>
      </div>
    
      <div >
      <component :is="!fade.next ? fade.transitionIn : fade.transitionOut" :duration="fade.duration" :delay="!fade.next ? fade.delay : 0" v-show='!fade.next'>
      <div>
        <div v-for="(item,index) in itemEven" :key="index" 
          style="position: absolute; width: 100%; height: 100%;"
          :style="{zIndex: item.item.id === current.item.id ? 6004 : 6000}">
          
          <div v-if="textContent(item)">
                  <div id="lhandle"
                      class="handle">
                    <div class="handle-button"
                        v-show="hasPrev(item)"
                        @click="goPrev">
                      <icon class="icon"
                            name="chevron-left"></icon>
                    </div>
                  </div>
                  <div id="tlayout">
                    <div :style="{overflow: 'hidden', width: '100%', height: '100%'}">
                      <div class="inner-container" id="content-inner-container" style="width:100%; height:100%; overflow:hidden">
                        <div id="content-inner-containerb" class="right-cpane" :style="{overflowY: 'auto', height: '100%'}" v-on:scroll="onScroll" >
                          <div class="around" :class="arounddarkmode" :style="{maxWidth: cpWidth, marginLeft: 'auto', marginRight: 'auto'}">
                            
                             <!-- <editorjs  v-if="edit && item.item.id === current.item.id"
                              :autofocus="editor.autofocus"
                              ref="editorjs"
                              :holderId="'editor'+item.item.id+'1'"
                              :placeholder="editor.placeholder"
                              :data="item.json || editor.initData"
                              @save="onEditorSave"
                              @ready="onEditorReady"
                              @change="onEditorSave"
                            />
                            <component v-else :is="dynComponent(item)" v-bind="$props"/> -->
                            <tip-tap v-if="edit && item.item.id === current.item.id" 
                              :item="item || editor.initData"
                              @onChange="onEditorSave"/>
                            <component v-else :is="dynComponent(item)" v-bind="$props"/> 
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  <div id="rhandle"
                      class="handle">
                    <div class="handle-button"
                        v-show="hasNext(item)"
                        @click="goNext">
                      <icon class="icon"
                            name="chevron-right"></icon>
                    </div>
                  </div>
                </div>
                <div v-if="boardContent(item)"
                    class="frame"
                    id="bpane">
                  <div style="width:100%">
                    
                    <!-- <editorjs  v-if="edit && item.item.id === current.item.id"
                              :autofocus="editor.autofocus"
                              ref="editorjs"
                              :holderId="'editor'+item.item.id+'2'"
                              :placeholder="editor.placeholder"
                              :data="item.json || editor.initData"
                              @save="onEditorSave"
                              @ready="onEditorReady"
                              @change="onEditorSave"
                            />
                    <component v-else :is="dynComponent(item)" v-bind="$props"/> -->
                    <tip-tap v-if="edit && item.item.id === current.item.id" 
                      :item="item || editor.initData"
                      @onChange="onEditorSave"/>
                    <component v-else :is="dynComponent(item)" v-bind="$props"/> 
                  </div>
                </div>
                <div v-if="slideContent(item)"
                    class="frame">
                  <div style="width:100%">
                    <slideshow :item="item" /> 
                  </div>
                </div>
                <div v-if="iframeContent(item)"
                    class="frame"
                    v-html="iframeHTML(item)"
                    id="vpane">
                </div>

        </div>
        </div>
      </component>


    </div>
    </div>

    </div> 
 
</template>

<script>

import {presentation} from '../lib/presentation'
import Slideshow from './Slideshow'
import _ from 'lodash'

const util = require('../util.js')
const hljs = require('highlight.js')

import { ContentLoader } from 'vue-content-loader'
import TipTap from './editor/TipTap'
// import EditorJs from './editor/EditorJs'
import EditMenu from './EditMenu'

const transitions = ['fade-transition', 
  'zoom-center-transition', 'zoom-x-transition', 'zoom-y-transition',
  'collapse-transition', 
  'scale-transition',
  'slide-y-up-transition', 'slide-y-down-transition', 'slide-x-left-transition', 'slide-x-right-transition']

// functions for dealing with x-frame headers
// TODO move these
window.getData = function (data) {
  if (data && data.query && data.query.results && data.query.results.resources && data.query.results.resources.content && data.query.results.resources.status == 200) {
    let html = data.query.results.resources.content
    if (/https:/.test(window.url)) {
      html = html.replace(/src="http:/g, 'src="https:')
    }
    loadHTML(html)
  } else if (data && data.error && data.error.description) {
    loadHTML(data.error.description)
  } else {
    loadHTML('Error: Cannot load ' + window.url)
  }
}
window.loadHTML = function (html) {
  iframe.src = 'about:blank'
  iframe.contentWindow.document.open()
  // iframe.contentWindow.document.write(html.replace(/<head>/i, '<head><base href="' + url + '"><scr' + 'ipt>document.addEventListener("click", function(e) { if(e.target && e.target.nodeName == "A") { e.preventDefault(); parent.loadURL(e.target.href); } });</scr' + 'ipt>'))
  iframe.contentWindow.document.write(html.replace(/<head>/i, '<head><base href="' + window.url + '"><scr' + 'ipt>document.addEventListener("click", function(e) { if(e.target && e.target.nodeName == "A") { e.preventDefault(); window.open(e.target.href); } });</scr' + 'ipt>'))
  iframe.contentWindow.document.close()
}
window.loadURL = function (src) {
  let url = src
  var script = document.createElement('script')
  script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.headers%20where%20url%3D%22' + encodeURIComponent(url) + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=getData'
  document.body.appendChild(script)
};
function overrideXFrame(item, textItems) {
  // console.log('override xframe')
  const iframe = document.getElementById('iframe-' + item.id);
  if (!iframe){ return }
  window.iframe = iframe
  const url = iframe.src
  if (url === 'about:blank') {
    return loadPresentation(item, textItems, iframe)
  }
  console.log('URL', url)
  if (!/^\s?xttp/.test(url)) { return }
  window.url = url.replace(/^s?xttp/, 'http')
  loadURL(window.url)
}
// end functions for dealing with x-frame headers

function loadPresentation(item, textItems, iframe) {
  console.log('loading presentation', item)
  // debugger
  let content = ''
  let re = /^@props (.*)/
  if (!item.children.length) {
    console.log('pid', item.presentation.pid)
    return
  }
  item.children.forEach((page, index) => {
    let pageContent = textItems[page.t]
    let props = re.exec(pageContent)
    if (props) {
      props = props[1]
    } else {
      props = ''
    }
    content = content + '<section ' + props + '>' +  util.formatText(pageContent, true) + '</section>'
  })
  const html = presentation(item.name, content)
  iframe.contentWindow.document.open()
  iframe.contentWindow.document.write(html)
  iframe.contentWindow.document.close()
}

export default {
  name: 'contentpane',
  components: {
    ContentLoader,
    EditMenu,
    TipTap,
    Slideshow
    // editorjs: EditorJs // ,
    // editorjson: JsonEditor
  },
  data () {
    return {
      xSections: [],
      handleScroll: null,
      new: {},
      current: {},
      history: [],
      historyItems: [],
      loading: true,
      edit: false,
      editor: {
        autofocus: false,
        placeholder: 'Become a knowledge explorer and write something deep under your look !!',
        initData: {},
        savedData: {}
      },
      fade: {
        duration: 500,
        delay: 500,
        next: false,
        items: [], 
        indexOdd: -1,
        indexEven: -1,
        transitionIn: transitions[0],
        transitionOut: transitions[0]
      }
    }
  },
  methods: {
    onEditorSave (data, html) {
      this.save(data, html)
    },
    onEditorReady () {
      // console.log('ready')
    },
    save (json, html) {
      this.current.json = json
      this.current.content = '<div>' + html + '</div>'
      this.$store.state.leojson[this.current.item.t] = json
      this.$store.state.leotext[this.current.item.t] = '<div>' + html + '</div>'
    },
    onScroll () {
      // bail if this isn't a paged item
      if (!this.xSections.length) { return }
      this.handleScroll()
    },
    goNext () {
      const next = this.current.item.next
      this.resetCurrentItem(next)
    },
    goPrev () {
      const prev = this.current.item.prev
      this.resetCurrentItem(prev)
    },
    resetCurrentItem (id) {
      // router.replace('/t/' + id)
      // const currentItem = { id }
      // this.$store.commit('RESET')
      this.$store.dispatch('setCurrentItem', {id})
    },
    dataTableClick (r) {
      debugger
      const title = r.data.title.replace(/<[^>]*>/g, "")
      // const title = r.data.title.innerHTML.replaceAll("<[^>]*>", "")
      const item = JSON.search(this.$store.state.leodata, '//*[vtitle="' + title + '"]')[0]
      if (item) {
        const id = item.id
        this.$store.dispatch('setCurrentItem', {id})
      }
      console.log('ROW CLICK', title, item)
    },
    edited (item) {
      console.log(item, this.slide.items)
      if (this.slide.items.length) {
        var last = this.slide.items[this.slide.items.length - 1]
        if (item.item.id != last.item.id) {
          console.log('not last')
          return false
        }
      }
      if (item && item.edited) {
        return true
      } else {
        return false
      }
    },
    iframeContent (item) {
      if (item && item.pane === 'site') {
        return true
      } else {
        return false
      }
    },
    boardContent (item) {
      if (item && item.pane === 'board') {
        return true
      } else {
        return false
      }
    },
    slideContent (item) {
      if (item && item.pane === 'slide') {
        return true
      } else {
        return false
      }
    },
    textContent (item) {
      if (item && item.pane === 'text') {
        return true
      } else {
        return false
      }
    },
    currentItemContent (item) {
      if (!this.connected) {
        return true
      }
      return item && item.content ? item.content : '' // this.$store.state.currentItemContent
    },
    iframeHTML (item) {
      if (this.iframeContent(item)) {
        return item.iframe
      } else {
        return ''
      }
    },
    hasNext (item) {
      return item && item.next ? item.next : false // this.$store.state.currentItem.next
    },
    hasPrev (item) {
      return item && item.prev ? item.prev : false // this.$store.state.currentItem.prev
    },
    dynComponent (item) {
      // const id = this.$store.state.currentItem.id
      var template = item && item.content ? item.content : '<div></div>' // this.currentItemContent
      return {
        template, // use content as template for this component
        props: this.$options.props // re-use current props definitions
      }
    },
    style (item) {
      return { background: 'transparent' }
    },
    // goToHistory(index) {
    //   if (this.$refs.carousel !== undefined) {
    //     this.$refs.carousel.goSlide(index)
    //   }
    //   else if (this.$refs.slider !== undefined) {
    //     this.$refs.slider.goToSlide(index)
    //   }
    //   else {
    //     this.current = this.historyItems[index]
    //   }
    //   this.$store.commit('LOADING', {state: false})
    // },
    // findInHistory(id) {
    //   let index = this.historyItems.findIndex(item => item.item.id === id);
    //   // console.log(index)
    //   return index
    // },
    // addItem(item) {
    //   this.current = item
    //   this.historyItems.push(item)
    //   let index = this.historyItems.length - 1
    //   setTimeout(() => this.goToHistory(index), 500)
    // },
    setNext(item) {
      if (!item || (item && item.item && item.item.id <= 0)) return
      setTimeout(() => {
          this.edit = false
          
          let index
          let obj = this.fade.items.find(obj => obj.item.id === item.item.id)
          if (!obj) {
            this.fade.items.push(item)
            index = this.fade.items.length-1
          } else if (obj.item.id !== this.current.item.id) {
            index = this.fade.items.findIndex(obj => obj.item.id === item.item.id)
          } else {
            return
          }

          // console.log(item)
          // item.json = this.$store.state.leojson[item.item.t] || {}
          var deep = item.item.obj.deep
          item.mode = (deep && deep.look && deep.look.mode === 'normal') ? 'normal' : 'invert'

          this.current = this.fade.items[index]
          if (this.fade.next) {
            this.fade.indexEven = index
          } else {
            this.fade.indexOdd = index
          }
          this.fade.next = !this.fade.next

          setTimeout(() => {
            this.$store.commit('LOADING', {state: false})
          }, 1000)
      }, 100)
    }
  },
  computed: {
    darkmode () {
      const dmode = !this.$store.state.darkmode
      const invert = this.current.mode === 'invert'
      return dmode ? (!invert ? 'light' : 'dark') : (!invert ? 'dark' : 'light')
    },
    arounddarkmode () {
      const dmode = this.$store.state.darkmode
      const invert = this.current.mode !== 'invert'
      return dmode ? (!invert ? 'lightaround' : 'darkaround') : (!invert ? 'darkaround' : 'lightaround')
    },
    itemOdd () {
      if (this.fade.indexOdd > -1)
        return [this.fade.items[this.fade.indexOdd]]
      else
        return []
    },
    itemEven () {
      if (this.fade.indexEven > -1)
        return [this.fade.items[this.fade.indexEven]]
      else
        return []
    },
    historyIndex () {
      return this.$store.state.historyIndex
    },
    historyLength () {
      return this.historyItems.length
    },
    width () {
      return this.$store.state.rightPaneWidth
    },
    cpWidth () {
      return window.lconfig.contentPaneWidth || '700px'
    },
    data () {
      return this.$store.state.leodata
    },
    text () {
      return this.$store.state.leotext
    },
    connected () {
      return this.$store.state.connected
    },
    config () {
      return window.lconfig
    },
    editable () {
      return this.$store.state.contentPane !== 'site'
    }
  },
  beforeUpdate () {
  },
  mounted () {
    const xSections = document.getElementsByClassName('x-section')
    if (xSections) {
      this.xSections = xSections
    }
    function handleScrollF() {
      const sections = Array.prototype.slice.call(this.xSections)
      sections.forEach(section => {
        const top = section.getBoundingClientRect().top
        if (top < 100) {
          const re = /-(\d+)$/
          const match = re.exec(section.id)
          let id = match[1]
          return this.$store.dispatch('setCurrentPageSection', {id})
        }
      })
    }
    this.handleScroll = _.debounce(handleScrollF, 50)
  },
  updated () {
    const blocks = this.$el.querySelectorAll('code')
    blocks.forEach(function(block) {
      hljs.highlightBlock(block);
    });

    if (this.$store.state.contentPane === 'site') {
      const id = this.$store.state.currentItem.id
      const item = JSON.search(this.data, '//*[id="' + id + '"]')[0]
      overrideXFrame(item, this.$store.state.leotext)
    }

    const clinks = document.getElementsByClassName('csection-link')
    let leodata = this.$store.state.leodata
    let me = this
    // section links in code content require explicit processing bc vue components
    // are turned off in code (with v-pre)
    function gotoSectionFunc (leodata) {
       function func (e) {
         try {
           let item = JSON.search(leodata, '//*[name="' + e.srcElement.innerHTML + '"]')[0]
           console.log('ITEM', item)
           let id = item.id
           me.$store.dispatch('setCurrentItem', {id})
         } catch (e) {
           console.log('goto section error:', e)
         }
       }
       return func
    }
    for (let i = 0; i < clinks.length; i++) {
      let clink = clinks[i]
      clink.onclick = gotoSectionFunc(leodata)
    }
  },
  events: {
    editMenuClick (action) {
      if (action) {
        // if (action.name === 'comments') {
        //   this.comments = !this.comments
        // }
        // if (action.name === 'meeting') {
        //   this.meeting = !this.meeting
        // }
      }
    },
    editMenuToggle (state) {
      if (state) {
        this.edit = state.active
        this.current.edited = state.active
      }
    }
  },
  watch: {
    '$store.state.history': {
      handler: function (val, oldVal) {
        this.history = val
      },
      deep: true,
      immediate: true
    },
    '$store.state.currentItem': {
      handler: function (val, oldVal) {
        this.loading = true
        this.new.item = val ? Object.assign({}, val) : null
        this.new.pane = 'text'
        this.new.content = ''
        this.new.iframe = ''
        this.$store.commit('LOADING', {state: true})
      },
      deep: true,
      immediate: true
    },
    '$store.state.currentItemContent': {
      handler: function (val, oldVal) {
        if (val === undefined) return
        if (this.$store.state.contentPane === 'site') return

        this.new.content = val
        this.new.pane = val !== '' ? this.$store.state.contentPane : 'void'
        this.setNext(Object.assign({}, this.new))
      },
      deep: true,
      immediate: true
    },
    '$store.state.iframeHTML': {
      handler: function (val, oldVal) {
        if (val === undefined) return
        if (this.$store.state.contentPane !== 'site') return

        this.new.iframe = val
        this.new.pane = this.$store.state.contentPane
        this.setNext(Object.assign({}, this.new))
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang='scss'>
.carousel-3d-container {
  .carousel-3d-slide {
    background: rgba(255,255,255, 1.0);
    border: 0px;
  }
}
</style>

<style>
  .pane {
    color: #333;
  }
  .handle-button {
    height:20px;
    width: 20px;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    text-align: center;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 9px;
  }
  #lhandle {
    max-width: 50px;
    margin-right: 0%;
  }
  #rhandle {
    float: right;
  }
  .behind {
    font-family: fantasy; 
    position: relative;
    height: 100%;
    transition: 0.5s;
  }
  .dark {
    background: rgba(255,255,255,0.5);
    // background: linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.9) 100%); /* Black*/
    color: #000;
  }
  .light {
    background: rgba(0,0,0,0.5);
    // background: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.9) 100%); /* Black*/
    color: #FFF;
  }
  .darkaround {
    // background: rgba(255,255,255,0.5);
    // background: linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.9) 100%); /* Black*/
    color: #000;
    // -webkit-box-shadow: 0px 30px 30px rgba(0,0,0,0.3);
    // -moz-box-shadow: 0px 30px 30px rgba(0,0,0,0.3);
    // box-shadow: 0px 30px 30px rgba(0,0,0,0.3);
  }
  .lightaround {
    // background: rgba(0,0,0,0.5);
    // background: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.9) 100%); /* Black*/
    color: #FFF;
    // -webkit-box-shadow: 0px 30px 30px rgba(255,255,255,0.3);
    // -moz-box-shadow: 0px 30px 30px rgba(255,0255,255,0.3);
    // box-shadow: 0px 30px 30px rgba(255,255,255,0.3);
  }
  .around {
    // background: rgba(255, 255, 255, 0.2);
    // padding: 30px;
    // margin: 300px;
    // margin-top: 100px;
    border-radius: 50px;
    // top: 50%;
    // transform: translate(0%, -50%);
    // -ms-transform: translate(-50%, -50%);
    // position: relative;
    margin-top: 5%;
    margin-bottom: 20%;
    // display: flex;
    align-items: center;
    justify-content: center;
    // padding-top: 33px;
    //max-width: 720px;
    //width: 700px;
    // min-width: 500px;
    //overflow: auto;
    // height: calc(100vh - 33px);
  }
  .login {
    //height: 1000px;
    //position:'absolute';
  }
  .handle {
    width:50px;
    // align-items: center;
    //flex: auto;
    display: block;
  }
  .right-cpane {
    flex: auto;
    // background: rgba(255, 255, 255, 0.8);
    padding: 0px;
    // padding-top: 33px;
    //max-width: 720px;
    //width: 700px;
    // min-width: 500px;
    //overflow: auto;
    height: calc(100vh - 0px);
    visibility: false;
  }
  .right-cpane::-webkit-scrollbar {
    display: none;
  }
  p {
    line-height:1.3em;
  }
  #vpane {
    width: 100%;
    //background: #fff;
    //height: 400px;
    height: calc(100vh - 0px);
  }
  #bpane {
    width: 100%;
    //background: #fff;
    height: calc(100% - 0px);
    overflow: scroll;
    visibility: false;
    padding-bottom: 10%;
  }
  #bpane::-webkit-scrollbar {
    display: none;
  }
  #tlayout {
    //background: #fff;
    min-height: 100%;
    // margin: 0;
    // margin-left: 5%;
    // padding: 0;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
  }
  .pane {
    font-family: fantasy;
    z-index: 1500;
    // height: 100%;
    //background: #fff;
    // background: linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.9) 100%); /* Black*/
    background: rgba(255, 255, 255, 0.03);
    width: 100%;
    position: relative;
  }
  .frame {
    display:flex; 
    // background:#fff;
    // background: rgba(255, 255, 255, 0.8); 
    width: 100%;
  }
  .voutline {
  }
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Opera and Firefox */
  }
  blockquote:before {
    content: "\201C";
    font-size: 6.25rem;
    font-family: Georgia;
    left: -7px;
    width: 100%;
    margin-bottom: -50px;
  }
</style>
