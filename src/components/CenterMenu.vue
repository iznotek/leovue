<template>
  <div class="panes-separator"
         id="panes-separator">
      <ballmenu class="split-ball"/>
      <div class="split-left"
           
           @click="slide('left')">
        <!-- <icon name="bulletarrow" /> -->
        <img :src="require(`@/assets/icons/bullet-arrow.svg`)" :style="style" width="95"/>
      </div>
      <div class="split-right"
           
           @click="slide('right')">
        <!-- <icon name="bulletarrow" /> -->
        <img :src="require(`@/assets/icons/bullet-arrow.svg`)" :style="style" width="95"/>
      </div>
    </div>
</template>

<script>
export default {
  name: 'centermenu',
  components: {
  },
  data () {
    return {
      count: 2,
      icons: ['fa fa-github', 'fa fa-comment'],
      list: [{'isLink': false}, {'isLink': false}],
      backgroundColor: 'rgba(20, 40, 100, 0.7)', // #1724D5',
      color: '#ffffff',
      position: 'top-left',
      isOpenNewTab: false
    }
  },
  methods: {
    handleQuick (key) {
      if (key === 1) {
        this.$events.fire('show', {type: 'tree'})
      }
      if (key === 0) {
        this.$events.fire('show', {type: 'graph'})
      }
    },
    style: function () {
      return '-webkit-filter: opacity(0.5) drop-shadow(0 0 0 ' + this.color + '); filter: opacity(0.5) drop-shadow(0 0 0' + this.color + '); z-index=5000;'
      //       return '-webkit-mask: url(/assets/icons/bullet-arrow.svg) no-repeat 100% 100%;
      //   mask: url(star.svg) no-repeat 100% 100%;
      //   -webkit-mask-size: cover;
      //   mask-size: cover;
      //   background-color: yellow;
      // }
      //       return '.path { fill: ' + this.color + '}' // + '; color: ' + this.color + ';'
    }
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
 .panes-separator {
    width: 14px;
    z-index: 5000;
    background: transparent;
    position: relative;
    cursor: col-resize;
    background-image: url('../assets/vertical.png');
    background-repeat: no-repeat;
    background-position: 50% 46%;
    //border-left: 1px solid #ddd;
    //border-right: 1px solid #ddd;
  }
  .panes-separator,
  .left-pane,
  .right-pane {
    // margin: 0;
    // padding: 0;
  }
  .right-pane {
    overflow: hidden;
  }
  .split-left, .split-right {
    margin-left: 0px;
    text-align: center;
    color: #fff;
    cursor: pointer;
    width: 11px;
  }
  .split-left {
    position: absolute;
    margin-top: calc(40vh);
    transform: rotate(180deg);
    margin-left: 25px;
  }
  .split-right {
    position: absolute;
    margin-top: calc(40vh);
    margin-left: -22px;
  }
  .split-ball {
    position: absolute;
    margin-top: calc(42vh);
    margin-left: -18px; 
  }
</style>
