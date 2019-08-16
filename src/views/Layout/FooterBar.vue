<template>
  <div class="footer-bar">
    <div class="container">
      <div class="copyright">Subscan © 2019</div>
      <div class="contact">
        <div class="contact-item mail">
          <icon-svg icon-class="mail" class="icon" />
        </div>
        <div class="contact-item earth">
          <icon-svg icon-class="earth" class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterBar"
};
</script>

<style lang='scss' scoped>
.footer-bar {
  background: #302b3c;
  .container {
    display: flex;
    justify-content: space-between;
    height: 50px;
    align-items: center;
    .copyright {
      color: #7b70ae;
      font-size: 14px;
      font-weight: bold;
    }
    .contact {
      display: flex;
      .contact-item {
        cursor: pointer;
        &:not(:first-child) {
          margin-left: 10px;
        }
        .icon {
          font-size: 26px;
        }
      }
    }
  }
}
</style>