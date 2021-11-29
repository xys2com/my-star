import Vue from "vue";
import Vuex from "vuex";
const pre_top_color = "#040426";
const pre_bottom_color = "#464c86";
Vue.use(Vuex);
const state = {
  backgroundTopColor: pre_top_color,
  backgroundBottomColor: pre_bottom_color,
};
const backgroundTopColor = (state) => {
  state.backgroundTopColor =
    window.localStorage.getItem("backgroundTopColor") || pre_top_color;
  return state.backgroundTopColor;
};
const backgroundBottomColor = (state) => {
  state.backgroundBottomColor =
    window.localStorage.getItem("backgroundBottomColor") || pre_bottom_color;
  return state.backgroundBottomColor;
};
const getters = {
  backgroundTopColor,
  backgroundBottomColor,
};
const SETTOPCOLOR = (state, color) => {
  const colorx16 = color || pre_top_color;
  state.backgroundTopColor = colorx16;
  window.localStorage.setItem("backgroundTopColor", colorx16);
};
const SETBTTOMCOLOR = (state, color) => {
  const colorx16 = color || pre_bottom_color;
  state.backgroundBottomColor = colorx16;
  window.localStorage.setItem("backgroundBottomColor", colorx16);
};
const mutations = {
  SETTOPCOLOR,
  SETBTTOMCOLOR,
};
const setTopColor = ({ commit }, color) => {
  commit("SETTOPCOLOR", color);
};
const setBottomColor = ({ commit }, color) => {
  commit("SETBTTOMCOLOR", color);
};
const actions = {
  setTopColor,
  setBottomColor,
};
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: {},
});
