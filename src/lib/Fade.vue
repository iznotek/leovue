<template>
  <div class="fadeComp" :class="compClasses" :style="compStyle">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'FadeComp',
    data () {
      return {
        out_alpha: false,
        in_alpha: false,
        out_height: false,
        in_height: false,
        out_left: false,
        in_left: false
      }
    },
    props: {
      mode: {
        type: String,
        default: 'alpha'
      },
      duration: {
        type: String,
        default: '3s'
      },
      out: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      compStyle: function () {
        // this.astyle.animationDuration = this.duration
        return {animationDuration: this.duration}
      },
      compClasses: function () {
        this.out_alpha = false
        this.in_alpha = false
        this.out_height = false
        this.in_height = false
        this.out_left = false
        this.in_left = false

        if (this.mode === 'alpha' && this.out) {
          this.out_alpha = true
        } else if (this.mode === 'alpha' && !this.out) {
          this.in_alpha = true
        } else if (this.mode === 'vertical' && this.out) {
          this.out_height = true
        } else if (this.mode === 'vertical' && !this.out) {
          this.in_height = true
        } else if (this.mode === 'horizontal' && this.out) {
          this.out_left = true
        } else if (this.mode === 'horizontal' && !this.out) {
          this.in_left = true
        }

        return {
          anim_in_alpha: this.in_alpha,
          anim_out_alpha: this.out_alpha,
          anim_in_height: this.in_height,
          anim_out_height: this.out_height,
          anim_in_left: this.in_left,
          anim_out_left: this.out_left
        }
      }
    }
  }
</script>
<style>
  .fadeComp {
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 0;
  }
  @keyframes fadeinAlpha {
    0% {
      opacity: 0;
      height: 100%;
    }
    100% {
      opacity: 1;
      height: 100%;
    }
  }
  @keyframes fadeoutAlpha {
    0% {
      opacity: 1;
      height: 100%;
    }
    100% {
      opacity: 0;
      height: 100%;
    }
  }
  @keyframes fadeinHeight {
    1% {
      opacity: 0;
      height: 0;
    }
    100% {
      opacity: 1;
      height: 100%;
    }
  }
  @keyframes fadeoutHeight {
    1% {
      opacity: 1;
      height: 100%;
    }
    100% {
      opacity: 0;
      height: 0;
    }
  }
  @keyframes fadeinLeft {
    1% {
      opacity: 0;
      left: -100px;
    }
    50% {
      opacity: 0.5;
      left: -60px;
    }
    100% {
      opacity: 1;
      left: 0;
    }
  }
  @keyframes fadeoutLeft {
    1% {
      opacity: 1;
      left: 0px;
    }
    50% {
      opacity: 0.5;
      left: -60px;
    }
    100% {
      opacity: 0;
      left: -1000px;
    }
  }
  .anim_in_alpha {
    animation: fadeinAlpha 1s 1 400ms;
    animation-fill-mode: forwards;
  }
  .anim_out_alpha {
    animation: fadeoutAlpha 1s 1 0ms;
    animation-fill-mode: forwards;
  }
  .anim_in_height {
    animation: fadeinHeight 1s 1 400ms;
    animation-fill-mode: forwards;
  }
  .anim_out_height {
    animation: fadeoutHeight 1s 1 0ms;
    animation-fill-mode: forwards;
  }
  .anim_in_left {
    animation: fadeinLeft 1s 1 1400ms;
    animation-fill-mode: forwards;
  }
  .anim_out_left {
    animation: fadeoutLeft 1s 1 0ms;
    animation-fill-mode: forwards;
  }
</style>