<template>
  <fab
    :position="position"
    :icon-size="iconSizes"
    :position-type="positionType"
    :bg-color="getColor"
    :main-icon="mainIcon"
    :main-tooltip="mainTooltip"
    :actions="getActions"
    :fixed-tooltip="fixedTooltip"
    :enable-rotation="enableRotation"
    :toggleWhenAway="false"
    :zIndex="70000"
    @handleClick="handleClick"
    @handleToggle="handleToggle"
    >
  </fab>
</template>

<script>
  import fab from './button/fab'
  const util = require('../util.js')

  export default {
    name: 'typemenu',
    components: {
      fab: fab
    },
    data () {
      return {
        positions: [
          'free-top',
          'free-bottom',
          'bottom-right',
          'bottom-left',
          'top-right',
          'top-left'
        ],
        positionTypes: [
          'fixed',
          'absolute'
        ],
        tooltipEvents: [
          'hover',
          'fixed'
        ],
        sizes: [
          'small',
          'medium',
          'large'
        ],
        actions: [
          {
            name: 'comments',
            icon: 'comment',
            // tooltip: 'Tree',
            color: 'rgba(20, 40, 100, 0.7)',
            active: false,
            group: 1
          },
          {
            name: 'meeting',
            icon: 'video',
            // tooltip: 'Graph',
            color: 'rgba(20, 40, 100, 0.7)',
            active: false,
            group: 1
          }
        ],
        color: 'rgba(20, 40, 100, 0.7)',
        position: 'free-down',
        positionType: 'fixed',
        tooltipEvent: 'hover',
        iconSizes: 'small',
        mainIcon: 'pen-nib',
        mainTooltip: '',
        enableRotation: true
      }
    },
    computed: {
      getColor () {
        return this.color
      },
      getActions () {
        return this.actions
      },
      fixedTooltip () {
        return this.tooltipEvent === 'fixed'
      }
    },
    methods: {
      handleClick: function (action) {
        this.$events.fire('middleMenuClick', action)
      },
      handleToggle: function (state) {
        var action = {active: state}
        this.$events.fire('middleMenuToggle', action)
      }
    },
    watch: {
      '$store.state.currentItem': {
        handler: function (val, oldVal) {
          if (val) {
            var deep = this.$store.getters.getDeepLookForNode(val)
            if (deep && deep.look && deep.look.theme) {
              var color = util.rgbaFromTheme(deep.look.theme, 0.9)
              this.color = color
              this.actions.forEach(function (a) {
                a.color = color
              })
            }
          }
        },
        deep: true,
        immediate: true
      }
    }
  }
</script>