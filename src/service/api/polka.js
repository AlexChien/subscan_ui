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
  }
];
