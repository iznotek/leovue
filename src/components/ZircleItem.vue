<template>
    <z-view :id="prefix + model.id" :nid="nid" size="xxl"
      class="meteor">
      <div slot="media" v-html="myContent">
      </div>
      <div slot="extension">
        <z-spot
          v-for="(itemdata, index) in model.children"
          button
          size="l"
          class="meteor"
          :distance="150"
          :angle="(-90 + (model.children.length > 5 ? 360 : 180) / model.children.length * index)"
          @click.native="toggle(itemdata.id)"
          :to-view="{ name: 'itemNext', params: {model: itemdata, key: itemdata.id, textItems: text, targetEl: targetEl, top: false}}"
          :key="itemdata.id">
          {{ itemdata.vtitle }}
        </z-spot>
      </div>
    </z-view>
</template>

// 
// <div :id="prefix + model.id" :nid="nid"
//     <z-view
//     label="Scenes"
//     v-bind:class="{'unselected-sibling': hasOpenSibling}"
//     slider
//     :progress="progress" >
//     <!--  :style="styleActive"> -->
//     <h1>{{model.vtitle}}</h1>
//     <div style="height: 60px;">
//       {{myContent}}
//     </div>
//     <div slot="extension" >
//           <z-spot
//             v-for="( model, index ) in model.children"
//             button
//             size="s"
//             :distance="120"
//             :angle="325 + (90 / model.children.length * index)"
//             <!-- :style="activeScene === el.scene ? styleActive : ''" -->
//             :key="index"
//             <!-- @click.native="showMe(el)"> -->
//             <!--  <i class="fas" :class="model.icon"></i> -->
//           </z-spot>
//       </div>
//     </z-view>
//   </div>

// <li :id="prefix + model.id"
//       :nid="nid"
//       v-bind:class="{'unselected-sibling': hasOpenSibling}">
//     <div class="item-box"
//          :class="{bold: isFolder, iactive: active, topItem: top}"
//          >
//       <div
//         @click="toggle">
//         <div v-bind:class="{'icon-bracket': top}" class="icon-b"
//              v-if="isFolder">
//           <div class="arrow"
//                v-bind:class="{arrowdown: isOpenA}">{{arrowIcon}}</div>
//         </div>
//         <div class="leo-box"></div>
//         <div v-if="!isFolder" class="leaf-button"></div>
//         <span class="otitle">{{model.vtitle}}</span>
//       </div>
//     </div>
//     <div v-show="isOpen" class="child-items">
//       <div v-html="myContent"
//            class="inline">
//       </div>
//       <ul v-if="isFolder">
//         <zitem
//           class="item"
//           v-for="model in model.children"
//           :model="model"
//           :prefix="prefix"
//           :key="model.id"
//           :textItems="textItems"
//           :accordion="accordion"
//           :targetEl="targetEl">
//         </zitem>
//       </ul>
//       <div v-show="isOpenInline" class="hshim"></div>
//     </div>
//   </li>

<script>

import Velocity from 'velocity-animate'
import _ from 'lodash'

export default {
  name: 'zitem',
  props: {
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
      model: Object,
      reset: true,
      openFlag: false,
      hasRibbon: false,
      inline: true,
      closearrow: false,
      myContent: ''
    }
  },
  computed: {
    arrowIcon: function () {
      return window.lconfig.itemArrow || '▶'
    },
    isFolder: function () {
      // console.log(this.model.name)
      if (/\.leo\)$/.test(this.model.name)) { return true } // subtree
      if (/^@outline/.test(this.model.name)) { return true } // outline
      return this.model.children && this.model.children.length
    },
    // isChildFolder: function () {
    //   // console.log(this.model.name)
    //   if (this.model.children && id < this.model.children.length) {
    //     if (/\.leo\)$/.test(this.model.children[id].name)) { return true } // subtree
    //     if (/^@outline/.test(this.model.children[id].name)) { return true } // outline
    //     return this.model.children[id].children && this.model.children[id].children.length
    //   }
    //   return false
    // },
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
    toggle: function (id) {
      console.log('toggle')
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

      let openItemIds = this.$store.state.openItemIds.slice(0) // clone openid array
      if (!this.isOpen) {
        openItemIds.push(this.model.id)
      } else {
        openItemIds = openItemIds.filter(id => id !== this.model.id)
        this.closearrow = true
      }

      // const ul = this.$el.getElementsByClassName('child-items')[0]
      this.$store.commit('OPEN_ITEMS', {openItemIds})

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
      this.$store.dispatch('setCurrentItem', {id})
      this.myContent = this.$store.state.contentItems[this.model.id]
    }
  },
  watch: {
    '$store.state.contentItemsUpdateCount': {
      handler: function (val, oldVal) {
        if (!this.isOpenInline) { return }
        if (val > 0 && val !== oldVal) {
          const text = this.$store.state.contentItems[this.model.id]
          this.myContent = text
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    if (this.$zircle.getParams() !== undefined) {
      this.model = this.$zircle.getParams().model
    }
    this.myContent = this.$store.state.contentItems[this.model.id]
  },
  updated () {
    // if (this.$zircle.getParams() !== undefined) {
    //   this.model = this.$zircle.getParams().model
    // }
    this.myContent = this.$store.state.contentItems[this.model.id]
  }
}
</script>


