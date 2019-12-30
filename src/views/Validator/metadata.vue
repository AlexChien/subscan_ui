<template>
  <div class="metadata-wrapper subscan-card">
    <div>
      <router-link class="nav-item" to="/validator" tag="div" active-class="choosed">
        <div class="metadata-item">
          <icon-svg class="icon" icon-class="active-accounts"></icon-svg>
          <div class="label">{{$t('validators')}}</div>
          <count-to class="value" :end="Number(metadata.current_validator_count||0)" :duration="0.8" :decimal="0" :options="validatorCountOpts"/>
        </div>
      </router-link>
    </div>
    <div>
      <router-link class="nav-item" to="/waiting" tag="div" active-class="choosed">
        <div class="metadata-item">
          <icon-svg class="icon" icon-class="sandglass"></icon-svg>
          <div class="label">{{$t('waiting')}}</div>
          <count-to class="value" :end="Number(metadata.waiting_validator||0)" :duration="0.8" :decimal="0" />
        </div>
      </router-link>
    </div>
    <div>
      <router-link :to="$route.fullPath" tag="div" active-class="choosed">
        <div class="metadata-item">
          <icon-svg class="icon" icon-class="era"></icon-svg>
          <div class="label">{{$t('era')}}</div>
          <count-to class="value" :end="Number(metadata.eraProcess||0)" :duration="0.8" :decimal="0" :options="eraCountOpts"/>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import countTo from "Components/CountTo";
import { mapState } from "vuex";
export default {
  components: { countTo },
  computed: {
    ...mapState({
      metadata: state => state.polka.metadata
    }),
    eraCountOpts() {
      return {
        suffix: '/' + Number(this.metadata.eraLength||0),
      }
    },
    validatorCountOpts() {
      return {
        suffix: '/' + Number(this.metadata.validator_count||0),
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.metadata-wrapper {
  display: flex;
  &>div{
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .nav-item{
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
  @media screen and (max-width:$screen-xs) {
    flex-direction: column;
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
