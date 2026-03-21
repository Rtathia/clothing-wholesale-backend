export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/design/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '服装定制',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#2563eb',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/house.png',
        selectedIconPath: './assets/tabbar/house-active.png',
      },
      {
        pagePath: 'pages/category/index',
        text: '分类',
        iconPath: './assets/tabbar/layout-grid.png',
        selectedIconPath: './assets/tabbar/layout-grid-active.png',
      },
      {
        pagePath: 'pages/design/index',
        text: '设计',
        iconPath: './assets/tabbar/palette.png',
        selectedIconPath: './assets/tabbar/palette-active.png',
      }
    ]
  }
})
