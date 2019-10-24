<template>
  <div id="vr">
  <a-scene embedded color="rgba(0,0,0,0.0000001)" id="scene" cursor="rayOrigin: mouse">
    

         <!-- This is a "mixin" we can apply to planets to make them
            rotate-->
            <a-mixin id="rotation" animation="property: rotation; loop: true; from:  0 0 0; to: 0 360 0; dur: 20000; easing: linear;"></a-mixin>

            <!-- here is a "mixin" that we can apply to a container to make the
            planet inside it orbit -->
            <a-mixin id="orbit" animation="property: rotation; loop: true; to: 0 360 0; dur: 40000; easing: linear;"></a-mixin>

            <a-assets>
                <img id="sun-texture" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2F1024px-Map_of_the_full_sun.jpg?1540859304920"
                    crossorigin="anonymous">
                <img id="mercury-texture" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2Fmercurymap.jpg?1541102122291"
                    crossorigin="anonymous">
                <img id="venus-texture" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2Fvenusmap.jpg?1541102155907"
                    crossorigin="anonymous">
                <img id="earth-texture" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2Fearthmap1k.jpg?1541102064615"
                    crossorigin="anonymous">
                <img id="mars-texture" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2Fmars_1k_color.jpg?1541102234577"
                    crossorigin="anonymous">
                <img id="jupiter-texture" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2Fjupitermap.jpg?1541101634813"
                    crossorigin="anonymous">
                <img id="saturn-texture" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2Fsaturnmap.jpg?1541102148468"
                    crossorigin="anonymous">
                <img id="uranus-texture" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2Furanusmap.jpg?1541102150185"
                    crossorigin="anonymous">
                <img id="neptune-texture" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2Fneptunemap.jpg?1541102137305"
                    crossorigin="anonymous">
                <img id="pluto-texture" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2Fplutomap1k.jpg?1541102145905"
                    crossorigin="anonymous">
                <img id="moon-texture" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2FMoonmap_from_clementine_data.png?1541102132708"
                    crossorigin="anonymous">
                <a-asset-item id="asteroids" response-type="arraybuffer" src="https://cdn.glitch.com/d558c128-2ed0-4284-a0da-4d18b9163ad6%2Fasteroides.glb?1541106805090"></a-asset-item>
            </a-assets>

            <!-- Give some basic lighting here. Ambient lighting lights the
            whole scene and makes sure we can still see our rings. -->
            <a-entity id="basic-light" light="type: ambient; color: #BBB"></a-entity>

            <!--use our new orbit-controls-->
            <a-entity camera look-controls orbit-controls="target: 0 1.6 -0.5;  initialPosition: -5 5 20"></a-entity>

            <a-sky color="black"></a-sky>
            <a-entity star-system="count: 1000; radius: 250; depth: 0"></a-entity>

            <!-- large rings we can use to guide our orbits -->
            <a-entity geometry="primitive: torus; radius: 3; radiusTubular: 0.01;segmentsTubular: 50" material="color: #FFFFFF;opacity: 0.3"
                rotation="90 0 0" scale="2 2 0.1"></a-entity>
            <a-entity geometry="primitive: torus; radius: 4.24; radiusTubular: 0.01;segmentsTubular: 50" material="color: #FFFFFF;opacity: 0.3"
                rotation="90 0 0" scale="2 2 0.1"></a-entity>
            <a-entity geometry="primitive: torus; radius: 5.24; radiusTubular: 0.01;segmentsTubular: 50" material="color: #FFFFFF;opacity: 0.3"
                rotation="90 0 0" scale="2 2 0.1"></a-entity>
            <a-entity geometry="primitive: torus; radius: 6.25; radiusTubular: 0.01;segmentsTubular: 50" material="color: #FFFFFF;opacity: 0.3"
                rotation="90 0 0" scale="2 2 0.1"></a-entity>
            <a-entity geometry="primitive: torus; radius: 12.1; radiusTubular: 0.01;segmentsTubular: 50" material="color: #FFFFFF;opacity: 0.3"
                rotation="90 0 0" scale="2 2 0.1"></a-entity>
            <a-entity geometry="primitive: torus; radius: 15.55; radiusTubular: 0.01;segmentsTubular: 50" material="color: #FFFFFF;opacity: 0.3"
                rotation="90 0 0" scale="2 2 0.1"></a-entity>
            <a-entity geometry="primitive: torus; radius: 18.05; radiusTubular: 0.01;segmentsTubular: 50" material="color: #FFFFFF;opacity: 0.3"
                rotation="90 0 0" scale="2 2 0.1"></a-entity>
            <a-entity geometry="primitive: torus; radius: 20.05; radiusTubular: 0.01;segmentsTubular: 50" material="color: #FFFFFF;opacity: 0.3"
                rotation="90 0 0" scale="2 2 0.1"></a-entity>
            <a-entity geometry="primitive: torus; radius: 23.05; radiusTubular: 0.01;segmentsTubular: 50" material="color: #FFFFFF;opacity: 0.3"
                rotation="90 0 0" scale="2 2 0.1"></a-entity>


            <!-- let's make the sun rotate and give off light!-->
            <a-sphere id="sun" position="0 0 0" radius="4" src="#sun-texture" mixin="rotation" light="type: point"
                material="shader: flat;"></a-sphere>

            <a-entity id="asteroid-belt" gltf-model="#asteroids" scale="2.1 2.1 2.1" position="0 0 0" mixin="rotation"
                animation="dur: 60000;"></a-entity>

            <!-- our basic planets, we're going to wrap them so we can apply
            orbits to them and also give them rotation-->
            <a-entity id="orbit-mercury" mixin="orbit" animation="dur: 20000;">
                <a-sphere id="mercury" position="0 0 6" radius=".4" src="#mercury-texture" mixin="orbit"></a-sphere>
            </a-entity>

            <a-entity id="orbit-venus" mixin="orbit">
                <a-sphere id="venus" position="0 0 8.5" radius=".4" src="#venus-texture" mixin="rotation"></a-sphere>
            </a-entity>

            <a-entity id="orbit-mars" mixin="orbit">
                <a-sphere id="mars" position="0 0 12.5" radius=".4" src="#mars-texture" mixin="rotation"></a-sphere>
            </a-entity>

            <a-entity id="orbit-jupiter" mixin="orbit" animation="dur: 90000;">
                <a-sphere id="jupiter" position="0 0 24" radius="2.5" src="#jupiter-texture" mixin="rotation"></a-sphere>
            </a-entity>

            <a-entity id="orbit-pluto" mixin="orbit" animation="dur: 80000;">
                <a-sphere id="pluto" position="0 0 46" radius=".4" src="#pluto-texture" mixin="rotation"></a-sphere>
            </a-entity>


            <!--there are two orbits here- the earth itself and the earth around the moon-->
            <a-entity id="orbit-earth" mixin="orbit" animation="dur: 30000;">
                <a-entity id="earth-and-moon" position="0 0 10.5">
                    <a-entity id="earth-container">
                        <a-sphere position="0 0 0" radius=".5" id="earth" src="#earth-texture" mixin="rotation"></a-sphere>
                        <a-entity id="moon-container" mixin="orbit">
                            <a-sphere position="-1 0 0" radius=".10" id="moon" src="#moon-texture"></a-sphere>
                        </a-entity>
                    </a-entity>
                </a-entity>
            </a-entity>

            <!--we'll need to wrap these further to get our orbits working-->
            <a-entity id="orbit-saturn" mixin="orbit">
                <a-entity id="saturn-container" position="0 0 31">
                    <a-sphere radius="1.8" id="saturn" src="#saturn-texture" mixin="rotation"></a-sphere>
                    <a-entity id="saturn-ring-1" geometry="primitive: torus; radius: 3.2; radiusTubular: 0.1;segmentsTubular: 50"
                        material="color: #57524A;" rotation="90 0 0" scale="1 1 0.1"></a-entity>
                    <a-entity id="saturn-ring-2" geometry="primitive: torus; radius: 2.4; radiusTubular: 0.2;segmentsTubular: 50"
                        material="color: #A29A87;" rotation="90 0 0" scale="1 1 0.1"></a-entity>
                </a-entity>
            </a-entity>

            <a-entity id="orbit-uranus" mixin="orbit" animation="dur: 70000;">
                <a-entity id="uranus-container" position="0 0 36">
                    <a-sphere id="uranus" radius=".75" src="#uranus-texture" mixin="rotation"></a-sphere>
                    <a-entity id="uranus-ring" geometry="primitive: torus; radius: 1.5; radiusTubular: 0.01;segmentsTubular: 50"
                        material="color: #FFFFFF;" rotation="-10 90 0" scale="1 1 0.1"></a-entity>
                </a-entity>
            </a-entity>

            <a-entity id="orbit-neptune" mixin="orbit" animation="dur: 35000;">
                <a-entity id="neptune-container" position="0 0 40">
                    <a-sphere id="neptune" radius="1" src="#neptune-texture" mixin="rotation"></a-sphere>
                    <a-entity id="neptune-ring-1" geometry="primitive: torus; radius: 2; radiusTubular: 0.01;segmentsTubular: 50"
                        material="color: #FFFFFF;opacity: 0.8" rotation="90 0 0" scale="1 1 0.1"></a-entity>
                    <a-entity id="neptune-ring-2" geometry="primitive: torus; radius: 1.7; radiusTubular: 0.05;segmentsTubular: 50"
                        material="color: #FFFFFF;opacity: 0.8" rotation="90 0 0" scale="1 1 0.1"></a-entity>
                    <a-entity id="neptune-ring-3" geometry="primitive: torus; radius: 1.3; radiusTubular: 0.01;segmentsTubular: 50"
                        material="color: #FFFFFF;opacity: 0.8" rotation="90 0 0" scale="1 1 0.1"></a-entity>
                </a-entity>
            </a-entity>

    </a-scene>  
  </div>
