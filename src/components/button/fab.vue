<template>
    <div :id="position + '-wrapper'" class="fab-wrapper" v-on-clickaway="away" @mouseenter="enter" @mouseleave="leave"
         style="transition: left 1s ease, right 1s ease;" :style="wrapperPosition">
        <div :id="position + '-action'" class="actions-container" :style="listPos">
            <transition name="fab-actions-appear"
                        :enter-active-class="transitionEnter"
                        :leave-active-class="transitionLeave"
            >
                <ul v-show="toggle" class="fab-list">
                    <template v-for="action in actions">
                        <transition
                                enter-active-class="animated quick zoomIn"
                                leave-active-class="animated quick zoomOut"
                                v-on:after-enter="afterActionsTransitionEnter"
                        >
                            <template v-if="action.tooltip">
                                <li v-if="toggle" :style="{ 'background-color': bgColor }"
                                    v-tooltip="{ content: action.tooltip, placement: tooltipPosition, classes: 'fab-tooltip', trigger: tooltipTrigger}"
                                    @click="clickAction(action.name)" class="fab-child pointer" ref="actions">
      
                                    <icon :class="[ actionIconSize , { select: action.active }, 'material-icons main']"  :name="action.icon"></icon>
                                    <icon :class="[ actionIconSize , { select: action.active }, 'material-icons close']" :name="action.icon"></icon>
                                </li>
                            </template>
                            <template v-else>
                                <li v-ripple="rippleColor == 'light' ? 'rgba(255, 255, 255, 0.35)' : ''"
                                    v-if="toggle" :style="{ 'background-color': bgColor }"
                                    @click="clickAction(action.name)" class="fab-child pointer">
 
                                    <icon :class="[ actionIconSize , { select: action.active }, 'material-icons main']"  :name="action.icon"></icon>
                                    <icon :class="[ actionIconSize , { select: action.active }, 'material-icons close']" :name="action.icon"></icon> 
                                </li>
                            </template>
                        </transition>
                    </template>
                </ul>
            </transition>
        </div>
        <template v-if="rippleShow">
            <template v-if="mainTooltip">
                <div v-ripple="rippleColor == 'light' ? 'rgba(255, 255, 255, 0.35)' : ''" @click="toggle = !toggle"
                     v-tooltip="{ content: mainTooltip, placement: tooltipPosition, classes: 'fab-tooltip' }"
                     class="fab-main pointer" :style="{ 'background-color': bgColor, 'padding': paddingAmount }"
                >
                    <!-- <i :class="[ mainIconSize , { rotate: toggle && allowRotation } ,'material-icons main']">{{mainIcon}}</i>
                    <i :class="[ mainIconSize , { rotate: toggle && allowRotation } ,'material-icons close']">add</i> -->
                    <icon :class="[ mainIconSize , { rotate: toggle && allowRotation } ,'material-icons main']" :name="mainIcon"></icon>
                    <icon :class="[ mainIconSize , { rotate: toggle && allowRotation } ,'material-icons close']" :name="mainIcon"></icon>
                </div>
            </template>
            <template v-else>
                <div v-ripple="rippleColor == 'light' ? 'rgba(255, 255, 255, 0.35)' : ''" @click="toggle = !toggle"
                     class="fab-main pointer" :style="{ 'background-color': bgColor, 'padding': paddingAmount }"
                >
                    <!-- <i :class="[ mainIconSize , { rotate: toggle && allowRotation }, 'material-icons main']">{{mainIcon}}</i>
                    <i :class="[ mainIconSize , { rotate: toggle && allowRotation }, 'material-icons close']">add</i> -->
                    <icon :class="[ mainIconSize , { rotate: toggle && allowRotation }, 'material-icons main']" :name="mainIcon"></icon>
                    <icon :class="[ mainIconSize , { rotate: toggle && allowRotation }, 'material-icons close']" :name="mainIcon"></icon>
                </div>
            </template>
        </template>
        <template v-else>
            <template v-if="mainTooltip">
                <div @click="toggle = !toggle" 
                     v-bind:v-tooltip="{ content: mainTooltip, placement: tooltipPosition, classes: 'fab-tooltip'}"
                     class="fab-main pointer" :style="{ 'background-color': bgColor, 'padding': paddingAmount }"
                >
                    <!-- <i class="material-icons md-36 main" :class="{ rotate: toggle && allowRotation }">{{mainIcon}}</i>
                    <i class="material-icons md-36 close" :class="{ rotate: toggle && allowRotation }">add</i> -->
                    <icon class="material-icons md-24 main" :class="{ rotate: toggle && allowRotation }" :name="mainIcon"></icon>
                    <icon class="material-icons md-24 close" :class="{ rotate: toggle && allowRotation }" :name="mainIcon"></icon>
                </div>
            </template>
            <template v-else>
                <div @click="toggle = !toggle" 
                    class="fab-main pointer" :style="{ 'background-color': bgColor, 'padding': paddingAmount }"
                >
                    <!-- <i class="material-icons md-36 main" :class="{ rotate: toggle && allowRotation }">{{mainIcon}}</i>
                    <i class="material-icons md-36 close" :class="{ rotate: toggle && allowRotation }">add</i> -->
                    <icon class="material-icons md-24 main" :class="{ rotate: toggle && allowRotation }" :name="mainIcon"></icon>
                    <icon class="material-icons md-24 close" :class="{ rotate: toggle && allowRotation }" :name="mainIcon"></icon>
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import Ripple from 'vue-ripple-directive'
import { VTooltip } from 'v-tooltip'
export default {
  mixins: [clickaway],
  directives: { Ripple, tooltip: VTooltip },
  data () {
    return {
      toggle: this.startOpened,
      pos: {},
      tooltipPosition: 'left'
    }
  },
  props: {
    bgColor: {
      default: '#333333'
    },
    position: {
      default: 'bottom-right'
    },
    positionType: {
      default: 'fixed'
    },
    zIndex: {
      default: '999'
    },
    decalWidth: {
      default: 20
    },
    decalHeight: {
      default: 20
    },
    rippleShow: {
      default: true
    },
    rippleColor: {
      default: 'light'
    },
    mainIcon: {
      default: 'add'
    },
    iconSize: {
      default: 'medium'
    },
    mainTooltip: {
      default: null
    },
    fixedTooltip: {
      default: true
    },
    tooltipTimeOutWhenStartOpened: {
      default: 200
    },
    enableRotation: {
      default: true
    },
    actions: {
      default: () => []
    },
    startOpened: {
      default: false
    },
    swipeFromSide: {
      default: false
    },
    toggleWhenAway: {
      default: true
    },
    toggleOnClick: {
      default: false
    }
  },
  computed: {
    wrapperPosition () {
      return [ this.pos, {zIndex: this.zIndex}, {position: this.positionType} ]
    },
    actionIconSize () {
      switch (this.iconSize) {
        case 'small':
          return 'md-18'
          break
        case 'medium':
          return 'md-24'
          break
        case 'large':
          return 'md-36'
          break
        default:
          return 'md-24'
      }
    },
    allowRotation () {
      return this.enableRotation // && this.actions && this.actions.length
    },
    mainIconSize () {
      switch (this.iconSize) {
        case 'mini':
          return 'md-18'
          break
        case 'small':
          return 'md-24'
          break
        case 'medium':
          return 'md-36'
          break
        case 'large':
          return 'md-48'
          break
        default:
          return 'md-36'
      }
    },
    paddingAmount () {
      switch (this.iconSize) {
        case 'small':
          return '24px'
          break
        case 'medium':
          return '32px'
          break
        case 'large':
          return '38px'
          break
        default:
          return '32px'
      }
    },
    listPos () {
      if (this.position === 'top-right' || this.position === 'top-left' || this.position === 'free-down') {
        return {
          top: '-20px',
          paddingTop: '20px'
        }
      }
      return {
        bottom: '-20px',
        paddingBottom: '20px'
      }
    },
    transitionEnter () {
      const animation = this.animation
      return animation.enter
    },
    transitionLeave () {
      const animation = this.animation
      return animation.leave
    },
    animation () {
      if (this.position === 'top-right' || this.position === 'top-left' || this.position === 'free-down') {
        return {
          enter: 'animated quick fadeInDown',
          leave: 'animated quick fadeOutUp'
        }
      } else if (this.position === 'bottom-right' || this.position === 'bottom-left' || this.position === 'free-up') {
        return {
          enter: 'animated quick fadeInUp',
          leave: 'animated quick fadeOutDown'
        }
      }
      return {
        enter: 'animated fadeInUp',
        leave: 'animated fadeOutDown'
      }
    },
    tooltipTrigger () {
      if (this.fixedTooltip) {
        return 'manual'
      }
      return 'hover'
    }
  },
  methods: {
    tooltipPos () {
      if (this.position === 'top-right' || this.position === 'bottom-right') {
        this.tooltipPosition = 'left'
      } else {
        this.tooltipPosition = 'right'
      }
    },
    clickAction (name) {
      var action = this.actions.find(action => action.name === name)
      var state = action.active || false
      var group = action.group || 0
      for (var i = 0; i < this.actions.length; i++) {
        if (this.actions[i].group === group || group === 0) {
          if (this.actions[i].name === name) {
            this.actions[i].active = !state
          } else if (state === false) {
            this.actions[i].active = state
          }
          if (this.actions[i].active) {
            action = this.actions[i]
          }
        }
      }
      this.$emit('handleClick', action)

      // var action = this.actions.find(action => action.name === name)
      // action.active = !action.active
      if (this.toggleOnClick) {
        this.toggle = false
      }
    },
    away () {
      if (this.swipeFromSide) {
        this.toggle = false
      }
    },
    enter () {
      if (this.swipeFromSide) {
        const wrapper = document.getElementById(`${this.position}-wrapper`)
        var dw = this.decalWidth + 'px'
        switch (this.position) {
          case 'bottom-right':
          case 'top-right':
            this.pos.right = dw
            wrapper.style.right = this.pos.right
            break
          case 'bottom-left':
          case 'top-left':
            this.pos.left = dw
            wrapper.style.left = this.pos.left
            break
        }
        this.$events.fire('fabSwipeFromSlideEnter')
        // console.log('away', this.pos)
      }
    },
    leave () {
      if (this.swipeFromSide) {
        const wrapper = document.getElementById(`${this.position}-wrapper`)
        var dw = this.decalWidth - 100 + 'px'
        switch (this.position) {
          case 'bottom-right':
          case 'top-right':
            this.pos.right = dw
            wrapper.style.right = this.pos.right
            break
          case 'bottom-left':
          case 'top-left':
            this.pos.left = dw
            wrapper.style.left = this.pos.left
            break
        }
        this.$events.fire('fabSwipeFromSlideLeave')
        // console.log('back', this.pos)
      }
    },
    setPosition () {
      this.pos = {}
      var dw = this.decalWidth + 'px'
      var dh = this.decalHeight + 'px'
      var apos = this.swipeFromSide ? this.decalWidth - 100 + 'px' : dw
      switch (this.position) {
        case 'bottom-right':
          this.pos.right = apos
          this.pos.bottom = dh
          this.pos.paddingLeft = '150px'
          break
        case 'bottom-left':
          this.pos.left = apos
          this.pos.bottom = dh
          this.pos.paddingRight = '150px'
          break
        case 'top-left':
          this.pos.left = apos
          this.pos.top = dh
          this.pos.paddingRight = '150px'
          break
        case 'top-right':
          this.pos.right = apos
          this.pos.top = dh
          this.pos.paddingLeft = '150px'
          break
        case 'free-down':
        case 'free-up':
          this.pos.top = '50px'
          break
        default:
          this.pos.right = '100px'
          this.pos.bottom = '40px'
      }
    },
    moveTransition () {
      const wrapper = document.getElementById(`${this.position}-wrapper`)
      const el = document.getElementById(`${this.position}-action`)
      if (this.position === 'top-right' || this.position === 'top-left' || this.position === 'free-down') {
        wrapper.appendChild(el)
      } else {
        wrapper.insertBefore(el, wrapper.childNodes[0])
      }
    },
    showTooltip (timeOut = 0) {
      if (this.toggle && this.actions.length && this.fixedTooltip) {
        setTimeout(() => {
          this.$refs.actions.forEach((item) => {
            if (this.toggle) {
              item._tooltip.show()
            }
          })
        }, timeOut)
      }
    },
    afterActionsTransitionEnter () {
      this.showTooltip()
    }
  },
  watch: {
    startOpened (val) {
      this.toggle = val
    },
    position (val) {
      this.setPosition()
      this.$nextTick(() => {
        this.moveTransition()
        this.tooltipPos()
      })
    },
    toggle (val) {
      this.$emit('handleToggle', val)
    }
  },
  mounted () {
    this.moveTransition()
  },
  created () {
    this.setPosition()
    if (this.startOpened) {
      this.showTooltip(this.tooltipTimeOutWhenStartOpened)
    }
  }
}
</script>

