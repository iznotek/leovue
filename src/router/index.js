import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Splitboard from '@/components/Splitboard'
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
      path: '/iznow/:id',
      component: Dashboard,
      children: [{
        name: 'ONode',
        path: '',
        component: Splitboard
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
