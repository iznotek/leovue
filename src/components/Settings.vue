<template>
  <modal 
    name="settings"
    classes="settings"
    transition="nice-modal-fade"
    :draggable="true"
    :resizable="true"
    @before-open="beforeOpen"
    @before-close="beforeClose"
  >
    <div 
      slot="top-right"
      class="ct-top-right"
      @click="$modal.hide('settings')"
    >
      EXIT
    </div>
    <!-- <img src="/static/images/back.jpg" /> -->
  </modal>
</template>

<script>
export default {
  name: 'InputFocusModal',
  methods: {
    beforeOpen (event) {
    },
    beforeClose (event) {
      // event.stop()
      // if (!this.$store.state.connected) {
      // }
    }
  }
}
</script>

<style lang="scss">
  .settings {
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 2%;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.8);
    border: 0px solid rgba(255, 255, 255, 0.65);
  }
  .ct-top-right {
    cursor: pointer;
    padding-top: 20px;
    padding-right: 30px;
    font-weight: 600;
    color: white;
    text-shadow: 0 0px 20px black;
  }
  .scale-enter-active,
  .scale-leave-active {
    transition: all 0.5s;
  }
  .scale-enter,
  .scale-leave-active {
    opacity: 0;
    transform: scale(0.3) translateY(24px);
  }
</style>