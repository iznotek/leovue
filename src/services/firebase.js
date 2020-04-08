import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import { firebaseConfig } from '../config'
export const firebaseApp = firebase.initializeApp(firebaseConfig)
export const firebaseAuth = firebaseApp.auth()
export const firebaseDb = firebaseApp.database()

export const FireBaseTools = {
  getProvider: (provider) => {
    switch (provider) {
      case 'email':
        return new firebase.auth.EmailAuthProvider()
      case 'facebook':
        return new firebase.auth.FacebookAuthProvider()
      case 'github':
        return new firebase.auth.GithubAuthProvider()
      case 'google':
        return new firebase.auth.GoogleAuthProvider()
      case 'twitter':
        return new firebase.auth.TwitterAuthProvider()
      default:
        throw new Error('Provider is not supported!!!')
    }
  },
  loginWithProvider: (p) => {
    const provider = FireBaseTools.getProvider(p)
    return firebaseAuth.signInWithPopup(provider).then(firebaseAuth.currentUser).catch(error => ({
      errorCode: error.code,
      errorMessage: error.message
    }))
  },
  registerUser: user => firebaseAuth.createUserWithEmailAndPassword(user.email, user.password)
    .then(userInfo => userInfo)
    .catch(error => ({
      errorCode: error.code,
      errorMessage: error.message
    })),
  logoutUser: () => firebaseAuth.signOut().then(() => ({
    success: 1,
    message: 'logout'
  })),
  fetchUser: () => new Promise((resolve, reject) => {
    const unsub = firebaseAuth.onAuthStateChanged((user) => {
      unsub()
      resolve(user)
    }, (error) => {
      reject(error)
    })
  }),
  loginUser: user => firebaseAuth.signInWithEmailAndPassword(user.email, user.password)
    .then(userInfo => userInfo)
    .catch(error => ({
      errorCode: error.code,
      errorMessage: error.message
    })),
  updateUserProfile: u => firebaseAuth.currentUser.updateProfile(u).then(() => firebaseAuth.currentUser, error => ({
    errorCode: error.code,
    errorMessage: error.message
  })),
  resetPasswordEmail: email => firebaseAuth.sendPasswordResetEmail(email).then(() => ({
    message: 'Email sent'
  }), error => ({
    errorCode: error.code,
    errorMessage: error.message
  })),
  changePassword: newPassword => firebaseAuth.currentUser.updatePassword(newPassword).then(user => user, error => ({
    errorCode: error.code,
    errorMessage: error.message
  })),
  sendEmailVerification: () => firebaseAuth.currentUser.sendEmailVerification().then(() => ({
    message: 'Email sent'
  }), error => ({
    errorCode: error.code,
    errorMessage: error.message
  })),
  getDatabaseReference: path => firebaseDb.ref(path),
  getMyProjects () {
    console.log('Getting my projects...')
    // const uid = localStorage.getItem('uid')
    const path = '/Project/sample/'
    firebaseDb.ref(path).once('value').then((snapshot) => {
      var Data = {}
      if (snapshot.val()) {
        Data = snapshot.val()
      }
      alert(JSON.stringify(Data))
    }).catch((e) => alert(e.toString(0)))
  }
}

export default FireBaseTools
