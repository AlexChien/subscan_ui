<template>
  <div class="account-wrapper">
    <div class="account-header space-between align-items-center">
      <!-- <div class="header-left">1</div>
      <mini-search-input class="header-right" placeholder="Search by Block / Extrinsic / Account" /> -->
    </div>
  </div>
</template>

<script>
import MiniSearchInput from "Components/MiniSearchInput";
import { timeAgo, parseTimeToUtc, hashFormat } from "Utils/filters";
import clipboard from "Directives/clipboard";
export default {
  name: "Account",
  components: {
    MiniSearchInput
  },
  filters: {
    timeAgo,
    parseTimeToUtc,
    hashFormat
  },
  directives: {
    clipboard
  },
  data() {
    return {
      address: "",
      accountInfo: {},
      activeTab: "transfer",
      notFound: false,
      isLoading: false
    };
  },
  created() {
    // this.address = this.$route.params.key;
    // this.isLoading = true;
    // this.init();
  },
  // watch: {
  //   "$route.params.key": function() {
  //     this.init();
  //   }
  // },
  methods: {
    init() {
      this.getAccountInfo();
      this.activeTab = "transfer";
    },
    async getAccountInfo() {
      const key = this.$route.params.key;
      this.$api["polkaGetSearchRes"]({ key, row: 10, page: 0 })
        .then(res => {
          debugger;
          if (res === null) {
            return Promise.reject(res);
          }
          this.notFound = false;
          res.extrinsics.forEach(item => {
            item.params = JSON.parse(item.params);
          });
          res.events.forEach(item => {
            let params = JSON.parse(item.params);
            item.params = params.filter(param => {
              return param.name;
            });
          });
          res.logs.forEach(item => {
            item.data = JSON.parse(item.data);
          });
          this.blockInfo = res;
          this.blockNum = res.block_num;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.address = undefined;
          this.accountInfo = {};
          if (err === null || err.code === -400) {
            this.notFound = true;
          }
        });
    },
    goBlockNum(direction) {
      if (this.blockNum !== undefined) {
        this.$router.push(`/block/${this.blockNum + direction}`);
      }
    },
    clipboardSuccess() {
      this.$message({
        type: "success",
        message: "Copy Success"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>