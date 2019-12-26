<template>
  <div class="nav-bar-wrapper"
    :class="{'is-home-page': isHomePage}"
  >
    <div class="container align-items-center">
      <router-link class="logo" to="/" tag="div"></router-link>
      <div class="rate">
        <div v-if="this.sourceSelected === 'kusama'" class="kms-rate">
          <span class="label">{{$t('kusama.short')}}</span>
          <span class="info">{{price}}</span>
        </div>
      </div>
      <div class="right-menu align-items-center">
        <ul class="nav-item-list align-items-center">
          <router-link class="nav-item" to="/block" tag="li" active-class="choosed">{{$t('blocks')}}</router-link>
          <router-link class="nav-item" to="/extrinsic" tag="li" active-class="choosed">{{$t('extrinsics')}}</router-link>
          <router-link class="nav-item" to="/transfer" tag="li" active-class="choosed">{{$t('transfers')}}</router-link>
          <el-dropdown class="account-dropdown" trigger="click">
            <li class="nav-item">{{$t('accounts')}}</li>
            <el-dropdown-menu slot="dropdown" class="account-dropdown-menu">
              <el-dropdown-item class="menu-item">
                <router-link class="account-nav-item" to="/validator" tag="li" active-class="choosed">{{$t('validators')}}</router-link>
              </el-dropdown-item>
              <el-dropdown-item class="menu-item">
                <router-link class="account-nav-item" to="/account" tag="li" active-class="choosed">{{$t('holders')}}</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </ul>
        <el-dropdown class="dropdown" trigger="click">
          <span class="el-dropdown-link align-items-center">
            <!--<div class="choosed-source">{{sourceSelectedLabel}}</div>-->
            <div :class="`network-button ${sourceSelectedValue}-button`"></div>


          </span>
          <el-dropdown-menu slot="dropdown" class="menu-dropdown">
            <li
              class="menu-dropdown-item align-items-center"
              v-for="item in sourceList"
              :key="item.value"
            >
              <i class="choosed-icon" :class="{show: sourceSelected===item.value}"></i>
              <span
                class="menu-dropdown-item-label"
                @click="changeSource(item.value)"
              >{{item.label}}</span>
            </li>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="mobile-menu">
          <div class="menu-area" @click="drawer = true">
            <icon-svg icon-class="menu" class="icon"/>
          </div>
        </div>
        <el-drawer
          :title="$t('menu')"
          class="mobile-drawer"
          size="40%"
          :visible.sync="drawer"
          :direction="direction">
          <div class="drawer-content">
            <div class="menu-section">
              <div class="row">
                <router-link class="item" to="/block" tag="div" @click.native="drawer = false">{{$t('blocks')}}</router-link>
                <router-link class="item" to="/extrinsic" tag="div" @click.native="drawer = false">{{$t('extrinsics')}}</router-link>
                <router-link class="item" to="/transfer" tag="div" @click.native="drawer = false">{{$t('transfers')}}</router-link>
                <div>
                  <router-link class="item" to="" tag="div">{{$t('accounts')}}</router-link>
                  <router-link class="sub-item" to="/validator" tag="div" @click.native="drawer = false">{{$t('validators')}}</router-link>
                  <router-link class="sub-item" to="/account" tag="div" @click.native="drawer = false">{{$t('holders')}}</router-link>
                </div>
              </div>
            </div>
            <div class="language-section">
              <div class="row">
                <div class="item" @click="changeLanguage('zh-CN')">简体中文</div>
                <div class="item" @click="changeLanguage('en')">English</div>
              </div>
            </div>
          </div>
        </el-drawer>
      </div>
    </div>
    <div class="nav-bar-search">
      <search-input
        class="search-input"
        :selectList="selectList"
        :placeholder="$t('placeholder.search_by')"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import SearchInput from '@/views/Components/SearchInput';
