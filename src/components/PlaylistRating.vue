<template>

  <div v-if="list != null">
    <!--    <button @click="updateRatingInSheet">update</button>-->
    <!--    <button @click="getRaterInfos">raters</button>-->
    <div style="display: flex; justify-content: stretch; align-items: center">
      <div @click="$router.push({ name: 'HelloWorld'})">
        <button class="button">zurück</button>
      </div>
      <div style="flex-grow: 1"><h1>Playlist-Bewertung</h1></div>
      <div/>
    </div>
    <hr>
    <div style="padding: 16px;display:flex; justify-content: center;align-items: center">
      <div><img
        :src="list.images[0].url"
        height="100"></div>
      <div><h2>{{ list.name }}</h2></div>
    </div>
    <table
      id="playlistRating"
      align="center">
      <tr>
        <th/>
        <th @click="columnVisibility.title = !columnVisibility.title"> <span v-if="columnVisibility.title">Songtitel</span><span v-else>&uArr;</span></th>
        <th @click="columnVisibility.interprets = !columnVisibility.interprets"> <span v-if="columnVisibility.interprets" >Interpreten</span><span v-else>&uArr;</span></th>
        <th v-for="rater in Array.from(raterIds)">{{ raterInfos ? raterInfos.find(e => e.id === rater).display_name : rater }}</th>
        <th style="color:#42b983">&Oslash;</th>
      </tr>
      <tr
        v-for="item in list.tracks.items.slice(0,200)"
        class="trackRow"
      >
        <td>
          <span v-if="!detail.find(i => i === item.track.id)">
            <i>Loading...</i>
          </span>

          <iframe
            :src="`https://open.spotify.com/embed/track/${item.track.id}`"
            :style="{visibility: detail.find(i => i === item.track.id) ? 'visible' : 'hidden'}"
            frameborder="0"
            height="75"
            allowtransparency="true"
            allow="encrypted-media"
            @load="putDetail(item.track.id)"/>
        </td>
        <td><span v-if="columnVisibility.title">{{ item.track.name }}</span>
        </td>
        <td>
          <span
            v-for="(artist,index) in item.track.artists"
            v-if="columnVisibility.interprets">{{ artist.name }}
            <span v-if="item.track.artists.length > 1 && index < item.track.artists.length - 1">, </span>
          </span>
        </td>
        <td
          v-for="rater of Array.from(raterIds)"
          class="ratingRow">
          <span v-if="ratings[item.track.id] && ratings[item.track.id].hasOwnProperty(rater)"> {{ ratings[item.track.id][rater] }} </span>
          <input
            v-else
            type="number"
            min="0"
            max="100"
            placeholder="-"
            @blur="addRating($event, item.track.id,rater)">
        </td>
        <td style="color:#42b983" v-if="ratings[item.track.id]">{{ (Object.values(ratings[item.track.id]).reduce((curr,acc) => {return curr + acc},0)  /  Object.values(ratings[item.track.id]).length).toFixed(1)|| '-'}}</td>
      </tr>

    </table>
  </div>
</template>
<script>
const axios = require('axios')
const Vue = require('Vue')
const sheets = require('../sheetsApi/sheetsBrowser.js')

export default {
  name: 'PlaylistRating',
  props: {
    id: {
      required: true,
      type: String
    },
    token: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      list: {name: '', tracks: []},
      fetchedItems: [],
      playlistLogo: null,
      detail: [],
      columnVisibility: {
        interprets: true,
        title: true
      },
      ratings: {
        '4TmtllBP0Iw4LrKmW47u9n': {
          'steaker127': 75
        }
      },
      raterIds: [],
      raterInfos: []
    }
  },
  beforeMount () {
    this.fetchList(this.id, this.token)
  },
  methods: {
    fetchList: async function (id, token) {
      const self = this

      try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`,
          {
            'headers': {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`

            }
          })

        self.getAllContributors(response.data)
        self.list = response.data
      } catch (e) {
        console.error(e)
        self.list = {name: '', tracks: []}
      }
    },
    putDetail (id) {
      console.log('ready', id)
      this.detail.push(id)
    },
    addRating (e, trackId, raterId) {
      if (!this.ratings.hasOwnProperty(trackId)) {
        this.$set(this.ratings, trackId, {})
      }
      this.$set(this.ratings[trackId], raterId, parseInt(e.target.value))
    },
    getAllContributors (list) {
      if (list.tracks.items) {
        this.raterIds = new Set(list.tracks.items.map(e => e.added_by.id))
        this.getRaterInfos()
      }
    },
    async getRaterInfos () {
      const self = this
      this.raterIds.forEach(async rater => {
        try {
          const response = await axios.get(`https://api.spotify.com/v1/users/${rater}`,
            {
              'headers': {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${self.token}`

              }
            })

          self.raterInfos.push(response.data)
        } catch (e) {
          console.error(e)
        }
      })
    },
    updateRatingInSheet () {
      try {
        console.log(handleClientLoad())
      } catch (e) {
        console.error(e)
      }
    }
  }
}

// Client ID and API key from the Developer Console
var CLIENT_ID = '391770748037-ha73om29n0khpnjj48aan93lainig8bb.apps.googleusercontent.com'
var API_KEY = 'AIzaSyDF0vRxBMIWq43LOT6CsI1wIMLPtzT4VOA'

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4']

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly'

var authorizeButton = document.getElementById('authorize_button')
var signoutButton = document.getElementById('signout_button')

/**
 *  On load, called to load the auth2 library and API client library.
 */
var handleClientLoad = function () {
  gapi.load('client', {
    callback: function () {
      // Handle gapi.client initialization.
      initClient()
    },
    onerror: function () {
      // Handle loading error.
      alert('gapi.client failed to load!')
    },
    timeout: 5000, // 5 seconds.
    ontimeout: function () {
      // Handle timeout.
      alert('gapi.client could not load in a timely manner!')
    }
  })
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient () {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
    authorizeButton.onclick = handleAuthClick
    signoutButton.onclick = handleSignoutClick
  }, function (error) {
    alert(JSON.stringify(error, null, 2))
  })
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus (isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none'
    signoutButton.style.display = 'block'
    listMajors()
  } else {
    authorizeButton.style.display = 'block'
    signoutButton.style.display = 'none'
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick (event) {
  gapi.auth2.getAuthInstance().signIn()
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick (event) {
  gapi.auth2.getAuthInstance().signOut()
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre (message) {
  var pre = document.getElementById('content')
  var textContent = document.createTextNode(message + '\n')
  pre.appendChild(textContent)
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors () {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Songs!A2:E'
  }).then(function (response) {
    var range = response.result
    if (range.values.length > 0) {
      appendPre('Name, Major:')
      for (let i = 0; i < range.values.length; i++) {
        var row = range.values[i]
        // Print columns A and E, which correspond to indices 0 and 4.
        appendPre(row[0] + ', ' + row[4])
      }
    } else {
      appendPre('No data found.')
    }
  }, function (response) {
    appendPre('Error: ' + response.result.error.message)
  })
}

</script>

<style scoped>
.trackRow{
  padding: 8px;
  text-align: left;
}

.ratingRow{
  text-align: center;
}

  #playlistRating> td {
      padding: 8px
  }

  .button{
    background: transparent;
    border: 1px solid #42b983;
    color: #42b983;
    padding: 8px 6px;
    border-radius: 3em
  }

</style>
