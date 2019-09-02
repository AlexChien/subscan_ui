<template>
  <div class="error-page-wrapper subscan-content">
    <div class="container">
        <div class="not-found">
          <img class="not-found-img" src="./../../assets/images/404@2x.png" alt="404" />
          <div class="no-data">No Data</div>
        </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>
<style lang="scss" scoped>
.error-page-wrapper{
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