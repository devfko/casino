import Vue from 'vue';
import Vuex from 'vuex';
import router from '../routes';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userLogged: null,
        isPlaying: false
    },
    mutations: {
        setUserLogged(state, data) {
            state.userLogged = data;
        },
        setPlaying(state, data) {
            state.isPlaying = data;
        }
    },
    actions: {
        saveUserLogged({ commit }, data) {
            commit('setUserLogged', data);
            localStorage.setItem("casino-devfko", JSON.stringify(data));
        },
        getUserLogged({ commit }) {
            let data = localStorage.getItem("casino-devfko");

            if (data) {
                commit('setUserLogged', JSON.parse(data));
                router.push({ path: '/game' });
            } else {
                router.push({ path: '/user' });
            }
        },
        logout({ commit }) {
            commit('setUserLogged', null);
            localStorage.removeItem("casino-devfko");
            router.push({ path: '/' });
        },
        setPlaying({ commit }, data) {
            commit('setPlaying', data);
        }
    },
    getters: {
        userLogged: state => {
            return state.userLogged;
        }
    }
});