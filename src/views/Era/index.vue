<template>
  <div class="era-wrapper subscan-content">
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
            <router-link class="link" :to="`/validator/${$route.query.address}`">{{validatorIndex}}</router-link>
          </template>
          <div v-else class="all">{{$t('all')}}</div>
          <div>{{`(${total})`}}</div>
        </div>
      </div>
      <div class="era-table subscan-card" v-loading="isLoading">
        <el-table :data="eras" style="width: 100%" ref="eraTable">
          <el-table-column min-width="100" prop="era" :label="$t('era')">
            <template slot-scope="scope">{{scope.row.era}}</template>
          </el-table-column>
          <el-table-column min-width="100" prop="start_block_num" :label="$t('start_block')">
            <template slot-scope="scope">
              <div class="link">
                <router-link
                  :to="`/block/${scope.row.start_block_num}`"
                >{{scope.row.start_block_num}}</router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" prop="end_block_num" :label="$t('end_block')">
            <template slot-scope="scope">
              <div class="link">
                <router-link :to="`/block/${scope.row.end_block_num}`">{{scope.row.end_block_num}}</router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="hasReward" min-width="150" prop="reward" :label="$t('reward')">
            <template slot-scope="scope">
              <div v-if="scope.row.reward === '0'">-</div>
              <div
                v-else
              >{{scope.row.reward|accuracyFormat(currencyTokenDetail.accuracy)}} {{formatSymbol('balances')}}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" prop="slash" :label="$t('slash')">
            <template slot-scope="scope">
              <div v-if="scope.row.slash === '0'">-</div>
              <div
                v-else
              >{{scope.row.slash|accuracyFormat(tokenDetail.accuracy)}} {{formatSymbol('balances', true)}}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" prop="block_produced" :label="$t('blocks_produced')">
            <template slot-scope="scope">
              <div
                class="link toggle-row"
                @click="toggleRowExpansion(scope.row)"
              >{{getBlockProduced(scope.row.block_produced).length}}</div>
            </template>
          </el-table-column>
          <el-table-column width="100" type="expand">
            <template slot-scope="props">
              <div class="expand-form">
                <div v-if="props.row.block_produced && props.row.block_produced.length > 0">
                  <div class="form-item align-items-center">
                    <div class="label">{{$t('blocks_produced')}} :</div>
                    <div class="block-produced-items">
                      <div
                        class="block-produced-item link"
                        v-for="item in getBlockProduced(props.row.block_produced)"
                        :key="item"
                      >
                        <router-link :to="`/block/${item}`">{{item}}</router-link>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="label">{{$t('no_data')}}</div>
                </div>
              </div>
            </template>
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
import { getTokenDetail, getCurrencyTokenDetail, formatSymbol } from "../../utils/tools";
export default {
  name: "era",
  components: {
    SearchInput,
    CsvDownload,
    Pagination,
    Identicon
  },
  data() {
    return {
      isLoading: false,
      eras: [],
      validatorInfo: {},
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
      return getTokenDetail(this.token, this.sourceSelected, this.currency);
    },
    currencyTokenDetail() {
      return getCurrencyTokenDetail(this.token, this.sourceSelected, this.currency);
    },
    validatorIndex() {
      let info = this.validatorInfo;
      return info.nickname || info.account_index || info.validator_stash;
    },
    hasReward() {
      let result = false;
      this.eras &&
        this.eras.forEach(era => {
          if (era && era.reward !== "0") {
            result = true;
          }
        });
      return result;
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
      this.getEraData();
    },
    toggleRowExpansion(row) {
      this.$refs.eraTable.toggleRowExpansion(row, true);
    },
    getBlockProduced(blockProduced) {
      let blocks = [];
      if (blockProduced) {
        blocks = blockProduced.split(",");
      }
      return blocks;
    },
    formatSymbol(module, isValidate) {
      return formatSymbol(module, this.$const, this.sourceSelected, isValidate);
    },
    async getEraData(page = 0) {
      const data = await this.$api["polkaGetEras"]({
        row: 25,
        page,
        address: this.$route.query.address
      });
      const validatorInfo = await this.$api["polkaGetValidator"]({
        Stash: this.$route.query.address
      });
      this.validatorInfo = (validatorInfo && validatorInfo.info) || {};
      if (data.list) {
        this.eras = data.list;
      } else {
        this.eras = [];
      }
      this.total = +data.count;
      this.isLoading = false;
    },
    downloadClick() {
      const tableData = [
        [
          this.$t("era"),
          this.$t("start_block_num"),
          this.$t("end_block_num"),
          this.$t("reward"),
          this.$t("slash"),
          this.$t("block_produced")
        ]
      ];
      this.eras.forEach(item => {
        let arr = [
          item.era,
          item.start_block_num,
          item.end_block_num,
          item.reward,
          item.slash,
          item.block_produced
        ];
        tableData.push(arr);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
      XLSX.writeFile(
        new_workbook,
        `era-${this.eras[this.eras.length - 1].era}-${this.eras[0].era}.csv`
      );
    },
    currentChange(pageSize) {
      this.getEraData(--pageSize);
    }
  }
};
</script>
<style lang="scss" scoped>
.era-wrapper {
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
    .era-table {
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
      .toggle-row {
        cursor: pointer;
      }
      .block-produced-item {
        display: inline-block;
        margin-right: 10px;
        &::after {
          content: ",";
        }
        &:last-child {
          &::after {
            content: "";
          }
        }
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
.era-wrapper {
  .era-table {
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
</style>
