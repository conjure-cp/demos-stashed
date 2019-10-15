import Vue from 'vue';
import Vuex from 'vuex';
import * as auth from './modules/auth';
import * as map from './modules/map';
import * as users from './modules/users';
Vue.use(Vuex)

export interface RootState {

}

const store = new Vuex.Store({
  modules: {
    auth,
    users,
    map
  },
  strict: process.env.NODE_ENV !== 'production',
})

export default store
