<template>
  <div id="vr">
  <a-scene embedded color="rgba(0,0,0,0.0000001)" id="scene" cursor="rayOrigin: mouse">
    <a-entity animation="property: rotation; to: 0 360 0; dur: 700000; repeat: indefinite; easing: linear">
    <a-entity a-terrain="fovpad:2;
                        latitude:36.1069652;
                        longitude:-112.1129972;
                        stretch:4;
                        lod:14;
                        elevation:500;
                        radius:1000000;
                        world_radius:63727982;
                      ">
    </a-entity> 
    </a-entity> 

    <a-entity id="cameraRig" position="0 1 0">
      <a-entity id="camera" camera wasd-controls="fly:true" look-controls orbit-controls></a-entity>
      <a-entity id="lefthand" camera-transform-controls-hand="hand:left" vive-controls="hand: left" oculus-touch-controls="hand: left" windows-motion-controls="hand: left"></a-entity>
      <a-entity id="righthand" camera-transform-controls-hand="hand:right" vive-controls="hand: right" oculus-touch-controls="hand: right" windows-motion-controls="hand: right"></a-entity>
    </a-entity>

    <a-light type="directional" color="#ffffff" intensity="1" position="-1 1 1"></a-light>
    <a-light type="ambient" color="#ff4444"></a-light>
    <a-light type="point" intensity="1" position="2 4 4"></a-light>

    <!-- <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
    <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
    <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
    <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane> -->
    <!-- <a-sky color="#08c"></a-sky> -->

    </a-scene>  
  </div>
</template>

<script>
import 'aframe'

