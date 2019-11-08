<template>
  <div class="footer-bar">
    <div class="container space-between align-items-center">
      <div class="copyright">Subscan © 2019 - Developed By Subscan Team</div>
      <div class="donate">
        <span class="donate-title">DONATE:</span>
        5DobnXBB9EU8gJR8ygCM5GvHHuvSRCfWypuC2vDqW35Udbku
      </div>
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
    .donate {
      font-size: 12px;
      font-weight: 600;
      flex: 1 1 auto;
      text-align: right;
      margin-right: 10px;
      color: rgba(255,255,255,.5);
      .donate-title {
        color: #fff;
      }
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
  @media screen and (max-width:$screen-xs) {
    .container {
      height: inherit;
      padding: 10px 10px;
      flex-wrap: wrap;
      .donate {
        order: 3;
        text-align: left;
      }
      .contact {
        order: 2;
      }
    }
  }
}
</style>
