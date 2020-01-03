<template>
  <div class="nominator-wrapper subscan-content">
    <div class="container">
      <search-input
        class="search-input"
        :selectList="selectList"
        :placeholder="$t('placeholder.search_by')"
      />
      <div class="table-top space-between align-items-center">
        <div class="for-block align-items-center">
          <div>{{$t('validator_hash_tag')}}</div>
          <template v-if="$route.query.address">
            <router-link class="link" :to="`/validator/${$route.query.address}`">{{$route.query.address}}</router-link>
          </template>
          <div v-else class="all">{{$t('all')}}</div>
          <div>{{`(${total})`}}</div>
        </div>
      </div>
      <div class="nominator-table subscan-card" v-loading="isLoading">
        <el-table :data="nominators" style="width: 100%">
          <el-table-column min-width="190" prop="nominator_stash" :label="$t('nominator')">
            <template slot-scope="scope">
              <div class="link align-items-center">
                <div class="icon identicon">
                  <identicon
                    :size="24"
                    theme="polkadot"
                    :value="scope.row.nominator_stash"
                  />
                </div>
                <router-link :to="`/account/${scope.row.nominator_stash}`">{{scope.row.nominator_stash}}</router-link>
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
          <el-table-column min-width="100" prop="share" :label="$t('share')">
            <template slot-scope="scope">{{scope.row.share}}</template>
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
import { fmtPercentage } from '../../utils/format';
export default {
  name: "Nominator",
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
      sourceSelected: state => state.global.sourceSelected,
      token: state => state.polka.token
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
      this.getNominatorData();
    },
    formatSymbol(module) {
      if (!this.$const[`SYMBOL/${this.sourceSelected}`]) {
        return "";
      }

      return this.$const[`SYMBOL/${this.sourceSelected}`][module].value || "";
    },
    async getNominatorData(page = 0) {
      const data = await this.$api["polkaGetNominators"]({
        row: 25,
        page,
        address: this.$route.query.address
      });
      const validatorInfo = await this.$api["polkaGetValidator"]({
        Stash: this.$route.query.address
      });
      let info = validatorInfo && validatorInfo.info;
      let total = (info && info.bonded_nominators) || 0;
      if (data.list) {
        this.nominators = data.list.map(function(val) {
          let obj = {};
          obj.nominator_stash = val.nominator_stash;
          obj.bonded = val.bonded;
          obj.hash = val.hash;
          if (total) {
            obj.share = fmtPercentage(val.bonded, total, 2) + '%';
          }
          return obj;
        });
      } else {
        this.nominators = [];
      }
      this.total = +data.count;
      this.isLoading = false;
    },
    downloadClick() {
      const tableData = [
        [
          this.$t("account"),
          this.$t("voted"),
          this.$t("share")
        ]
      ];
      this.nominators.forEach(item => {
        let arr = [
          item.nominator_stash,
          item.bonded,
          item.rank_nominator
        ];
        tableData.push(arr);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
      XLSX.writeFile(
        new_workbook,
        `nominator-${this.nominators[this.nominators.length - 1].nominator_stash}-${this.nominators[0].nominator_stash}.csv`
      );
    },
    currentChange(pageSize) {
      this.getNominatorData(--pageSize);
    }
  }
};
</script>
<style lang="scss" scoped>
.nominator-wrapper {
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
    .nominator-table {
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
.nominator-wrapper {
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
  .nominator-table {
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
