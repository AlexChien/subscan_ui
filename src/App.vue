<template>
  <div id="app">
    <navbar />
    <div class="main">
      <router-view />
    </div>
    <footer-bar class="footer-bar"></footer-bar>
  </div>
</template>

<script>
import Navbar from "Views/Layout/Navbar";
import FooterBar from "Views/Layout/FooterBar";
const queryString = require("query-string");

export default {
  name: "App",
  components: {
    navbar: Navbar,
    footerBar: FooterBar
  },
  created() {
    // 接受路由中携带语言参数lang
    const parsedObj = queryString.parse(location.search);
    let language = parsedObj["lang"];
    if (language) {
      if (["en", "zh-CN"].indexOf(language) === -1) {
        // 浏览器语言不在列表中
        language = "en";
      }
      this.$store.dispatch("SetLanguage", language);
      this.$i18n.locale = language;
    }
  },
  mounted() {
    GLOBAL.vbus.$on("CHANGE_LANGUAGE", language => {
      this.$i18n.locale = language;
    });
  },
  methods: {}
};
</script>

<style lang="scss">
@import "./assets/style/index.scss";
#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .nav-bar {
    flex: none;
  }
  .footer-bar {
    flex: none;
  }
  .main {
    flex: auto;
    background: #f3f4f6;
  }
  .subscan-content {
    padding: 20px 0;
  }
  .subscan-card {
    background: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    border: 1px solid rgba(231, 234, 243, 1);
  }
}
</style>
