<template>
  <div class="nav-bar-wrapper">
    <div class="container space-between align-items-center">
      <router-link class="logo" to="/" tag="div"></router-link>
      <div class="right-menu align-items-center">
        <ul class="nav-item-list align-items-center">
          <router-link class="nav-item" to="/block" tag="li" active-class="choosed">Blocks</router-link>
          <router-link class="nav-item" to="/extrinsic" tag="li" active-class="choosed">Extrinsics</router-link>
          <router-link class="nav-item" to="/transfer" tag="li" active-class="choosed">Transfers</router-link>
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


      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "NavBar",
  data() {
    return {
      sourceList: [
        {
          label: "Crayfish",
          value: "darwinia"
        },
        {
          label: "Kusama",
          value: "kusama"
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
    ...mapState({
      sourceSelected: state => state.global.sourceSelected
    })
  },
  methods: {
    changeLanguage(language) {
      GLOBAL.vbus.$emit("CHANGE_LANGUAGE", language);
      this.$store.dispatch("SetLanguage", language);
    },
    changeSource(source) {
      // this.$store.dispatch("SetSourceSelected", source);
      window.location.href = this.$const[`SYMBOL/${source}`]['domain']['value'];
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
      width: 250px;
      background: url("../../assets/images/logo@2x.png") no-repeat left center;
      background-size: 125px 25px;
      cursor: pointer;
    }
    .right-menu {
      .nav-item-list {
        .nav-item {
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

      .network-button{
        width: 116px;
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
}
</style>
<style lang="scss">
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
</style>
