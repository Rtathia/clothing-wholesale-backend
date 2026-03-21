export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '设计',
    })
  : { navigationBarTitleText: '设计' }
