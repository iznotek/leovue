<template>
  <div class="player">
    <div id="vimeplayer"/>
  </div>
</template>

<script>
  import { Player, Boot, FileProvider, YouTubeProvider, VimeoProvider, DailymotionProvider } from '@vime-js/complete';

  export default {
    props: {
      src: String
    },
    data () {
      return {
        player: null,
        off: null
      }
    },
    mounted () {
      const target = document.getElementById('vimeplayer');

      // Mount
      this.player = new Player({
        target,
        // If you'd like to initialize any props on setup, you can do so here.
        props: {
          src: this.src,
          plugins: [Boot],
          providers: [FileProvider, YouTubeProvider, VimeoProvider, DailymotionProvider]
        }
      });

      this.off = player.$on('mount', () => {
        // Interact with the player and plugins here.
        // console.log()
      });
    },
    beforeDestroy () {
      if (off) off()
      if (this.player) this.player.$destroy()
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