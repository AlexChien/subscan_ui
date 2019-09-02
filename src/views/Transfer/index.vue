<template>
  <div class="transfer-wrapper subscan-content">
    <div class="container">
      <search-input
        class="search-input"
        :selectList="selectList"
        placeholder="Search by Block / Extrinsic / Account"
      />
      <div class="table-top space-between align-items-center">
        <div class="for-block align-items-center">
          <div>For</div>
          <template v-if="$route.query.address">
            <div class="icon">
              <identicon :size="30" theme="polkadot" :value="$route.query.address" />
            </div>
            <div
              class="link"
              @click="$router.push(`/account/${$route.query.address}`)"
            >{{` ${$route.query.address} `}}</div>
          </template>
          <div v-else class="all">All</div>
          <div>{{`(${total})`}}</div>
        </div>
      </div>
      <div class="transfer-table subscan-card" v-loading="isLoading">
        <el-table :data="transfersData" style="width: 100%">
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
                <span @click="$router.push(`/block/${scope.row.block_num}`)">{{scope.row.block_num}}</span>
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
import moment from "moment";
import { mapState } from "vuex";
import SearchInput from "Components/SearchInput";
import CsvDownload from "Components/CsvDownload";
import Pagination from "Components/Pagination";
import { timeAgo, hashFormat } from "Utils/filters";
export default {
  name: "Transfer",
  components: {
    SearchInput,
    CsvDownload,
    Pagination,
    Identicon
  },
  data() {
    return {
      isLoading: false,
      transfersData: [],
      total: 0,
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
  computed: {
    ...mapState({
      transfers: state => state.polka.transfers
    })
  },
  filters: {
    timeAgo,
    hashFormat
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      if (this.transfers.length > 0) {
        this.transfersData = this.transfers;
      } else {
        this.isLoading = true;
      }
      this.getTransferData();
    },
    async getTransferData(page = 0) {
      const data = await this.$api["polkaGetTransfers"]({
        row: 25,
        page,
        address: this.$route.query.address
      });
      this.transfersData = data.transfers || [];
      this.total = +data.count;
      this.isLoading = false;
      if (page == 0) {
        this.$store.commit("SET_TRANSFERS", data.transfers);
      }
    },
    downloadClick() {
      const tableData = [
        [
          "Extrinsic ID",
          "Block",
          "Block Timestamp",
          "From",
          "To",
          "Value",
          "Result",
          "Hash"
        ]
      ];
      this.transfersData.forEach(item => {
        let arr = [
          item.extrinsic_index,
          item.block_num,
          moment(item.block_timestamp * 1000).format(),
          item.from,
          item.to,
          item.amount,
          item.success,
          item.hash
        ];
        tableData.push(arr);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
      XLSX.writeFile(
        new_workbook,
        `transfer-${this.transfersData[this.transfersData.length - 1].extrinsic_index}-${this.transfersData[0].extrinsic_index}.csv`
      );
    },
    currentChange(pageSize) {
      this.getTransferData(--pageSize);
    }
  }
};
</script>
<style lang="scss" scoped>
.transfer-wrapper {
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
    .transfer-table {
      min-height: 120px;
      margin-top: 10px;
      padding: 13px 20px;
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
            border-color: #5930dd;
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
          font-weight: 600;
          padding: 0;
        }
      }
    }
  }
}
</style>
