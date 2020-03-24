<template>
  <div :style="{background: backgroundColor}">
    <beautiful-chat
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :close="closeChat"
      :colors="getColors"
      :isOpen="isChatOpen"
      :messageList="messageList"
      :messageStyling="messageStyling"
      :newMessagesCount="newMessagesCount"
      :onMessageWasSent="onMessageWasSent"
      :open="openChat"
      :participants="participants"
      :showEmoji="true"
      :showFile="true"
      :showTypingIndicator="showTypingIndicator"
      :titleImageUrl="titleImageUrl"
      @onType="handleOnType"
    />
    <!-- <v-dialog/> -->
  </div>
</template>

<script>
import messageHistory from './messageHistory'
import chatParticipants from './chatProfiles'
import availableColors from './colors'
const util = require('../../util.js')

export default {
  name: 'chat',
  components: {
  },
  data () {
    return {
      participants: chatParticipants,
      titleImageUrl:
        'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: messageHistory,
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: '',
      colors: null,
      availableColors,
      chosenColor: null,
      alwaysScrollToBottom: false,
      messageStyling: true,
      userIsTyping: false
    }
  },
  created () {
    this.setColor('own')
  },
  methods: {
    sendMessage (text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1
        this.onMessageWasSent({
          author: 'support',
          type: 'text',
          data: { text }
        })
      }
    },
    handleTyping (text) {
      this.showTypingIndicator =
        text.length > 0
          ? this.participants[this.participants.length - 1].id
          : ''
    },
    onMessageWasSent (message) {
      this.messageList = [...this.messageList, message]
    },
    openChat () {
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      this.isChatOpen = false
    },
    setColor (color) {
      this.colors = this.availableColors[color]
      this.chosenColor = color
    },
    // showStylingInfo() {
    //   this.$modal.show('dialog', {
    //     title: 'Info',
    //     text:
    //       'You can use *word* to <strong>boldify</strong>, /word/ to <em>emphasize</em>, _word_ to <u>underline</u>, `code` to <code>write = code;</code>, ~this~ to <del>delete</del> and ^sup^ or ¡sub¡ to write <sup>sup</sup> and <sub>sub</sub>'
    //   })
    // },
    messageStylingToggled (e) {
      this.messageStyling = e.target.checked
    },
    handleOnType () {
      this.$root.$emit('onType')
      this.userIsTyping = true
    }
  },
  computed: {
    getColors () {
      return this.colors
    },
    linkColor () {
      return this.chosenColor === 'dark'
        ? this.colors.sentMessage.text
        : this.colors.launcher.bg
    },
    backgroundColor () {
      return this.chosenColor === 'dark' ? this.colors.messageList.bg : '#fff'
    }
  },
  watch: {
    '$store.state.currentItem': {
      handler: function (val, oldVal) {
        if (val) {
          var theme = this.$store.state.themes[val.id]
          if (this.colors && theme && theme.background && theme.background.theme) {
            var color = util.rgbaFromTheme(theme.background.theme, 0.7)
            var bg = util.rgbaObjectFromTheme(theme.background.theme, 0.7, 30)
            if (typeof bg === 'object') {
              bg = 'rgba(' + bg.r + ',' + bg.g + ',' + bg.b + ',' + bg.a + ')'
            }
            this.colors.header.bg = color
            this.colors.launcher.bg = color
            this.colors.messageList.bg = bg
            this.colors.sentMessage.bg = color
            this.colors.receivedMessage.bg = color
            this.colors.userInput.bg = color
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>


<style>
.sc-launcher {
  z-index: 2000;
  // left: 25px;
  // right:auto !important;
}
.sc-launcher .sc-open-icon,
.sc-launcher .sc-closed-icon {
  // left: 25px;
  // right:auto !important;
}

.sc-chat-window {
  z-index: 2000;
  background: transparent;
  // left: 25px;
  // right:auto !important;
}
.sc-chat-window.opened {
  opacity: 0.9;
}
</style>

<style scoped>
body {
  padding: 0px;
  margin: 0px;
}

* {
  font-family: Avenir Next, Helvetica Neue, Helvetica, sans-serif;
}

.demo-description {
  max-width: 500px;
}

.demo-description img {
  max-width: 500px;
}

.demo-test-area {
  width: 300px;
  box-sizing: border-box;
}

.demo-test-area--text {
  box-sizing: border-box;
  width: 100%;
  margin: 0px;
  padding: 0px;
  resize: none;
  font-family: Avenir Next, Helvetica Neue, Helvetica, sans-serif;
  background: #fafbfc;
  color: #8da2b5;
  border: 1px solid #dde5ed;
  font-size: 16px;
  padding: 16px 15px 14px;
  margin: 0;
  border-radius: 6px;
  outline: none;
  height: 150px;
  margin-bottom: 10px;
}

.demo-monster-img {
  width: 400px;
  display: block;
  margin: 60px auto;
}

.text-center {
  text-align: center;
}

.colors a {
  color: #fff;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 10px;
}

.toggle a {
  text-decoration: none;
}

.messageStyling {
  font-size: small;
}
</style>