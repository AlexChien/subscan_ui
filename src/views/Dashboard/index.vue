<template>
  <div class="dashboard-wrapper subscan-content">
    <div class="container">
      <div class="metadata-chart-wrapper space-between">
        <meta-data class="metadata-component" />
        <chartPie class="chart-component" />
      </div>
      <div class="blocks-transfers-wrapper space-between">
        <latest-blocks class="latest-blocks-component" :currentTime="currentTime" />
        <transfers class="transfers-component" :currentTime="currentTime" />
      </div>
    </div>
  </div>
</template>
<script>
import MetaData from "./metadata";
import ChartPie from "./chartPie";
import { mapState } from "vuex";
import LatestBlocks from "./latestBlocks";
import Transfers from "./transfers";

export default {
  name: "Dashboard",
  components: {
    MetaData,
    ChartPie,
    LatestBlocks,
    Transfers
  },
  data() {
    return {
      currentTime: Date.now(),
      selectList: [
        {
          label: this.$t('all'),
          value: "all"
        },
        {
          label: this.$t('block'),
          value: "block"
        },
        {
          label: this.$t('extrinsic'),
          value: "extrinsic"
        },
        {
          label: this.$t('account'),
          value: "account"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      sourceSelected: state => state.global.sourceSelected,
      token: state => state.polka.token
    })
  },
  created() {
    this.init();
    this.w = new Worker('/' + "timeWorker.js");
    this.w.onmessage = () => {
      this.changeTime();
    };
  },
  beforeDestroy() {
    // 销毁 worker
    if (this.w && typeof this.w.terminate === "function") {
      this.w.terminate();
    }
    this.$loop.removeLoop("dashborad");
  },
  methods: {
    async init() {
      // await this.getData();
      this.$loop.addLoop(
        "dashborad",
        () => {
          return this.getData();
        },
        true
      );
    },
    async getToken() {
      await Promise.all([
        this.$store.dispatch("SetToken")
      ]);
    },
    async getData() {
      await Promise.all([
        this.$store.dispatch("SetLatestBlocks", { row: 25, page: 0 }),
        // this.$store.dispatch("SetLatestExtrinsics", { row: 25, page: 0 }),
        this.$store.dispatch("SetTransfers", { row: 25, page: 0 }),
      ]);
    },
    changeTime() {
      this.currentTime = Date.now();
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
  @media screen and (max-width:$screen-xs) {
    .container {
      .metadata-chart-wrapper {
        height: inherit;
        flex-direction: column;
        .metadata-component {
          width: 100%;
        }
        .chart-component {
          margin-top: 20px;
          width: 100%;
          height: 196px;
        }
      }
      .blocks-transfers-wrapper {
        flex-direction: column;
        width: 100%;
        .latest-blocks-component,
        .transfers-component {
          width: 100%;
        }
        .transfers-component {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
