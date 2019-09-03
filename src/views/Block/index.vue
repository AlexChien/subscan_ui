<template>
  <div class="block-wrapper subscan-content">
    <div class="container">
      <search-input
        class="search-input"
        :selectList="selectList"
        placeholder="Search by Block / Extrinsic / Account"
      />
      <div class="block-table subscan-card" v-loading="isLoading">
        <el-table :data="blockData" style="width: 100%">
          <el-table-column prop="block_num" label="Block" width="180">
            <template slot-scope="scope">
              <div class="link" @click="$router.push(`/block/${scope.row.block_num}`)">
                <span>{{scope.row.block_num}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="block_timestamp" label="Age" width="200">
            <template slot-scope="scope">{{scope.row.block_timestamp|timeAgo}}</template>
          </el-table-column>
          <el-table-column prop="extrinsics_count" label="Extrinsics" width="120">
            <template slot-scope="scope">
              <div :class="{link:scope.row.extrinsics_count>0}">
                <span>{{scope.row.extrinsics_count}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="event_count" label="Events" width="120">
            <!-- <template slot-scope="scope">
              <div :class="{link:scope.row.event_count>0}">
                <span>{{scope.row.event_count}}</span>
              </div>
            </template> -->
          </el-table-column>
          <el-table-column prop="validator" label="Validator" fit>
            <template slot-scope="scope">
              <div class="link">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.validator"
                  placement="top-start"
                >
                  <span>{{scope.row.validator|hashFormat}}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="hash" label="Block hash" fit>
            <template slot-scope="scope">
              <div class="link">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.hash"
                  placement="top-end"
                >
                  <span @click="$router.push(`/block/${scope.row.hash}`)">{{scope.row.hash|hashFormat}}</span>
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
import XLSX from "xlsx";
import moment from "moment";
import { mapState } from "vuex";
import SearchInput from "@/views/Components/SearchInput";
import CsvDownload from "Components/CsvDownload";
import Pagination from "Components/Pagination";
import { timeAgo, hashFormat } from "Utils/filters";
export default {
  name: "Block",
  components: {
    SearchInput,
    CsvDownload,
    Pagination
  },
  data() {
    return {
      isLoading: false,
      blockData: [],
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
      latestBlocks: state => state.polka.latestBlocks
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
      if (this.latestBlocks.length > 0) {
        this.blockData = this.latestBlocks;
      } else {
        this.isLoading = true;
      }
      this.getBlockData();
    },
    async getBlockData(page = 0) {
      const data = await this.$api["polkaGetBlocks"]({ row: 25, page });
      this.blockData = data.blocks;
      this.total = +data.count;
      if (page == 0) {
        this.$store.commit("SET_LATEST_BLOCKS", data.blocks);
      }
      this.isLoading = false;
    },
    downloadClick() {
      const tableData = [
        [
          "Block",
          "Block Timestamp",
          "Extrinsics",
          "Events",
          "Validator",
          "Block hash"
        ]
      ];
      this.blockData.forEach(item => {
        let arr = [
          item.block_num,
          moment(item.block_timestamp * 1000).format(),
          item.extrinsics_count,
          item.event_count,
          item.validator,
          item.hash
        ];
        tableData.push(arr);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
      XLSX.writeFile(
        new_workbook,
        `block-${this.blockData[this.blockData.length - 1].block_num}-${this.blockData[0].block_num}.csv`
      );
    },
    currentChange(pageSize) {
      this.isLoading = true;
      this.getBlockData(--pageSize);
    }
  }
};
</script>
<style lang="scss" scoped>
.block-wrapper {
  .container {
    .search-input {
      height: 50px;
    }
    .block-table {
      min-height: 120px;
      margin-top: 10px;
      padding: 13px 20px;
      .link {
        color: var(--main-color);
        span {
          cursor: pointer;
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
}
</style>
<style lang="scss">
.block-wrapper {
  .block-table {
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
