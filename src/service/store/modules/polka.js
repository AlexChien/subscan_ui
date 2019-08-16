import api from "Plugins/api";
const { polkaGetMetadata, polkaGetBlocks, polkaGetTransfers, polkaGetDaily } = api;
export default {
  state: {
    metadata: {},
    latestBlocks: [],
    // latestExtrinsics: [],
    transfers: [],
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
    SET_DAILY_CHART: (state, data) => {
      state.dailyChart = data;
    }
  },
  actions: {
    async SetMetadata({ commit }) {
      const data = await polkaGetMetadata();
      commit("SET_METADATA", data);
    },
    async SetLatestBlocks({ commit }, payload) {
      const data = await polkaGetBlocks(payload);
      commit("SET_LATEST_BLOCKS", data.blocks);
    },
    // async SetLatestExtrinsics({ commit }, payload) {
    //   const data = await polkaGetExtrinsics(payload);
    //   commit("SET_LATEST_EXTRINSICS", data.extrinsics);
    // },
    async SetTransfers({ commit }, payload) {
      const data = await polkaGetTransfers(payload);
      commit("SET_TRANSFERS", data.transfers);
    },
    async SetDailyChart({ commit }, payload) {
      const data = await polkaGetDaily(payload);
      commit("SET_DAILY_CHART", data.list);
    }
  }
};
