import Vue from 'vue'
import App from './App'
import AppBase from './AppBase.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import StarRating from 'vue-star-rating'

import Icon from 'vue-awesome/components/Icon.vue'
import 'vue-awesome/icons/bars'
import 'vue-awesome/icons/arrow-left'
import 'vue-awesome/icons/arrow-right'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/chevron-left'
import 'vue-awesome/icons/chevron-right'
import 'vue-awesome/icons/expand'
import 'vue-awesome/icons/reply'
import 'vue-awesome/icons/share'
import 'vue-awesome/icons/project-diagram'
import 'vue-awesome/icons/code-branch'
import 'vue-awesome/icons/regular/eye'
import 'vue-awesome/icons/spinner'
import 'vue-awesome/icons/moon'
import 'vue-awesome/icons/regular/moon'
import 'vue-awesome/icons/sync-alt'
import 'vue-awesome/icons/comments'
import 'vue-awesome/icons/comment'
import 'vue-awesome/icons/video'
import 'vue-awesome/icons/pen-nib'
import 'vue-awesome/icons/cog'
import 'vue-awesome/icons/play'
import 'vue-awesome/icons/stop'
import 'vue-awesome/icons/volume-up'
import 'vue-awesome/icons/volume-mute'

import ForkMeOnGithub from 'fork-me-on-github-vue'
// import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
// import 'timeline-vuejs/dist/timeline-vuejs.css'

// content components
import {LMap, LTileLayer, LMarker} from 'vue2-leaflet'
import InfoCard from 'vue-info-card'
import VTooltip from 'v-tooltip'
import VueContentPlaceholders from 'vue-content-placeholders'

import AsyncComputed from 'vue-async-computed'
import VueKinesis from 'vue-kinesis'

import VueYouTubeEmbed from 'vue-youtube-embed'

import Fullscreen from 'vue-fullscreen'
import VueResize from 'vue-resize'
import Zircle from 'zircle'

import VTable from './components/Table'
import VCTable from './content-components/VCTable'
import Mermaid from './content-components/Mermaid'
import MermaidP from './content-components/MermaidP'
import VSVG from './content-components/VSVG'
import SectionLink from './components/SectionLink'
import TOC from './components/TOC'
import NodeLink from './components/NodeLink'
import MathJaxComponent from './components/MathJax'
import ImageLeft from './components/layout/ImageLeft'
import LVTimeline from './components/LVTimeline'
import WordCloud from './components/WordCloud'
import Kanban from './components/Kanban'
import MermaidBoard from './components/MermaidBoard'
import D3Board from './components/D3Board'

import { TableComponent, TableColumn } from 'vue-table-component'
import SummaryTable from './components/SummaryTable'
import VueWordCloud from 'vuewordcloud'
import VueLazyImageLoading from 'vue-lazy-image-loading'
// import VueCesium from 'vue-cesium'
import vBlur from 'v-blur'
// import Chat from 'vue-beautiful-chat'
// import VueFab from 'vue-float-action-button'
import VueEvents from 'vue-events'
import VueLazyComponent from '@xunlei/vue-lazy-component'
import Grid from 'vue-js-grid'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import Transitions from 'vue2-transitions'
import VueMouseFollower from 'vue-mousefollower'
import VueGoodLinks from 'vue-good-links'
import 'vue-good-links/dist/vue-good-links.css'
import VueAnime from 'vue-animejs'
import VueRouterMultiView from 'vue-router-multi-view'
import VueMq from 'vue-mq'
// import AudioVisual from 'vue-audio-visual'
import VueAudio from 'vue-audio-better'
import VueGamepad from 'vue-gamepad'
import VuePrlx from 'vue-prlx'
import panZoom from 'vue-panzoom'

import SlideOut from '@hyjiacan/vue-slideout'
import '@hyjiacan/vue-slideout/lib/slideout.css'

// import Embed from 'v-video-embed'

// import VueVideoPlayer from 'vue-video-player'
// import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'
// import './lib/videojs-youtube'
// import 'videojs-youtube'
// import 'videojs-contrib-hls/dist/videojs-contrib-hls'

import vmodal from 'vue-js-modal'
import Element from 'element-ui'
import './assets/element.scss'
import locale from 'element-ui/lib/locale/lang/en'

// import { SmartWidgetGrid } from 'vue-smart-widget'
import { ElementTiptapPlugin } from 'element-tiptap'
import 'element-tiptap/lib/index.css'

// import Editor from 'vue-editor-js'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

import { blockstack, bs } from './services/blockstack'
import { charts } from './content-components/Charts'
import Textra from './content-components/Textra'
import Impress from './content-components/Impress'

import pkg from '../package.json'
const Defiant = require('./lib/defiant') // eslint-disable-line

charts(Vue)
Vue.prototype.$blockstack = blockstack
Vue.prototype.$bs = bs

// Enable progressive web app support (with offline-plugin)
// if (process.env.NODE_ENV === 'production') {
//   require('./pwa')
// }
// Vue.use(Editor)
// Vue.use(ElementUI)

