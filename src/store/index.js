import Vue from 'vue';

const state = Vue.observable({
  doc: null,
});

export const getters = {
  doc: () => state.doc,
  lists: () =>
    !state.doc
      ? []
      : state.doc.getRootObject()
      ? state.doc.getRootObject().lists
      : [],
};

export const mutations = {
  setDoc: (doc) => {
    state.doc = doc;
    state.lists = doc.getRootObject().lists;
  },
};

export default {
  getters,
  mutations,
};
