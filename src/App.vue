<template>
<body v-bind:class="{ lock: menuShow }">
  <div class="wrapper" id="app">
    <header class="header">
      <div class="container">
        <div class="top-nav">
          <div class="logo">
            <img src="img/icons/icons.svg#logo" alt="logo" />
          </div>
          <div class="menu" v-bind:class="{ active: menuShow }">
            <ul>
              <li><router-link to="/" class="menu__btn">Home</router-link></li>
              <li><router-link to="/task" class="menu__btn">Add task</router-link></li>
              <li><router-link to="/group" class="menu__btn">Edit group</router-link></li>
            </ul>
          </div>
          <div class="toggle-service">
            <button class="toggle-service__btn" v-on:click="showService()">
              <svg>
                <use xlink:href="img/icons/icons.svg#filter" />
              </svg>
            </button>
          </div>
          <div class="toggle-menu" v-on:click="showMenu()">
            <span v-bind:class="{ active: menuShow }" ></span>
          </div>
        </div>
      </div>
    </header>
    <section>
      <div class="container">
        <div class="bread">
          <span>{{title}}</span>
        </div>
      </div>
    </section>
    <section>
      <div class="error" v-bind:class="{ active: error }">
        <div class="error__title">{{error}}</div>
      </div>
    </section>
    <section>
      <div class="success" v-bind:class="{ active: success }">
        <div class="success__title">{{success}}</div>
      </div>
    </section>
    <section>
      <div class="loading" v-bind:class="{ active: loading }">
        <svg>
          <use xlink:href="img/icons/icons.svg#autorenew" />
        </svg>
        <span>Как будто загружаю )))</span>
      </div>
    </section>
    <router-view/>
  </div>
</body>
</template>
<script>
export default {
  name: 'ToDo',
  data: function () {
    return {
      
    }
  },
  computed: {
    loading () {
      return this.$store.getters.LOADING
    },
    success () {
      return this.$store.getters.SUCCESS
    },
    error () {
      return this.$store.getters.ERROR
    },
    title () {
      return this.$store.getters.TITLE
    },
    menuShow () {
      return this.$store.getters.MENU_SHOW
    }
  },
  methods: {
    showMenu: function () {
      this.$store.commit('SET_MENU_SHOW');
    },
    showService: function () {
      this.$store.commit('SET_SERVICE_SHOW');
    }
  }
}
</script>
<style>
  @import '../public/css/style.min.css';
</style>
