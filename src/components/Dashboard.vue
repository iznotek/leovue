<template>
  <div  class="dashboard">
   <div id="dashboard" v-bind:style="dashboardStyle"> 
    <!--<modelviewer/>-->
    <typemenu v-if="connected"/>
    <chat v-if="connected"/>
    <background/>
    <appheader/>
    <menubar ref="menubar">
      <div slot="left">
        <d3view v-if="showgraph"/> 
        <treeview v-if="showtree"/>
      </div>
      <div slot="right" id="main" :class="{'header-space': config.showHeader}">
          <router-view :id="id"></router-view>
      </div>
    </menubar> 
   <!--  <div slot="right" id="main" :class="{'header-space': config.showHeader}">
      <router-view :id="id"></router-view>
    </div> -->

    <!-- <div class="login">
        <img v-if="!connected" class="loginimage" :src="require(`@/assets/logo.png`)" width="170" height="170"/> 
        <!-- <img v-if="connected" class="loginimagehide" :src="require(`@/assets/logo.png`)" width="150" height="150"/> 
    </div> -->
    <div class="login" v-if="!connected">
         <!-- <img class="loginimage" :src="require(`@/assets/logo.png`)" width="150" height="150"/> -->
<!-- 
         <div class="logintheme">
            <pbutton
              :visible.sync="configlogin.visible"
              :animating.sync="configlogin.animating"
              :options="configlogin">
             <vgl-wave :text="title" :style="{fontFamily: 'fantasy', color: 'white', fontSize: '35', textAlign: 'center'}"></vgl-wave>
            </pbutton>
          </div>   -->
        
         <div class="logininput">
         <form id="form_cdb" onsubmit="return false">
            <input type="password" 
                  id="IdPassword" 
                  autocomplete="any" 
                  readonly 
                  onfocus="this.removeAttribute('readonly');"
                  oncontextmenu="return false"
                  placeholder="..." 
                  v-on:keyup="onKeyUp"
                  v-model="password"> </form>
          </div>

       
      </div>
    </div>
  </div>
</template>

//  <component :is="kebab(transitionName)" :duration="duration" :delay="delay" appear v-if="!isGroup">
//           <div v-show="show">
//             <div class="box">
//               <p>{{transitionName}}</p>
//             </div>
//           </div>
//         </component>

<script>
import AppHeader from './Header'
import MenuBar from './menubar/Menu'
import Chat from './chat/Chat'
import CenterMenu from './CenterMenu'
import TypeMenu from './TypeMenu'
import Background from './Background'
import TreeView from './TreeView'
import D3View from './D3View'

// import ModelViewer from './modelviewer/Viewer'
import ParticleEffectButton from 'vue-particle-effect-buttons'
import {OrbitSpinner} from 'epic-spinners' // OrbitSpinner

