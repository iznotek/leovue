<template>
  <div style="height:0px;">
    <div class="holder">
      <div class="header" v-if="config.showHeader">
        <span class="app-title"> 
          {{user}}{{ config.trademark }}
        </span>
       
          
 

        <!-- <span v-if="config.showAppTitle && config.docTitle">:</span> -->
        <span v-if="config.showAppTitle" class="doc-title">{{ docTitle }}</span>
         <!-- <div @click="toggle" class="icon icon-button">
          <icon class="icon" name="bars"></icon>
        </div> -->
       
        <digital-clock :blink="false" />
         <div class="space">.</div>
         <div v-if="connected" @click="$modal.show('settings')" class="icon icon-button">
          <icon class="icon" name="cog"></icon>
        </div> 
        <div @click="fullscreen" class="icon icon-button">
          <icon class="icon" name="expand"></icon>
        </div> 
        <div v-if="connected" @click="$store.commit('DARKMODE', !$store.state.darkmode)" class="icon icon-button">
          <icon class="icon" :name="$store.state.darkmode ? 'moon' : 'regular/moon'" flip="horizontal"></icon>
        </div> 
        <!-- <div v-if="connected" class="button-shim"></div> -->
        <div class="space">.</div>
        <div v-if="connected" @click="goBack"
             class="icon icon-button disabled">
          <icon class="icon"
                :class="{disabled: noBack}"
                name="reply"></icon>
        </div>
        <div v-if="connected" @click="goForward"
             class="icon icon-button">
          <icon class="icon"
                :class="{disabled: noForward}"
                name="share"></icon>
        </div>

        <div class="space">.</div>   
        <div @click="refresh" class="icon icon-button">
          <icon class="icon" name="sync-alt"></icon>
        </div> 
        <!-- <searchbar class="searchbar"></searchbar> -->
        <div class="vshim"></div>

        <!-- <dock/> -->
      </div>
    </div>
    <div id="imenu" class="menu">
      <div style="height:33px" class='header'>
      <div @click="toggle" class="icon icon-button">
          <icon class="icon" name="bars"></icon>
      </div>
      </div>
      <div class="menu-header">View Type</div>
      <div  v-for="v in viewTypes"
            class="menu-item"
            @click="setViewType(v.type)">
        <div class="icon-box">
          <icon
            name="check"
            v-show="viewType === v.type"
            class="check"></icon>
        </div>
        <div class="menu-label">{{v.name}}</div>
      </div>
      <div class="menu-separator"></div>
      <div class="hshim"></div>
      <div @click="setAccordion()"
           title="Accordion mode: close siblings when opening node."
           class="menu-item">
        <div class="icon-box">
          <icon
            name="check"
            v-show="accordion"
            class="check"></icon>
        </div>
        <div class="menu-label">Accordion</div>
      </div>
      <div class="menu-separator"></div>
      <div class="hshim"></div>
      <div class="hshim"></div>
      <div class="hshim"></div>
      <div class="menu-item" style="text-align: center">
        <div class="menu-label">Download<br> Node Data</div>
        <div @click="downloadJSON()"
             class="menu-item">
          <div class="menu-label" style="text-decoration: underline; color: blue">JSON</div>
        </div>
        <div @click="downloadLeo()"
             class="menu-item">
          <div class="menu-label" style="text-decoration: underline; color: blue">Leo</div>
        </div>
      </div>
      <div class="menu-footer" @click="settings">LeoVue</div>
    </div>
  </div>
</template>

