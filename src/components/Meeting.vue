<template>
  <div style="position: relative; height: 100%; background: rgba(0,0,0,0.5);">
    <div style="height: 100%;"> <!-- v-show="!showSignPanel && auth"> -->
      <vue-jitsi-meet
        ref="jitsiRef"
        domain="meet.jit.si"
        :options="jitsiOptions"
      ></vue-jitsi-meet>    
    </div>        
    <!-- <sign-wrapper 
      v-if="showSignPanel && !auth" 
      :baseURL="signConfig.baseURL" 
      :apiKey= "signConfig.apiKey"
      :maxUserNameLength="30" 
      v-on:sign-user="signUser"
    ></sign-wrapper> -->
  </div>
</template>

<script>
import { JitsiMeet } from '@mycure/vue-jitsi-meet'
import Sign from './comment/Sign.vue'
import { firebaseConfig } from '../config.js'

export default {
  components: {
    VueJitsiMeet: JitsiMeet,
    signWrapper: Sign
  },
  data () {
    return {
      loading: true,
      showSignPanel: true,
      idToken: null,
      userId: null,
      isAdmin: null,
      userName: '',
      expiresIn: null,
      auth: false
    }
  },
  computed: {
    signConfig () {
      return {
        baseURL: firebaseConfig.databaseURL,
        apiKey: firebaseConfig.apiKey
      }
    },
    jitsiOptions () {
      return {
        roomName: 'deep.look.iznow.tech.3773829817',
        noSSL: false,
        userInfo: {
          email: 'iznow@pm.me',
          displayName: 'iznow.time'
        },
        configOverwrite: {
          enableNoisyMicDetection: false
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_CHROME_EXTENSION_BANNER: false
        },
        onload: this.onIFrameLoad
      }
    }
  },
  mounted () {
    // this.checkAutoLogin()
  },
  methods: {
    checkAutoLogin () {
      const token = localStorage.getItem('commentToken')
      if (!token) {
        return
      }
      const expirationDate = localStorage.getItem('commentExpirationDate')
      const now = new Date()
      const remainingTime = Math.floor(
        (new Date(expirationDate).getTime() - now.getTime()) / 1000
      )
      if (now >= expirationDate) {
        return
      }
      const userId = localStorage.getItem('commentUserId')
      const userName = localStorage.getItem('commentUserName')
      if (localStorage.getItem('commentAdmin') !== undefined) {
        const data = [token, userId, userName, remainingTime, true]
        this.signUser(data)
      } else {
        const data = [token, userId, userName, remainingTime]
        this.signUser(data)
      }
    },
    signUser (data) {
      this.idToken = data[0]
      this.userId = data[1]
      this.userName = data[2]
      this.expiresIn = data[3]
      this.logOutTimer = setTimeout(() => {
        this.clearAuth()
      }, this.expiresIn * 1000)
      this.isAdmin = data[4]
      this.auth = true
      this.showSignPanel = false
    },
    clearAuth () {
      clearTimeout(this.logOutTimer)
      this.idToken = ''
      this.userId = ''
      this.userName = ''
      this.isAdmin = null
      this.auth = false
      localStorage.removeItem('commentToken')
      localStorage.removeItem('commentUserId')
      localStorage.removeItem('commentExpirationDate')
      localStorage.removeItem('commentUserName')
      localStorage.removeItem('commentAdmin')
    },
    onIFrameLoad () {
      this.$refs.jitsiRef.addEventListener('participantJoined', this.onParticipantJoined)
    },
    onParticipantJoined (e) {
      // do stuff
      console.log(e)
    }
  }
}
</script>