</template>

//  <!-- <a-entity animation="property: rotation; to: 0 360 0; dur: 700000; repeat: 3000; easing: linear"> -->
//     <a-entity id="world" position="0 0 0" a-terrain="
//                         radius:1000;
//                         oberver:camera;
//                       ">
//     <!-- <a-entity a-terrain="fovpad:4;
//                         latitude:36.1069652;
//                         longitude:-112.1129972;
//                         stretch:4;
//                         lod:0;
//                         elevation:0;
//                         radius:6372798;
//                         world_radius:6372798;
//                       "> -->
//     </a-entity> 
//      <!-- </a-entity>  -->

//     <a-entity id="cameraRig">
//       <a-entity id="camera"
//         camera="fov: 45; near:0.01; far:10000" 
//         wasd-controls="fly:true" 
//         look-controls 
//         orbit-controls
//         position="0 1 5000"
//         orbit-controls="
//           autoRotate: false;
//           target: #world;
//           enableDamping: true;
//           dampingFactor: 0.125;
//           rotateSpeed:0.10;
//           minDistance:1000;
//           maxDistance:5000;
//           minPolarAngle:0.1;
//           maxPolarAngle:3.04159265359;
//           enableProportionalVelocity:true;"
//       ></a-entity>
//       <a-entity id="lefthand" camera-transform-controls-hand="hand:left" vive-controls="hand: left" oculus-touch-controls="hand: left" windows-motion-controls="hand: left"></a-entity>
//       <a-entity id="righthand" camera-transform-controls-hand="hand:right" vive-controls="hand: right" oculus-touch-controls="hand: right" windows-motion-controls="hand: right"></a-entity>
//     </a-entity>

