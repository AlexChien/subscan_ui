<template>
  <div class="footer-bar">
    <div class="container space-between align-items-center">
      <div class="partner align-items-center" :class="{'is-home-page': isHomePage}">
        <span class="partner-title">{{$t('partner')}}</span>
        <a
          class="partner-img-wrapper"
          href="http://www.mathwallet.org/"
          target="_blank"
          rel="noopener"
        >
          <img src="./../../assets/images/partner-1.png" />
        </a>
        <a class="partner-img-wrapper" href="https://cobo.com/" target="_blank" rel="noopener">
          <img src="./../../assets/images/partner-2.png" />
        </a>
        <a
          class="partner-img-wrapper"
          href="https://trustwallet.com/"
          target="_blank"
          rel="noopener"
        >
          <img src="./../../assets/images/partner-3.png" />
        </a>
        <a class="partner-img-wrapper" href="https://www.bepal.pro/" target="_blank" rel="noopener">
          <img src="./../../assets/images/partner-4.png" />
        </a>
        <a
          class="partner-img-wrapper"
          href="https://polkawallet.io/"
          target="_blank"
          rel="noopener"
        >
          <img src="./../../assets/images/partner-5.png" />
        </a>
        <a class="partner-img-wrapper" href="https://cybex.io/" target="_blank" rel="noopener">
          <img src="./../../assets/images/partner-6.png" />
        </a>
        <a
          class="partner-img-wrapper"
          href="https://www.coinex.com/"
          target="_blank"
          rel="noopener"
        >
          <img src="./../../assets/images/partner-7.png" />
        </a>
      </div>
      <div class="info-container align-items-center">
        <div class="copyright">{{$t('copy_right', { year: new Date().getFullYear()})}}</div>
        <div class="icon-group">
          <el-dropdown class="donate-dropdown" trigger="click">
            <div class="donate">
              <icon-svg icon-class="donate" class="icon" />
            </div>
            <el-dropdown-menu class="donate-menu" slot="dropdown">
              <el-dropdown-item class="menu-item">
                <div class="donate-menu-item">
                  <div class="donate-content">
                    <div class="donate-title">{{$t('donate')}}:</div>
                    <a :href="donateUrl" class="donate-address">{{donateAddress}}</a>
                  </div>
                  <div
                    class="copy-btn align-items-center"
                    v-clipboard:copy="donateAddress"
                    v-clipboard:success="clipboardSuccess"
                  >
                    <icon-svg class="iconfont" icon-class="copy" />
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="contact">
            <a target="_blank" rel="noopener" href="mailto:hello@subscan.io">
              <div class="contact-item mail">
                <icon-svg icon-class="mail" class="icon" />
              </div>
            </a>
          </div>
          <el-dropdown class="language-dropdown" trigger="click" @command="changeLanguage">
            <div class="language">
              <icon-svg icon-class="earth" class="icon" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="menu-item" command="zh-CN">简体中文</el-dropdown-item>
              <el-dropdown-item class="menu-item" command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="container mobile space-between align-items-center">
      <div class="partner" :class="{'is-home-page': isHomePage}">
        <div class="partner-title">{{$t('partner')}}:</div>
        <div class="partner-img-wrapper">
          <img src="./../../assets/images/partner-mobile.png" />
        </div>
      </div>
      <div class="split-line" :class="{'is-home-page': isHomePage}"></div>
      <div class="copyright">{{$t('copy_right', { year: new Date().getFullYear()})}}</div>
      <el-dropdown class="donate-dropdown" trigger="click">
        <div class="donate">
          <icon-svg icon-class="donate" class="icon" />
        </div>
        <el-dropdown-menu class="donate-menu" slot="dropdown">
          <el-dropdown-item class="menu-item">
            <div class="donate-menu-item">
              <div class="donate-content">
                <div class="donate-title">{{$t('donate')}}:</div>
                <a :href="donateUrl" class="donate-address">{{donateAddress}}</a>
              </div>
              <div
                class="copy-btn align-items-center"
                v-clipboard:copy="donateAddress"
                v-clipboard:success="clipboardSuccess"
              >
                <icon-svg class="iconfont" icon-class="copy" />
              </div>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="contact">
        <a target="_blank" rel="noopener" href="mailto:hello@subscan.io">
          <div class="contact-item mail">
            <icon-svg icon-class="mail" class="icon" />
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import clipboard from "Directives/clipboard";
export default {
  name: "FooterBar",
  computed: {
    ...mapState({
      sourceSelected: state => state.global.sourceSelected
    }),
    donateAddress() {
      let source = this.$const[`SYMBOL/${this.sourceSelected}`];
      let result = "";
      if (source) {
        result = source["donate"]["address"];
      }
      return result;
    },
    donateUrl() {
      let source = this.$const[`SYMBOL/${this.sourceSelected}`];
      let result = "";
      if (source) {
        result =
          source["domain"]["value"] + "/account/" + source["donate"]["address"];
      }
      return result;
    },
    isHomePage() {
      let name = this.$route.name;
      let result = false;
      switch (name) {
        case "root":
        case "404":
        case "noData":
          result = true;
          break;
        default:
          break;
      }
      return result;
    }
  },
  directives: {
    clipboard
  },
  methods: {
    changeLanguage(language) {
      GLOBAL.vbus.$emit("CHANGE_LANGUAGE", language);
      this.$store.dispatch("SetLanguage", language);
    },
    clipboardSuccess() {
      this.$message({
        type: "success",
        message: this.$t("copy_success")
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.footer-bar {
  color: var(--main-color);
  background: #302b3c;
  .container {
    flex-direction: column;
    .partner {
      width: 100%;
      color: #fff;
      font-size: 14px;
      height: 53px;
      border-bottom: 1px solid rgba(216, 216, 216, 0.2);
      .partner-title {
        margin-right: 35px;
      }
      .partner-img-wrapper {
        height: 20px;
        margin-right: 22px;
        img {
          height: 100%;
        }
      }
      &:not(.is-home-page) {
        display: none;
      }
    }
    .info-container {
      width: 100%;
      height: 50px;
      display: flex;
    }
    .copyright {
      color: #fff;
      font-size: 14px;
    }
    .icon-group {
      display: flex;
      flex: 1 1 auto;
      justify-content: flex-end;
    }
    .poweredby {
      color: #7b70ae;
      font-size: 14px;
      font-weight: bold;
      margin-left: 10px;
    }
    .donate {
      cursor: pointer;
      margin-right: 10px;
      .icon {
        font-size: 26px;
      }
    }
    .contact {
      display: flex;
      margin-right: 10px;
      .contact-item {
        cursor: pointer;
        .icon {
          font-size: 26px;
        }
      }
    }
    .language {
      cursor: pointer;
      .icon {
        font-size: 26px;
      }
    }
    &.mobile {
      display: none;
    }
  }
  @media screen and (max-width: $screen-xs) {
    .container {
      height: inherit;
      flex-direction: column;
      background-color: #302b3c;
      align-items: initial;
      position: relative;
      display: none;
      &.mobile {
        display: flex;
      }
      .copyright {
        color: #7b70ae;
        line-height: 40px;
        padding-left: 10px;
      }
      .contact-item, .donate {
        font-size: 0;
      }
      .partner {
        border: none;
        padding: 20px 30px 0 10px;
        margin: 0;
        display: flex;
        height: auto;
        .partner-title {
          margin: 0;
          padding-right: 20px;
          flex: 0 0 auto;
          font-size: 12px;
        }
        .partner-img-wrapper {
          flex: 1 1 auto;
          height: auto;
          margin: 0;
          img {
            width: 100%;
            height: auto;
          }
        }
      }
      .split-line {
        height: 1px;
        background-color: rgba(216, 216, 216, 0.2);
        margin: 0 18px;
        &:not(.is-home-page) {
          display: none;
        }
      }
      .contact {
        position: absolute;
        right: 10px;
        bottom: 7px;
      }
      .donate-dropdown {
        position: absolute;
        right: 42px;
        bottom: 7px;
      }
      .language-dropdown {
        display: none;
      }
    }
  }
}
.el-dropdown-menu {
  padding: 16px 0;
  .menu-item {
    display: block;
    width: 160px;
    text-align: center;
    padding: 10px 20px;
    margin: 0;
    font-size: 16px;
    color: #212529;
    cursor: pointer;
    outline: none;
    &:hover {
      color: #16181b;
      text-decoration: none;
      background-color: #f8f9fa;
    }
  }
  &.donate-menu {
    padding: 0;
    .menu-item {
      width: auto;
      padding: 8px 15px;
      cursor: default;
      &:hover {
        color: #212529;
        text-decoration: none;
        background-color: #fff;
      }
    }
  }
  .donate-menu-item {
    display: flex;
    .donate-content {
      text-align: left;
      padding-right: 10px;
      border-right: 1px solid #d8d8d8;
    }
    .donate-title {
      color: var(--main-color);
      line-height: 22px;
      font-weight: 600;
    }
    .donate-address {
      display: inline-block;
      color: var(--link-color);
      font-size: 14px;
      word-break: break-all;
      max-width: 260px;
      line-height: 18px;
    }
    .copy-btn {
      cursor: pointer;
      margin-left: 16px;
      font-size: 18px;
      color: var(--main-color-light);
    }
  }
}
</style>
