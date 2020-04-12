<template>
  <modal 
    name="login"
    classes="login"
    transition="nice-modal-fade"
    :draggable="true"
    :resizable="true"
    :height="260"
    :width="260"
    @before-open="beforeOpen"
    @before-close="beforeClose"
  >
    <div 
      slot="top-right"
      class="ct-top-right"
      @click="$modal.hide('login')"
    >
      CONNECT
    </div>
    <img src="/static/images/back.jpg" />
  </modal>
</template>

<script>
export default {
  name: 'InputFocusModal',
  methods: {
    beforeOpen (event) {
    },
    beforeClose (event) {
      if (!this.$store.state.connected) {
        event.stop()
      }
    }
  }
}
</script>

<style lang="scss">
  .login {
    background-color: transparent;
    border-radius: 100%;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.65);
    img {
      width: 260px;
      height: 260px;
    }
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