export default{
  name: 'VR',
  props: ['loc', 'checkInWatch'],
  data () {
    return {
      clickListener: false,
      checkInPopup: true,
      first: true,
      loading: true,
      topAmount: 20,
      animOn: true,
      currentPhotoId: false,
      photo: '/static/loading.png',
      planePosition: '0 1.5 -3',
      locSlug: false
    }
  },
  computed: {
    objmodel () {
      return this.loc.type === 'airport' ? 'obj: #plane-obj' : 'obj: #wheel-obj'
    }
  },
  watch: {
    checkInWatch (val) {
      this.checkInPopup = val
      if (val) {
        setTimeout(function () { this.checkInPopup = false }, 4000)
      }
    },
    loc (newloc) {
      console.log('WATCH: loc changed')
      console.log(newloc)
      if (newloc && newloc.photos && newloc.photos.length > 0) {
        console.log('switch ')
        this.switchPhoto()
        document.getElementById('toy').setAttribute('material', 'color', newloc.color)
        this.$parent.showGreeting()
      }
    }
  },
  methods: {
    switchClick () {
      // console.log('switch click clicked')
      this.photo = ''
      this.$parent.switchCities()
    },
    rand () {
      var foo = Math.floor(Math.random() * 12) - 6
      return foo < 2 && foo > 0 ? 2 : foo > -2 && foo < 0 ? -2 : foo
    },
    changePosition () {
      this.planePosition = this.rand() + ' ' + this.rand() + ' ' + this.rand()
    },
    switchPhoto (callback = function () {}) {
      // console.log('switch photo')
      var vm = this
      vm.loading = true
      // var topAmount = this.loc.photos.length > this.topAmount ? this.loc.photos.length - 1 : this.topAmount
      var photoId = this.loc.photos[Math.floor(Math.random() * this.loc.photos.length)].id
      if (photoId === this.currentPhotoId) {
        this.switchPhoto()
      } else {
        this.getFlick(photoId, function (url) {
          // console.log('get flick')
          var img = new Image()
          img.onload = function () {
            vm.photo = url
            vm.loading = false
            callback()
          }
          img.src = url
        })
      }
    },
    getPhoto (loc, callback = function () {}) {
      // console.log('get photo')
      if (this.loading) {
        return
      }
      this.loading = true
      this.$http.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9f9dc34361fdef233d4309c30176d8dd&sort=interestingness-desc&license=4,5,6,7&group_id=44671723%40N00&lat=' + loc.latitude + '&lon=' + loc.longitude + '&radius=' + this.radius + '&format=json&extras=url_k&nojsoncallback=1').then(function (successResult) {
        this.loading = false
        var photos = successResult.data.photos.photo
        callback(photos)
      }, function (errorResult) {
        // console.log(errorResult)
      })
    },
    getFlick (photoId, callback = function () {}) {
      this.$http.get('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=9f9dc34361fdef233d4309c30176d8dd&photo_id=' + photoId + '&format=json&nojsoncallback=1').then(function (successData) {
        var photo = false
        successData.data.sizes.size.reverse().forEach(function (element, int) {
          if (!photo && element.width <= 2050) {
            photo = element
          }
        })
        if (!photo) {
          photo = successData.data.sizes.size.pop()
        }
        callback(photo.source)
      }, function (errorResult) {
        // console.log(errorResult)
      })
    },
    makeLoc (loc) {
      // console.log('make loc')
      var vm = this
      this.getPhoto(loc, function (photos = []) {
        if (photos.length === 0) {
          vm.switchCities()
        } else {
          // var newLoc = {
          //   type: loc.type,
          //   key: vm.locSlug,
          //   slug: vm.locSlug,
          //   name: loc.name,
          //   lat: loc.latitude,
          //   long: loc.longitude,
          //   country_code: loc.country_code,
          //   color: vm.generateColor(vm.locSlug),
          //   photos: photos,
          //   entities: [],
          //   users: []
          // }
          vm.locKey = 'cool' // vm.$firebaseRefs.locs.push(newLoc).key
          vm.loc = vm.findLoc()
        }
      })
    },
    findLoc () {
      var vm = this
      var index = this.locs.findIndex(function (item) {
        return item.slug === vm.locSlug
      })
      return index > -1 ? this.locs[index] : false
    },
    bindToLoc (loc) {
      this.locSlug = this.slugify(loc.name)
      this.loc = this.findLoc()
      if (!this.loc) {
        // console.log('no loc yet')
        this.makeLoc(loc)
      } else if (!this.loc.photos || this.loc.photos.length === 0) {
        this.switchCities()
      }
      // this.$bindAsArray('chats', db.ref('chats/' + this.locSlug))
    }
  },
  mounted () {
    // var vm = this
    // // console.log(AFRAME.version)
    // // console.log(AFRAME)
    // if (typeof (AFRAME.components['toy-color']) !== 'undefined') {
    //   // console.log('plane already defined!')
    //   return
    // } else {
    //   // console.log('pane not already defined!')
    // }
    // AFRAME.registerComponent('toy-color', {
    //   init: function () {
    //     this.el.setAttribute('material', 'color:white')
    //   }
    // })
    // AFRAME.registerComponent('check-in', {
    //   init: function () {
    //     // const COLORS = ['red', 'green', 'blue']
    //     if (!vm.clickListener) {
    //       // console.log('ADD EVENT LISTENER')
    //       vm.clickListener = this.el.addEventListener('click', function () {
    //         // console.log('AIRPLANE WAS CLICKED')
    //         if (vm.loading) {
    //           // console.log('still loading return false')
    //           return
    //         }
    //         var aframeEl = this
    //         // const randomIndex = Math.floor(Math.random() * COLORS.length)
    //         this.setAttribute('material', 'color', '#00A8E8')
    //         vm.$parent.checkIn()
    //         vm.switchPhoto(function () {
    //           vm.changePosition()
    //           aframeEl.setAttribute('material', 'color', vm.loc.color)
    //         })
    //       })
    //     }
    //   }
    // })
  }
}
</script>

<style>
  .a-enter-vr-button { 
    bottom: auto !important; 
    top: 10px; 
  }
</style>

<style lang="scss" scoped>
  #vr{
    position: absolute;
    top:0; left: 0;
    height:100vh;
    overflow: hidden;
    width:100%;
    transition:transform 500ms;
    // background: #07c;
  }

  #firstCheckInModal{
    position: absolute;
    width:100vw; height:100vh;
    top:0; left:0;
    display: flex;
    align-items:center;
    justify-content:center;
    > .inner {
      background: white;
      box-shadow:0 0 6px rgba(0,0,0,.25);
      padding:2rem;
      //max-width:20em;
      > h2{
        margin-bottom: 1em;
      }
      .swatch{
        width:1em; height:1em;
        display:inline-block;
      }
    }
  }
</style>