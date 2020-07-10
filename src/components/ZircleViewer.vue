
<template>
  <div >
    <div class="zircleviewer">
      <div style="position: absolute; width: 100%; height: 100%;">
       <div class="adjust space" :style="{color: 'rgba(255,255,255,0.5)'}">
        <!--<div class="adjust space" :style="{color: $store.state.darkmode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}"> -->
          <textra :data='spaceNames' :timer="1" filter="left-right" />
        </div>
         <div class="adjust spacedesc" :style="{color: 'rgba(255,255,255,0.5)'}">
        <!--<div class="adjust spacedesc" :style="{color: $store.state.darkmode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}"> -->
          <textra :data='spaceDescs' :timer="1" filter="right-left" />
        </div>

<!-- <div class="adjust space" :style="{color: $store.state.darkmode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}">
          <textra :data='spaceNames' :timer="1" filter="left-right" />
        </div>
        <div class="adjust spacedesc" :style="{color: $store.state.darkmode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}">
          <textra :data='spaceDescs' :timer="1" filter="right-left" />
        </div> -->
        <fade-transition v-show='showcircle'>
          <z-canvas id="z-container" class="zcanvas" :views='$options.views' :style="{width: width, left: left}" >
          </z-canvas>
        </fade-transition>
        <fade-transition v-show='!showcircle'>
          <treeview class="zcanvas" :style="{width: width, left: left}" >
          </treeview>
        </fade-transition> 
      </div>
    </div>
  </div>
</template>

<br/>

