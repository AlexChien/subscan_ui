<template>
  <div class="transfers-wrapper">
    <div class="header-content space-between">
      <div class="header-left align-items-center">
        <icon-svg class="icon" icon-class="transfers" />
        <span class="title">{{$t('transfers')}}</span>
      </div>
      <div class="header-right">
        <router-link class="all-link" tag="div" to="/transfer">{{$t('all')}}</router-link>
      </div>
    </div>
    <el-scrollbar
      wrap-class="data-list subscan-card"
      view-class="view-box"
      :native="false"
      v-loading="typeof transfers === 'undefined' && sourceSelected === 'darwinia'"
    >
      <div v-if="sourceSelected === 'kusama_cc3'" class="transfer-placeholder-kusama-cc3">
        <div class="coming-soon">
          <img class="not-found-img" src="./../../assets/images/kusama-empty.png" alt="coming soon" />
          <div class="info">{{$t('kusama.transfer')}}</div>
        </div>
      </div>
      <div v-else-if="sourceSelected === 'kusama'" class="transfer-placeholder-kusama">
        <div class="not-found">
          <img class="not-found-img" src="./../../assets/images/no-data.png" alt="no data" />
        </div>
      </div>
      <transfer-item
        v-else
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
      transfers: state => state.polka.transfers,
      sourceSelected: state => state.global.sourceSelected
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
  .not-found {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
  }
  .coming-soon {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .info {
      color: #98959F;
      font-size:14px;
      font-weight: bold;
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
    position: relative;
    .transfer-item {
      box-sizing: border-box;
    }
    .transfer-item:not(:last-child) {
      border-bottom: 1px solid #e7eaf3;
    }
  }
}
.transfers-wrapper {
  @media screen and (max-width:$screen-xs) {
    .el-scrollbar {
      .data-list {
        max-height: 520px;
        overflow: hidden;
      }
    }
  }
}
</style>
