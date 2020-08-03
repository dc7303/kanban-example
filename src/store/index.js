import Vue from 'vue';

const state = Vue.observable({
  lists: [],
});

export const getters = {
  lists: () => state.lists,
}

export const mutations = {
  setLists: (v) => state.lists = v,
}

export default {
  getters,
  mutations,
}