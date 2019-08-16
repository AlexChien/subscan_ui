<template>
  <div class="transfer-item-wrapper">
    <div class="transfer-item-top">
      <div class="left">
        <div class="label">Hash</div>
        <el-tooltip class="item" effect="light" :content="transferData.hash" placement="top-start">
          <div class="value hash-v">{{transferData.hash}}</div>
        </el-tooltip>
      </div>
      <div class="right">{{transferData.block_timestamp|timeAgo}}</div>
    </div>
    <div class="transfer-item-bottom">
      <div class="left">
        <div class="label">From</div>
        <div class="value">
          <el-tooltip
            class="item"
            effect="light"
            :content="transferData.from"
            placement="top-start"
          >
            <div class="from">{{transferData.from}}</div>
          </el-tooltip>
          <div class="separator">&nbsp;To&nbsp;&nbsp;</div>
          <el-tooltip class="item" effect="light" :content="transferData.to" placement="top-start">
            <div class="to">{{transferData.to}}</div>
          </el-tooltip>
        </div>
      </div>
      <div class="right">{{transferData.amount}} DOT</div>
    </div>
  </div>
</template>

<script>
import { timeAgo } from "Utils/filters";
export default {
  props: {
    transferData: {
      type: Object,
      required: true
    }
  },
  filters: {
    timeAgo
  }
};
</script>

<style lang="scss" scoped>
.transfer-item-wrapper {
  box-sizing: border-box;
  height: 80px;
  padding: 16px 0 20px;
  .transfer-item-top,
  .transfer-item-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      .label {
        width: 59px;
      }
    }
  }
  .transfer-item-top {
    // transform: translateY(-3px);
    .left {
      .label {
        font-size: 13px;
        font-weight: 600;
        color: rgba(19, 18, 18, 1);
      }
      .value {
        font-size: 14px;
        font-weight: 600;
        color: $main-color;
        cursor: pointer;
        width: 308px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .right {
      font-size: 14px;
      font-weight: 600;
      color: rgba(152, 149, 159, 1);
    }
  }
  .transfer-item-bottom {
    padding-top: 7px;
    font-size: 12px;
    .left {
      .label {
        font-weight: 600;
        color: rgba(152, 149, 159, 1);
      }
      .value {
        display: flex;
        .from,
        .to {
          cursor: pointer;
          font-weight: 400;
          color: rgba(230, 1, 122, 1);
          width: 86px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .separator {
          font-weight: 600;
          color: rgba(152, 149, 159, 1);
        }
      }
    }
    .right {
      font-size: 14px;
      font-weight: bold;
      color: $main-color;
      line-height: 20px;
    }
  }
}
</style>