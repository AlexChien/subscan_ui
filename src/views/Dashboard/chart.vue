<template>
  <div class="chart-wrapper subscan-card" ref="chart"></div>
</template>

<script>
import moment from "moment";
let myChart;
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      dailyChart: state => state.polka.dailyChart,
      sourceSelected: state => state.global.sourceSelected
    })
  },
  created() {
    GLOBAL.vbus.$on("CHANGE_SOURCE", source => {
      myChart.setOption({
        series: {
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color:
                    source === "darwinia"
                      ? "rgba(138, 193, 243, 1)"
                      : "rgba(236, 153, 160, 1)"
                },
                {
                  offset: 0.6,
                  color:
                    source === "darwinia"
                      ? "rgba(138, 193, 243, 0.9)"
                      : "rgba(236, 153, 160, 0.9)"
                },
                {
                  offset: 0.8,
                  color:
                    source === "darwinia"
                      ? "rgba(231, 243, 254, 1)"
                      : "rgba(253, 239, 241, 1)"
                },
                {
                  offset: 1,
                  color: "rgba(255, 255, 255, 1)"
                }
              ]
            }
          },
          lineStyle: {
            width: 1,
            color:
              source === "darwinia"
                ? "rgba(138, 193, 243, 1)"
                : "rgba(236, 153, 160, 1)"
          }
        }
      });
    });
  },
  beforeDestroy() {
    myChart = null;
    GLOBAL.vbus.$off("CHANGE_SOURCE");
  },
  watch: {
    dailyChart(nevV, oldV) {
      if (oldV.length === 0 || !myChart) {
        this.initChart();
      } else {
        const xAxisData = [];
        const data = [];
        this.dailyChart.forEach(item => {
          xAxisData.push(moment(item.time_utc).format("YYYY-MM-DD"));
          data.push(item.transfer_count);
        });
        myChart.setOption({
          xAxis: {
            data: xAxisData
          },
          series: {
            data
          }
        });
      }
    }
  },
  methods: {
    initChart() {
      const xAxisData = [];
      const data = [];
      this.dailyChart.forEach(item => {
        xAxisData.push(moment(item.time_utc).format("YYYY-MM-DD"));
        data.push(item.transfer_count);
      });
      myChart = window.echarts.init(this.$refs.chart);
      myChart.setOption({
        grid: {
          top: "5%",
          left: "0%",
          right: "0%",
          bottom: "0%",
          containLabel: false
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b}<br />Transfer Count：{c}"
        },
        xAxis: [
          {
            type: "category",
            show: false,
            boundaryGap: false,
            splitLine: {
              show: false
            },
            data: xAxisData
          }
        ],
        yAxis: [
          {
            type: "value",
            show: false,
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color:
                      this.sourceSelected === "darwinia"
                        ? "rgba(138, 193, 243, 1)"
                        : "rgba(236, 153, 160, 1)"
                  },
                  {
                    offset: 0.6,
                    color:
                      this.sourceSelected === "darwinia"
                        ? "rgba(138, 193, 243, 0.9)"
                        : "rgba(236, 153, 160, 0.9)"
                  },
                  {
                    offset: 0.8,
                    color:
                      this.sourceSelected === "darwinia"
                        ? "rgba(231, 243, 254, 1)"
                        : "rgba(253, 239, 241, 1)"
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 255, 255, 1)"
                  }
                ]
              }
            },
            lineStyle: {
              width: 1,
              color:
                this.sourceSelected === "darwinia"
                  ? "rgba(138, 193, 243, 1)"
                  : "rgba(236, 153, 160, 1)"
            },
            // itemStyle: {
            //   normal: {
            //     color: "rgba(88,160,253,1)"
            //   }
            // },
            data
          }
        ]
      });
    }
  }
};
</script>

<style>
</style>