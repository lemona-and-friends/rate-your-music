<template>
  <div class="hello">
    <!--    <h1>{{ msg }}</h1>-->
    <div v-if="userInfos">
      <img
        :src="userInfos.images[0].url"
        height="80">
      <h2>{{ userInfos.display_name }}</h2>
    </div>
    <!--    <a @click="authorize">Authorize</a>-->
    <br>

<!--    <button @click="getPlaylists">retrieve collab playlists</button>-->
    <table align="center">
      <tr v-for="list in collabPlaylists">
        <td>
          <img
            :src="list.images[0].url"
            height="50">
        </td>
        <td>
          <a @click="goto(list.id)">{{ list.name }}</a>
        </td>
        <td>
          <a @click="goto(list.id)">{{ list.tracks.total }}</a>
        </td>
      </tr>
    </table>

  </div>
</template>

<script>
const axios = require('axios')
// const fetch = require('fetch')
// debug.enable('*')

export default {

  name: 'HelloWorld',
  data () {
    return {
      msg: 'ProductRow Grid Demo',
      inputText: 50,
      clientId: '5721153b9a2e4a249f5a5c1acff729d7',
      redirectURI: 'localhost:8080',
      token: 'BQAYWAKBuO0yF8KMKG1bO1Q0qwZiajgigglHgvSlp4SixOF-JZWMhhIeYSoIVb3EdvqKYaoD2KPuqSgWKdYvjmz6iui3bJspEPrkimbAARnd9KeVt-NDIBzgMrWXpwBeLdGube7DfFgOueHL6LUHzkxwCnH32Ur7UrvM7n54TlCoOSD_uIEiYIxra9JxJmk',
      playlistId: '0kfVAJv5Crqoi58f9Zib4p?',
      userInfos: null,
      collabPlaylists: [],
      loggedInUser: 'musicmyaeroplane'
    }
  },
  mounted () {
    document.querySelectorAll('div[name="wrapper_0"] label').forEach(elem => {
      elem.style.display = 'block'
    })
    this.getPlaylists()

  },
  beforeMount(){
    this.getUserInfos(this.loggedInUser)
  },
  methods: {
    showLabel (index) {
      return true
    },
    goto (playlistId) {
      this.$router.push({ name: 'PlaylistRating', params: { id: playlistId, token: this.token }})
    },
    authorize () {
      // axios.get(`https://accounts.spotify.com/authorize?client_id=${this.clientId}&redirect_uri=http:%2F%2F${this.redirectURI}%2Fcallback&scope=user-read-private%20user-read-email&response_type=json&state=123`,
      //   {
      //     'headers': {
      //       'Access-Control-Allow-Origin': '*',
      //     }
      //   }).then(r => {
      //   console.log(r)
      // }).catch(e => {
      //   console.error(e)
      // })
      // fetch(`https://accounts.spotify.com/authorize?client_id=${this.clientId}&redirect_uri=http:%2F%2F${this.redirectURI}%2Fcallback&scope=user-read-private%20user-read-email&response_type=json&state=123`,
      //   {
      //     'headers': {
      //       'Access-Control-Allow-Origin': '*',
      //     }
      //   }).then(r => {
      //   console.log(r)
      // }).catch(e => {
      //   console.error(e)
      // })
    },
    async getPlaylists () {
      const self = this

      try {
        const response = await axios.get(`https://api.spotify.com/v1/users/${self.loggedInUser}/playlists`,
          {
            'headers': {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${self.token}`

            }
          })

        self.collabPlaylists = response.data.items.filter(l => l.collaborative === true)
      } catch (e) {
        console.error(e)
        self.collabPlaylists = []
      }
    },
    async getUserInfos (id) {
      console.log('ID', id)
      const self = this

      try {
        const response = await axios.get(`https://api.spotify.com/v1/users/${id}`,
          {
            'headers': {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${self.token}`

            }
          })

        self.userInfos = response.data
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.hello{
  padding: 24px;
}

#wrapper{
  display: grid;
  grid-template-columns: repeat(26, minmax(30px,1fr));
  margin: 32px 0;
  border-left: 1px solid grey;
  border-right: 1px solid grey;

}

.elem{
  padding: 8px;
  text-align: center;
  /*border: 1px solid grey;*/
}

.elem-2{
  grid-column: span 2
}
.elem-3{
  grid-column: span 3
}
.elem-4{
  grid-column: span 4
}
.elem-6{
  grid-column: span 6
}
.elem-1{
  grid-column: span 1
}

select, input{
  width: 100%
}

.elem-6 input:nth-of-type(1){
  width: 30%;
  /*border: 1px solid blue;*/
}

.elem-6 input:nth-of-type(2){
  width: 65%;
  /*border: 1px solid green;*/
}

label{
  display:none
}

#buttons{
  align-self: flex-end;
}

@media(max-width:1100px){
  #wrapper{
    grid-template-columns: repeat(13, minmax(30px,1fr));
  }

  #options{
    grid-row: 1;
    grid-column: 7 / span 3;
  }

  #buttons{
    grid-row: 1;
    grid-column: 12;
    align-self: center;
  }

  .elem-6 input:nth-of-type(1){
    width: 20%;
  }

  .elem-6 input:nth-of-type(2){
    width: 55%;
  }

  #da{
    grid-column: 10
  }

  label{
    font-size: 10pt;
    float:left;
    padding: 4px;
    margin-right: 4px;
    display:block;
  }

  select, input{
    width: 40%;
    float:left;
  }
}

  table td{
    padding: 16px 8px
  }

</style>