//     <a-light type="directional" color="#ffffff" intensity="1" position="-1 1 1"></a-light>
//     <a-light type="ambient" color="#444444"></a-light>
//     <a-light type="point" intensity="1" position="2 4 4"></a-light>

//     <!-- <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
//     <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
//     <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
//     <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane> -->
//     <!-- <a-sky color="#08c"></a-sky> -->

// <a-scene id="scene" vr-mode-ui="enabled: false">
//       <a-assets>
//         <!--<img id="highlight1" src="../assets/radial-highlight.png">-->
//         <a-asset-item id="plane-obj" src="/static/plane.obj"></a-asset-item>
//         <a-asset-item id="wheel-obj" src="/static/wheel.obj"></a-asset-item>
//         <img id="sky-src" :src="photo">
//       </a-assets>
//       <!-- Ground Highlight -->
//       <!--<a-image position="0 -.2 5" src="#highlight1" rotation="-90 0 0" scale="30 30 30"></a-image>-->
//       <!-- Objects -->
//       <a-entity id="toy" toy-color check-in :position="planePosition" :obj-model="objmodel" rotation="-3 -45 0">
//         <a-animation v-if="animOn" attribute="rotation"
//         direction="normal"
//         dur="20000"
//         fill="reverse"
//         to="0 -45 -360"
//         easing="linear"
//         repeat="indefinite"></a-animation>
//       </a-entity>
//       <!-- camera / cursor -->
//       <a-entity position="0 2.2 4">
//     <a-entity camera look-controls wasd-controls>
//       <a-entity v-if='loc' position="0 0 -3"
//                 geometry="primitive: ring; radiusOuter: 0.30;
//                           radiusInner: 0.20;"
//                 material="color: cyan; shader: flat"
//                 cursor="maxDistance: 30; fuse: true">
//         <a-animation begin="click" easing="ease-in" attribute="scale"
//              fill="backwards" from="0.1 0.1 0.1" to="1 1 1" dur="150"></a-animation>
//         <a-animation begin="fusing" easing="ease-in" attribute="scale"
//              fill="forwards" from="1 1 1" to="0.1 0.1 0.1" dur="1500"></a-animation>
//       </a-entity>
//     </a-entity>
//   </a-entity>
// <!-- 

//       <a-entity camera="userHeight: 1.6" look-controls>
//             <a-entity position="0 0 -1"
//                 geometry="primitive: ring; radiusOuter: 0.10;
//                           radiusInner: 0.07;"
//                 material="color: black; "
//                 cursor=" fuse: true;">
//         <a-animation begin="click" easing="ease-in" attribute="scale"
//              fill="backwards" from="0.1 0.1 0.1" to="1 1 1" dur="150"></a-animation>
//         <a-animation begin="fusing" easing="ease-in" attribute="scale"
//              fill="forwards" from="1 1 1" to="0.1 0.1 0.1" dur="1500"></a-animation>
//       </a-entity>
//       </a-entity> -->
//       <!-- Background / loc.photo -->
//       <a-sky :src="photo"></a-sky>
//     </a-scene>

<script>
/* global Image:true */
/* eslint no-undef: "error" */
// import AFRAME from 'aframe'
import 'aframe'
import 'cesium/Build/CesiumUnminified/Cesium.js'
import 'aframe-aterrain-component/dist/aframe-aterrain-component.min.js'
// import './vr/camera.js'

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