export default {
  name: 'dashboard',
  components: {
    background: Background,
    appheader: AppHeader,
    typemenu: TypeMenu,
    centermenu: CenterMenu,
    chat: Chat,
    menubar: MenuBar,
    treeview: TreeView,
    d3view: D3View,
    pbutton: ParticleEffectButton,
    spinner: OrbitSpinner
    // ,
    // modelviewer: ModelViewer
  },
  data () {
    return {
      type: 'circle',
      password: '',
      configlogin: {
        // easing: 'easeOutQuart',
        // size: 6,
        animLogoLeft: null,
        animLogoRight: null,
        animLogoLogin: null,
        duration: 1000,
        color: '#fff',
        easing: 'easeOutQuad',
        speed: 1.0,
        size: 3,
        particlesAmountCoefficient: 4,
        // oscillationCoefficient: 10,
        // particlesAmountCoefficient: 4,
        // oscillationCoefficient: 2,
        // color: 'red',
        // color: function () {
        //   return '#ffffff' // 'rgba(0,0,0,0)' // Math.random() < 0.5 ? '#000000' : '#ffffff'
        // },
        onComplete: () => {
          console.log(this.configlogin.visible)
          this.configlogin.animating = false
          this.configlogin.showing = this.configlogin.visible
          this.configlogin.visible = !this.login()
          // this.animLogoHide.restart()

          if (this.configlogin.visible === true) {
            this.animLogoRight.reverse()
          }
        },
        onBegin: () => {
          // console.log(this.configlogin.visible)
          // if (this.configlogin.showing) {
          // } else {
          this.animLogoRight.play()
          // }
        },
        complete: () => {
          console.log('complete')
          this.configlogin.animating = false
        },
        showing: false,
        visible: false,
        animating: false
      }
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
        this.$refs.menubar.toggle(state.active)
        // this.type = 'tree'
      }
    }
  },
  mounted () {
    let loader = this.$loading.show({
      // Optional parameters
      container: this.$refs.dashboard,
      backgroundColor: '#001127',
      color: '#0AF',
      opacity: 1,
      canCancel: true,
      loader: 'dots',
      zIndex: 10000
      // onCancel: this.onCancel,
    }, {
      default: this.$createElement('spinner', {props: {size: 120, animationDuration: 1700, color: '#FFF'}})
      // before: this.$createElement('before'),
      // after: this.$createElement('after')
    })
    // simulate AJAX

    let vm = this
    setTimeout(() => {
      var id = setInterval(() => {
        loader.opacity -= 0.07
        if (loader.opacity <= 0.0) {
          clearInterval(id)
          loader.hide()
          setTimeout(() => {
            vm.configlogin.visible = true
          }, 2000)
        }
      }, 50)
    }, 5000)

    this.animLogoRight = this.$anime({
      targets: '.loginimage',
      easing: 'easeInOutQuad',
      translateX: -125,
      opacity: {value: [0, 1], duration: 1000},
      scale: {value: [1.3, 1.1], duration: 1000},
      duration: 1000,
      delay: 1025,
      // endDelay: 1000,
      autoplay: false
    })
    this.animLogoLogin = this.$anime({
      targets: '.loginimagehide',
      easing: 'easeInOutQuad',
      scale: 2,
      duration: 1000,
      delay: 0,
      autoplay: false
    })

    let map = {}
    window.addEventListener('keydown', function (e) {
      e = e || event // to deal with IE
      map[e.keyCode] = true
    })
    window.addEventListener('keyup', function (e) {
      e = e || event // to deal with IE
      var w
      if (e.keyCode === 37 && map[16]) {
        w = parseInt(vm.$store.state.leftPaneWidth) - 7
        vm.$store.state.leftPaneWidth = (w < 0 ? 0 : w) + '%'
      }
      if (e.keyCode === 39 && map[16]) {
        w = parseInt(vm.$store.state.leftPaneWidth) + 7
        vm.$store.state.leftPaneWidth = (w > 100 ? 100 : w) + '%'
      }
      map[e.keyCode] = false
    })
  },
  methods: {
    onKeyUp: function (e) {
      if (e.keyCode === 13) {
        this.login()
        // let vm = this
        // setTimeout(() => {
        //   vm.configlogin.visible = false
        // }, 100)
      } // else if (e.keyCode === 50) {
      // alert('@ was pressed');
      // }
    },
    login: function () {
      // console.log('login')
      if (this.password === 'surprise') {
        // 3,14159265
        this.$store.state.connected = true
        this.$store.state.user = {name: 'guest', pw: this.password}
        // this.animLogoLogin.play()

        let vm = this
        setTimeout(() => {
          vm.$store.state.leftPaneWidth = parseInt(window.lconfig.leftPaneWidth) + '%'
          vm.$store.state.rightPaneWidth = 100 - parseInt(window.lconfig.leftPaneWidth) + '%'
        }, 2000)
        return true
      }
      return false
    }
  },
  computed: {
    title () {
      return window.lconfig.docTitle
    },
    showtree: function () {
      return this.type === 'tree'
    },
    showgraph: function () {
      return this.type === 'graph'
    },
    connected: function () {
      return this.$store.state.connected
    },
    id: function () {
      if (!this.$route.params.id) {
        return +1
      } else {
        return this.$route.params.id
      }
    },
    config () {
      return window.lconfig
    },
    dashboardStyle () {
      let style = {}
      const p = window.lconfig.dashboardPadding || '-33px'
      const u = window.lconfig.dashboardImage || ''
      style = `padding: ${p}; background-color: #ffffff;` // background-image: url("${u}");`
      // <div class="img-banner" :style="{'background-image': 'url(' + require('./assets/media/baner1.jpg') + ')'}"></div>
      return style
      if (window.lconfig.coverPage) {
        style = { display: 'none' }
      } else {
        // const p = '0'
        // const u = 'static/images/bubble.png'
        style = `padding:${p}; background-color: #ffffff; background-image: url(${u});`
      }
      return style
    }
  },
  watch: {
    '$route' (to, from) {
    // console.log(to, from)
    }
  }
}
</script>

<style>
.fab-main {
  left: -70px;
  position: absolute;
}
.fab-wrapper .actions-container {
  left: -70px;
  position: absolute;
}

.logintheme {
  background: transparent;
  margin-top: 25px;
  margin-left: -130px;
  /* --color-action: #e85577; */
}
.logintheme .vue-particle-effect-button .particles-button {
  // background: transparent;
  background: -webkit-radial-gradient(center, ellipse cover, rgba(255,255,255,0) 0%,rgba(255,255,255,0.5) 100%); /* Chrome10-25,Safari5.1-6 */
  background-color: rgba(200,235,255,0.4);
  // color: #e85577;
  border-radius: 50%;
  border: 1px solid #fff;
  //  padding: 1.5rem 3rem;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
} 

#main {
  height: calc(100vh - 33px);
  width: 100%;
  top: 33px;
  position: fixed;
  z-index: 2;
}
a {
  color: #42b983;
}
.dashboard{
  height: 100%;
}

.login {
    // margin-top: 490px;
    // margin-left: 50%;
    //padding-left: -30px;
    position: fixed;
    top: 10%;
    left: 50%;
    z-index: 1100;
}

.loginbutton {
    //transform: rotate(-90deg);
    z-index: 1100;
    width: 200px;
    height: 70px;
    // margin-left: 5px;
    margin-top: 0px;
}

.loginimage {
    z-index: 1100;
    margin-top: 0px;
    margin-left: -80px;
}

.loginimagehide {
  z-index: 1100;
    margin-top: 7px;
    margin-left: -65px;
}

.logininput {
    z-index: 111100;
    // margin-top: 7px;
    margin-left: -100px;
    margin-top: 20px;
}

input[type="password"] {
    z-index: 1111;
    background: rgba(255, 255, 255, 0.0);
    border-radius: 50%;
    border: none;
    text-align: center;
    font-size: 20px;
    outline: none;
    color: #bbb;
}

input[type="password"]:focus {
    background: rgba(255, 255, 255, 0.0);
}

</style>
