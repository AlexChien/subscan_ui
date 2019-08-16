<template>
  <div class="latest-blocks-wrapper">
    <div class="header-content">
      <div class="header-left">
        <icon-svg class="icon" icon-class="latest-blocks" />
        <span class="title">Latest blocks</span>
      </div>
      <div class="header-right">
        <router-link class="all-link" tag="div" to="/block">All</router-link>
      </div>
    </div>
    <el-scrollbar
      wrap-class="data-list subscan-card"
      view-class="view-box"
      :native="false"
      v-loading="latestBlocks.length===0"
    >
      <block-item
        class="block-item"
        v-for="block in latestBlocks"
        :key="block.block_num"
        :blockData="block"
      />
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import blockItem from "./blockItem";
export default {
  components: {
    blockItem
  },
  computed: {
    ...mapState({
      latestBlocks: state => state.polka.latestBlocks
    })
  }
};
</script>

<style lang="scss" scoped>
.latest-blocks-wrapper {
  .header-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .header-left {
      height: 30px;
      display: flex;
      align-items: center;
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
        background: rgba(230, 1, 122, 1);
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
    .block-item {
      box-sizing: border-box;
    }
    .block-item:not(:last-child) {
      border-bottom: 1px solid #e7eaf3;
    }
  }
}
</style>