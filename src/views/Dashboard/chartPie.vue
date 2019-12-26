<template>
  <div class="chart-wrapper">
    <div class="header-content space-between">
      <div class="header-left align-items-center">
        <icon-svg class="icon" icon-class="chart" />
        <span class="title">{{$t('transfer_history')}}</span>
      </div>
    </div>
    <div class="chart-content subscan-card" ref="chart"></div>
  </div>
</template>

<script>
let myChart;
import { mapState } from "vuex";
import {
  fmtNumber,
  fmtPercentage,
  bnMinus,
  bnPlus,
  bnShift
} from "../../utils/format";
import ring from "../../assets/images/ring@2x.png";
import kton from "../../assets/images/kton@2x.png";
import kusama from "../../assets/images/ksm@2x.png";
import switchIcon from "../../assets/images/switch-purple.png";

import bIconBlack from "../../assets/images/b-black.png";
import tIconBlack from "../../assets/images/t-black.png";
import bIconPurple from "../../assets/images/b-purple.png";
import tIconPurple from "../../assets/images/t-purple.png";
import bIconPink from "../../assets/images/b-pink.png";
import tIconPink from "../../assets/images/t-pink.png";
import oIcon from "../../assets/images/o.png";

export default {
  computed: {
    ...mapState({
      sourceSelected: state => state.global.sourceSelected,
      token: state => state.polka.token
    }),
    tokenDetail() {
      if (this.token && this.token.detail) {
        return this.token.detail[this.token.token];
      }
      return {};
    },
    iconImg() {
      if (this.sourceSelected === "kusama") {
        return kusama;
      }
      return this.currency === "kton" ? kton : ring;
    }
  },
  data() {
    return {
      currency: "",
      colorMap: {
        darwinia: {
          mainColor: "#5930dd",
          colors: ["#5930dd", "#a995eb", "#d7d7d7"],
          bIcon: bIconPurple,
          tIcon: tIconPurple,
          oIcon: oIcon
        },
        kusama: {
          mainColor: "#e90979",
          colors: ["#e90979", "#ffaccb", "#d7d7d7"],
          bIcon: bIconPink,
          tIcon: tIconPink,
          oIcon: oIcon
        },
        polkadot: {
          mainColor: "#e90979",
          colors: ["#e90979", "#ffaccb", "#d7d7d7"],
          bIcon: bIconPink,
          tIcon: tIconPink,
          oIcon: oIcon
        },
        edgeware: {
          mainColor: "#000000",
          colors: ["#000000", "#a6a6a6", "#d7d7d7"],
          bIcon: bIconBlack,
          tIcon: tIconBlack,
          oIcon: oIcon
        }
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
            color: this.colorMap[source || "darwinia"].mainColor
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
    tokenDetail(newV) {
      let others = bnMinus(
        newV.total_issuance,
        bnPlus(newV.locked_balance, newV.available_balance)
      );
      const data = [
        {
          name: this.$t("total_bonded"),
          formatVal: fmtNumber(bnShift(newV.locked_balance, -15), 0),
          value: fmtPercentage(newV.locked_balance, newV.total_issuance, 1)
        },
        {
          name: this.$t("transferrable"),
          formatVal: fmtNumber(bnShift(newV.available_balance, -15), 0),
          value: fmtPercentage(newV.available_balance, newV.total_issuance, 1)
        },
        {
          name: this.$t("others"),
          formatVal: fmtNumber(bnShift(others, -15), 0),
          value: fmtPercentage(others, newV.total_issuance, 1)
        }
      ];
      myChart.setOption({
        graphic: [
          {
            type: "group",
            left: "18%",
            top: "center",
            children: [
              {
                type: "circle",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                shape: {
                  // width: 190,
                  // height: 90,
                  // cx: 95,
                  // cy: 77,
                  r: 25
                },
                style: {
                  fill: "#fff",
                  // stroke: '#555',
                  lineWidth: 2,
                  shadowBlur: 4,
                  // shadowOffsetX: 3,
                  // shadowOffsetY: 3,
                  shadowColor: "rgba(0,0,0,0.2)"
                }
              },
              {
                type: "image",
                id: "logos",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                bounding: "raw",
                style: {
                  image: this.iconImg,
                  width: 35,
                  height: 35
                }
              }
            ]
          },
          {
            type: "image",
            id: "logosddd",
            z: -100,
            left: "38%",
            bottom: "12",
            ignore: true,
            bounding: "raw",
            style: {
              image: switchIcon,
              width: 16,
              height: 16
            },
            onclick: this.switchKton
          }
        ],
        legend: {
          orient: "vertical",
          left: "50%",
          top: "10%",
          align: "left",
          itemGap: 28,
          data: this.getXAxisData(),
          tooltip: {
            show: true
          },
          itemHeight: 20,
          itemWidth: 20,
          textStyle: {
            color: "#302b3c",
            fontWeight: "bold",
            fontSize: 14
          },
          formatter(name) {
            let result = "";
            data.forEach(function(val) {
              if (val.name === name) {
                result = val.formatVal + "K（" + val.value + "%）";
              }
            });
            return result;
          }
        },
        series: {
          data
        }
      });
    },
    currency() {
      myChart.setOption({
        graphic: [
          {
            type: "group",
            left: "18%",
            top: "center",
            children: [
              {
                type: "circle",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                shape: {
                  r: 25
                },
                style: {
                  fill: "#fff",
                  lineWidth: 2,
                  shadowBlur: 4,
                  shadowColor: "rgba(0,0,0,0.2)"
                }
              },
              {
                type: "image",
                id: "logos",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                bounding: "raw",
                style: {
                  image: this.iconImg,
                  width: 35,
                  height: 35
                }
              }
            ]
          },
          {
            type: "image",
            id: "logosddd",
            z: -100,
            ignore: true,
            left: "38%",
            bottom: "12",
            bounding: "raw",
            style: {
              image: switchIcon,
              width: 16,
              height: 16
            },
            onclick: this.switchKton
          }
        ]
      });
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      let newV = this.tokenDetail;
      let others = bnMinus(
        newV.total_issuance,
        bnPlus(newV.locked_balance, newV.available_balance)
      );
      let data = [];
      if (newV.total_issuance) {
        data = [
          {
            name: this.$t("total_bonded"),
            formatVal: fmtNumber(bnShift(newV.locked_balance, -15), 0),
            value:
              fmtPercentage(newV.locked_balance, newV.total_issuance, 1) || 0
          },
          {
            name: this.$t("transferrable"),
            formatVal: fmtNumber(bnShift(newV.available_balance, -15), 0),
            value:
              fmtPercentage(newV.available_balance, newV.total_issuance, 1) || 0
          },
          {
            name: this.$t("others"),
            formatVal: fmtNumber(bnShift(others, -15), 0),
            value: fmtPercentage(others, newV.total_issuance, 1) || 0
          }
        ];
      }
      myChart = window.echarts.init(this.$refs.chart);
      myChart.setOption({
        graphic: [
          {
            type: "group",
            left: "18%",
            top: "center",
            children: [
              {
                type: "circle",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                shape: {
                  // width: 190,
                  // height: 90,
                  // cx: 95,
                  // cy: 77,
                  r: 25
                },
                style: {
                  fill: "#fff",
                  // stroke: '#555',
                  lineWidth: 2,
                  shadowBlur: 4,
                  // shadowOffsetX: 3,
                  // shadowOffsetY: 3,
                  shadowColor: "rgba(0,0,0,0.2)"
                }
              },
              {
                type: "image",
                id: "logos",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                bounding: "raw",
                style: {
                  image: this.iconImg,
                  width: 35,
                  height: 35
                }
              }
            ]
          },
          {
            type: "image",
            id: "logosddd",
            z: -100,
            left: "38%",
            bottom: "12",
            ignore: true,
            bounding: "raw",
            style: {
              image: switchIcon,
              width: 16,
              height: 16
            },
            onclick: this.switchKton
          }
        ],
        tooltip: {
          trigger: "item",
          backgroundColor: "#ffffff",
          borderColor: "#e7eaf3",
          borderWidth: 1,
          padding: [5, 20],
          textStyle: {
            color: "#302b3c"
          },
          formatter: `{b}`
        },
        legend: {
          orient: "vertical",
          left: "50%",
          top: "10%",
          align: "left",
          itemGap: 32,
          icon: "circle",
          data: this.getXAxisData(),
          tooltip: {
            show: true
          },
          itemHeight: 20,
          itemWidth: 20,
          textStyle: {
            color: "#302b3c",
            fontWeight: "bold",
            fontSize: 14
          },
          formatter(name) {
            let result = "";
            data.forEach(function(val) {
              if (val.name === name) {
                result = val.formatVal + "K（" + val.value + "%）";
              }
            });
            return result;
          }
        },
        series: [
          {
            type: "pie",
            data: data,
            radius: ["70%", "85%"],
            center: ["25%", "50%"],
            avoidLabelOverlap: false,
            legendHoverLink: false,
            hoverAnimation: false,
            color: this.colorMap[this.sourceSelected || "darwinia"].colors,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            }
          }
        ]
      });
    },
    switchKton() {
      if (this.currency) {
        this.currency = "";
      } else {
        this.currency = "kton";
      }
    },
    getXAxisData() {
      return [
        {
          name: this.$t("total_bonded"),
          icon: "image://" + this.colorMap[this.sourceSelected].bIcon
        },
        {
          name: this.$t("transferrable"),
          icon: "image://" + this.colorMap[this.sourceSelected].tIcon
        },
        {
          name: this.$t("others"),
          icon: "image://" + this.colorMap[this.sourceSelected].oIcon
        }
      ];
    },
    getColorStop(source) {
      let sourceColor = this.colorMap[source || "darwinia"].mainColor;
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
