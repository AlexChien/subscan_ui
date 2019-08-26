<template>
  <div class="dashboard-wrapper subscan-content">
    <div class="container">
      <search-input
        class="search-input"
        :selectList="selectList"
        placeholder="Search by Block / Extrinsic / Account"
      />
      <div class="metadata-chart-wrapper space-between">
        <metadata class="metadata-component" />
        <chart class="chart-component" />
      </div>
      <div class="blocks-transfers-wrapper space-between">
        <latest-blocks class="latest-blocks-component" />
        <transfers class="transfers-component" />
      </div>
    </div>
  </div>
</template>
<script>
import SearchInput from "Components/SearchInput";
import Metadata from "./metadata";
import Chart from "./chart";
import LatestBlocks from "./latestBlocks";
import Transfers from "./transfers";
import moment from "moment";

export default {
  name: "Dashboard",
  components: {
    SearchInput,
    Metadata,
    Chart,
    LatestBlocks,
    Transfers
  },
  data() {
    return {
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
    this.init();
  },

  methods: {
    init() {
      this.getData();
    },
    async getData() {
      const end = moment();
      const start = moment().subtract(15, "days");
      Promise.all([
        this.$store.dispatch("SetMetadata"),
        this.$store.dispatch("SetLatestBlocks", { row: 25, page: 0 }),
        // this.$store.dispatch("SetLatestExtrinsics", { row: 25, page: 0 }),
        this.$store.dispatch("SetTransfers", { row: 25, page: 0 }),
        this.$store.dispatch("SetDailyChart", { start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') })
      ]);
    }
  }
};
</script>
<style lang="scss" scoped>
.dashboard-wrapper {
  .container {
    .search-input {
      height: 50px;
    }
    .metadata-chart-wrapper {
      margin-top: 20px;
      height: 156px;
      .metadata-component {
        width: 780px;
      }
      .chart-component {
        width: 380px;
      }
    }
    .blocks-transfers-wrapper {
      margin-top: 30px;
      .latest-blocks-component,
      .transfers-component {
        width: 580px;
      }
    }
  }
}
</style>