import { fmtNumber} from '../../utils/format';
export default {
  name: "NavBar",
  components: {
    SearchInput
  },
  data() {
    return {
      currentTime: Date.now(),
      drawer: false,
      direction: 'rtl',
      selectList: [
        {
          label: this.$t('all'),
          value: "all"
        },
        {
          label: this.$t('block'),
          value: "block"
        },
        {
          label: this.$t('extrinsic'),
          value: "extrinsic"
        },
        {
          label: this.$t('account'),
          value: "account"
        }
      ],
      sourceList: [
        {
          label: "Kusama CC3",
          value: "kusama"
        },
        {
          label: "Darwinia Crayfish",
          value: "darwinia"
        }
      ]
    };
  },
  computed: {
    sourceSelectedValue() {
      return this.sourceList.find(item => {
        return item.value === this.sourceSelected;
      }).value;
    },
    isHomePage() {
      let path = this.$route.path;
      let result = false;
      switch (path) {
        case '/':
        case '/404':
        case '/noData':
          result = true;
          break;
        default:
            break;
      }
      return result
    },
    price() {
      if (this.token.detail) {
        let tokenDetail = this.token.detail[this.token.token];
        let price = '$' + fmtNumber(tokenDetail.price, 3);
        let change = '(' + fmtNumber(+tokenDetail.price_change, 2) + '%)';
        return price + change;
      } else {
        return '';
      }
    },
    ...mapState({
      sourceSelected: state => state.global.sourceSelected,
      token: state => state.polka.token
    })
  },
  created() {
    this.init();
    this.w = new Worker('/' + "timeWorker.js");
    this.w.onmessage = () => {
      this.changeTime();
    };
  },
  beforeDestroy() {
    // 销毁 worker
    if (this.w && typeof this.w.terminate === "function") {
      this.w.terminate();
    }
    this.$loop.removeLoop("metadata");
    this.$loop.removeLoop("token");
  },
  methods: {
    async init() {
      // await this.getData();
      this.$loop.addLoop(
        "metadata",
        () => {
          return this.getMetaData();
        },
        true
      );
      this.$loop.addLoop(
        "token",
        () => {
          return this.getToken();
        },
        true
      );
    },
    async getToken() {
      await Promise.all([
        this.$store.dispatch("SetToken")
      ]);
    },
    async getMetaData() {
      await Promise.all([
        this.$store.dispatch("SetMetadata")
      ]);
    },
    changeLanguage(language) {
      GLOBAL.vbus.$emit("CHANGE_LANGUAGE", language);
      this.$store.dispatch("SetLanguage", language);
      this.closeDrawer();
    },
    closeDrawer() {
      this.drawer = false;
    },
    changeSource(source) {
      // this.$store.dispatch("SetSourceSelected", source);
      window.location.href = this.$const[`SYMBOL/${source}`]['domain']['value'];
    },
    changeTime() {
      this.currentTime = Date.now();
    }
  }
};
</script>
<style lang="scss" scoped>
.nav-bar-wrapper {
  height: 50px;
  background: var(--navbar-bg);
  position: relative;
  color: #fff;
  .container {
    height: 100%;
    .logo {
      height: 100%;
      width: 150px;
      background: url("../../assets/images/logo@2x.png") no-repeat left center;
      background-size: 125px 25px;
      cursor: pointer;
    }
    .rate {
      flex: 1 1 auto;
      margin-top: 2px;
      font-size: 14px;
      .label {
        font-weight: bold;
      }
      .info {
        margin-left: 8px;
      }
    }
    .right-menu {
      .nav-item-list {
        > .nav-item {
          height: 50px;
          line-height: 50px;
          cursor: pointer;
          font-size: 14px;
          user-select: none;
          font-weight: 600;
          margin-right: 15px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .account-dropdown {
        color: #fff;
        .nav-item {
          height: 50px;
          line-height: 50px;
          cursor: pointer;
          font-size: 14px;
          user-select: none;
          font-weight: 600;
        }
      }
      .dropdown {
        margin-left: 15px;
        margin-right: 1px;
        background: #fff;
        border-radius: 2px;
        .el-dropdown-link {
          /*padding: 0 10px;*/
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          .dropdown-icon {
            font-size: 11px;
          }
          .choosed-source {
            height: 31px;
            line-height: 31px;
            color: #201550;
            margin-right: 5px;
          }
        }
      }
      .mobile-menu {
        display: none;
      }

      .network-button{
        width: 130px;
        height: 30px;
        background: url("../../assets/images/crayfish-button.png") no-repeat left center;
        background-size: contain;
      }

      .crayfish-button {
        background: url("../../assets/images/crayfish-button.png") no-repeat left center;
        background-size: contain;
      }

      .kusama-button {
        background: url("../../assets/images/kusama-button.png") no-repeat left center;
        background-size: contain;
      }
    }
  }
  .nav-bar-search {
    display: none;
  }
  &.is-home-page {
    height: 125px;
    .container {
      height: 50px;
    }
    .nav-bar-search {
      display: block;
      margin-top: 4px;
      > div {
        width: 760px;
        margin: 0 auto;
      }
    }
  }
  @media screen and (max-width:$screen-xs) {
    .container {
      padding: 0 15px;
      .logo {
        flex: 0 0 45vw;
        margin-left: 10px;
      }
      .rate {
        display: none;
      }
      .right-menu {
        flex: 1 1 auto;
        .nav-item-list {
          display: none;
        }
        .dropdown {
          margin-left: 0;
        }
        .network-button{
          width: 100px;
        }
        .mobile-menu {
          display: block;
          font-size: 34px;
          flex: 1 1 auto;
          text-align: right;
          .menu-area {
            display: inline-block;
            padding-left: 10px;
          }
          .icon {
            cursor: pointer;
          }
        }
      }
    }
  }
}
.drawer-content {
  height: 100%;
  color: #FFF;
  display: flex;
  flex-direction: column;
  .menu-section {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    .item {
      font-size: 20px;
      padding: 20px 10px;
      margin: 10px 0;
      color: #FFF;
    }
    .sub-item {
      font-size: 14px;
      padding: 0 10px 10px;
      margin: 4px 0;
      color: #FFF;
    }
  }
  .language-section {
    height: 125px;
    background-color: #3A3545;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    .item {
      padding: 10px;
    }
  }
}
</style>
<style lang="scss">
@each $theme in darwinia, kusama {
  .#{$theme} {
    > .nav-bar-wrapper {
      background: var(--navbar-bg);
      &.is-home-page {
        background: url("../../assets/images/#{$theme}-banner.png") no-repeat center center;
        background-size: cover;
      }
    }
    @media screen and (max-width:$screen-xs) {
      > .nav-bar-wrapper {
        background: url("../../assets/images/#{$theme}-banner-mobile.png") no-repeat center center;
        background-size: cover;
        &.is-home-page {
          background: url("../../assets/images/#{$theme}-banner-mobile.png") no-repeat center center;
          background-size: cover;
        }
      }
    }
  }
}
.account-dropdown-menu.el-dropdown-menu {
  .menu-item {
    text-align: center;
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
.menu-dropdown.el-dropdown-menu {
  margin-top: 20px;
  background: #fff;
  padding: 5px 0;
  border-radius: 4px;
  border: 1px solid rgba(219, 219, 219, 1);
  .menu-dropdown-item {
    line-height: 22px;
    height: 42px;
    padding: 10px 24px;
    cursor: pointer;
    .menu-dropdown-item-label {
      font-size: 16px;
      font-weight: 600;
      color: #201550;
    }
    .choosed-icon {
      margin-right: 10px;
      border-radius: 50%;
      width: 7px;
      height: 7px;
      background: linear-gradient(
        315deg,
        rgba(254, 56, 118, 1) 0%,
        rgba(124, 48, 221, 1) 71%,
        rgba(58, 48, 221, 1) 100%
      );
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }
  }
  .popper__arrow {
    opacity: 0;
  }
}
.mobile-drawer {
  .el-drawer {
    color: #FFF;
    background-color: #302B3C;
  }
  .el-drawer__header {
    padding: 10px 0;
    color: #FFF;
    background-color: #3A3545;
    > span {
      margin-left: 20px;
    }
    button {
      padding: 0 10px;
    }
  }
}
</style>
