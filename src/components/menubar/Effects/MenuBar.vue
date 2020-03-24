<template>
    <div>
        <div class="bm-burger-button-back" style="z-index: 4; margin-top: -33px; margin-left: 0px;" :class="{ hidden: !crossIcon }"> 
            <!-- <span class="bm-burger-bars line-style" :style="{ top:20 * (index * 2) + '%'}" v-for="(x, index) in 3" :key="index"></span> -->
        </div>
       
        <div id="sideNav" class="bm-menu">
            <!-- <div class="bm-item-list"> 
              <slot></slot>
            </div>  -->
            <slot></slot>
        </div>
    </div>
</template>

//  <div class="bm-burger-button" @click="toggle" style="z-index: 5; margin-top: -17px; margin-left: -78px;"> <!-- :class="{ hidden: !burgerIcon }">
//             <!-- <span class="bm-burger-bars line-style" :style="{ top:20 * (index * 2) + '%'}" v-for="(x, index) in 3" :key="index"></span> -->
//             <img src="static/images/topfractal.png" alt="alt text" width="150">
//         </div>
//         <div class="bm-cross-button cross-style" @click="toggle" style="z-index: 6; left: 55px; top: 33px;" :class="{ hidden: !crossIcon }">
//           <!-- <span v-for="(x, index) in 2" :key="x" class="bm-cross" :style="{ position: 'absolute', width: '3px', height: '24px',transform: index === 1 ? 'rotate(45deg)' : 'rotate(-45deg)'}">
//           </span> -->
//           <img src="static/images/topfractal.png" alt="alt text" width="40">
//         </div> 

<script>
export default {
  name: 'menu-base',
  data () {
    return {
      isSideBarOpen: false,
      burgerIcon: true,
      crossIcon: false,
      noOverlay: true
    }
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false
    },
    right: {
      type: Boolean,
      required: false
    },
    width: {
      type: [String],
      required: false,
      default: '600'
    },
    disableEsc: {
      type: Boolean,
      required: false
    },
    onStateChange: {
      type: Function,
      required: false
    },
    useOverlay: {
      type: Boolean,
      required: false,
      default: true
    },
    useBurgerIcon: {
      type: Boolean,
      required: false,
      default: true
    },
    useCrossIcon: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    openMenu () {
      this.$emit('openMenu')
      this.isSideBarOpen = true
      this.noOverlay = !this.useOverlay
      this.burgerIcon = this.useBurgerIcon && false
      this.crossIcon = this.useCrossIcon && true

      if (!this.noOverlay) {
        document.body.className += 'bm-overlay'
      }
      if (this.right) {
        document.querySelector('.bm-menu').style.left = 'auto'
        document.querySelector('.bm-menu').style.right = '0px'
      }
      this.$nextTick(function () {
        let sideNav = document.getElementById('sideNav')
        sideNav.style.width = this.$store.state.leftPaneWidth
        // ? this.$store.state.leftPaneWidth
        // : '300px'
      })
    },

    closeMenu () {
      this.$emit('closeMenu')
      this.isSideBarOpen = false
      this.burgerIcon = this.useBurgerIcon && true
      this.crossIcon = this.useCrossIcon && false
      document.body.className = document.body.className.replace(
        'bm-overlay',
        ''
      )
      document.getElementById('sideNav').style.width = '0px'
    },

    toggle () {
      if (this.isSideBarOpen === true) {
        this.closeMenu()
      } else {
        this.openMenu()
      }
    },
    open (state) {
      if (state !== true) {
        this.closeMenu()
      } else {
        this.openMenu()
      }
    },
    closeMenuOnEsc (e) {
      e = e || window.event
      if (e.key === 'Escape' || e.keyCode === 27) {
        document.getElementById('sideNav').style.width = '0px'
        document.body.style.backgroundColor = 'inherit'
        this.isSideBarOpen = false
      }
    },
    documentClick (e) {
      let element = document.querySelector('.bm-burger-button')
      let target = e.target
      if (
        element !== target &&
        !element.contains(target) &&
        e.target.className !== 'bm-menu' &&
        this.isSideBarOpen
      ) {
        this.closeMenu()
      }
    }
  },
  mounted () {
    if (!this.disableEsc) {
      document.addEventListener('keyup', this.closeMenuOnEsc)
    }
  },
  created: function () {
    // document.addEventListener('click', this.documentClick)
  },
  destroyed: function () {
    document.removeEventListener('keyup', this.closeMenuOnEsc)
    // document.removeEventListener('click', this.documentClick)
  },
  watch: {
    isOpen: {
      deep: true,
      immediate: true,
      handler (newValue, oldValue) {
        if (!oldValue && newValue) {
          this.openMenu()
        }
        if (oldValue && !newValue) {
          this.closeMenu()
        }
      }
    },
    right: {
      deep: true,
      immediate: true,
      handler (oldValue, newValue) {
        if (oldValue) {
          this.$nextTick(() => {
            document.querySelector('.bm-burger-button').style.left = 'auto'
            document.querySelector('.bm-burger-button').style.right = '36px'
            document.querySelector('.bm-menu').style.left = 'auto'
            document.querySelector('.bm-menu').style.right = '0px'
          })
        }
        if (newValue) {
          if (
            document.querySelector('.bm-burger-button').hasAttribute('style')
          ) {
            document
              .querySelector('.bm-burger-button')
              .removeAttribute('style')
            document.getElementById('sideNav').style.right = 'auto'
          }
        }
      }
    },
    '$store.state.leftPaneWidth': {
      handler: function (val, oldVal) {
        let sideNav = document.getElementById('sideNav')
        if (sideNav !== undefined && sideNav !== null && this.isSideBarOpen) {
          sideNav.style.width = val
        }
      } // ,
      // deep: true,
      // immediate: true
    }
  }
}
</script>

