<template>
  <div class="d3view">
    <d3tree
      style="height:100vh"
      :reset="reset"
      :openDepth="openDepth"
      ref="tree"
      :zoomable="zoomable"
      :data="data"
      :node-text="nodeText"
      :margin-x="Marginx" :margin-y="Marginy"
      :type="type"
      :layout-type="layoutType"
      :duration="duration"
      @clicked="onClick"
      class="tree">
    </d3tree>
  </div>
</template>

<script>
  import D3tree from '../lib/D3tree'

  let target = {el: null}
  export default {
    name: 'd3view',
    props: {
    },
    components: {
      D3tree
    },
    data: function () {
      return {
        target: target,
        open: false,
        active: false,
        lhandle: true,
        duration: 250,
        nodeText: 'name',
        currentNode: null,
        zoomable: true,
        isLoading: false,
        events: [],
        reset: 0
      }
    },
    methods: {
      onClick (evt) {
        this.currentNode = evt.element
        this.onEvent('onClick', evt)
      },
      onEvent (eventName, data) {
        this.events.push({eventName, data: data.data})
        const id = data.data.id
        this.$store.dispatch('setCurrentItem', {id})
      }
    },
    watch: {
      '$route': {
        handler: function (val, oldVal, changed) {
        //  this.id = val.params.id
        },
        immediate: true
      }
    },
    computed: {
      data () {
        let d = this.$store.state.leodata
        if (d.length > 1) {
          const root = {
            name: 'test',
            id: 0,
            children: d
          }
          return root
        } else {
          return d[0]
        }
      },
      text () {
        return this.$store.state.leotext
      },
      openDepth () {
        return 2
        // if (this.$store.state.viewType === 'd') {
        //  return 2
        // }
        // return -1
      },
      type () {
        this.reset = this.reset + 1
        return 'tree'
        // if (this.$store.state.viewType === 'z') { return 'cluster' }
        // return 'tree'
      },
      layoutType () {
        return 'euclidean'
        // if (this.$store.state.viewType === 'r') { return 'circular' }
        // return 'euclidean'
      },
      Marginx () {
        return 80
        // if (this.$store.state.viewType === 'r') { return -300 }
        // return 80
      },
      Marginy () {
        return 30
        // if (this.$store.state.viewType === 'r') { return -200 }
        // return 30
      }
    },
    mounted: function () {
    },
    updated () {
      // console.log('updated')
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .d3view {
    height: 100%;
    width: 100%;
    color: #dddddd
  }
</style>
