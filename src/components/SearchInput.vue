<template>
  <div class="search-input-wrapper">
    <el-input class="serach-input" :placeholder="placeholder" v-model="input1">
      <el-select
        class="serach-select"
        popper-class="serach-select-out"
        v-model="select1"
        slot="prepend"
        v-if="!isMini"
      >
        <el-option
          class="serach-select-option"
          v-for="item in selectList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button class="serach-button" slot="append">Search</el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input1: "",
      select1: ""
    };
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    selectList: {
      type: Array,
      default: ()=>{
        return []
      }
    },
    isMini: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.select1 = this.selectList[0] ? this.selectList[0].value : "";
  },
  computed: {
    selectListFilter() {
      return this.selectList.filter(item => {
        return item.value !== this.select1;
      });
    }
  }
};
</script>

 <style lang="scss" scoped>
.search-input-wrapper {
  background: #fff;
  .serach-input {
    height: 100%;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    .serach-select {
      width: 110px;
      height: 100%;
    }
    .serach-button {
      height: 100%;
      width: 110px;
      background: var(--main-color);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>
<style lang="scss">
.search-input-wrapper {
  .el-input__inner {
    height: 100%;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #fff;
  }
  .el-input-group__append {
    border-color: var(--main-color);
  }
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus,
  .el-input__inner:hover {
    border-color: #dcdfe6;
  }
  .el-input {
    height: 100%;
    .el-input__inner::placeholder {
      font-size: 14px;
      font-weight: 600;
      color: rgba(179, 179, 179, 1);
    }
  }
  .serach-select {
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
}
.serach-select-out {
  margin-top: 0 !important;
  font-size: 14px;
  font-weight: 600;
  color: #302b3c;
  .popper__arrow {
    display: none;
  }
  .el-select-dropdown__item.serach-select-option.selected {
    color: var(--main-color);
    display: none;
  }
}
</style>