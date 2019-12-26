<template>
  <div class="validator-wrapper subscan-content">
    <div class="container">
      <search-input
        class="search-input"
        :selectList="selectList"
        :placeholder="$t('placeholder.search_by')"
      />
      <div class="metadata-chart-wrapper space-between">
        <meta-data class="metadata-component" />
        <chartPie class="chart-component" />
      </div>
      <Validators />
    </div>
  </div>
</template>
<script>
import MetaData from "./metadata";
import ChartPie from "./chartPie";
import Validators from "./validators";
import SearchInput from "@/views/Components/SearchInput";

export default {
  name: "Validator",
  components: {
    MetaData,
    Validators,
    ChartPie,
    SearchInput
  },
  data() {
    return {
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
  methods: {
  }
};
</script>
<style lang="scss" scoped>
.validator-wrapper {
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
  }
  @media screen and (max-width: $screen-xs) {
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
    }
  }
}
</style>
