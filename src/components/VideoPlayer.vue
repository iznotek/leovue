<template>
  <div class="player">
    <video-player class="video-player-box player"
                  ref="videoPlayer"
                  :options="playerOptions"
                  :playsinline="true"

                  @play="onPlayerPlay($event)"
                  @pause="onPlayerPause($event)"
                  @ended="onPlayerEnded($event)"
                  @waiting="onPlayerWaiting($event)"
                  @playing="onPlayerPlaying($event)"
                  @loadeddata="onPlayerLoadeddata($event)"
                  @timeupdate="onPlayerTimeupdate($event)"
                  @canplay="onPlayerCanplay($event)"
                  @canplaythrough="onPlayerCanplaythrough($event)"

                  @statechanged="playerStateChanged($event)"
                  @ready="playerReadied">
    </video-player>
  </div>
</template>

<script>
  // Similarly, you can also introduce the plugin resource pack you want to use within the component
  // import 'some-videojs-plugin'

  // import 'video.js/dist/video-js.css'
  // import { videoPlayer } from 'vue-video-player'
  // import 'videojs-youtube'
  // require('videojs-youtube/dist/Youtube.min.js')

  export default {
    // components: {
    //   videoPlayer
    // },
    props: {
      src: String
    },
    data () {
      return {
        playerOptions: {
          // videojs options
          muted: true,
          controls: false,
          language: 'en',
          autoplay: true,
          loop: true,
          fluid: true,
          // aspectRatio: '16:6', // window.innerWidth + ':' + window.innerHeight,
          // width: window.document.width,
          // height: window.document.height,
          // playbackRates: [0.7, 1.0, 1.5, 2.0],
          techOrder: ['Youtube'],
          sources: [{
            type: 'video/youtube',
            src: 'http://vjs.zencdn.net/v/oceans.mp4'
          }] // ,
          // poster: '/static/images/bubble.png'
        }
      }
    },
    mounted () {
      // this.playerOptions.sources[0].src = this.src
      // console.log('this is current player instance object', this.player)
    },
    watch: {
      'src': {
        handler: function (val, oldVal) {
          var source = {
            type: 'video/youtube',
            src: val
          }
          this.playerOptions.sources = [source]
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      player () {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      // listen event
      onPlayerPlay (player) {
        // console.log('player play!', player)
      },
      onPlayerPause (player) {
        // console.log('player pause!', player)
      },
      onPlayerEnded (player) {
        // console.log('player ended!', player)
      },
      onPlayerLoadeddata (player) {
        // console.log('player Loadeddata!', player)
      },
      onPlayerWaiting (player) {
        // console.log('player Waiting!', player)
      },
      onPlayerPlaying (player) {
        // console.log('player Playing!', player)
      },
      onPlayerTimeupdate (player) {
        // console.log('player Timeupdate!', player.currentTime())
      },
      onPlayerCanplay (player) {
        // console.log('player Canplay!', player)
      },
      onPlayerCanplaythrough (player) {
        // console.log('player Canplaythrough!', player)
      },
      // or listen state event
      playerStateChanged (playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },
      // player is ready
      playerReadied (player) {
        // seek to 10s
        // console.log('example player 1 readied', player)
        // player.currentTime(10)
        // console.log('example 01: the player is readied', player)
      }
    }
  }
</script>

<style scoped>
.player{
  background: rgba(0,0,0,0.0);
 // height: 100vh;
}
</style>