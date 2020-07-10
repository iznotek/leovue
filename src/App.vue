<template>
  <div id="app"
       style="scroll-behavior: smooth;"
       @drop="drop_handler($event);"
       @dragover="dragover_handler($event);"
       @dragend="dragend_handler($event);">
    <cover v-if="hasCoverPage"/>
    <router-view id="router-page"></router-view>
    <Ribbon v-if="hasGithubRibbon"
      v-bind="ribbonOptions"
    ></Ribbon>
  </div>
</template>

<script>
  import Cover from './components/Cover'
  import axios from 'axios'
  // import untar from 'js-untar'
  
  export default {
    name: 'app',
    components: {
      cover: Cover
    },
    computed: {
      hasCoverPage: function () {
        if (window.lconfig.coverPage) {
          return true
        }
        return false
      },
      hasGithubRibbon: function () {
        if (window.lconfig.githubRibbon) {
          return true
        }
        return false
      },
      ribbonOptions: function () {
        return window.lconfig.githubRibbon
      }
    },
    methods: {
      // drag and drop a leo file
      dragover_handler (ev) {
        // Prevent default select and drag behavior
        ev.preventDefault()
      },
      dragend_handler (ev) {
        // Remove all of the drag data
        var dt = ev.dataTransfer
        if (dt !== undefined) {
          if (dt.items) {
            // Use DataTransferItemList interface to remove the drag data
            for (var i = 0; i < dt.items.length; i++) {
              dt.items.remove(i)
            }
          } else {
            // Use DataTransfer interface to remove the drag data
            ev.dataTransfer.clearData()
          }
        }
      },
      drop_handler (ev) {
        ev.preventDefault()
        // If dropped items aren't files, reject them
        const dt = ev.dataTransfer
        if (dt !== undefined) {
          let i
          let f
          if (dt.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (i = 0; i < dt.items.length; i++) {
              if (dt.items[i].kind === 'file') {
                f = dt.items[i].getAsFile()
              }
            }
          } else {
            // Use DataTransfer interface to access the file(s)
            for (i = 0; i < dt.files.length; i++) {
              f = dt.files[i]
            }
          }
          const reader = new FileReader()
          reader.onload = (xml) => {
            const xmlString = xml.srcElement.result
            this.$store.dispatch('loadLeoFromXML', {xml: xmlString, route: this.$route})
          }
          reader.readAsText(f)
        }
      },
      linkStone (url) {
        var vm = this
        axios.head(url) // , {headers: {'Access-Control-Allow-Origin': '*'}})
          .then((response) => {
            // function str2ab (str) {
            //   var buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
            //   var bufView = new Uint16Array(buf)
            //   for (var i = 0, strLen = str.length; i < strLen; i++) {
            //     bufView[i] = str.charCodeAt(i)
            //   }
            //   return buf
            // }
            // let ab = str2ab(response.data)
            // console.log(typeof ab)
            // untar(ab).then(
            //   function (extractedFiles) { // onSuccess
            //     console.log(extractedFiles)
            //   }
            // )
            vm.load(url)
          })
          .catch(function (error) {
            console.log(error)
            vm.load()
          })
      },
      linkCheck (url) {
        var vm = this
        // var xhr = new XMLHttpRequest()
        // xhr.onreadystatechange = function () {
        //   if (this.readyState === this.HEADERS_RECEIVED) {
        //     var status = this.status
        //     if (status === 0 || (status >= 200 && status < 400)) {
        //       vm.load(url)
        //     } else {
        //       vm.load()
        //     }
        //   }
        // }
        // console.log(url)
        // xhr.open('HEAD', url, true)
        axios.head(url)
          .then((response) => {
            vm.load(url)
          })
          .catch(function () {
            vm.load()
          })
      },
      loadDefault (url = null) {
        let filename = '/static/docs'
        if (window.lconfig.filename) {
          filename = window.lconfig.filename
        }
        if (url) {
          filename = url
        }

        // console.log(filename)
        if (!this.$store.state.initializedData) {
          this.$store.dispatch('loadLeo', {filename, route: this.$route})
        }
        this.$store.dispatch('setMessages')
      },
      load (url = null) {
        // console.log(url)
        var auser
        if (url) { // window.location.origin.includes(':8080')) {
          auser = {name: 'guest', pw: ''}
          this.$store.commit('CONNECTED', {state: false, user: auser})
          this.loadDefault(url)
          return
        }

        if (!window.lconfig.static) {
          // const { userData, user, session } = this.$bs.lookForUserData()
          const { user, session } = this.$bs.lookForUserData()

          if (session.isUserSignedIn()) {
            // console.log(userData)
            auser = {name: user.username.replace('.blockstack', ''), pw: ''}
            this.$store.commit('CONNECTED', {state: true, user: auser})
          } else {
            auser = {name: 'guest', pw: ''}
            this.$store.commit('CONNECTED', {state: false, user: auser})
          }
        }

        try {
          this.$bs.getProfile(window.lconfig.admin).then(async (data) => {
            let appUrl = window.location.origin

            const bucketUrl = data && data.apps && data.apps[window.lconfig.appUrl]
            // If the user already used the app we try to get the public list
            if (bucketUrl && !appUrl.includes('localhost')) {
              const [dataGraph] = await Promise.all([
                this.$bs.fetchGraph(bucketUrl)
              ])
              // console.log(dataGraph)
              if (dataGraph.statusCode === 200) {
                this.$store.dispatch('loadGraph', dataGraph.file)
              } else {
                this.loadDefault(url)
              }
            } else {
              console.log('Blockstack app ', appUrl, ' is not reachable for account ', window.lconfig.admin,
                'You should connect at least one time as admin to get any published graph from your bucket !!!')

              this.loadDefault(url)
            }
          })
        } catch (error) {
          console.log('An error occured while querying profile for ', window.lconfig.admin,
            'Create the id or check your connection !!!')

          this.loadDefault(url)
        }
      }
    },
    mounted () {
      var host = window.location.hostname
      // console.log(host)
      if (process.env.NODE_ENV === 'production' && window.lconfig.api && window.lconfig.stone) {
        this.linkStone(window.lconfig.api + '/' + window.lconfig.stone + '/doc/trunk/welcome.leo') // window.lconfig.stone + '/uv/welcome.gz')
      } else if (window.lconfig.stone) {
        this.linkCheck(window.location.origin + '/static/stones/' + window.lconfig.stone + '/welcome.leo')
      } else if (host) {
        this.linkCheck(window.location.origin + '/static/stones/' + host + '/welcome.leo')
      }
    }
  }
</script>

<style lang="sass">

@import './assets/global.sass'
@import './assets/vue-instant.css'
@import './assets/wikipedia.css'
@import '~leaflet/dist/leaflet.css'

HTML, BODY
  // margin: 0
  // padding: 0
  height: 100%
  width: 100%
  // overflow: hidden

#app
  color: $mycolor
  margin: 0
  padding: 0
  height: 100%
  // background-color: rgba(255,0,0,1.0)

.right-pane .text, .inline .text
  // margin-top: 20px
  border: none
  background-color: transparent
  resize: none
  outline: none
  font-size: 16px
  // height: 100%
  // white-space: pre-line
  width: 100%

.directive
  color: #990000;

.md
  margin-left: 10px
  margin-top: 10px
  padding-right: 10px
  margin-bottom: 80px

.unselectable
 -moz-user-select: -moz-none
 -khtml-user-select: none
 -webkit-user-select: none
 //  Introduced in IE 10.
 //  See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
 -ms-user-select: none
 user-select: none

A, .link
  color: #42b983
  cursor: pointer
  text-decoration: underline

.flip-container
  width: 80%
  max-width: 600px
  margin-left: 40px
  margin-bottom: 60px
  SVG
    height: inherit !important

</style>
