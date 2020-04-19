import { UserSession, AppConfig, Person, lookupProfile } from 'blockstack'
import * as ablockstack from 'blockstack'

let auser // {person: Person, username: String}

export const appConfig = new AppConfig(['store_write', 'publish_data'])
export const userSession = new UserSession({ appConfig })

export const blockstack = ablockstack
export const bs = {

  lookForUserData: () => {
    const session = userSession
    let userData
    if (session.isUserSignedIn()) {
      userData = session.loadUserData()
      const person = new Person(userData.profile)
      const username = userData.username
      auser = { person, username }
      // context.root.$router.push('dashboard')
    } else if (session.isSignInPending()) {
      session.handlePendingSignIn()
        .then((x) => {
          window.location = window.location.origin
        })
    }
    const user = auser
    return { userData, user, session }
  },

  redirectToSignIn: () => {
    const origin = window.location.origin
    userSession.redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
  },

  signUserOut: () => {
    const origin = window.location.origin
    userSession.signUserOut(origin)
  },

  isUserSignedIn: () => {
    return userSession.isUserSignedIn()
  },

  signOut: (redirectUrl) => {
    userSession.signUserOut(redirectUrl)
  },

  async getProfile (userName) {
    try {
      return await lookupProfile(userName)
    } catch (error) {
      console.log(error)
    }
  },

  get currentUser () {
    return auser
  },

  async fetchGraph (bucketUrl) {
    let file
    let statusCode = false
    const data = await fetch(`${bucketUrl}graph.json`)
    if (data.status === 200) {
      file = await data.json()
    } else if (data.status === 404) {
      // If file is not found we set an empty object
      file = {}
    }
    statusCode = data.status
    return { file, statusCode }
  },

  async save (graph) {
    var udata = userSession.loadUserData()
    var appUrl = window.location.origin
    const bucketUrl = udata && udata.profile && udata.profile.apps && udata.profile.apps[appUrl]
    if (bucketUrl) {
      // console.log(`${bucketUrl}`)
      userSession.deleteFile(`graph.json`).then(() => {})
      userSession.putFile(`graph.json`,
        JSON.stringify(graph), { encrypt: false }).then((data) => {
        console.log('Saved ' + data)
      })
    } else {
      console.log('Cannot save graph on gaia hub')
    }
  }
}

// window.blockStackTools = BlockStackTools
// window.userSession = userSession
