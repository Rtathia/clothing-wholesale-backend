export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '服装定制',
    })
  : { navigationBarTitleText: '服装定制' }
