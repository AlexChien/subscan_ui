import moment from "moment";
import _ from 'lodash';
import api from "Plugins/api";

const {polkaGetMetadata, polkaGetBlocks, polkaGetTransfers, polkaGetDaily} = api;

export default {
  state: {
    metadata: {},
    latestBlocks: [],
    // latestExtrinsics: [],
    transfers: undefined,
    dailyChart: []
  },
  mutations: {
    SET_METADATA: (state, data) => {
      state.metadata = data;
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
    async SetMetadata({commit}) {
      const data = await polkaGetMetadata();
      commit("SET_METADATA", data);
    },
    async SetLatestBlocks({commit}, payload) {
      const data = await polkaGetBlocks(payload);
      commit("SET_LATEST_BLOCKS", data.blocks);
    },
    // async SetLatestExtrinsics({ commit }, payload) {
    //   const data = await polkaGetExtrinsics(payload);
    //   commit("SET_LATEST_EXTRINSICS", data.extrinsics);
    // },
    async SetTransfers({commit}, payload) {
      const data = await polkaGetTransfers(payload);
      commit("SET_TRANSFERS", data.transfers);
    },
    async SetDailyChart({commit}, payload) {
      let emptyDailyData = [];
      const start = moment(payload.start);
      const end = moment(payload.end);
      const days = (end.valueOf() - start.valueOf()) / (24 * 3600 * 1000)
      for (let i = 0; i < days; i++) {
        emptyDailyData.push({
          time: start.add(1, 'days').format("YYYY-MM-DD"),
          transfer_count: 0
        })
      }
      const data = await polkaGetDaily(payload);

      data.list.forEach((item) => {
        const timeLabel = moment(item.time_utc).format("YYYY-MM-DD");
        const index = _.findIndex(emptyDailyData, {time: timeLabel});
        emptyDailyData[index] = {
          time: timeLabel,
          transfer_count: item.transfer_count
        }
      })
      commit("SET_DAILY_CHART", emptyDailyData);
    }
  }
};
