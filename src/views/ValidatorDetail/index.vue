<template>
  <div class="validator-wrapper subscan-content">
    <div class="container">
      <template v-if="notFound">
        <search-input
          class="search-input"
          :selectList="selectList"
          :placeholder="$t('placeholder.search_by')"
        />
        <div class="not-found">
          <img class="not-found-img" src="./../../assets/images/404.png" alt="404" />
          <div class="no-data">{{$t('no_data')}}</div>
        </div>
      </template>
      <template v-else-if="validatorInfo">
        <div class="validator-header space-between align-items-center">
          <div class="header-left align-items-center">
            <div
              class="address"
            >{{$t('validator_hash_tag') + ' ' + (validatorInfo.nickname || validatorInfo.account_index || '')}}</div>
            <div
              class="copy-btn"
              v-clipboard:copy="(validatorInfo.nickname || validatorInfo.account_index || '')"
              v-clipboard:success="clipboardSuccess"
            >
              <icon-svg class="iconfont" icon-class="copy" />
            </div>
          </div>
          <div
            class="header-left align-items-center mobile"
            v-clipboard:copy="(validatorInfo.nickname || validatorInfo.account_index || '')"
            v-clipboard:success="clipboardSuccess"
          >
            <div
              class="address"
            >{{$t('validator_hash_tag') + ' ' + (validatorInfo.nickname || validatorInfo.account_index || '')}}</div>
          </div>
          <search-input
            class="header-right"
            :placeholder="$t('placeholder.search_by')"
            :isMini="true"
          />
        </div>
        <div class="validator-info-list subscan-card" v-loading="isIntroLoading">
          <div>
            <div class="info-item">
              <div class="label">{{$t('stash')}}</div>
              <div class="value link copy align-items-center">
                <div class="icon identicon">
                  <identicon :size="24" theme="polkadot" :value="validatorInfo.validator_stash" />
                </div>
                <router-link
                  :to="`/account/${validatorInfo.validator_stash}`"
                >{{validatorInfo.validator_stash}}</router-link>
                <div
                  class="copy-btn"
                  v-if="validatorInfo.validator_stash"
                  v-clipboard:copy="validatorInfo.validator_stash"
                  v-clipboard:success="clipboardSuccess"
                >
                  <icon-svg class="iconfont" icon-class="copy" />
                </div>
              </div>
            </div>
            <div class="info-item">
              <div class="label">{{$t('controller')}}</div>
              <div class="value link copy align-items-center">
                <div class="icon identicon">
                  <identicon
                    :size="24"
                    theme="polkadot"
                    :value="validatorInfo.validator_controller"
                  />
                </div>
                <router-link
                  :to="`/account/${validatorInfo.validator_controller}`"
                >{{validatorInfo.validator_controller}}</router-link>
                <div
                  class="copy-btn"
                  v-if="validatorInfo.validator_controller"
                  v-clipboard:copy="validatorInfo.validator_controller"
                  v-clipboard:success="clipboardSuccess"
                >
                  <icon-svg class="iconfont" icon-class="copy" />
                </div>
              </div>
            </div>
            <div class="info-item">
              <div class="label">{{$t('rank')}}</div>
              <div v-if="this.$route.name === 'waitingDetail'" class="value">{{$t('waiting')}}</div>
              <div v-else class="value">{{validatorInfo.rank_validator + 1}}</div>
            </div>
            <div class="info-item">
              <div class="label">{{$t('self_bonded')}}</div>
              <div
                class="value"
              >{{validatorInfo.bonded_owner|accuracyFormat(tokenDetail.accuracy)}} {{formatSymbol('balances')}}</div>
            </div>
            <div class="info-item">
              <div class="label">{{$t('total_bonded')}}</div>
              <div
                class="value"
              >{{getTotalBonded(validatorInfo.bonded_nominators, validatorInfo.bonded_owner)|accuracyFormat(tokenDetail.accuracy)}} {{formatSymbol('balances')}}</div>
            </div>
            <div class="info-item">
              <div class="label">{{$t('nominator')}}</div>
              <div class="value">{{validatorInfo.count_nominators}}</div>
            </div>
            <div class="info-item">
              <div class="label">{{$t('commission')}}</div>
              <div class="value">{{getCommission(validatorInfo.validator_prefs_value)}}</div>
            </div>
          </div>
        </div>
        <div class="nominator-wrapper subscan-card" v-loading="isLoading">
          <el-tabs v-model="activeTab">
            <el-tab-pane
              :label="`${$t('nominator')}${nominators.count>0?` (${nominators.count})`:''}`"
              name="nominator"
            >
              <el-table :data="nominators.list" style="width: 100%">
                <el-table-column min-width="190" prop="nominator_stash" :label="$t('account')">
                  <template slot-scope="scope">
                    <div class="link align-items-center">
                      <div class="icon identicon">
                        <identicon :size="24" theme="polkadot" :value="scope.row.nominator_stash" />
                      </div>
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.nominator_stash"
                        placement="top-start"
                      >
                        <router-link
                          :to="`/account/${scope.row.nominator_stash}`"
                        >{{scope.row.nominator_stash | hashFormat}}</router-link>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="180" prop="bonded" :label="$t('voted')">
                  <template slot-scope="scope">
                    <div>
                      <span>{{scope.row.bonded|accuracyFormat(tokenDetail.accuracy)}} {{formatSymbol('balances')}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="100" prop="my_share" :label="$t('share')">
                  <template
                    slot-scope="scope"
                  >{{getMyShare(scope.row.bonded, getTotalBonded(validatorInfo.bonded_nominators, validatorInfo.bonded_owner), 2)}}</template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <div class="view-all-extrinsic" @click="goTransferOrExtrinsicByAddress">{{$t('view_all')}}</div>
        </div>
        <div
          class="view-all-extrinsic mobile"
          @click="goTransferOrExtrinsicByAddress"
        >{{$t('view_all')}}</div>
      </template>
    </div>
  </div>
</template>

<script>
import Identicon from "@polkadot/vue-identicon";
import SearchInput from "@/views/Components/SearchInput";
import { mapState } from "vuex";
import {
  timeAgo,
  parseTimeToUtc,
  hashFormat,
  accuracyFormat
} from "Utils/filters";
import clipboard from "Directives/clipboard";
import Balances from "../ExtrinsicDetail/Balances";
import { fmtPercentage, getCommission, bnPlus } from "../../utils/format";

export default {
  name: "AccountDetail",
  components: {
    SearchInput,
    Identicon,
    Balances
  },
  filters: {
    timeAgo,
    parseTimeToUtc,
    hashFormat,
    accuracyFormat
  },
  directives: {
    clipboard
  },
  data() {
    return {
      address: "",
      showKton: false,
      role: "nominator",
      // role: "validator",
      currency: "ring",
      validatorInfo: {},
      nominators: {
        count: 0,
        list: []
      },
      extrinsicsInfo: {
        count: 0,
        extrinsics: []
      },
      activeTab: "nominator",
      notFound: false,
      isLoading: false,
      isIntroLoading: false,
      selectList: [
        {
          label: this.$t("all"),
          value: "all"
        },
        {
          label: this.$t("block"),
          value: "block"
        },
        {
          label: this.$t("extrinsic"),
          value: "extrinsic"
        },
        {
          label: this.$t("account"),
          value: "account"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      metadata: state => state.polka.metadata,
      token: state => state.polka.token,
      sourceSelected: state => state.global.sourceSelected
    }),
    shouldShowKton() {
      return (
        this.sourceSelected === "darwinia" || this.sourceSelected === "icefrog"
      );
    },
    tokenDetail() {
      if (this.token && this.token.detail) {
        if (this.sourceSelected === "kusama") {
          return this.token.detail[this.token.token];
        } else {
          return this.token.detail[this.currency.toUpperCase()];
        }
      }
      return {};
    }
  },
  created() {
    this.address = this.$route.params.key;
    this.init();
  },
  watch: {
    "$route.params.key": function() {
      this.init();
    }
  },
  methods: {
    init() {
      this.getValidatorInfo();
      this.getNominatorInfo();
      this.activeTab = "nominator";
    },
    getMyShare(vote, total, digits) {
      return fmtPercentage(vote, total, digits) + "%";
    },
    getTotalBonded(own, nominator) {
      return bnPlus(own, nominator).toString();
    },
    getCommission(perf) {
      return getCommission(perf, this.metadata.commissionAccuracy);
    },
    changeAssetType(type) {
      this.showKton = type === "kton";
    },
    formatSymbol(module) {
      if (!this.$const[`SYMBOL/${this.sourceSelected}`]) {
        return "";
      }
      return this.$const[`SYMBOL/${this.sourceSelected}`][module].value || "";
    },
    async getValidatorInfo() {
      this.isIntroLoading = true;
      const data = await this.$api["polkaGetValidator"]({
        Stash: this.address
      });
      this.isIntroLoading = false;
      this.validatorInfo = data && data.info;
    },
    async getNominatorInfo() {
      this.isLoading = true;
      const data = await this.$api["polkaGetNominators"]({
        row: 10,
        page: 0,
        address: this.address
      }).catch(() => {
        this.nominators = { count: 0, list: [] };
      });
      this.isLoading = false;
      data.list === null && (data.list = []);
      this.nominators = data;
    },
    goTransferOrExtrinsicByAddress() {
      this.$router.push(`/${this.activeTab}?address=${this.address}`);
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

<style lang="scss" scoped>
.validator-wrapper {
  .search-input {
    height: 50px;
  }
  .validator-header {
    height: 50px;
    .header-left {
      &.mobile {
        display: none;
      }
      .address {
        font-size: 18px;
        font-weight: 600;
        color: #0c0b0c;
        padding: 0 10px;
      }
      .copy-btn {
        font-size: 20px;
        color: var(--main-color-light);
        cursor: pointer;
      }
    }
    .header-right {
      width: 400px;
      height: 100%;
    }
  }
  .validator-info-list {
    margin-top: 20px;
    padding: 10px 20px;
    .info-item {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #302b3c;
      display: flex;
      align-items: center;
      &:not(:last-child) {
        border-bottom: 1px solid #e7eaf3;
      }

      .label {
        padding-left: 10px;
        width: 180px;
        font-weight: 600;
      }
      .value {
        padding-left: 10px;
        flex: auto;
        &.link {
          color: var(--link-color);
          cursor: pointer;
        }
        &.copy {
          .copy-btn {
            margin-left: 14px;
            font-size: 20px;
            color: var(--main-color-light);
            cursor: pointer;
          }
        }
        .icon {
          font-size: 24px;
          margin-right: 10px;
          vertical-align: -0.3em;
          &.identicon {
            font-size: 32px;
          }
        }
      }
    }
    &:not(.el-loading-mask):last-child {
      color: red;
    }
  }
  .nominator-wrapper {
    min-height: 200px;
    margin-top: 20px;
    padding: 10px 20px;
    position: relative;
    .view-all-extrinsic {
      position: absolute;
      top: 20px;
      right: 24px;
      height: 30px;
      line-height: 30px;
      padding: 0 23px;
      cursor: pointer;
      border-radius: 2px;
      border: 1px solid var(--main-color);
      font-size: 14px;
      font-weight: 600;
      color: var(--main-color);
    }
    .link {
      color: var(--link-color);
      span {
        cursor: pointer;
      }
    }
    .icon {
      vertical-align: -0.5em;
      font-size: 26px;
      user-select: none;
      margin-right: 10px;
    }
    .icon-wrapper {
      width: 26px;
      height: 26px;
      font-size: 26px;
      border-radius: 50%;
      background-color: #f6f4fd;
      color: var(--main-color);
    }
    .expand-form {
      background: #f3f5f9;
      padding: 10px 28px;
      .form-item {
        min-height: 40px;
        font-size: 14px;
        color: rgba(48, 43, 60, 1);
        .label {
          min-width: 140px;
        }
        .value {
          width: 900px;
          word-break: break-all;
        }
      }
    }
    .block-log {
      .log-item {
        .label {
        }
        .value {
        }
      }
    }
  }
  .view-all-extrinsic {
    &.mobile {
      display: none;
    }
  }
  .not-found {
    padding: 10%;
    text-align: center;
    .not-found-img {
    }
    .no-data {
      font-size: 14px;
      font-weight: 600;
      color: rgba(152, 149, 159, 1);
    }
  }
  @media screen and (max-width: $screen-xs) {
    .validator-header {
      height: inherit;
      flex-direction: column;
      .header-left {
        width: 100%;
        order: 2;
        display: none;
        &.mobile {
          display: flex;
        }
        .copy-btn {
          display: none;
        }
        .address {
          word-break: break-all;
          padding: 0 0 0 10px;
        }
      }
      .search-input-wrapper {
        order: 1;
        max-width: 100%;
        margin: 0 20px 20px;
      }
    }
    .validator-info-list {
      padding-bottom: 0;
      .info-item {
        height: initial;
        flex-direction: column;
        align-items: initial;
        line-height: initial;
        padding: 10px 0;
        position: relative;
        .label {
          padding: 0 0 10px 0;
        }
        .value {
          flex: none;
          line-height: 20px;
          max-width: 100%;
          padding: 0;
          word-break: break-all;
          &.account {
            display: flex;
            align-items: center;
          }
          > div {
            word-break: break-all;
            & + div {
              margin-top: 5px;
            }
          }
          &.copy {
            .copy-btn {
              display: inline-block;
              position: absolute;
              top: 10px;
              right: 0;
              height: 24px;
              line-height: 24px;
              padding: 0 14px;
              margin: 0;
            }
          }
        }
      }
    }
    .nominator-wrapper {
      .view-all-extrinsic {
        display: none;
      }
    }
    .view-all-extrinsic {
      &.mobile {
        display: block;
        height: 35px;
        line-height: 35px;
        margin-top: 12px;
        border-radius: 2px;
        color: var(--main-color);
        background-color: #fff;
        border: 1px solid var(--main-color);
        text-align: center;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
}
</style>

<style lang="scss">
.asset-dropdown-menu.el-dropdown-menu {
  width: 428px;
  .menu-item {
    text-align: left;
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
.nominator-wrapper {
  .el-tabs {
    .el-tabs__header {
      .el-tabs__nav-wrap {
        height: 50px;
        &::after {
          height: 1px;
          background-color: #e7eaf3;
        }
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            .el-tabs__active-bar {
              height: 4px;
              background-color: var(--main-color);
            }
            .el-tabs__item {
              height: 50px;
              line-height: 50px;
              &.is-active,
              &:hover {
                color: var(--main-color);
              }
            }
          }
        }
      }
    }
    .el-tabs__content {
      .el-table {
        .el-table__header-wrapper {
          th,
          tr {
            box-sizing: border-box;
            height: 44px;
            background: #f3f5f9;
            font-size: 14px;
            font-weight: bold;
            color: #302b3c;
          }
          th {
            padding: 0;
            border: none;
          }
        }
        .el-table__body-wrapper {
          .el-table__body tr:hover > td {
            background: none;
          }
          tr {
            box-sizing: border-box;
            height: 50px;
            font-size: 14px;
            color: #302b3c;
          }
          td {
            padding: 0;
            &.el-table__expand-column {
              .el-table__expand-icon {
                width: 48px;
                height: 26px;
                background: rgba(255, 255, 255, 1);
                border-radius: 4px;
                border: 1px solid rgba(219, 219, 219, 1);
                font-size: 10px;
                text-align: center;
                cursor: pointer;
                user-select: none;
                .el-icon {
                  transition: transform 0.2s ease-in-out;
                }
                &.el-table__expand-icon--expanded {
                  transform: rotate(0);
                  .el-icon {
                    transform: rotate(90deg);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
