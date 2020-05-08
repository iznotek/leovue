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
      linkCheck (url) {
        axios.get(url)
          .then((response) => {
            this.loadDefault(url)
          })
          .catch((error) => {
            console.log(error)
            this.loadDefault()
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

        if (!this.$store.state.initializedData) {
          this.$store.dispatch('loadLeo', {filename, route: this.$route})
        }
        this.$store.dispatch('setMessages')
      }
    },
    mounted () {
      var host = window.location.hostname
      if (host) {
        this.linkCheck(window.location.origin + '/static/domains/' + host + '.leo')
      }

      // if (!window.lconfig.static) {
      //   // const { userData, user, session } = this.$bs.lookForUserData()
      //   const { user, session } = this.$bs.lookForUserData()
      //   if (session.isUserSignedIn()) {
      //     // console.log(userData)
      //     this.$store.state.connected = true
      //     this.$store.state.user = {name: user.username.replace('.blockstack', ''), pw: ''}
      //   } else {
      //     this.$store.state.user = {name: 'guest', pw: ''}
      //   }
      // }

      // try {
      //   this.$bs.getProfile(window.lconfig.admin).then(async (data) => {
      //     let appUrl = window.location.origin
      //     // console.log(data)
      //     const bucketUrl = data && data.apps && data.apps[window.lconfig.appUrl]
      //     // If the user already used the app we try to get the public list
      //     if (bucketUrl && !appUrl.includes('localhost')) {
      //       const [dataGraph] = await Promise.all([
      //         this.$bs.fetchGraph(bucketUrl)
      //       ])
      //       // console.log(dataGraph)
      //       if (dataGraph.statusCode === 200) {
      //         this.$store.dispatch('loadGraph', dataGraph.file)
      //       } else {
      //         this.loadDefault()
      //       }
      //     } else {
      //       console.log('Blockstack app ', appUrl, ' is not reachable for account ', window.lconfig.admin,
      //         'You should connect at least one time as admin to get any published graph from your bucket !!!')

      //       this.loadDefault()
      //     }
      //   })
      // } catch (error) {
      //   console.log('An error occured while querying profile for ', window.lconfig.admin,
      //     'Create the id or check your connection !!!')

      //   this.loadDefault()
      // }
    }
  }
</script>

<style lang="sass">

@import './assets/global.sass'
@import './assets/vue-instant.css'
@import './assets/wikipedia.css'
@import '~leaflet/dist/leaflet.css'

HTML, BODY
  margin: 0
  padding: 0
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
