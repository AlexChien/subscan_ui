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
      <div class="info-container space-between align-items-center">
        <div class="copyright">{{$t('copy_right', { year: new Date().getFullYear()})}}</div>
        <div class="donate" :class="{'is-home-page': isHomePage}">
          <span class="donate-title">{{$t('donate')}}:</span>
          <span class="donate-address">{{donateAddress}}</span>
        </div>
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
    <div class="container mobile space-between align-items-center">
      <div class="partner" :class="{'is-home-page': isHomePage}">
        <div class="partner-title">{{$t('partner')}}:</div>
        <div class="partner-img-wrapper">
          <img src="./../../assets/images/partner-mobile.png" />
        </div>
      </div>
      <div class="donate" :class="{'is-home-page': isHomePage}">
        <div class="donate-title">{{$t('donate')}}:</div>
        <div class="donate-address">{{donateAddress}}</div>
      </div>
      <div class="split-line" :class="{'is-home-page': isHomePage}"></div>
      <div class="copyright">{{$t('copy_right', { year: new Date().getFullYear()})}}</div>
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
export default {
  name: "FooterBar",
  computed: {
    ...mapState({
      sourceSelected: state => state.global.sourceSelected
    }),
    donateAddress() {
      let source = this.$const[`SYMBOL/${this.sourceSelected}`];
      return source && source["donate"]["address"];
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
  methods: {
    changeLanguage(language) {
      GLOBAL.vbus.$emit("CHANGE_LANGUAGE", language);
      this.$store.dispatch("SetLanguage", language);
    }
  }
};
</script>

<style lang='scss' scoped>
.footer-bar {
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
    }
    .copyright {
      color: #fff;
      font-size: 14px;
    }
    .donate {
      font-size: 12px;
      font-weight: 600;
      flex: 1 1 auto;
      text-align: right;
      margin-right: 10px;
      color: #fff;
      .donate-title {
        padding-right: 10px;
      }
      &:not(.is-home-page) {
        visibility: hidden;
      }
    }
    .poweredby {
      color: #7b70ae;
      font-size: 14px;
      font-weight: bold;
      margin-left: 10px;
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
      .donate {
        text-align: left;
        padding: 20px 10px;
        margin: 0;
        display: flex;
        font-weight: normal;
        &:not(.is-home-page) {
          display: none;
        }
        .copyright {
          line-height: 40px;
        }
        .donate-title {
          flex: 0 0 auto;
        }
        .donate-address {
          color: rgba(216, 216, 216, 0.6);
          word-break: break-all;
        }
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
}
</style>
