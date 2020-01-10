import moment from "moment";
import _ from 'lodash';
import api from "Plugins/api";

const {
  polkaGetMetadata,
  polkaGetBlocks,
  polkaGetTransfers,
  polkaGetDaily,
  polkaGetToken
} = api;

export default {
  state: {
    metadata: {},
    latestBlocks: [],
    token: {},
    // latestExtrinsics: [],
    transfers: undefined,
    dailyChart: []
  },
  mutations: {
    SET_METADATA: (state, data) => {
      state.metadata = data;
    },
    SET_TOKEN: (state, data) => {
      state.token = data;
    },
    SET_LATEST_BLOCKS: (state, data) => {
      state.latestBlocks = data;
    },
    // SET_LATEST_EXTRINSICS: (state, data) => {
    //   state.latestExtrinsics = data;
    // },
    SET_TRANSFERS: (state, data) => {
      state.transfers = data;
    },
    SET_ACCOUNTS: (state, data) => {
      state.accounts = data;
    },
    SET_DAILY_CHART: (state, data) => {
      state.dailyChart = data;
    }
  },
  actions: {
    async SetMetadata({
      commit
    }) {
      const data = await polkaGetMetadata();
      commit("SET_METADATA", data);
    },
    async SetLatestBlocks({
      commit
    }, payload) {
      const data = await polkaGetBlocks(payload);
      commit("SET_LATEST_BLOCKS", data.blocks);
    },
    async SetToken({
      commit
    }) {
      const data = await polkaGetToken();
      commit("SET_TOKEN", data);
    },
    // async SetLatestExtrinsics({ commit }, payload) {
    //   const data = await polkaGetExtrinsics(payload);
    //   commit("SET_LATEST_EXTRINSICS", data.extrinsics);
    // },
    async SetTransfers({
      commit
    }, payload) {
      const data = await polkaGetTransfers(payload);
      commit("SET_TRANSFERS", data.transfers);
    },
    async SetDailyChart({
      commit
    }, payload) {
      let emptyDailyData = [];
      const start = moment(payload.start);
      const end = moment(payload.end);
      let days = (end.valueOf() - start.valueOf()) / (24 * 3600 * 1000);
      let timeSpans = days;
      let span = {
        days: 1
      };
      let timeFormat = "YYYY-MM-DD";
      let timeUTC = "time_utc";
      switch (payload.format) {
        case 'hour':
          timeSpans = days * 24;
          span = {
            hours: 1
          };
          timeFormat = "YYYY-MM-DD: HH:mm";
          timeUTC = "time_hour_utc";
          break;
        case '6hour':
          timeSpans = days * 4;
          span = {
            hours: 6
          };
          timeFormat = "YYYY-MM-DD: HH:mm";
          timeUTC = "time_six_hour_utc";
          break;
        case 'day':
          timeSpans = days;
          span = {
            days: 1
          };
          timeFormat = "YYYY-MM-DD";
          timeUTC = "time_utc";
          break;
        default:
          break;
      }
      emptyDailyData.push({
        time: start.format(timeFormat),
        transfer_count: 0
      })
      for (let i = 0; i < timeSpans - 1; i++) {
        emptyDailyData.push({
          time: start.add(span).format(timeFormat),
          transfer_count: 0
        })
      }
      const data = await polkaGetDaily(payload);
      data.list.forEach((item) => {
        const timeLabel = moment.utc(item[timeUTC]).format(timeFormat);
        const index = _.findIndex(emptyDailyData, {
          time: timeLabel
        });
        emptyDailyData[index] = {
          time: timeLabel,
          transfer_count: item.total
        }
      })
      commit("SET_DAILY_CHART", emptyDailyData);
    }
  }
};
