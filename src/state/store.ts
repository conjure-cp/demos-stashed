import Vue from 'vue';
import Vuex from 'vuex';
import * as auth from './modules/auth';
import * as users from './modules/users';
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    users,
  },
  strict: process.env.NODE_ENV !== 'production',
})

export default store
