<template>
  <section>
      <div class="row" style='width:300px; height:300px; bottom:0px; position:absolute;'>
        <!-- <div class="col-md-2">
          <button type="button" class="btn btn-primary btn-block" @click="changeModel('gltf')">GLTF</button>
          <button type="button" class="btn btn-primary btn-block" @click="changeModel('glb')">GLTF (GLB)</button>
          <button type="button" class="btn btn-primary btn-block" @click="changeModel('gltf_anim')">GLTF (Anim)</button>
        </div> -->
        <div class="col-md-10">
          <ModelViewer style='z-index:1200;'
            :lights="lights"
            :background-color="backgroundColor"
            :show-controls="false"
            :visible-controls="visibleControls"
            :src="src"
            :cubemap="cubemap"
            :statsjs="statsjs"
            :datgui="datgui"
            :rotation="rotate"
            :scale='scale'
            :playAnimation="anim"
          ></ModelViewer>
        </div>
      </div>
  </section>
</template>

<script>
  import {Vector3, Euler} from 'three'
  import ModelViewer from './components/ModelViewer.vue' // develop
  // import {ModelViewer} from '../dist/vue-3dmodel-viewer.esm' //webpack test
  // import { ModelViewer } from './../' // for test

  export default {
    name: 'app',
    components: {
      ModelViewer
    },
    data () {
      return {
        models: {
          'gltf_anim': {
            src: '/static/models/gltf/CesiumMan/glTF/CesiumMan.gltf',
            rotate: new Euler(0, 0, 0),
            anim: true
          }
        },
        lights: [
          {
            type: 'hemisphere',
            skyColor: 0xbbbbff,
            groundColor: 0x444422,
            position: new Vector3(0, 1, 0)
          } /* ,
          {
            type: 'AmbientLight',
            color: 0xaaaaaa
          },
          {
            type: 'DirectionalLight',
            position: { x: 1, y: 1, z: 1 },
            color: 0xffffff,
            intensity: 0.8
          }
          ,{
            type: 'ambient',
            color: 0x1e1e23
          },
          {
            type: 'directional',
            color: 0xcfcfcf,
            position: new Vector3(20, 40, -15)
          } */
        ],
        src: null,
        backgroundColor: 'rgba(0,0,0,0.001)',
        visibleControls: {help: false, fullscreen: false, download: false},
        statsjs: false,
        datgui: false,
        cubemap: [
          // 'textures/cube/Bridge2/posx.jpg',
          // 'textures/cube/Bridge2/negx.jpg',
          // 'textures/cube/Bridge2/posy.jpg',
          // 'textures/cube/Bridge2/negy.jpg',
          // 'textures/cube/Bridge2/posz.jpg',
          // 'textures/cube/Bridge2/negz.jpg'
        ],
        // cameraPosition: new Vector3(0.0,0.0,20),
        scale: new Vector3(0.9,0.9,0.9),
        rotate: new Vector3(0,-0.8,0),
        // position: new Vector3(0,0,0),
        anim: true
      }
    },
    mounted () {
      this.src = this.models.gltf_anim.src
    },
    methods: {
      changeModel (el) {
        this.src = this.models[el].src
        this.rotate = this.models[el].rotate
        this.anim = this.models[el].anim || true
      }
    }
  }
</script>
