<template>
  <div>
    <fade-transition :duration="1000" :delay="500" v-show="show">
      <div id="logo-around" class="logo-around">
          <orbit-spinner class="logo-spinner"
            style="position: absolute; left: -5px; top: -5px"
            :animation-duration="3000"
            :size="80"
            color="#fff" />
          <div class="logo-logo">
            <img src="/static/images/logo.png" width="85"/>
          </div>
          <div class="logo-arrowleft">
            <img :src="require(`@/assets/icons/bullet-arrow.svg`)" width="150"/>
          </div>
          <div class="logo-arrowright">
            <img :src="require(`@/assets/icons/bullet-arrow.svg`)" width="150"/>
          </div>
      </div> 
    </fade-transition> 
  </div> 
</template>

<style scoped>
  .logo-around {
    transition: all 2s ease;
    position: absolute;
    margin-top: -45px; 
    margin-left: -45px; 
  }
  .logo-back {
    position: absolute;
    width: 500px;
    height: 500px;
    margin-top: -220px; 
    margin-left: -250px; 
    background: radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 50%);
    display: none;
  }
  .logo-logo {
    position: absolute;
    margin-top: 35px; 
    margin-left: 8px; 
  }
  .logo-spinner {
    position: absolute;
    margin-top: 37px; 
    margin-left: 13px; 
  }
  .logo-arrowleft {
    position: absolute;
    transform: rotate(180deg);
    margin-top: 0px; 
    margin-left: -52px;
    opacity: 0.5;
  }
  .logo-arrowright {
    position: absolute;
    margin-top: 0px; 
    margin-left: 0px;
    opacity: 0.5;
  }
</style>

<script>
import { OrbitSpinner } from 'epic-spinners'

export default {
  name: 'app',
  components: {
    OrbitSpinner
  },
  data () {
    return {
      show: false
    }
  },
  mounted () {
    this.show = true
  },
  methods: {
    hide () {
      this.show = false
      // document.getElementById('logo-around').style.opacity = 0
    }
  }
}
</script>