import Vue from 'vue';
import Vuex from 'vuex';
import router from '../routes';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userLogged: null
    },
    mutations: {
        setUserLogged(state, data) {
            state.userLogged = data;
        }
    },
    actions: {
        saveUserLogged({ commit }, data) {
            commit('setUserLogged', data);
            localStorage.setItem("casino-devfko", JSON.stringify(data));
        },
        getUserLogged({ commit }) {
            let data = localStorage.getItem("casino-devfko");
            console.log('data recibida ', JSON.parse(data));
            if (data) {
                commit('setUserLogged', JSON.parse(data));
                router.push({ path: '/game' });
            } else {
                router.push({ path: '/user' });
            }
        },
    },
    getters: {
        userLogged: state => {
            return state.userLogged;
        }
    }
});