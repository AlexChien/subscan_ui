<template>
  <div class="vote-wrapper subscan-content">
    <div class="container">
      <search-input
        class="search-input"
        :selectList="selectList"
        :placeholder="$t('placeholder.search_by')"
      />
      <div class="table-top space-between align-items-center">
        <div class="for-block align-items-center">
          <div>{{$t('for')}}</div>
          <template v-if="$route.query.address">
            <router-link
              class="link"
              :to="`/account/${$route.query.address}`"
            >{{$route.query.address}}</router-link>
          </template>
          <div v-else class="all">{{$t('all')}}</div>
          <div>{{`(${total})`}}</div>
        </div>
      </div>
      <div class="vote-table subscan-card" v-loading="isLoading">
        <el-table :data="nominators" style="width: 100%">
          <el-table-column min-width="150" prop="nominator_stash" :label="$t('validator')">
            <template slot-scope="scope">
              <div class="link">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.validator_stash"
                  placement="top-start"
                >
                  <router-link
                    :to="`/validator/${scope.row.validator_stash}`"
                  >{{scope.row.validator_stash | hashFormat}}</router-link>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" prop="bonded_owner" :label="$t('validator_bonded')">
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.bonded_owner|accuracyFormat(tokenDetail.accuracy)}} {{formatSymbol('balances')}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" prop="total_bonded" :label="$t('total_bonded')">
            <template slot-scope="scope">
              <div>
                <span>{{getTotalBonded(scope.row.bonded_nominators, scope.row.bonded_owner)|accuracyFormat(tokenDetail.accuracy)}} {{formatSymbol('balances')}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="100" prop="count_nominators" :label="$t('nominator')">
            <template slot-scope="scope">
              <div :class="{link:scope.row.count_nominators > 0}">
                <router-link
                  :to="scope.row.count_nominators > 0 ? `/nominator?address=${scope.row.validator_stash}`: `${$route.fullPath}`"
                >{{scope.row.count_nominators}}</router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="110" prop="validator_prefs_value" :label="$t('commission')">
            <template slot-scope="scope">
              <div>
                <span>{{getCommission(scope.row.validator_prefs_value)}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="100" prop="my_share" :label="$t('my_share')">
            <template
              slot-scope="scope"
            >{{getMyShare(scope.row.bonded, getTotalBonded(scope.row.bonded_nominators, scope.row.bonded_owner), 2)}}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-bottom space-between align-items-center">
        <div class="download">
          <csv-download @downloadClick="downloadClick" />
        </div>
        <pagination :page-size="25" :total="total" @currentChange="currentChange" />
      </div>
    </div>
  </div>
</template>
<script>
import Identicon from "@polkadot/vue-identicon";
import XLSX from "xlsx";
import { mapState } from "vuex";
import SearchInput from "@/views/Components/SearchInput";
import CsvDownload from "Components/CsvDownload";
import Pagination from "Components/Pagination";
import { timeAgo, hashFormat, accuracyFormat } from "Utils/filters";
import { fmtPercentage, getCommission, bnPlus } from "../../utils/format";
export default {
  name: "Vote",
  components: {
    SearchInput,
    CsvDownload,
    Pagination,
    Identicon
  },
  data() {
    return {
      isLoading: false,
      nominators: [],
      total: 0,
      currency: "ring",
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
  filters: {
    timeAgo,
    hashFormat,
    accuracyFormat
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      this.isLoading = true;
      this.getVoteData();
    },
    formatSymbol(module) {
      if (!this.$const[`SYMBOL/${this.sourceSelected}`]) {
        return "";
      }

      return this.$const[`SYMBOL/${this.sourceSelected}`][module].value || "";
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
    async getVoteData(page = 0) {
      const data = await this.$api["polkaGetVotes"]({
        row: 25,
        page,
        address: this.$route.query.address
      });
      this.nominators = data.list || [];
      this.total = this.nominators.length;
      this.isLoading = false;
    },
    downloadClick() {
      const tableData = [
        [this.$t("account"), this.$t("voted"), this.$t("share")]
      ];
      this.nominators.forEach(item => {
        let arr = [item.nominator_stash, item.bonded, item.rank_nominator];
        tableData.push(arr);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
      XLSX.writeFile(
        new_workbook,
        `vote-${this.nominators[this.nominators.length - 1].nominator_stash}-${this.nominators[0].nominator_stash}.csv`
      );
    },
    currentChange(pageSize) {
      this.getVoteData(--pageSize);
    }
  }
};
</script>
<style lang="scss" scoped>
.vote-wrapper {
  .container {
    .search-input {
      height: 50px;
    }
    .table-top {
      margin-top: 20px;
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
    .vote-table {
      min-height: 120px;
      margin-top: 10px;
      padding: 13px 20px;
      .link {
        color: var(--link-color);
        span {
          cursor: pointer;
        }
      }
      .icon {
        vertical-align: -0.5em;
        margin-right: 10px;
        font-size: 26px;
        user-select: none;
      }
      .icon-wrapper {
        width: 26px;
        height: 26px;
        font-size: 26px;
        border-radius: 50%;
        background-color: var(--main-color-white);
        color: var(--main-color);
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
.vote-wrapper {
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
  .vote-table {
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
}
</style>
