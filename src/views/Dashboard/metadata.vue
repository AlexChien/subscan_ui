<template>
  <div class="metadata-wrapper subscan-card">
    <div>
      <router-link class="nav-item" to="/block" tag="div" active-class="choosed">
        <div class="metadata-item">
          <icon-svg class="icon" icon-class="latest-blocks"></icon-svg>
          <div class="label">Latest Blocks</div>
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
      <router-link class="nav-item" to="/extrinsic" tag="div" active-class="choosed">
        <div class="metadata-item">
          <icon-svg class="icon" icon-class="signed-extrinsics"></icon-svg>
          <div class="label">Signed Extrinsics</div>
          <count-to class="value" :end="Number(metadata.count_signed_extrinsic||0)" :duration="0.8" :decimal="0" />
        </div>
      </router-link>
    </div>
    <div>
      <div class="metadata-item">
        <icon-svg class="icon" icon-class="module-events"></icon-svg>
        <div class="label">Module Events</div>
        <count-to class="value" :end="Number(metadata.count_event||0)" :duration="0.8" :decimal="0" />
      </div>
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
      metadata: state => state.polka.metadata
    })
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
}
</style>
