<template>
  <div class="transfers-wrapper">
    <div class="header-content space-between">
      <div class="header-left align-items-center">
        <icon-svg class="icon" icon-class="transfers" />
        <span class="title">Transfers</span>
      </div>
      <div class="header-right">
        <router-link class="all-link" tag="div" to="/transfer">All</router-link>
      </div>
    </div>
    <el-scrollbar
      wrap-class="data-list subscan-card"
      view-class="view-box"
      :native="false"
      v-loading="transfers.length===0"
    >
      <transfer-item
        class="transfer-item"
        v-for="transfer in transfers"
        :key="transfer.extrinsic_index"
        :transferData="transfer"
        :currentTime="currentTime"
      />
    </el-scrollbar>
  </div>
</template>

<script>
import transferItem from "./transferItem";
import { mapState } from "vuex";
export default {
  components: {
    transferItem
  },
  computed: {
    ...mapState({
      transfers: state => state.polka.transfers || []
    })
  },
  props: {
    currentTime: {
      type: Number
    }
  }
};
</script>

<style lang="scss" scoped>
.transfers-wrapper {
  .header-content {
    margin-bottom: 10px;
    .header-left {
      height: 30px;
      .icon {
        font-size: 30px;
      }
      .title {
        padding-left: 8px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(48, 43, 60, 1);
      }
    }
    .header-right {
      .all-link {
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        width: 90px;
        background: var(--main-button-color);
        border-radius: 2px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
}
</style>
<style lang="scss">
.el-scrollbar {
  .data-list {
    max-height: calc(100vh - 421px);
    min-height: 400px;
    background: #fff;
    box-sizing: border-box;
    padding: 0 20px;
    .transfer-item {
      box-sizing: border-box;
    }
    .transfer-item:not(:last-child) {
      border-bottom: 1px solid #e7eaf3;
    }
  }
}
</style>