<style scope>
    html {
      height: 100%;
    }
    .bm-burger-button {
      position: absolute;
      width: 36px;
      height: 30px;
      left: 36px;
      top: 36px;
      cursor: pointer;
      background-color: rgb(0, 0, 0, 0.0);
    }
    .bm-burger-button.hidden {
      display: none;
    }
    .bm-burger-button-back {
      position: absolute;
      width: 120px;
      height: 120px;
      left: 0px;
      top: 0px;
      /* background-color: rgb(0, 0, 0, 0.0); */
      background-image: radial-gradient( circle at top left, rgba(0,0,0,1.0) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.0) 75% );
    }
    .bm-burger-button-back.hidden {
      display: none;
    }
    .bm-burger-bars {
      background-color: rgb(0, 0, 0, 0.3);
    }
    .line-style {
      position: absolute;
      height: 20%;
      left: 0;
      right: 0;
    }
    .cross-style {
      position: absolute;
      top: 12px;
      right: 2px;
      cursor: pointer;
    }
    .bm-cross {
      background: #bdc3c7;
    }
    .bm-cross-button {
      height: 24px;
      width: 24px;
      transform: rotate(180deg)
    }
    .bm-cross-button.hidden {
      display: none;
    }
    .bm-menu {
      height: 100%; /* 100% Full-height */
      width: 0; /* 0 width - change this with JavaScript */
      position: fixed; /* Stay in place */
      z-index: 3; /* Stay on top */
      top: 0;
      left: 0;
      /* background-color: rgba(0, 0, 0, 0.6); */
      background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.0) 100%); /* Black*/
      overflow-x: hidden; /* Disable horizontal scroll */
      padding-top: 33px; /* Place content 60px from the top */
      transition: 0.2s; /*0.5 second transition effect to slide in the sidenav*/
    }

    .bm-overlay {
      background: rgba(63, 255, 64, 0.0);
    }
    .bm-item-list {
      color: #b8b7ad;
      /* margin-left: 10%; */
      /* font-size: 20px; */
    }
    /* .bm-item-list > * {
      display: flex;
      text-decoration: none;
      padding: 0.7em;
    }
    .bm-item-list > * > span {
      margin-left: 10px;
      font-weight: 700;
      color: white;
    } */
</style>

