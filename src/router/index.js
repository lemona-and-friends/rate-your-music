import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import PlaylistRating from '@/components/PlaylistRating'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/list/:id/rate/:token',
      name: 'PlaylistRating',
      component: PlaylistRating,
      props: true
    }
  ]
})
