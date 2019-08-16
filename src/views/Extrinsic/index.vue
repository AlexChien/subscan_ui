<template>
  <div class="extrinsic-wrapper subscan-content">
    <div class="container">
      <search-input
        class="search-input"
        :selectList="selectList"
        placeholder="Search by Block / Extrinsic / Account"
      />
      <div class="table-top">
        <div class="for-block">
          <span>For</span>
          <span>{{` All （${total}）`}}</span>
        </div>
        <div class="signed-checkbox">
          <el-checkbox v-model="signedChecked" @change="signedChange">Signed only</el-checkbox>
        </div>
      </div>
      <div class="extrinsic-table subscan-card" v-loading="isLoading">
        <el-table :data="extrinsicsData" style="width: 100%">
          <el-table-column prop="extrinsic_index" label="Extrinsic ID" width="160">
            <template slot-scope="scope">
              <div class="link">
                <span>{{scope.row.extrinsic_index}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="block_num" label="Block" width="160">
            <template slot-scope="scope">
              <div class="link">
                <div class="link">
                  <span>{{scope.row.block_num}}</span>
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
                  <span>{{scope.row.extrinsic_hash|hashFormat}}</span>
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
          <el-table-column width="120">
            <template slot-scope="scope">
              <div class="detail-btn">
                <icon-svg icon-class="detail-arrow" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-bottom">
        <div class="download">
          <csv-download @downloadClick="downloadClick" />
        </div>
        <pagination :page-size="25" :total="total" @currentChange="currentChange" />
      </div>
    </div>
  </div>
</template>
<script>
import XLSX from "xlsx";
import moment from "moment";
import SearchInput from "Components/SearchInput";
import CsvDownload from "Components/CsvDownload";
import Pagination from "Components/Pagination";
import { timeAgo, hashFormat } from "Utils/filters";
export default {
  name: "Dashboard",
  components: {
    SearchInput,
    CsvDownload,
    Pagination
  },
  data() {
    return {
      isLoading: false,
      extrinsicsData: [],
      currentPage: 0,
      total: 0,
      signedChecked: true,
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
  filters: {
    timeAgo,
    hashFormat
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      this.getExtrinsicData();
    },
    async getExtrinsicData(page = 0) {
      this.isLoading = true;
      const data = await this.$api["polkaGetExtrinsics"]({
        row: 25,
        page,
        signed: this.signedChecked ? "signed" : "all"
      });
      this.extrinsicsData = data.extrinsics;
      this.total = +data.count;
      this.isLoading = false;
    },
    downloadClick() {
      const tableData = [
        [
          "Extrinsic ID",
          "Block",
          "Extrinsic Hash",
          "Block Timestamp",
          "Result",
          "Action",
        ]
      ];
      this.extrinsicsData.forEach(item => {
        let arr = [
          item.extrinsic_index,
          item.block_num,
          item.extrinsic_hash,
          moment(item.block_timestamp * 1000).format(),
          item.success,
          item.call_module
        ];
        tableData.push(arr);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
      XLSX.writeFile(
        new_workbook,
        `extrinsic-${this.extrinsicsData[this.extrinsicsData.length - 1].extrinsic_index}-${this.extrinsicsData[0].extrinsic_index}.csv`
      );
    },
    currentChange(pageSize) {
      this.getExtrinsicData(pageSize);
      this.currentPage = pageSize;
    },
    signedChange() {
      this.getExtrinsicData(this.currentPage);
    }
  }
};
</script>
<style lang="scss" scoped>
.extrinsic-wrapper {
  .container {
    .search-input {
      height: 50px;
    }
    .table-top {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .for-block {
        font-size: 14px;
        font-weight: bold;
        color: rgba(48, 43, 60, 1);
      }
    }
    .extrinsic-table {
      min-height: 120px;
      margin-top: 10px;
      padding: 13px 20px;
      .link {
        color: $main-color;
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      .download {
        width: 196px;
        height: 30px;
      }
    }
  }
}
</style>
<style lang="scss">
.extrinsic-wrapper {
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
  .extrinsic-table {
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
