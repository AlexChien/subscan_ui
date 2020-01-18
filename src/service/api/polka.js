export default [
  {
    name: "getNow",
    method: "POST",
    desc: "获取时间信息",
    baseURL: "",
    path: "/now",
    options: {}
  },
  {
    name: "getBlocks",
    method: "POST",
    desc: "获取块信息",
    baseURL: "",
    path: "/scan/blocks",
    options: {}
  },
  {
    name: "getMetadata",
    method: "POST",
    desc: "元数据",
    baseURL: "",
    path: "/scan/metadata",
    options: {}
  },
  {
    name: "getExtrinsics",
    method: "POST",
    desc: "extrinsics数据",
    baseURL: "",
    path: "/scan/extrinsics",
    options: {}
  },
  {
    name: "getTransfers",
    method: "POST",
    desc: "transfers数据",
    baseURL: "",
    path: "/scan/transfers",
    options: {}
  },
  {
    name: "getAccounts",
    method: "POST",
    desc: "accounts数据",
    baseURL: "",
    path: "/scan/accounts",
    options: {}
  },
  {
    name: "getDaily",
    method: "POST",
    desc: "图表数据",
    baseURL: "",
    path: "/scan/daily",
    options: {}
  },
  {
    name: "getBlockByKey",
    method: "POST",
    desc: "获取单个块数据",
    baseURL: "",
    path: "/scan/block",
    options: {
      noShowDefaultError: true
    }
  },
  {
    name: "getExtrinsicByKey",
    method: "POST",
    desc: "获取单个extrinsics数据",
    baseURL: "",
    path: "/scan/extrinsic",
    options: {
      noShowDefaultError: true
    }
  },
  {
    name: "getSearchRes",
    method: "POST",
    desc: "获取搜索结果",
    baseURL: "",
    path: "/scan/search",
    options: {
      noShowDefaultError: true
    }
  },
  {
    name: "checkHash",
    method: "POST",
    desc: "判断blockHash还是extrinsicHash",
    baseURL: "",
    path: "/scan/check_hash",
    options: {
      noShowDefaultError: true
    }
  },
  {
    name: "getToken",
    method: "POST",
    desc: "获取token信息",
    baseURL: "",
    path: "/scan/token",
    options: {
      noShowDefaultError: true
    }
  },
  {
    name: "getValidators",
    method: "POST",
    desc: "获取validators列表",
    baseURL: "",
    path: "/scan/staking/validators",
    options: {}
  },
  {
    name: "getValidator",
    method: "POST",
    desc: "获取validator详情",
    baseURL: "",
    path: "/scan/staking/validator",
    options: {}
  },
  {
    name: "getWaitingValidators",
    method: "POST",
    desc: "获取waiting validators列表",
    baseURL: "",
    path: "/scan/staking/waiting",
    options: {}
  },
  {
    name: "getNominators",
    method: "POST",
    desc: "获取nominators列表",
    baseURL: "",
    path: "/scan/staking/nominators",
    options: {}
  },
  {
    name: "getEras",
    method: "POST",
    desc: "获取eras列表",
    baseURL: "",
    path: "/scan/staking/era_stat",
    options: {}
  },
  {
    name: "getVotes",
    method: "POST",
    desc: "获取votes列表",
    baseURL: "",
    path: "/scan/staking/voted",
    options: {}
  }
];
