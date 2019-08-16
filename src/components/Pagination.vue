<template>
  <div class="pagination-component">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :pager-count="5"
      :page-size="pageSize"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    pageSize: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  methods: {
    currentChange(pageSize) {
      this.$emit("currentChange", pageSize);
    }
  }
};
</script>

<style  lang="scss">
.pagination-component {
  .el-pagination {
    padding: 0;
    .btn-prev,
    .btn-next {
      background: #5930dd;
      width: 30px;
      height: 30px;
      .el-icon {
        font-size: 18px;
        color: #fff;
      }
      &:disabled {
        background: #c0c4cc;
        color: #f4f4f5;
      }
    }
    .el-pager {
      .number {
        box-sizing: border-box;
        min-width: 30px;
        height: 30px;
        background: rgba(255, 255, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(204, 204, 204, 1);
        &.active {
          background: rgba(244, 246, 249, 1) !important;
          border: 1px solid rgba(48, 43, 60, 1);
          color: #302b3c !important;
        }
      }
    }
  }
}
</style>