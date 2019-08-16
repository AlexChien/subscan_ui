export default [
  {
    name: "root",
    path: "/",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "Views/Dashboard")
  },
  {
    name: "block",
    path: "/block",
    component: () => import(/* webpackChunkName: "block" */ "Views/Block")
  },
  {
    name: "extrinsic",
    path: "/extrinsic",
    component: () =>
      import(/* webpackChunkName: "extrinsic" */ "Views/Extrinsic")
  },
  {
    name: "transfer",
    path: "/transfer",
    component: () =>
      import(/* webpackChunkName: "transfer" */ "Views/Transfer")
  },
  {
    path: "*",
    redirect: "/"
  }
];
