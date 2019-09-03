<template>
  <div class="error-page-wrapper subscan-content">
    <div class="container">
      <search-input
        class="search-input"
        :selectList="selectList"
        placeholder="Search by Block / Extrinsic / Account"
      />
      <div class="not-found">
        <img class="not-found-img" src="./../../assets/images/no-data@2x.png" alt="404" />
        <div class="no-data">No related data found</div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchInput from "@/views/Components/SearchInput";
export default {
  components: {
    SearchInput
  },
  data() {
    return {
      selectList: [
        {
          label: "All",
          value: "all"
        },
        {
          label: "Block",
          value: "block"
        },
        {
          label: "Extrinsic",
          value: "extrinsic"
        },
        {
          label: "Account",
          value: "account"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.error-page-wrapper {
  .search-input {
    height: 50px;
  }
  .not-found {
    padding: 10%;
    text-align: center;
    .not-found-img {
    }
    .no-data {
      font-size: 14px;
      font-weight: 600;
      color: rgba(152, 149, 159, 1);
    }
  }
}
</style>