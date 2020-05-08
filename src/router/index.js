import Vue from 'vue'
import Router from 'vue-router'
// import Dashboard from '@/components/Dashboard'
// import Splitboard from '@/components/Splitboard'
// import TreeViewer from '@/components/TreeViewer'
// import D3Viewer from '@/components/D3Viewer'
// import DbViewer from '@/components/DbViewer'
// import Settings from '@/components/Settings'
// import AccordionViewer from '@/components/AccordionViewer'
// import NestedViewer from '@/components/NestedViewer'
// import ZircleViewer from '@/components/ZircleViewer'

// Fix DuplicatedNavigation due to promise
// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location) {
//  return originalPush.call(this, location).catch(err => err)
// }

const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '@/components/Dashboard')
const Splitboard = () => import(/* webpackChunkName: "splitboard" */ '@/components/Splitboard')

Vue.use(Router)

let baseMode = 'iznow'
let startPage = '/1'
if (window.lconfig.coverPage) {
  startPage = '/2'
}

// TODO: add not found link
export default new Router({
  mode: 'history',
  routes: [
    // {
    //   // Outline
    //   path: '/t/:id',
    //   component: Dashboard,
    //   children: [{
    //     name: 'Node',
    //     path: '',
    //     component: TreeViewer
    //   }]
    // },
    // {
    //   // Accordeon
    //   path: '/a/:id',
    //   component: Dashboard,
    //   children: [{
    //     name: 'ANode',
    //     path: '',
    //     component: AccordionViewer
    //   }]
    // },
    // {
    //   // Nested
    //   path: '/n/:id',
    //   name: 'Nested',
    //   component: Dashboard,
    //   children: [{
    //     name: 'NNode',
    //     path: '',
    //     component: NestedViewer
    //   }]
    // },
    // {
    //   // Graphic Tree
    //   path: '/d/:id',
    //   component: Dashboard,
    //   children: [{
    //     name: 'DNode',
    //     path: '',
    //     component: D3Viewer
    //   }]
    // },
    // {
    //   // Dendrogram
    //   path: '/z/:id',
    //   name: 'Dendogram',
    //   component: Dashboard,
    //   children: [{
    //     name: 'ZNode',
    //     path: '',
    //     component: D3Viewer
    //   }]
    // },
    // },
    // {
    //   path: '/r/:id',
    //   name: 'Dendogram',
    //   component: Dashboard,
    //   children: [{
    //     name: 'RNode',
    //     path: '',
    //     component: D3Viewer
    //   }]
    // },
    /*
    {
      path: '/w/:id',
      component: Dashboard,
      children: [{
        name: 'WNode',
        path: '',
        component: DbViewer
      }]
    },
    */

    {
      path: '/',
      component: Dashboard
    },
    {
      path: '/iznow/:id',
      component: Dashboard,
      children: [{
        name: 'ONode',
        path: '',
        component: Splitboard
        // component: () => lazyLoadView(import(/* webpackChunkName: "Splitboard" */'@/components/Splitboard'))
      }]
    },

    // {
    //   path: '/settings',
    //   component: Settings
    // },
    {
      path: '*',
      redirect: '/' + baseMode + startPage
    }
  ]
})

// Lazy-loads view components, but with better UX. A loading view
// will be used if the component takes a while to load, falling
// back to a timeout view in case the page fails to load. You can
// use this component to lazy-load a route with:
//
// component: () => lazyLoadView(import('@views/my-view'))
//
// NOTE: Components loaded with this strategy DO NOT have access
// to in-component guards, such as beforeRouteEnter,
// beforeRouteUpdate, and beforeRouteLeave. You must either use
// route-level guards instead or lazy-load the component directly:
//
// component: () => import('@views/my-view')
//

// function lazyLoadView (AsyncView) {
//   const AsyncHandler = () => ({
//     component: AsyncView,
//     // A component to use while the component is loading.
//     loading: import('@components/base/BaseLoading'),
//     // A fallback component in case the timeout is exceeded
//     // when loading the component.
//     error: import('@components/base/BaseTimeout'),
//     // Delay before showing the loading component.
//     // Default: 200 (milliseconds).
//     delay: 70,
//     // Time before giving up trying to load the component.
//     // Default: Infinity (milliseconds).
//     timeout: 15000
//   })

//   return Promise.resolve({
//     functional: true,
//     render (h, { data, children }) {
//       // Transparently pass any props or children
//       // to the view component.
//       return h(AsyncHandler, data, children)
//     }
//   })
// }
