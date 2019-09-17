<template>
  <div class="account-wrapper subscan-content">
    <div class="container">
      <template v-if="notFound">
        <search-input
          class="search-input"
          :selectList="selectList"
          placeholder="Search by Block / Extrinsic / Account"
        />
        <div class="not-found">
          <img class="not-found-img" src="./../../assets/images/404@2x.png" alt="404" />
          <div class="no-data">No Data</div>
        </div>
      </template>
      <template v-else-if="accountInfo.account">
        <div class="account-header space-between align-items-center">
          <div class="header-left align-items-center">
            <div class="icon">
              <identicon :size="40" theme="polkadot" :value="address" />
            </div>
            <div class="address">{{address}}</div>
            <div
              class="copy-btn"
              v-clipboard:copy="address"
              v-clipboard:success="clipboardSuccess"
            >COPY</div>
          </div>
          <search-input
            class="header-right"
            placeholder="Search by Block / Extrinsic / Account"
            :isMini="true"
          />
        </div>
        <div class="intro space-between">
          <div class="asset subscan-card" v-loading="isIntroLoading">
            <div class="title">Asset</div>
            <div class="desc">
              <div class="desc-item align-items-center no-border-bottom">
                <div class="label">Balance</div>
                <div class="value"><balances :amount="accountInfo.account.balance" module="balances"></balances></div>
              </div>
              <div class="desc-item align-items-center">
                <div class="label"></div>
                <div class="value"><balances :amount="accountInfo.account.kton_balance" module="kton"></balances></div>
              </div>
            </div>
          </div>
          <div class="basic subscan-card" v-loading="isIntroLoading">
            <div class="title">Basic</div>
            <div class="desc">
              <div class="desc-item align-items-center">
                <div class="label">Account Index</div>
                <div class="value">{{accountInfo.account.account_index}}</div>
              </div>
              <div class="desc-item align-items-center">
                <div class="label">Nonce</div>
                <div class="value">{{accountInfo.account.nonce}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="transfer-extrinsic-wrapper subscan-card" v-loading="isLoading">
          <el-tabs v-model="activeTab">
            <el-tab-pane
              :label="`Transfers${transfersInfo.count>0?` (${transfersInfo.count})`:''}`"
              name="transfer"
            >
              <el-table :data="transfersInfo.transfers" style="width: 100%">
                <el-table-column prop="extrinsic_index" label="Extrinsic ID" width="120">
                  <template slot-scope="scope">
                    <div class="link">
                      <span
                        @click="$router.push(`/extrinsic/${scope.row.extrinsic_index}`)"
                      >{{scope.row.extrinsic_index}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="block_num" label="Block" width="120">
                  <template slot-scope="scope">
                    <div class="link">
                      <span
                        @click="$router.push(`/block/${scope.row.block_num}`)"
                      >{{scope.row.block_num}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="block_timestamp" label="Age" width="150">
                  <template slot-scope="scope">{{scope.row.block_timestamp|timeAgo}}</template>
                </el-table-column>
                <el-table-column prop="from" label="From" width="150">
                  <template slot-scope="scope">
                    <div class="link">
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.from"
                        placement="top-start"
                      >
                        <span
                          @click="$router.push(`/account/${scope.row.from}`)"
                        >{{scope.row.from|hashFormat}}</span>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="40">
                  <template>
                    <icon-svg class="icon" icon-class="from-to-arrow" />
                  </template>
                </el-table-column>
                <el-table-column prop="to" label="To" width="150">
                  <template slot-scope="scope">
                    <div class="link">
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.to"
                        placement="top-start"
                      >
                        <span
                          @click="$router.push(`/account/${scope.row.to}`)"
                        >{{scope.row.to|hashFormat}}</span>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="amount" label="Value" fit>
                  <template
                    slot-scope="scope"
                  >{{`${scope.row.amount} ${scope.row.module==="balances"?'RING':scope.row.module==="kton"?"KTON":''}`}}</template>

                </el-table-column>
                <el-table-column prop="success" label="Result" width="70">
                  <template slot-scope="scope">
                    <icon-svg class="icon" :icon-class="scope.row.success?'success':'failed'" />
                  </template>
                </el-table-column>
                <el-table-column prop="hash" label="Hash" width="150">
                  <template slot-scope="scope">
                    <div class="link">
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.hash"
                        placement="top-end"
                      >
                        <span
                          @click="$router.push(`/extrinsic/${scope.row.hash}`)"
                        >{{scope.row.hash|hashFormat}}</span>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane
              :label="`Extrinsics${extrinsicsInfo.count>0?` (${extrinsicsInfo.count})`:''}`"
              name="extrinsic"
            >
              <el-table :data="extrinsicsInfo.extrinsics" style="width: 100%">
                <el-table-column prop="extrinsic_index" label="Extrinsic ID" width="160">
                  <template slot-scope="scope">
                    <div class="link">
                      <span
                        @click="$router.push(`/extrinsic/${scope.row.extrinsic_index}`)"
                      >{{scope.row.extrinsic_index}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="block_num" label="Block" width="160">
                  <template slot-scope="scope">
                    <div class="link">
                      <div class="link">
                        <span
                          @click="$router.push(`/block/${scope.row.block_num}`)"
                        >{{scope.row.block_num}}</span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="extrinsic_hash" label="Extrinsic Hash" fit>
                  <template slot-scope="scope">
                    <div class="link">
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.extrinsic_hash"
                        placement="top-start"
                      >
                        <span
                          @click="$router.push(`/extrinsic/${scope.row.extrinsic_hash}`)"
                        >{{scope.row.extrinsic_hash|hashFormat}}</span>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="block_timestamp" label="Age" width="180">
                  <template slot-scope="scope">{{scope.row.block_timestamp|timeAgo}}</template>
                </el-table-column>
                <el-table-column prop="success" label="Result" width="120">
                  <template slot-scope="scope">
                    <icon-svg class="icon" :icon-class="scope.row.success?'success':'failed'" />
                  </template>
                </el-table-column>
                <el-table-column prop="call_module" label="Action" width="180"></el-table-column>
                <el-table-column width="120" type="expand">
                  <template slot-scope="props">
                    <div class="expand-form">
                      <div
                        class="form-item align-items-center"
                        v-for="item in props.row.params"
                        :key="item.name"
                      >
                        <div class="label">{{item.name}} :</div>
                        <div class="value" v-if="item.name==='now'">{{item.value|parseTimeToUtc}}</div>
                        <div class="value" v-else>{{item.value}}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <div class="view-all-extrinsic" @click="goTransferOrExtrinsicByAddress">View All</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Identicon from "@polkadot/vue-identicon";
import SearchInput from "@/views/Components/SearchInput";
import { timeAgo, parseTimeToUtc, hashFormat } from "Utils/filters";
import clipboard from "Directives/clipboard";
import Balances from '../ExtrinsicDetail/Balances'

export default {
  name: "Account",
  components: {
    SearchInput,
    Identicon,
    Balances
  },
  filters: {
    timeAgo,
    parseTimeToUtc,
    hashFormat
  },
  directives: {
    clipboard
  },
  data() {
    return {
      address: "",
      accountInfo: {},
      transfersInfo: {
        count: 0,
        transfers: []
      },
      extrinsicsInfo: {
        count: 0,
        extrinsics: []
      },
      activeTab: "transfer",
      notFound: false,
      isLoading: false,
      isIntroLoading: false,
      selectList: [
        {
          label: "All",
          value: "all"
        },
        {
          label: "Block",
          value: "block"
        },
        {
          label: "Extrinsic",
          value: "extrinsic"
        },
        {
          label: "Account",
          value: "account"
        }
      ]
    };
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
      this.getAccountInfo();
      this.activeTab = "transfer";
    },
    async getAccountInfo() {
      this.isLoading = true;
      this.isIntroLoading = true;
      const key = this.$route.params.key;
      this.$api["polkaGetSearchRes"]({ key, row: 1, page: 0 })
        .then(async res => {
          if (res === undefined || typeof res.account !== "object") {
            return Promise.reject();
          }
          this.address = res.account.address;
          this.accountInfo = res;
          this.notFound = false;
          this.isIntroLoading = false;
          await Promise.all([this.getTransferInfo(), this.getExtrinsicInfo()]);
          this.isLoading = false;
        })
        .catch(() => {
          this.notFound = true;
          this.accountInfo = {};
          this.transfersInfo = { count: 0, transfers: [] };
          this.extrinsicsInfo = { count: 0, extrinsics: [] };
          this.isLoading = false;
          this.isIntroLoading = false;
        });
    },
    async getTransferInfo() {
      const data = await this.$api["polkaGetTransfers"]({
        row: 10,
        page: 0,
        address: this.address
      });
      data.transfers === null && (data.transfers = []);
      this.transfersInfo = data;
    },
    async getExtrinsicInfo() {
      const data = await this.$api["polkaGetExtrinsics"]({
        row: 10,
        page: 0,
        address: this.address,
        signed: "all"
      });
      data.extrinsics === null && (data.extrinsics = []);
      data.extrinsics.forEach(item => {
        item.params = JSON.parse(item.params);
      });
      this.extrinsicsInfo = data;
    },
    goTransferOrExtrinsicByAddress() {
      this.$router.push(`/${this.activeTab}?address=${this.address}`);
    },
    clipboardSuccess() {
      this.$message({
        type: "success",
        message: "Copy Success"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.account-wrapper {
  .search-input {
    height: 50px;
  }
  .account-header {
    height: 50px;
    .header-left {
      .icon {
      }
      .address {
        font-size: 18px;
        font-weight: 600;
        color: #0c0b0c;
        padding: 0 10px;
      }
      .copy-btn {
        background: var(--main-color-light);
        border-radius: 2px;
        font-size: 10px;
        font-weight: 600;
        color: #fff;
        height: 20px;
        line-height: 20px;
        padding: 0 8px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .header-right {
      width: 400px;
      height: 100%;
    }
  }
  .intro {
    margin-top: 20px;
    .asset,
    .basic {
      width: 580px;
      height: 171px;
      padding: 10px 0;
      .title {
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        font-weight: bold;
        color: #302b3c;
        border-bottom: 1px solid #e7eaf3;
      }
      .desc {
        padding: 0 20px;
        .desc-item {
          height: 50px;
          line-height: 50px;
          &:not(:last-child):not(.no-border-bottom) {
            border-bottom: 1px solid #e7eaf3;
          }
          .label,
          .value {
            padding-left: 10px;
            font-size: 14px;
            font-weight: 600;
            color: #2a2727;
          }
          .label {
            width: 120px;
          }
        }
      }
    }
  }
  .transfer-extrinsic-wrapper {
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
      border: 1px solid #302b3c;
      font-size: 14px;
      font-weight: 600;
      color: #302b3c;
    }
    .link {
      color: var(--main-color);
      span {
        cursor: pointer;
      }
    }
    .icon {
      vertical-align: -0.5em;
      font-size: 26px;
      user-select: none;
    }
    .expand-form {
      background: #f3f5f9;
      padding: 10px 28px;
      .form-item {
        min-height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(48, 43, 60, 1);
        .label {
          width: 124px;
        }
        .value {
          width: 900px;
          overflow-wrap: break-word;
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
}
</style>

<style lang="scss">
.transfer-extrinsic-wrapper {
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
            font-weight: 600;
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