// Vue.use(VueVideoPlayer)
// Vue.use(AudioVisual)

Vue.use(panZoom)
Vue.use(VuePrlx)
Vue.use(SlideOut, {})
Vue.use(VueGamepad)
Vue.use(VueAudio)
Vue.use(Impress)
Vue.use(Element, { locale })
Vue.use(ElementTiptapPlugin)
Vue.use(vmodal, { dynamic: true })

Vue.use(Transitions)
Vue.use(VueRouterMultiView)
Vue.use(VueAnime)
Vue.use(VueGoodLinks)
Vue.use(VueMouseFollower)
Vue.use(Transitions)
Vue.use(Loading)
Vue.use(Grid)
Vue.use(VueLazyComponent)

Vue.use(VueKinesis)
Vue.use(AsyncComputed)
Vue.use(VueEvents)
// Vue.use(Chat)
Vue.use(VueContentPlaceholders)
Vue.use(VTooltip)

Vue.use(Fullscreen)
Vue.use(VueYouTubeEmbed)
Vue.use(ForkMeOnGithub)
// Vue.use(BootstrapVue)
Vue.use(Zircle)
Vue.use(VueResize)
Vue.use(VueLazyImageLoading)
Vue.use(vBlur)

Vue.use(VueMq, {
  breakpoints: { // default breakpoints - customize this
    sm: 650,
    md: 1250,
    lg: Infinity
  }
})

// Vue.use(VueCesium, {
// cesiumPath is path of Cesium.js', for example:
// local Cesium Build package:
// cesiumPath: /static/Cesium/Cesium.js
// Personal online Cesium Build package：
// cesiumPath: 'https://zouyaoji.top/vue-cesium/statics/Cesium/Cesium.js'
// Personal online SuperMap Cesium Build package：
// cesiumPath: 'https://zouyaoji.top/vue-cesium/statics/SuperMapCesium/Cesium.js'
// Official Online Cesium Build package：
// cesiumPath: 'https://unpkg.com/cesium/Build/Cesium/Cesium.js',
// cesiumPath: 'https://zouyaoji.top/vue-cesium/statics/MyCesium/Cesium.js',
// accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5Y2U0ZTk2Ni1jNzdkLTQ3OWYtYjVmYS0yMGM3YTk3NjgzMmUiLCJpZCI6Njk5Nywic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0ODA1MTc0OH0.Csy6yyAnv6JSBppH0Ou3ahshqcHFEhP27iOz5gjQMEo'
// })
// Vue.use(VueFab, {
//   iconType: 'MaterialDesign'
//   // iconType: 'iconfont'
// })

// Vue.component('SmartWidgetGrid', SmartWidgetGrid)
Vue.component('textra', Textra)
Vue.component('star-rating', StarRating)
Vue.component('lv-timeline', LVTimeline)
Vue.component('word-cloud', WordCloud)
Vue.component('img-left', ImageLeft)
Vue.component('sectionlink', SectionLink)
Vue.component('toc', TOC) // table of contents (of child nodes)
Vue.component('Nodelink', NodeLink)
Vue.component('v-table', VTable)
Vue.component('v-svg', VSVG)
Vue.component('vc-table', VCTable)
Vue.component('mermaid', Mermaid)
Vue.component('mermaidp', MermaidP)
Vue.component('mj', MathJaxComponent)
Vue.component('info-card', InfoCard)
Vue.component('l-map', LMap)
Vue.component('l-tilelayer', LTileLayer)
Vue.component('l-marker', LMarker)
Vue.component('summary-table', SummaryTable)
Vue.component('table-component', TableComponent)
Vue.component('table-column', TableColumn)
Vue.component('kanban', Kanban)
Vue.component('mermaid-board', MermaidBoard)
Vue.component('d3-board', D3Board)
Vue.component(VueWordCloud.name, VueWordCloud)

sync(store, router)

const util = require('./util.js')
util.parseQueryString(window.lconfig, window.location.href) // fill in global config object from url params

Vue.component('icon', Icon)

Vue.config.productionTip = false

let template = '<App/>'
let el = '#app'
if (window.lconfig.appBase) {
  template = '<AppBase />'
  el = '#app-base'
}

/* eslint-disable no-new */
require('./simpledrag.js')
new Vue({
  el,
  store,
  router,
  template: template,
  components: { App, AppBase },
  mounted: function () {
    // const vm = this
    window.addEventListener('keyup', e => {
      // If down arrow was pressed...
      let direction = ''
      e.preventDefault()
      switch (e.keyCode) {
        case 40:
          direction = 'down'
          break
        case 38:
          direction = 'up'
          break
        case 13:
          direction = 'in'
          break
        default:
      }
      if (direction) {
        this.$store.dispatch('changeCurrentItem', { direction })
      }
    })
  }
})
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  console.log('Error: ', err, vm.name, info)
}
Vue.config.warnHandler = function (err) {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  console.log('Warning: ', err)
}

window.noop = () => {}

console.log(`${pkg.name} v${pkg.version} is running`)
