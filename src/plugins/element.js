import Vue from "vue";
import {
  Loading,
  MessageBox,
  // Notification,
  Message,
  Button,
  Dropdown,
  // DropdownItem,
  DropdownMenu,
  Scrollbar,
  Checkbox,
  // Carousel,
  // CarouselItem,
  // Breadcrumb,
  // BreadcrumbItem,
  // InputNumber,
  // Dialog,
  // Collapse,
  // CollapseItem,
  Input,
  // Col,
  // Row,
  // Menu,
  // Submenu,
  // MenuItem,
  // Form,
  // FormItem,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Tooltip,
  // Pagination,
  // Popover,
  Select,
  Option,
  Pagination
  // Badge
} from "element-ui";
// 按需引入element-ui的部分功能
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
// Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
// Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

Vue.use(Button);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
// Vue.use(DropdownItem)
// Vue.use(Carousel)
// Vue.use(CarouselItem)
// Vue.use(Breadcrumb)
// Vue.use(BreadcrumbItem)
// Vue.use(InputNumber)
// Vue.use(Dialog)
// Vue.use(Collapse)
// Vue.use(CollapseItem)
Vue.use(Input);
Vue.use(Scrollbar);
Vue.use(Checkbox);
Vue.use(Tooltip);
// Vue.use(Col)
// Vue.use(Row)
// Vue.use(Menu)
// Vue.use(Submenu)
// Vue.use(MenuItem)
// Vue.use(Form)
// Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
// Vue.use(Pagination)
// Vue.use(Popover)
Vue.use(Select);
Vue.use(Option);
Vue.use(Pagination);
// Vue.use(Badge)
