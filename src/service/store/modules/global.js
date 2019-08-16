import { setLocalStore, getLocalStore } from "Utils/storage";

let language =
  getLocalStore("local_language") ||
  (navigator.browserLanguage ? navigator.browserLanguage : navigator.language);
let language_bak = getLocalStore("local_language");
language === "en-US" && (language = "en");
language === "zh-cn" && (language = "zh-CN");
if (["en", "zh-CN"].indexOf(language) === -1) {
  // 浏览器语言不在列表中
  language = "en";
}
if (language_bak === null) {
  setLocalStore("local_language", language);
}

const global = {
  state: {
    language // 当前UI语言
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language;
    }
  },
  actions: {
    SetLanguage({ commit }, language) {
      commit("SET_LANGUAGE", language);
      setLocalStore("local_language", language);
    }
  }
};

export default global;
