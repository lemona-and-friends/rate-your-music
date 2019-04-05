<template>
  <div id="app">
    <img :src="playlistLogo">
<!--    <table-->
<!--      style="text-align: left; width:100%"-->
<!--      border="1">-->
<!--      <tr>-->
<!--        <th>Songtitel</th>-->
<!--        <th>Rating 1</th>-->
<!--        <th>Rating 2</th>-->
<!--        <th>Rating 3</th>-->
<!--      </tr>-->
<!--      <tr v-for="item in fetchedItems">-->
<!--        <td>{{ item.track.name }}</td>-->
<!--        <td/>-->
<!--        <td/>-->
<!--        <td/>-->
<!--      </tr>-->
<!--    </table>-->

    <router-view/>
  </div>
</template>

<script>
const debug = require('debug')('App')
const axios = require('axios')

export default {
  name: 'App',
  data () {
    return {
      fetchedItems: [],
      playlistLogo: null
    }
  },
  mounted () {
    debug('The app-view has mounted')
    const self = this
    // axios.get('https://api.spotify.com/v1/playlists/0kfVAJv5Crqoi58f9Zib4p',
    //   {
    //     'headers': {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer BQCetpRujqWOAKyyCm9d_raI26YOyJa2TU7vd-gCUFnTYijVth8vMrlucmwm2wA1wLdyf7ZqbATxaImTS2_jTPTUBXX1XaOOoH9DenugNXXhUjT7SRXyg_1zgyHZFWQxB57pXWTVYAhbdoSC-aWDhHD3asDrJvo-wRfW'
    //
    //     }
    //   })
    //   .then(function (response) {
    //     self.fetchedItems = response.data.tracks.items
    //     self.playlistLogo = response.data.images[0].url
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fefefe;
  margin-top: 60px;
  background: black;
}
</style>
