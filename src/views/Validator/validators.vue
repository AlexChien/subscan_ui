
<template>
  <div class="transfer-wrapper" :class="{'is-waiting': isWaiting}">
    <div class="container">
      <div class="table-top space-between align-items-center">
        <div class="for-block align-items-center">
          <div v-if="isWaiting">{{$t('waiting')}}</div>
          <div v-else>{{$t('validator')}}</div>
        </div>
        <div class="validator-search-wrapper">
          <el-input
            class="search-input"
            debounce
            :placeholder="$t('search_validator')"
            v-model.trim="inputValue"
          >
            <el-button class="search-button" slot="append" :loading="isBtnLoading">
              <icon-svg class="icon" icon-class="search" />
            </el-button>
          </el-input>
        </div>
      </div>
      <div class="transfer-table subscan-card" v-loading="isLoading">
        <el-table @sort-change="handleSortChange" :data="filteredValidators" style="width: 100%">
          <el-table-column
            v-if="!isWaiting"
            min-width="70"
            prop="rank_validator"
            :label="$t('rank')"
          >
            <template slot-scope="scope">
              <div class="icon-wrapper" :class="{'top-ten': scope.row.rank_validator < 10}">
                <span>{{scope.row.rank_validator + 1}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" prop="validator_stash" :label="$t('validator')">
            <template slot-scope="scope">
              <div class="link">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.validator_stash"
                  placement="top-start"
                >
                  <router-link
                    :to="isWaiting ? `/waiting/${scope.row.validator_stash}` : `/validator/${scope.row.validator_stash}`"
                  >{{scope.row.nickname || scope.row.account_index}}</router-link>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            min-width="150"
            prop="bonded_owner"
            :label="$t('self_bonded')"
          >
            <template
              slot-scope="scope"
            >{{scope.row.bonded_owner|accuracyFormat(tokenDetail.accuracy)}} {{formatSymbol('balances')}}</template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            min-width="150"
            prop="total_bonded"
            :label="$t('total_bonded')"
          >
            <template
              slot-scope="scope"
            >{{scope.row.total_bonded|accuracyFormat(tokenDetail.accuracy)}} {{formatSymbol('balances')}}</template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            min-width="120"
            prop="count_nominators"
            :label="$t('nominator')"
            fit
          >
            <template slot-scope="scope">
              <div :class="scope.row.count_nominators > 0 ? 'link' : 'defaul-cursor'">
                <router-link
                  :to="scope.row.count_nominators > 0 ? `/nominator?address=${scope.row.validator_stash}` : `${$route.fullPath}`"
                >{{scope.row.count_nominators}}</router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="120" prop="validator_prefs_value" :label="$t('commission')">
            <template slot-scope="scope">{{getCommission(scope.row.validator_prefs_value)}}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import Identicon from "@polkadot/vue-identicon";
import { mapState } from "vuex";
import { hashFormat, accuracyFormat } from "Utils/filters";
import { getCommission, bnPlus } from "../../utils/format";
import { BigNumber } from "bignumber.js";
export default {
  name: "Validators",
  components: {
    Identicon
  },
  data() {
    return {
      inputValue: "",
      isLoading: false,
      type: "",
      validators: [],
      isOnSearch: false,
      isBtnLoading: false,
      total: 0,
      currency: "ring",
      currentOrder: "",
      currentOrderField: ""
    };
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: "getValidatorData"
  },
  filters: {
    hashFormat,
    accuracyFormat
  },
  computed: {
    ...mapState({
      metadata: state => state.polka.metadata,
      token: state => state.polka.token,
      sourceSelected: state => state.global.sourceSelected
    }),
    tokenDetail() {
      if (this.token && this.token.detail) {
        if (this.sourceSelected === "kusama") {
          return this.token.detail[this.token.token];
        } else {
          return this.token.detail[this.currency.toUpperCase()];
        }
      }
      return {};
    },
    isWaiting() {
      return this.type === "waiting";
    },
    filteredValidators() {
      let keyWord = this.inputValue.toLowerCase();
      return this.validators.filter(function(validator) {
        if (validator) {
          if (
            validator.validator_stash &&
            validator.validator_stash.toLowerCase().includes(keyWord)
          ) {
            return true;
          } else if (
            validator.account_index &&
            validator.account_index.toLowerCase().includes(keyWord)
          ) {
            return true;
          } else if (
            validator.nickname &&
            validator.nickname.toLowerCase().includes(keyWord)
          ) {
            return true;
          }
        }
        return false;
      });
    }
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      this.getValidatorData();
    },
    search() {
      this.getValidatorData();
    },
    getCommission(perf) {
      return getCommission(perf, this.metadata.commissionAccuracy);
    },
    getTotalBonded(own, nominator) {
      return bnPlus(own, nominator).toString();
    },
    handleSortChange(change) {
      this.currentOrderField = change.prop || "";
      switch (change.order) {
        case "descending":
          this.currentOrder = "desc";
          break;
        case "ascending":
          this.currentOrder = "asc";
          break;
        default:
          this.currentOrder = "";
          this.currentOrderField = "";
          break;
      }
      if (this.currentOrderField === "total_bonded" && this.currentOrderField) {
        this.sortByTotalBonded();
      } else {
        this.getValidatorData();
      }
    },
    sortByTotalBonded() {
      this.validators.sort((prev, next) => {
        let prevTotal = new BigNumber(prev && prev.total_bonded);
        let nextTotal = new BigNumber(next && next.total_bonded);
        let result = prevTotal.minus(nextTotal);
        let sort = 0;
        if (result.isNegative()) {
          sort = this.currentOrder === "desc" ? 1 : -1;
        }
        if (result.isPositive()) {
          sort = this.currentOrder === "desc" ? -1 : 1;
        }
        if (result.isZero()) {
          sort = 0;
        }
        return sort;
      });
    },
    formatSymbol(module) {
      if (!this.$const[`SYMBOL/${this.sourceSelected}`]) {
        return "";
      }
      return this.$const[`SYMBOL/${this.sourceSelected}`][module].value || "";
    },
    getCurrency() {},
    async getValidatorData() {
      this.isLoading = true;
      let api = "polkaGetValidators";
      let type = this.$route.name;
      if (type && type === "waiting") {
        api = "polkaGetWaitingValidators";
        this.type = "waiting";
      } else {
        this.type = "";
      }
      const data = await this.$api[api]({
        page: this.currentPage,
        order: this.currentOrder,
        order_field: this.currentOrderField
      });
      this.validators = data.list || [];
      this.validators.forEach(validator => {
        if (validator) {
          validator.total_bonded = this.getTotalBonded(
            validator.bonded_owner,
            validator.bonded_nominators
          );
        }
      });
      this.total = +data.count || this.validators.length;
      this.isLoading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.transfer-wrapper {
  padding-top: 10px;
  .container {
    .table-top {
      .for-block {
        font-size: 14px;
        font-weight: bold;
        color: rgba(48, 43, 60, 1);
        .icon {
          padding-left: 10px;
          transform: translateY(2px);
        }
        .link {
          padding: 0 10px;
          color: var(--main-color);
          cursor: pointer;
        }
        .all {
          padding: 0 10px;
        }
      }
    }
    .transfer-table {
      min-height: 120px;
      margin-top: 10px;
      padding: 13px 20px;
      .defaul-cursor {
        a {
          cursor: auto;
        }
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
      }
      .icon-wrapper {
        width: 28px;
        height: 28px;
        text-align: center;
        line-height: 28px;
        border-radius: 50%;
        font-size: 12px;
        background-color: transparent;
        color: var(--main-color);
        border: 1px solid var(--main-color);
        &.top-ten {
          background-color: var(--main-color);
          color: #fff;
        }
      }
      .detail-btn {
        width: 48px;
        height: 26px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(219, 219, 219, 1);
        font-size: 10px;
        text-align: center;
        cursor: pointer;
        user-select: none;
      }
    }
    .table-bottom {
      margin-top: 20px;
      .download {
        width: 196px;
        height: 30px;
      }
    }
  }
  @media screen and (max-width: $screen-xs) {
    .container {
      .validator-search-wrapper {
        width: 220px;
      }
      .table-top {
        margin-top: 0;
        .for-block {
          .link {
            max-width: 250px;
            word-break: break-all;
          }
        }
      }
      .table-bottom {
        flex-direction: column;
        .pagination-component {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.transfer-wrapper {
  .signed-checkbox {
    .el-checkbox {
      .el-checkbox__input {
        .el-checkbox__inner {
          width: 22px;
          height: 22px;
          background-color: #fff;
          border-color: #dbdbdb;
          &::after {
            border-color: #000;
            border-width: 2px;
            height: 10px;
            left: 7px;
            top: 2px;
            width: 5px;
          }
        }
      }
      .el-checkbox__label {
        font-size: 14px;
        font-weight: bold;
        color: rgba(48, 43, 60, 1);
      }
    }
  }
  .container {
    .validator-search-wrapper {
      width: 290px;
      .el-input-group__append {
        overflow: hidden;
        background-color: var(--main-button-color);
        border-color: var(--main-button-color);
      }
      .el-input {
        .el-input__inner::placeholder {
          font-size: 14px;
          font-weight: 600;
          color: rgba(179, 179, 179, 1);
        }
      }
      .search-input {
        .search-button {
          display: block;
          width: 60px;
          padding: 0;
          font-size: 30px;
          background-color: var(--main-button-color);
        }
      }
    }
  }
  .transfer-table {
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
        }
      }
    }
  }
  &.is-waiting {
    .transfer-table {
      .el-table {
        .el-table__body-wrapper {
          overflow: hidden;
        }
      }
    }
  }
}
</style>