<script>
  import Settings from './ZircleSettings'
  import ZItem from './ZircleItem'
  import ZView from './ZircleView'
  // import ZIntro from './ZircleIntro'
  import 'zircle/dist/zircle.css'

  import TreeView from './TreeView'
  import {FadeTransition} from 'vue2-transitions'
  // const util = require('../util.js')

  // let zcanvas
  export default {
    name: 'zircleviewer',
    components: {
      treeview: TreeView,
      FadeTransition
    },
    views: {
      item0: ZItem,
      item1: ZItem,
      item2: ZItem,
      item3: ZItem,
      item4: ZItem,
      item5: ZItem,
      item6: ZItem,
      item7: ZItem,
      zview: ZView,
      settings: Settings // ,
      // intro: ZIntro
    },
    data: function () {
      return {
        viewname: '',
        current: '',
        leftTrigger: 70,
        type: 'circle',
        zenable: false,
        check: true,
        spaceNames: ['Welcome'],
        spaceDescs: ['... it should be fun !!!'],
        color: '#fff'
      }
    },
    mounted () {
      this.$zircle.config({
        mode: 'full',
        shape: 'circle',
        style: {
          theme: 'blue',
          mode: 'dark'
        },
        debug: false
      })

      // console.log(this.$zircle.getComponentList())
      this.$zircle.setView('zview')
      this.viewname = this.$zircle.getCurrentViewName()

      setTimeout(() => {
        setInterval(this.checkViewChanged, 500)
      }, 1300)
    },
    updated () {},
    events: {
      show (action) {
        if (action) {
          if (action.name) {
            this.type = action.name
          }
        }
      },
      showLeft (state) {
        if (state) {
          this.type = !state.active ? 'circle' : 'tree'
        }
      }
    },
    methods: {
      initialize () {
        setTimeout(() => {
          setInterval(this.checkViewChanged, 500)
        }, 1300)
      },
      checkViewChanged () {
        let current = this.$zircle.getCurrentViewName() // this.$zircle.resolveComponent(this.$zircle.getComponentList(), this.$zircle.getCurrentViewName())

        if (!this.check) return
        if (current !== this.current) {
          var id = this.$store.state.zircle[current]
          // console.log(id, current, this.$store.state.zircle, this.$store.state.space)
          if (id > 0) {
            // console.log('zircleupdate: ', id)
            this.$store.dispatch('setCurrentItem', {id})
          } else if (this.$store.state.space) {
            id = this.$store.state.space.id
            this.$store.dispatch('setCurrentItem', {id})
          }
          // if (this.$store.state.currentItem.id === id) {
          this.current = current
          // }
        }
      },
      getTop (index) {
        if (!index) {
          return this.top
        }
      }
    },
    computed: {
      left () {
        if (parseInt(this.$store.state.leftPaneWidth) < this.leftTrigger) {
          return (parseInt(this.$store.state.leftPaneWidth) - this.leftTrigger - 120) / 1.8 + '%'
        }
        return '-50%'
      },
      width () {
        // if (parseInt(this.$store.state.leftPaneWidth) < this.leftTrigger) {
        //   return this.leftTrigger + '%'
        // }
        // return this.$store.state.leftPaneWidth || '30%'
        return '200%' // this.$store.state.leftPaneWidth || '30%'
      },
      leftPaneStyle () {
        // const w = window.lconfig.leftPaneWidth || '30%'
        const c = 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)' // 'rgba(0, 0, 0, 0.3)'
        // const u = 'static/images/chou.jpg'
        return `background: ${c};` // width:${w};
      },
      top () {
        // if (this.$store.state.leodata.length > 1) { return false }
        if (window.lconfig.firstNodeAsTitle === false) {
          return false
        }
        return true
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
      showtree: function () {
        return this.type === 'tree'
      },
      showgraph: function () {
        return this.type === 'graph'
      },
      showcircle: function () {
        return this.type === 'circle'
      }
    },
    watch: {
      '$store.state.space': {
        handler: function (val, oldVal) {
          if (val) {
            console.log('Switching to space: ' + val.name)
            this.spaceNames = [val.name]

            var deep = this.$store.getters.getDeepLookForNode(val)
            if (deep && deep.look && deep.look.space) {
              this.spaceDescs = [deep.look.space]
            } else {
              this.spaceDescs = ['']
            }

            this.$store.dispatch('setCurrentItem', val)
            // console.log({view: this.viewname, id: this.$store.state.currentItem.id || 1})
            // this.zenable = false

            let vm = this
            if (vm.$zircle.getPreviousViewName() !== '') {
              this.check = false
              vm.$zircle.goBack()

              let intId = setInterval(() => {
                if (vm.$zircle.getPreviousViewName() !== '') {
                  vm.$zircle.goBack()
                } else {
                  clearInterval(intId)
                  this.check = true
                  // this.$store.dispatch('setCurrentItem', val)
                }
              }, 250)
            }
          }
        },
        deep: true,
        immediate: true
      },
      // '$store.state.leftPaneLeft': {
      //   handler: function (val, oldVal) {
      //     let zcanvas = document.getElementById('zcanvas')
      //     if (zcanvas !== undefined && zcanvas !== null) {
      //       // console.log(val)
      //       zcanvas.style.paddingLeft = val
      //       // zcanvas.style.width = '1000px'
      //     }
      //   },
      //   deep: true,
      //   immediate: true
      // },
      // '$store.state.connected': {
      //   handler: function (val, oldVal) {
      //     if (val) {
      //       // this.$zircle.setView('zview')
      //       this.$zircle.setView('zview')
      //     }
      //   },
      //   deep: true,
      //   immediate: true
      // },
      '$route' (to, from) {
        var fromid = from.path.split('/')[2]
        var toid = to.path.split('/')[2]

        if (this.$store.state.currentItem.id === toid) return

        // console.log(fromid, toid)
        if (fromid) {
          const parent = JSON.search(this.data, '//*[id="' + fromid + '"]/parent::*')
          if (parent && parent[0]) {
            const parentid = parent[0].id
            if (toid === parentid) {
              // console.log('back')
              this.$store.dispatch('setCurrentItem', {id: toid})
              this.$zircle.goBack()
            }
          }
        }
      },
      '$store.state.currentItem': {
        handler: function (val, oldVal) {
          if (val) {
            var model = JSON.search(this.$store.state.leodata, '//*[id="' + val.id + '"]')
            if (!model) return
            if (model.length) model = model[0]

            // if (model) {
            //   this.spaceNames = [model.vtitle]
            // }
            if (model && model.deep && model.deep.look && model.deep.look.space) {
              this.spaceDescs = [model.deep.look.space]
            }
            // var deep = this.$store.getters.getDeepLookForNode(val)
            // if (deep && deep.look) {
            //   if (deep.look.theme) {
            //     this.color = util.rgbaFromTheme(deep.look.theme, 0.3)
            //     // this.$zircle.config({style: {theme: theme.background.theme}})
            //   }
            //   if (deep.look.mode) {
            //     // this.$zircle.config({style: {mode: theme.background.mode}})
            //   }
            //   // this.$store.commit('CURRENT_DEEP', deep)
            //   this.nodeNames = [deep.look.space]
            // }
            // this.$store.state.currentItemPathMapIds.length
            // var name = 'item' + this.$store.state.currentItemPathMapIds.length
            // if (name !== this.$zircle.getCurrentViewName()) {
            //   console.log(name)
            //   this.$zircle.toView(name)
            // }

            // let current = this.$zircle.getCurrentViewName()
            // if (current && this.$store.state.zircle) {
            //   var id = this.$store.state.zircle[current]
            //   // console.log(current, ' ', val.id)
            //   if (id !== val.id) {
            //     // let model = JSON.search(this.$store.state.leodata, '//*[id="' + val.id + '"]')[0]
            //     // console.log(model)
            //     // this.$zircle.toView({
            //     //   to: 'item7', // string. Required,
            //     //   params: {depth: 7, model: model, key: model.id, textItems: this.$store.state.leotext, targetEl: true, top: false} // Optional
            //     // })
            //     // this.$zircle.setView('zstart')
            //   }
            // }
          }
        },
        deep: true,
        immediate: true
      }
    }
  }
