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
    :zIndex="2000"
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
            name: 'tree',
            icon: 'project-diagram',
            // tooltip: 'Tree',
            color: 'rgba(20, 40, 100, 0.7)',
            active: true,
            group: 1
          },
          {
            name: 'graph',
            icon: 'code-branch',
            // tooltip: 'Graph',
            color: 'rgba(20, 40, 100, 0.7)',
            active: false,
            group: 1
          }
        ],
        color: 'rgba(20, 40, 100, 0.7)',
        position: 'bottom-left',
        positionType: 'absolute',
        tooltipEvent: 'hover',
        iconSizes: 'medium',
        mainIcon: 'eye',
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
        this.$events.fire('show', action)
      },
      handleToggle: function (state) {
        var action = {active: state}
        this.$events.fire('show', action)
      }
    },
    watch: {
      '$store.state.currentItem': {
        handler: function (val, oldVal) {
          if (val) {
            var theme = this.$store.state.themes[val.id]
            if (theme && theme.background && theme.background.theme) {
              var color = util.rgbaFromTheme(theme.background.theme, 0.7)
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