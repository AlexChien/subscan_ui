<template>
  <div class="block-item-wrapper space-between">
    <div class="block-left">
      <div class="block-num align-items-center">
        <div class="label">{{$t('block_hash_tag')}}</div>
        <div class="value link">
          <router-link
            :to="`/block/${blockData.block_num}`"
          >{{+blockData.block_num|toThousandslsFilter}}</router-link>
        </div>
      </div>
      <div class="block-includes align-items-center">
        <div class="label">{{$t('includes')}}</div>
        <div class="value">
          <div class="extrinsics empty" :class="{link: blockData.extrinsics_count > 0}">
            <router-link
              :to="blockData.extrinsics_count > 0 ? `/block/${blockData.block_num}?detail_type=extrinsic` : `${$route.fullPath}`"
            >{{blockData.extrinsics_count}} {{$t('extrinsic')}}</router-link>
          </div>
          <div class="event empty" :class="{link: blockData.event_count > 0}">
            <router-link
              :to="blockData.event_count > 0 ? `/block/${blockData.block_num}?detail_type=event` : `${$route.fullPath}`"
            >{{blockData.event_count}} {{$t('event')}}</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="block-right align-items-center">
      <span>{{blockData.block_timestamp|timeAgo(currentTime)}}</span>
      <el-tooltip class="item" effect="light" :content="blockData.finalize ? $t('finalized') : $t('unfinalized')" placement="top-start">
        <icon-svg class="icon" :icon-class="blockData.finalize?'success':'pending'" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { timeAgo, toThousandslsFilter } from "Utils/filters";
export default {
  props: {
    blockData: {
      type: Object,
      required: true
    },
    currentTime: {
      type: Number
    }
  },
  filters: {
    timeAgo,
    toThousandslsFilter
  }
};
</script>

<style lang="scss" scoped>
.block-item-wrapper {
  box-sizing: border-box;
  height: 80px;
  padding: 16px 0 20px;
  .block-left {
    .block-num {
      transform: translateY(-3px);
      .label {
        font-size: 13px;
        font-weight: 600;
        color: rgba(19, 18, 18, 1);
      }
      .value {
        cursor: pointer;
        transform: translateY(-1px);
        font-size: 18px;
        font-weight: 600;
        color: var(--link-color);
      }
    }
    .block-includes {
      // padding-top: 1px;
      .label {
        font-size: 12px;
        font-weight: 600;
        color: rgba(152, 149, 159, 1);
      }
      .value {
        display: flex;
        font-size: 12px;
        font-weight: 400;
        color: var(--link-color);
        .event {
          margin-left: 10px;
        }
        .extrinsics,
        .event {
          cursor: pointer;
        }
        .extrinsics.empty,
        .event.empty {
          cursor: auto;
          a {
            color: rgba(152, 149, 159, 1);
          }
        }
      }
    }
    .block-num,
    .block-includes {
      .label {
        width: 59px;
      }
    }
  }
  .block-right {
    font-size: 14px;
    font-weight: 600;
    color: rgba(152, 149, 159, 1);
    .icon {
      margin-left: 5px;
      font-size: 20px;
    }
  }
}
</style>
