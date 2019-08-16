<template>
    <span ref='countup'></span>
</template>

<script>
import CountUp from "countup.js";
export default {
    name: "countup",
    data() {
        return {
            numAnim: null
        };
    },
    props: {
        start: {
            type: Number,
            default: 0 // 起始值
        },
        end: {
            type: Number,
            default: 0 // 结束值
        },
        decimal: {
            type: Number,
            default: 0 // 小数位数
        },
        duration: {
            type: Number,
            default: 2.5 // 动画间隔
        },
        options: {
            type: Object // 配置 详细参考 countup.js 文档
        }
    },
    watch: {
        end(newValue, oldValue) {
            this.startNum = oldValue;
            this.initCountUp();
        }
    },
    mounted() {
        this.startNum = this.start;
        this.initCountUp();
    },
    methods: {
        initCountUp() {
            this.numAnim = null;
            this.numAnim = new CountUp(
                this.$refs.countup,
                this.startNum,
                this.end,
                this.decimal,
                this.duration,
                this.options
            );
            this.numAnim.start();
        }
    }
};
</script>