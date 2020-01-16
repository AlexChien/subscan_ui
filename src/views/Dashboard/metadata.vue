<template>
  <div class="metadata-wrapper subscan-card">
    <div class="block-data">
      <router-link class="nav-item" to="/block" tag="a" active-class="choosed">
        <div class="metadata-item">
          <icon-svg class="icon" icon-class="latest-blocks"></icon-svg>
          <div class="label">{{$t('finalized_and_latest_block')}}</div>
          <count-to
            class="value"
            :end="Number(metadata.finalized_blockNum||0)"
            :duration="0.8"
            :decimal="0"
            :options="blockCountOpts"
          />
        </div>
      </router-link>
    </div>
    <div class="block-data mobile">
      <router-link class="nav-item" to="/block" tag="a" active-class="choosed">
        <div class="metadata-item">
          <icon-svg class="icon" icon-class="finalized"></icon-svg>
          <div class="label">{{$t('finalized_blocks')}}</div>
          <count-to
            class="value"
            :end="Number(metadata.finalized_blockNum||0)"
            :duration="0.8"
            :decimal="0"
          />
        </div>
      </router-link>
    </div>
    <div class="block-data mobile">
      <router-link class="nav-item" to="/block" tag="a" active-class="choosed">
        <div class="metadata-item">
          <icon-svg class="icon" icon-class="latest-blocks"></icon-svg>
          <div class="label">{{$t('latest_blocks')}}</div>
          <count-to class="value" :end="Number(metadata.blockNum||0)" :duration="0.8" :decimal="0" />
        </div>
      </router-link>
    </div>
    <!-- <div class="metadata-item">
            <div class="icon">
              <i class="fa fa-file-contract fa-2x"></i>
            </div>
            <div class="label">count extrinsic</div>
            <count-to class="value" :end="metadata.count_extrinsic" :duration="0.8" :decimal="0" />
    </div>-->
    <div>
      <router-link class="nav-item" to="/extrinsic" tag="a" active-class="choosed">
        <div class="metadata-item">
          <icon-svg class="icon" icon-class="signed-extrinsics"></icon-svg>
          <div class="label">{{$t('signed_extrinsics')}}</div>
          <count-to
            class="value"
            :end="Number(metadata.count_signed_extrinsic||0)"
            :duration="0.8"
            :decimal="0"
          />
        </div>
      </router-link>
    </div>
    <div>
      <router-link class="nav-item" to="/validator" tag="a" active-class="choosed">
        <div class="metadata-item">
          <icon-svg class="icon" icon-class="active-accounts"></icon-svg>
          <div class="label">{{$t('validators')}}</div>
          <count-to
            class="value"
            :end="Number(metadata.current_validator_count||0)"
            :duration="0.8"
            :decimal="0"
            :options="validatorCountOpts"
          />
        </div>
      </router-link>
    </div>
    <div>
      <router-link class="nav-item" to="/transfer" tag="a" active-class="choosed">
        <div class="metadata-item">
          <icon-svg class="icon" icon-class="transfers"></icon-svg>
          <div class="label">{{$t('transfers')}}</div>
          <count-to
            class="value"
            :end="Number(metadata.count_transfer||0)"
            :duration="0.8"
            :decimal="0"
          />
        </div>
      </router-link>
    </div>

    <!-- <div class="metadata-item">
            <div class="icon">
              <i class="fa fa-id-card fa-2x"></i>
            </div>
            <div class="label">count account</div>
            <count-to class="value" :end="metadata.count_account" :duration="0.8" :decimal="0" />
    </div>-->
  </div>
</template>

<script>
import countTo from "Components/CountTo";
import { mapState } from "vuex";
export default {
  components: { countTo },
  computed: {
    ...mapState({
      sourceSelected: state => state.global.sourceSelected,
      metadata: state => state.polka.metadata
    }),
    validatorCountOpts() {
      return {
        suffix:
          "/" +
          Number(this.metadata.validator_count || 0).toLocaleString("en-US")
      };
    },
    blockCountOpts() {
      return {
        suffix:
          "/" + Number(this.metadata.blockNum || 0).toLocaleString("en-US")
      };
    }
  }
};
</script>

<style lang='scss' scoped>
.metadata-wrapper {
  display: flex;
  & > div {
    flex: 1;
    display: flex;
    justify-content: center;
    &:first-child {
      flex: 0 0 230px;
    }
  }
  .block-data {
    &.mobile {
      display: none;
    }
  }
  .nav-item {
    cursor: pointer;
    &.event {
      cursor: default;
    }
  }
  .metadata-item {
    /*width: 260px;*/
    color: #4a4a4a;
    padding: 15px 10px 0;
    text-align: center;
    .icon {
      height: 60px;
      font-size: 60px;
    }
    .label {
      padding-top: 10px;
      color: #302b3c;
      font-size: 14px;
      font-family: Eina01-SemiBold;
      font-weight: 600;
    }
    .value {
      font-size: 18px;
      font-weight: 600;
      color: #302b3c;
      line-height: 30px;
    }
  }
  @media screen and (max-width: $screen-xs) {
    flex-direction: column;
    .block-data {
      display: none;
      &.mobile {
        display: flex;
      }
    }
    & > div {
      &:first-child {
        flex: 1;
      }
    }
    .nav-item {
      width: 100%;
    }
    .metadata-item {
      display: flex;
      align-items: center;
      padding: 10px;
      .icon {
        height: 30px;
        font-size: 30px;
      }
      .label {
        padding: 0;
        margin-left: 10px;
      }
      .value {
        text-align: right;
        flex: 1 1 auto;
      }
    }
  }
}
</style>
