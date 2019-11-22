<template>
  <div class="search-input-wrapper">
    <el-input
      class="search-input"
      :placeholder="placeholder"
      v-model="inputValue"
      @keyup.enter.native="search"
    >
      <el-select
        class="search-select"
        popper-class="search-select-out"
        v-model="selectValue"
        slot="prepend"
        v-if="!isMini"
      >
        <el-option
          class="search-select-option"
          v-for="item in selectList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        class="search-button"
        slot="append"
        @click="search"
        :loading="isBtnLoading"
      >{{$t('search')}}</el-button>
    </el-input>
  </div>
</template>

<script>
const { ss58Decode } = require("oo7-substrate");
export default {
  data() {
    return {
      inputValue: "",
      selectValue: "",
      isOnSearch: false,
      isBtnLoading: false
    };
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    selectList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isMini: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.selectValue = this.selectList[0] ? this.selectList[0].value : "";
  },
  computed: {
    selectListFilter() {
      return this.selectList.filter(item => {
        return item.value !== this.selectValue;
      });
    }
  },
  methods: {
    search() {
      let blockNumReg = /^[0-9]+$/;
      let extrinsicNumReg = /^[0-9]+-[0-9]+$/;
      let blockHashOrExtrinsicHashReg = /^0x[0-9a-fA-F]{64}$/;
      if (blockNumReg.test(this.inputValue)) {
        // blockNum
        this.$router.push(`/block/${this.inputValue}`);
      } else if (extrinsicNumReg.test(this.inputValue)) {
        // extrinsicNum
        this.$router.push(`/extrinsic/${this.inputValue}`);
      } else if (blockHashOrExtrinsicHashReg.test(this.inputValue)) {
        // blockHashOrExtrinsicHash
        this.isBtnLoading = true;
        this.$api["polkaCheckHash"]({
          hash: this.inputValue
        })
          .then(res => {
            this.isBtnLoading = false;
            this.$router.push(`/${res.hash_type}/${this.inputValue}`);
          })
          .catch(() => {
            this.isBtnLoading = false;
            this.$router.push(`/noData`);
          });
      } else {
        if (ss58Decode(this.inputValue)) {
          this.$router.push(`/account/${this.inputValue}`);
        } else {
          this.$router.push(`/noData`);
        }
      }
    }
  }
};
</script>

 <style lang="scss" scoped>
.search-input-wrapper {
  .search-input {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    .search-select {
      width: 110px;
      height: 100%;
    }
    .search-button {
      height: 100%;
      width: 110px;
      background: var(--main-button-color);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      border-radius: 0 0px 0px 0;
    }
  }
}
</style>
<style lang="scss">
.search-input-wrapper {
  .el-input__inner {
    height: 50px;
    line-height: 48px;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #fff;
  }
  .el-input-group__append {
    background-color: var(--main-button-color);
    border-color: var(--main-button-color);
    overflow: hidden;

    .el-button.is-loading:before {
      right: -2px;
    }
  }
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus,
  .el-input__inner:hover {
    border-color: #dcdfe6;
  }
  .el-input {
    .el-input__inner::placeholder {
      font-size: 14px;
      font-weight: 600;
      color: rgba(179, 179, 179, 1);
    }
  }
  .search-select {
    .el-input {
      .el-input__inner {
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: #302b3c;
      }
    }
    .el-input:hover {
      .el-input__inner {
        color: #302b3c;
      }
    }
  }
  @media screen and (max-width:$screen-xs) {
    .el-input-group__prepend {
      display: none;
    }
  }
}
.search-select-out {
  margin-top: 0 !important;
  font-size: 14px;
  font-weight: 600;
  color: #302b3c;
  .popper__arrow {
    display: none;
  }
  .el-select-dropdown__item.search-select-option.selected {
    color: var(--main-color);
    display: none;
  }
}
</style>
