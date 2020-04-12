
<template>
  <div >
    <div class="zircleviewer">
      <div style="position: absolute; width: 100%; height: 100%;">
        <fade-transition v-show='showcircle'>
          <z-canvas id="zcanvas" class="zcanvas" :views='$options.views' :style="{width: width, left: left}" >
          </z-canvas>
        </fade-transition>
        <!-- <fade-transition v-show='!showcircle'>
          <treeview class="zcanvas" :style="{width: width, left: left}" >
          </treeview>
        </fade-transition> -->
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
  import {TweenLite, Power2} from 'gsap/TweenMax'
  import TreeView from './TreeView'
  import {FadeTransition} from 'vue2-transitions'

  let mov = {
    angle: -7
  }
  let target = {
    el: true,
    v: null
  }
  let zcanvas
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

      zcanvas = document.getElementById('zcanvas')
      zcanvas.style.backgroundColor = 'rgba(0, 0, 0, 0.0)'

      setTimeout(() => {
        setInterval(this.checkViewChanged, 100)
        this.$zircle.toView('zview')
      }, 1300)

      let vm = this
      this.$store.state.tween = TweenLite.to(mov, 2, {angle: 0,
        ease: Power2.easeInOut,
        repeat: -1,
        onUpdate: function () {
          vm.$store.commit('TWEEN_ANGLE', {a: mov.angle})
        }})
      this.$store.state.tween.play()
    },
    updated () {},
    data: function () {
      return {
        target: target,
        current: '',
        leftTrigger: 70,
        type: 'circle'
      }
    },
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
      checkViewChanged () {
        let vm = this
        let current = this.$zircle.getCurrentViewName() // this.$zircle.resolveComponent(this.$zircle.getComponentList(), this.$zircle.getCurrentViewName())
        if (current !== this.current) {
          this.current = current
          var id = this.$store.state.zircle[current]
          var run = false
          if (id > 0) {
            // console.log('zircleupdate: ', id)
            run = true
            // setTimeout(() => this.$store.dispatch('setCurrentItem', {id}), 2000)
            this.$store.dispatch('setCurrentItem', {id})
          } else {
            // console.log('zircleupdate: ', 'cover')
            if (window.lconfig.coverPage === false) {
              id = 1
              run = true
              this.$store.dispatch('setCurrentItem', {id})
              // setTimeout(() => this.$store.dispatch('setCurrentItem', {id}), 2000)
            }
            // else swipe content pane ?!
          }

          if (run === true) {
            setTimeout(() => {
              if (vm.$store.state.tween.reversed()) {
                vm.$store.state.tween.play()
              } else {
                vm.$store.state.tween.reverse()
              }
            }, 500)
          }
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
            var deep = this.$store.getters.getDeepLookForNode(val)
            if (deep && deep.look) {
              if (deep.look.theme) {
                // this.$zircle.config({style: {theme: theme.background.theme}})
              }
              if (deep.look.mode) {
                // this.$zircle.config({style: {mode: theme.background.mode}})
              }
              this.$store.commit('CURRENT_DEEP', deep)
            }
            // this.$store.state.currentItemPathMapIds.length
            // var name = 'item' + this.$store.state.currentItemPathMapIds.length
            // if (name !== this.$zircle.getCurrentViewName()) {
            //   console.log(name)
            //   this.$zircle.toView(name)
            // }

            let current = this.$zircle.getCurrentViewName()
            if (current && this.$store.state.zircle) {
              var id = this.$store.state.zircle[current]
              // console.log(current, ' ', val.id)
              if (id !== val.id) {
                // let model = JSON.search(this.$store.state.leodata, '//*[id="' + val.id + '"]')[0]
                // console.log(model)
                // this.$zircle.toView({
                //   to: 'item7', // string. Required,
                //   params: {depth: 7, model: model, key: model.id, textItems: this.$store.state.leotext, targetEl: true, top: false} // Optional
                // })
                // this.$zircle.setView('zstart')
              }
            }
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
</style>

<style lang="css">

.zcanvas {
    transition: all 1s ease-in-out;
}
.title {
    margin-left: 5%;
    position: absolute;
    width: 90%;
    color: #454545;
    font-weight: 700;
    font-size: 32px;
    z-index: 9999;
    opacity: 1;
    line-height: 1.02em;
    pointer-events: none !important;
}
.title.home {
    text-align: center;
}
</style>


<style>

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