<style>
    .fab-tooltip.tooltip {
        display: block !important;
        padding: 4px;
        z-index: 10000;
    }
    .fab-tooltip.tooltip .tooltip-inner {
        background: #333333;
        color: white;
        border-radius: 0px;
        padding: 5px 10px 4px;
    }
    .fab-tooltip.tooltip tooltip-arrow {
        display: none;
    }
    .fab-tooltip.tooltip[aria-hidden='true'] {
        visibility: hidden;
        opacity: 0;
        transition: opacity .15s, visibility .15s;
    }
    .fab-tooltip.tooltip[aria-hidden='false'] {
        visibility: visible;
        opacity: 1;
        transition: opacity .15s;
    }
</style>

<style scoped>
    .animated.quick {
        -webkit-animation-duration: 0.7s !important;
        animation-duration: 0.7s !important;
    }
    .fab-wrapper {
        z-index: 99999;
    }
    .fab-main {
        border-radius: 100px;
        /*width: 65px;*/
        /*height: 65px;*/
        padding: 30px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.20), 0 4px 4px rgba(0, 0, 0, 0.15);
        z-index: 200000; 
        justify-content: center;
        -webkit-transition: 3s all ease;
        -moz-transition: 3s all ease;
        transition: 3s all ease;
    }
    .fab-main .material-icons {
        color: white;
        -webkit-transition: 0.4s all ease;
        -moz-transition: 0.4s all ease;
        transition: 0.4s all ease;
        margin: 0px auto;
    }
    .fab-main .material-icons.main {
        opacity: 1;
        position: absolute;
    }
    .fab-main .material-icons.close {
        opacity: 0;
        position: absolute;
    }
    .fab-main .material-icons.main.rotate {
        -ms-transform: rotate(315deg); /* IE 9 */
        -webkit-transform: rotate(315deg); /* Chrome, Safari, Opera */
        transform: rotate(315deg);
        opacity: 0;
        -webkit-transition: opacity .3s ease-in, -webkit-transform .4s; /* Safari */
        transition: opacity .3s ease-in, transform .4s;
    }
    .fab-main .material-icons.close.rotate {
        -ms-transform: rotate(315deg); /* IE 9 */
        -webkit-transform: rotate(315deg); /* Chrome, Safari, Opera */
        transform: rotate(315deg);
        opacity: 1;
        -webkit-transition: opacity .3s ease-in, -webkit-transform .4s; /* Safari */
        transition: opacity .3s ease-in, transform .4s;
    }
    .fab-child {
        border-radius: 100px;
        /*width: 65px;
        /*height: 65px;*/
        padding: 30px;
        /* position: relative;
        overflow: hidden;
        display: flex;*/
        align-items: center;
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.20), 0 4px 4px rgba(0, 0, 0, 0.15);
        /*z-index: 2; */
        justify-content: center;
        -webkit-transition: 3s all ease;
        -moz-transition: 3s all ease;
        transition: 3s all ease;
    }
    .fab-child .material-icons {
        color: #cccccc;
        /* -webkit-transition: .4s all;
        -moz-transition: .4s all;
        transition: .4s all;
        /* margin: 0px auto; */
    }
    .fab-child .material-icons.main {
        opacity: 1;
        position: absolute;
    }
    .fab-child .material-icons.close {
        opacity: 0;
        position: absolute;
    }
    .fab-child .material-icons.main.select {
        opacity: 0;
        color: white;
        -webkit-transition: opacity .3s ease-in, -webkit-transform .4s; /* Safari */
        transition: opacity .3s ease-in, color .3s ease-in, transform .4s;
    }
    .fab-child .material-icons.close.select {
        opacity: 1;
        color: white;
        -webkit-transition: opacity .3s ease-in, -webkit-transform .4s; /* Safari */
        transition: opacity .3s ease-in, color .3s ease-in, transform .4s;
    }
    .fab-list {
        position: relative;
        /*z-index: 1; */
        margin: 2vh 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .fab-list li {
        width: 50px;
        height: 50px;
        padding: 10px;
        margin-top: 2vh;
        display: flex;
        align-items: center;
        border-radius: 100px;
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.20), 0 4px 4px rgba(0, 0, 0, 0.15);
    }
    .fab-list li .material-icons {
        // color: white;
        margin: 0px auto;
    }
    .pointer {
        cursor: pointer;
    }
    ul {
        list-style-type: none;
        padding: 0 !important;
    }
    .fab-wrapper .actions-container {
        overflow: hidden;
        /*z-index: 0;*/
        position: relative;
    }
    /* Rules for sizing the icon. */
    .material-icons {
        text-align: center;
        margin-top: 50vh; /* poussé de la moitié de hauteur de viewport */
        transform: translateY(10%);
    }
    .material-icons.md-18 {
        font-size: 12px;
        width: 18px;
        height: 18px; 
    }
    .material-icons.md-24 {
        font-size: 20px;
        width: 24px;
        height: 24px; 
    }
    .material-icons.md-36 {
        font-size: 36px;
        /* width: 48px;
        height: 48px; */
    }
    .material-icons.md-48 {
        font-size: 48px;
        /* width: 64px;
        height: 64px; */
    }
    /* Rules for using icons as black on a light background. */
    .material-icons.md-dark {
        color: rgba(0, 0, 0, 0.54);
    }
    .material-icons.md-dark.md-inactive {
        color: rgba(0, 0, 0, 0.26);
    }
    /* Rules for using icons as white on a dark background. */
    .material-icons.md-light {
        color: rgba(255, 255, 255, 1);
    }
    .material-icons.md-light.md-inactive {
        color: rgba(255, 255, 255, 0.3);
    }
    @media screen and (max-width: 768px) {
        .fab-list {
            margin: 2vh 0;
        }
        .fab-list li {
            /*width: 40px;*/
            /*height: 40px;*/
            /*padding: .6rem;*/
        }
        .fab-list li i {
            /*font-size: 24px !important;*/
        }
        .fab-main {
            /*width: 55px;*/
            /*height: 55px;*/
            /*padding: 1.5rem;*/
        }
        .fab-main i {
            /*font-size: 34px !important;*/
        }
    }
</style>