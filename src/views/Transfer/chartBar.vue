<template>
  <div class="chart-wrapper" v-loading="isLoading">
    <div class="chart-content subscan-card" ref="chart"></div>
  </div>
</template>

<script>
let myChart;
import { mapState } from "vuex";
import moment from "moment";
import { isMobile } from "../../utils/tools";
export default {
  computed: {
    ...mapState({
      dailyChart: state => {
        let chart = state.polka.dailyChart;
        if (isMobile() && chart.length > 15) {
          return chart.slice(chart.length - 15);
        } else {
          return chart;
        }
      },
      sourceSelected: state => state.global.sourceSelected
    })
  },
  data() {
    return {
      chartFormat: "hour",
      isLoading: false,
      colorMap: {
        darwinia: "#5930DD",
        kusama: "#E90979",
        polkadot: "#E90979",
        edgeware: "#000000"
      }
    };
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
              colorStops: this.getColorStop(source)
            }
          },
          lineStyle: {
            width: 1,
            color: this.colorMap[source || "darwinia"]
          }
        }
      });
    });
    this.getData();
  },
  beforeDestroy() {
    myChart = null;
    GLOBAL.vbus.$off("CHANGE_SOURCE");
  },
  watch: {
    dailyChart(nevV, oldV) {
      this.isLoading = false;
      if (oldV.length === 0 || !myChart) {
        this.initChart();
      } else {
        const xAxisData = [];
        const data = [];
        this.dailyChart.forEach(item => {
          xAxisData.push(item.time);
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
    },
    chartFormat() {
      this.getData();
      myChart.setOption({
        graphic: [
          {
            type: "group",
            left: "17px",
            top: "10px",
            children: [
              {
                type: "rect",
                z: 100,
                cursor: "pointer",
                info: "hour",
                shape: {
                  width: 52,
                  height: 22,
                  r: 2
                },
                style: {
                  fill:
                    this.chartFormat === "hour"
                      ? this.colorMap[this.sourceSelected]
                      : "#d6d5d8"
                },
                onclick: params => {
                  this.changeChartFormat(params.target && params.target.info);
                }
              },
              {
                type: "text",
                z: 100,
                left: "18px",
                top: "4px",
                silent: true,
                style: {
                  fill: "#FBFBFB",
                  text: "1H",
                  font: "14px bold"
                }
              },
              {
                type: "rect",
                z: 100,
                left: "62px",
                cursor: "pointer",
                info: "6hour",
                shape: {
                  width: 52,
                  height: 22,
                  // x: 95,
                  // y: 77,
                  r: 2
                },
                style: {
                  fill:
                    this.chartFormat === "6hour"
                      ? this.colorMap[this.sourceSelected]
                      : "#d6d5d8"
                },
                onclick: params => {
                  this.changeChartFormat(params.target && params.target.info);
                }
              },
              {
                type: "text",
                z: 100,
                left: "79px",
                top: "4px",
                silent: true,
                style: {
                  fill: "#FBFBFB",
                  text: "6H",
                  font: "14px bold"
                }
              },
              {
                type: "rect",
                z: 100,
                left: "124px",
                cursor: "pointer",
                info: "day",
                shape: {
                  width: 52,
                  height: 22,
                  r: 2
                },
                style: {
                  fill:
                    this.chartFormat === "day"
                      ? this.colorMap[this.sourceSelected]
                      : "#d6d5d8"
                },
                onclick: params => {
                  this.changeChartFormat(params.target && params.target.info);
                }
              },
              {
                type: "text",
                z: 100,
                left: "142px",
                top: "4px",
                silent: true,
                style: {
                  fill: "#FBFBFB",
                  text: "1D",
                  font: "14px bold"
                }
              }
            ]
          }
        ]
      });
    }
  },
  methods: {
    isMobile() {
      return isMobile();
    },
    async getData() {
      await Promise.all([this.getTransferHistory()]);
    },
    async getTransferHistory() {
      this.isLoading = true;
      let end = moment();
      let start = moment().subtract(30, "days");
      switch (this.chartFormat) {
        case "hour":
          start = moment().subtract(2, "days");
          break;
        case "6hour":
          start = moment().subtract(10, "days");
          break;
        case "day":
          start = moment().subtract(30, "days");
          break;
        default:
          break;
      }
      this.$store.dispatch("SetDailyChart", {
        start: start.format("YYYY-MM-DD"),
        end: end.format("YYYY-MM-DD"),
        format: this.chartFormat
      });
    },
    changeChartFormat(format) {
      this.chartFormat = format;
    },
    initChart() {
      const xAxisData = [];
      const data = [];
      this.dailyChart.forEach(item => {
        xAxisData.push(item.time);
        data.push(item.transfer_count);
      });
      myChart = window.echarts.init(this.$refs.chart);
      myChart.setOption({
        graphic: [
          {
            type: "group",
            left: "17px",
            top: "10px",
            children: [
              {
                type: "rect",
                z: 100,
                cursor: "pointer",
                info: "hour",
                shape: {
                  width: 52,
                  height: 22,
                  r: 2
                },
                style: {
                  fill:
                    this.chartFormat === "hour"
                      ? this.colorMap[this.sourceSelected]
                      : "#d6d5d8"
                },
                onclick: params => {
                  this.changeChartFormat(params.target && params.target.info);
                }
              },
              {
                type: "text",
                z: 100,
                left: "18px",
                top: "4px",
                silent: true,
                style: {
                  fill: "#FBFBFB",
                  text: "1H",
                  font: "14px bold"
                }
              },
              {
                type: "rect",
                z: 100,
                left: "62px",
                cursor: "pointer",
                info: "6hour",
                shape: {
                  width: 52,
                  height: 22,
                  // x: 95,
                  // y: 77,
                  r: 2
                },
                style: {
                  fill:
                    this.chartFormat === "6hour"
                      ? this.colorMap[this.sourceSelected]
                      : "#d6d5d8"
                },
                onclick: params => {
                  this.changeChartFormat(params.target && params.target.info);
                }
              },
              {
                type: "text",
                z: 100,
                left: "79px",
                top: "4px",
                silent: true,
                style: {
                  fill: "#FBFBFB",
                  text: "6H",
                  font: "14px bold"
                }
              },
              {
                type: "rect",
                z: 100,
                left: "124px",
                cursor: "pointer",
                info: "day",
                shape: {
                  width: 52,
                  height: 22,
                  r: 2
                },
                style: {
                  fill:
                    this.chartFormat === "day"
                      ? this.colorMap[this.sourceSelected]
                      : "#d6d5d8"
                },
                onclick: params => {
                  this.changeChartFormat(params.target && params.target.info);
                }
              },
              {
                type: "text",
                z: 100,
                left: "142px",
                top: "4px",
                silent: true,
                style: {
                  fill: "#FBFBFB",
                  text: "1D",
                  font: "14px bold"
                }
              }
            ]
          }
        ],
        grid: {
          top: "20%",
          left: "0%",
          right: "0%",
          bottom: "10%",
          containLabel: false
        },
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "none"
          },
          textStyle: {
            color: "#302B3C"
          },
          formatter: function(params) {
            return (
              "<div class='tooltip-wrapper'><div class='time'>" +
              params.name +
              "</div><div class='number'>" +
              params.data +
              " times</div></div>"
            );
          },
          padding: [20, 28, 16, 28],
          backgroundColor: "#FFFFFF",
          extraCssText: "box-shadow:0px 2px 10px 0px rgba(0,0,0,0.05);"
        },
        xAxis: [
          {
            type: "category",
            show: false,
            data: xAxisData
          }
        ],
        yAxis: [
          {
            type: "value",
            show: false
          }
        ],
        series: [
          {
            type: "bar",
            itemStyle: {
              color: this.colorMap[this.sourceSelected],
              opacity: 0.2,
              barBorderRadius: 4
            },
            cursor: "default",
            barWidth: 15,
            barMinHeight: 1,
            emphasis: {
              itemStyle: {
                opacity: 1
              }
            },
            data
          }
        ]
      });
    },
    getColorStop(source) {
      let sourceColor = this.colorMap[source || "darwinia"];
      return [
        {
          offset: 0,
          color: sourceColor + "99" // 透明度60%
        },
        {
          offset: 0.6,
          color: sourceColor + "4D" // 透明度30%
        },
        {
          offset: 0.8,
          color: sourceColor + "33" // 透明度20%
        },
        {
          offset: 1,
          color: sourceColor + "1A" // 透明度10%
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.chart-wrapper {
  .header-content {
    display: none;
  }
  .chart-content {
    height: 100%;
    /deep/ .tooltip-wrapper {
      text-align: center;
      .time {
        font-size: 12px;
      }
      .number {
        font-size: 16px;
        font-weight: bold;
        color: var(--main-color);
      }
    }
  }
  @media screen and (max-width: $screen-xs) {
    .header-content {
      display: block;
      margin-bottom: 10px;
      .header-left {
        height: 30px;
        .icon {
          font-size: 30px;
        }
        .title {
          padding-left: 8px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(48, 43, 60, 1);
        }
      }
    }
    .chart-content {
      height: 156px;
    }
  }
}
</style>
