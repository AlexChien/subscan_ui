<template>
    <div class="progress-wrapper">
        <div class="progress-content">
            <div class="bar" :style="{width:percent+'%'}"></div>
        </div>
        <div class="text" v-if="isShowText">
            <div class="left">{{percent}}%</div>
            <div class="right">{{`${num}/${total} ${unit}`}}</div>
        </div>
    </div>
</template>
<script>
import { BigNumber } from "bignumber.js";
export default {
    props: {
        num: {
            required: true,
            type: [String, Number]
        },
        total: {
            required: true,
            type: [String, Number]
        },
        unit: {
            required: true,
            type: String
        },
        isShowText:{
            type: Boolean,
            default: true
        }
    },
    computed: {
        percent() {
            if (+this.total === 0) {
                return 100;
            }
            return new BigNumber(this.num)
                .div(this.total)
                .times(100)
                .toFixed(2);
        }
    }
};
</script>

<style lang="scss" scoped>
.progress-wrapper {
    width: 100%;
    .progress-content {
        width: 100%;
        height: 7px;
        border-radius: 4px;
        background-color: #e6e6e6;
        .bar {
            height: 7px;
            border-radius: 4px;
            background: linear-gradient(to right,#ffba4d, #fb6c51);;
            transition: width 0.3s ease;
        }
    }
    .text {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        padding-top: 5px;
    }
}
</style>