<script>
  import SearchBar from './SearchBar'
  import Dock from './dock/dock'
  import _ from 'lodash'
  import { JSONtoLeo } from '../services/leo-file'
  import DigitalClock from 'vue-digital-clock'
  import router from '../router'

  function formatJSONData (data, textItems) {
    if (_.isArray(data)) {
      data.forEach(d => formatJSONData(d, textItems))
    } else {
      data.text = textItems[data.t]
      data.children.forEach(child => {
        formatJSONData(child, textItems)
      })
    }
  }

  export default {
    name: 'appheader',
    components: {
      searchbar: SearchBar,
      dock: Dock,
      DigitalClock
    },
    data () {
      return {
        menu: false
      }
    },
    mounted () {
    },
    methods: {
      settings () {
        this.$router.replace({path: '/settings'})
      },
      downloadJSON () {
        let data = this.$store.state.leodata
        let item = JSON.search(data, '//*[id="' + this.$store.state.currentItem.id + '"]')[0]
        const textItems = this.$store.state.leotext
        formatJSONData(item, textItems)
        const hiddenElement = document.createElement('a')
        hiddenElement.href = 'data:text/json;charset=utf-8,' + encodeURI(JSON.stringify(data))
        hiddenElement.target = '_blank'
        hiddenElement.download = 'leovue.json'
        hiddenElement.click()
      },
      downloadLeo () {
        let data = this.$store.state.leodata
        let item = JSON.search(data, '//*[id="' + this.$store.state.currentItem.id + '"]')[0]
        data = JSONtoLeo(item, this.$store.state.leotext)
        const hiddenElement = document.createElement('a')
        hiddenElement.href = 'data:text/xml;charset=utf-8,' + encodeURI(data)
        hiddenElement.target = '_blank'
        hiddenElement.download = 'leovue.leo'
        hiddenElement.click()
      },
      setAccordion () {
        this.$store.commit('TOGGLEACCORDION')
      },
      fullscreen () {
        this.$fullscreen.toggle(document.getElementById('dashboard'))
      },
      refresh () {
        let filename = 'static/docs'
        if (window.lconfig.filename) {
          filename = window.lconfig.filename
        }
        this.$store.dispatch('loadLeo', {filename, route: this.$route})
        this.$store.dispatch('setMessages')
      },
      toggle () {
        const menuEl = document.getElementById('imenu')
        if (this.menu) {
          menuEl.style.width = 0
          menuEl.style.borderRight = 'none'
        } else {
          menuEl.style.width = '180px'
          // menuEl.style.borderRight = '1px solid #ccc'
        }
        this.menu = !this.menu
      },
      setViewType (type) {
        this.$store.commit('VIEW_TYPE', {type})
        this.$store.commit('RESET')
        this.$router.replace({path: '/' + type + '/' + this.$store.state.currentItem.id})
        // close the menu
        setTimeout(this.toggle, 500)
      },
      goBack () {
        router.back()
        // if (this.noBack) { return }
        // const history = this.$store.state.history
        // let historyIndex = this.$store.state.historyIndex
        // if (historyIndex > 0) {
        //   historyIndex = historyIndex - 1
        // }
        // const id = history[historyIndex]
        // this.$store.dispatch('setCurrentItem', { id, historyIndex })
      },
      goForward () {
        router.forward()
        // if (this.noForward) { return }
        // const history = this.$store.state.history
        // let historyIndex = this.$store.state.historyIndex
        // const id = history[historyIndex + 1]
        // if (historyIndex < history.length - 1) {
        //   historyIndex = historyIndex + 1
        // }
        // this.$store.dispatch('setCurrentItem', { id, historyIndex })
      }
    },
    computed: {
      docTitle () {
        if (!this.connected) {
          return '' // window.lconfig.docTitle
        }
        if (this.$store.state.currentItemPath.includes('@cover')) {
          return window.lconfig.docTitle // + ' / Home'
        }
        return this.$store.state.currentItemPath
      },
      user () {
        return this.$store.state.user.name
      },
      connected () {
        return this.$store.state.connected
      },
      viewType () {
        return this.$store.state.viewType
      },
      accordion () {
        return this.$store.state.accordion
      },
      viewTypes () {
        let viewTypes = [
          {name: 'Outline', type: 't'},
          {name: 'Inline', type: 'a'},
          {name: 'Graphic Tree', type: 'd'},
          {name: 'Dendrogram', type: 'z'},
          {name: 'Nested Menu', type: 'n'},
          {name: 'Movable Panes', type: 'w'}
        ]
        if (this.config.viewTypes) {
          return this.config.viewTypes
        }
        return viewTypes
      },
      noBack () {
        return this.$store.state.historyIndex < 2
      },
      noForward () {
        return this.$store.state.historyIndex >= this.$store.state.history.length - 1
      },
      config () {
        return window.lconfig
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
.clock 
  float: left
  color: #eceff1
  margin-top: -1px
  padding-left: 7px
  padding-right: 15px
.check
  // margin-top: 2px
  // margin-bottom: -3px
.holder
  padding: 0
  margin: 0
  top: 0px
  position: fixed
  width: 100%
  z-index: 1110
.icon-box
  width: 20px
  margin-left: 20px
  display: inline-block
.menu-label
  width: 80px
  display: inline
.menu-header
  padding: 10px
  font-weight: bold
  text-align: center
  white-space: nowrap
.menu-item
  padding: 4px
  // text-align: center
  white-space: nowrap
  cursor: pointer
.menu
  position: fixed
  z-index: 111
  top: 0px
  overflow: hidden
  color: #ccc
  background-color: rgba(0, 0, 0, 0.9)
  //#ccc
  width: 0
  left: 0
  height: 100%
  //border-left: 1px solid #999
  //border-top: 1px solid #ccc
  //-webkit-box-shadow: 10px 0 5px -2px #888;
  //box-shadow: 0px 10 5px -2px #888;
  //box-shadow: -4px 0 8px -4px rgba(31, 31, 31, 0.8)
  transition: width .5s
.menu-separator
  //border-bottom: 1px solid #ddd
  margin-top: 10px
.header
  text-align: left
  //background: linear-gradient(0deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
  background-color: rgba(0,0,0,0.5) 
  font-weight: normal
  padding: 2px
  padding-top: 6px
  padding-left: 6px
  color: #333
  //border-bottom: 1px solid #333
  //box-shadow: 0 1px 1px 0 rgba(116, 129, 141, 0.1)
  box-shadow: 0px 10px 30px rgba(0,0,0,0.85)
  height: 33px
.search
  float: left
  margin-right: 10px
  font-size: 14px
  margin-top: -1px
  display: none
.space
  float: left
  width: 20px
.icon
  float: left
  padding: 0
  margin-top: 1px
  margin-left: 3px
  margin-right: 3px
  color: #ccc
.icon-button
  cursor: pointer
  // margin: 0
  padding: 0
.vshim
  width: 8px
  float: right
.disabled
  color: #ccc
.button-shim
  width: 8px
  float: left
  height: 16px
.app-title
  float: right
  font-weight: normal
  color: #dddddd
  margin-left: 10px
  margin-right: 10px
  //border: 1px solid #ccc
  //border-radius: 5px
  margin-top: -3px
  display: inline-block
  text-align: center
.doc-title
  // font-weight: bold
  margin-left: 20px
  color: #dddddd
  text-align: center
.menu-footer
  color: #fff
  position: absolute
  bottom: 60px
  width: 100%
  text-align: center
  text-decoration: none
  cursor: pointer
.searchbar
  //position: absolute
  //right: 80px
  //top: 0
  border-radius: 16px;
  background: rgba(0,0,0,0.0)
  color: #ccc
  margin-top: -6px
  margin-right: 15px
  margin-left: 15px
  float: right
  height: 33px
</style>
