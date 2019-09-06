<template>
  <div class="footer-bar">
    <div class="container space-between align-items-center">
      <div class="copyright">Subscan © 2019 - Developed By Subscan Team</div>

      <div class="contact">
        <a target="_blank" rel="noopener" href="mailto:hello@subscan.io">
          <div class="contact-item mail">
            <icon-svg icon-class="mail" class="icon" />
          </div>
        </a>

        <!--<div class="contact-item earth">-->
          <!--<icon-svg icon-class="earth" class="icon" />-->
        <!--</div>-->

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
    height: 50px;
    .copyright {
      color: #7b70ae;
      font-size: 14px;
      font-weight: bold;
    }
    .poweredby{
      color: #7b70ae;
      font-size: 14px;
      font-weight: bold;
      margin-left: 10px;
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
