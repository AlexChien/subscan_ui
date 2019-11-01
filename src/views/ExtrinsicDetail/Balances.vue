<template>
  <div class="align-items-center">
    <div class="currency-icon">
      <img
        :src="icon"
        :alt="symbol"
      />
    </div>
    <div
      class="currency-num"
    >{{`${amount} ${symbol}`}}
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    props: {
      amount: {
        type: String,
        default: "0"
      },
      module: {
        type: String,
        default: 'balances'
      }
    },
    computed: {
      ...mapState({
        sourceSelected: state => state.global.sourceSelected
      }),
      symbol: function() {return this.formatSource(this.module, 'value')},
      icon:  function() {return this.formatSource(this.module, 'icon')},
    },
    methods: {
      formatSource(module, type) {
        let source = this.$const[`SYMBOL/${this.sourceSelected}`];
        if (source && source[module]) {
            return source[module][type] || '';
        } else {
            return '';
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .currency-icon {
    margin-right: 10px;
    img {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      transform: translateY(-2px);
    }
  }
</style>