</script>

<br/>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
.zircleviewer
  margin: 0
  height: 100%
  width: 100%

.z-canvas
  transition: background-color 0ms
  background-color: rgba(0, 0, 0, 0.0)
  
</style>

<style>
.textra .mainTextra {
  min-height: 200px;
}
</style>

<style>
.adjust {
  position: absolute;
  display: inline;
  transition: all 0.5s; 
}

.space {
  top: 0px;
  left: 60px;
  width: 100%;
  font-size: 75px;
}

.spacedesc {
  top: 90px;
  left: 120px;
  width: 100%;
  font-size: 25px;
}

.description {
  padding-top: 600px;
  left: 0%;
  width: 100%;
  font-size: 25px;
}

.current-label-background {
  transition: all 2s ease;
  background-color: rgba(0,0,0,0.3);
  background-size: cover;
  opacity: 1.0;
  width: 1000px;
  
}

.current-label-bottom {
  margin-top: 25%;
  height: 150px;
}

.current-label-bottom-hide {
  margin-top: 35%;
  height: 150px;
  //opacity: 0.2;
}

.current-label-bottom2 {
  margin-top: 0%;
  height: 100px;
}

.current-label-bottom2-hide {
  margin-top: 5%;
  height: 100px;
  //opacity: 0.2;
}

.current-label-hide {
  //opacity: 0.2;
}

.transition {
  transition: all 2s ease;
  -webkit-transition: all 2s ease;
}
</style>


<style>

.zcanvas {
    transition: all 1s ease;
}

.asteroids {
    pointer-events: none !important;
    opacity: 0.10;
}

.planetoide {
    pointer-events: none !important;
    background-color: rgba(255, 255, 255, 1.0);
    opacity: 0.3;
    border: none;
}

.planetoide2 {
    pointer-events: none !important;
    background-color: rgba(255, 255, 255, 1.0);
    opacity: 0.3;
    border: none;
}

.meteor {
    // background-color: rgba(20, 40, 100, 0.7);
    opacity: 1.0;
}

.comete {
    // background-color: rgba(255, 255, 255, 0.2);
    opacity: 0.01;
}
</style>