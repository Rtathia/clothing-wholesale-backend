import { View, Text, ScrollView, Swiper, SwiperItem, Input, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import './index.css'

// 导航图标数据（4个）
const navItems = [
  { id: 'all', name: '全部产品', icon: '📦', color: 'bg-blue-50' },
  { id: 'polo', name: 'POLO系列', icon: '👕', color: 'bg-orange-50' },
  { id: 'tshirt', name: 'T恤系列', icon: '👔', color: 'bg-purple-50' },
  { id: 'hoodie', name: '卫衣系列', icon: '🎽', color: 'bg-pink-50' },
]

// Banner数据（使用图片）
const bannerItems = [
  { 
    id: 1, 
    imageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F1321321.jpg&nonce=db6a56c3-b257-473a-a166-b5415539912a&project_id=7619676618268688390&sign=75188a79a24598950bcac84bbe32a61f6a6c75d021b69bb0567de4ed0a95643a' 
  },
  { 
    id: 2, 
    imageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2Fbanner1.jpg&nonce=44f8cca5-d35e-4ea0-86ea-db4c9232d9a1&project_id=7619676618268688390&sign=0c2cce38d6c5563a62f120c98c87077b045042dd3dba7f51c1f108828ae9d76f' 
  },
  { 
    id: 3, 
    imageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F3.png&nonce=e716f209-4b0f-4578-9856-36c542e94e7d&project_id=7619676618268688390&sign=4c1d714c58390185f5938141d443cc191dd96ae9d389eca9b5f143ccf5a109ed' 
  },
]

const HomePage: FC = () => {
  const [searchText, setSearchText] = useState('')

  // 搜索
  const handleSearch = () => {
    if (searchText.trim()) {
      Taro.navigateTo({ url: `/pages/search/index?keyword=${searchText}` })
    }
  }

  // 导航点击
  const handleNavClick = (id: string) => {
    console.log('点击导航:', id)
    if (id === 'all' || id === 'polo' || id === 'tshirt' || id === 'hoodie') {
      // 存储筛选参数到全局状态
      Taro.setStorageSync('categoryFilter', id)
      console.log('已存储筛选参数:', id)
      Taro.switchTab({ url: '/pages/category/index' })
    }
  }

  return (
    <View className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <View className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <View className="px-4 py-3">
          <View className="flex items-center gap-3">
            {/* Logo/品牌名 */}
            <Text className="block text-base font-bold text-gray-900">广州柳乐服饰有限公司</Text>
            {/* 搜索框 */}
            <View className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Text className="block text-gray-400 mr-2">🔍</Text>
              <View className="flex-1">
                <Input
                  className="w-full bg-transparent text-sm"
                  placeholder="搜索商品..."
                  value={searchText}
                  onInput={(e) => setSearchText(e.detail.value)}
                  onConfirm={handleSearch}
                />
              </View>
            </View>
            {/* 拍照搜索 */}
            <View className="p-2">
              <Text className="block text-xl">📷</Text>
            </View>
            {/* 后台管理入口 */}
            <View 
              className="p-2"
              onClick={() => Taro.navigateTo({ url: '/pages/admin/index' })}
            >
              <Text className="block text-xl">⚙️</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView scrollY className="flex-1">
        {/* Banner轮播 */}
        <View className="px-4 pt-4">
          <Swiper
            className="w-full h-40 rounded-2xl overflow-hidden"
            indicatorDots
            autoplay
            circular
            indicatorColor="rgba(255,255,255,0.5)"
            indicatorActiveColor="#ffffff"
          >
            {bannerItems.map((banner) => (
              <SwiperItem key={banner.id}>
                <Image 
                  src={banner.imageUrl}
                  mode="aspectFill"
                  className="w-full h-full"
                />
              </SwiperItem>
            ))}
          </Swiper>
        </View>

        {/* 快捷导航区 */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl p-4">
            <View className="grid grid-cols-4 gap-4">
              {navItems.map((item) => (
                <View
                  key={item.id}
                  className="flex flex-col items-center"
                  onClick={() => handleNavClick(item.id)}
                >
                  <View className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-2`}>
                    <Text className="block text-2xl">{item.icon}</Text>
                  </View>
                  <Text className="block text-xs text-gray-700 text-center">{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 全部款式 */}
        <View className="px-4 mt-4">
          <View className="flex items-center justify-between mb-3">
            <Text className="block text-lg font-semibold text-gray-900">全部款式</Text>
            <View className="flex items-center" onClick={() => Taro.switchTab({ url: '/pages/category/index' })}>
              <Text className="block text-sm text-gray-500">查看更多</Text>
              <Text className="block text-sm text-gray-400 ml-1">›</Text>
            </View>
          </View>
          
          <View className="grid grid-cols-2 gap-3">
            {[
              { id: 1, name: '经典POLO衫', price: '89' },
              { id: 2, name: '纯棉圆领T恤', price: '59' },
              { id: 3, name: '运动卫衣', price: '159' },
              { id: 4, name: '商务长袖POLO', price: '129' },
            ].map((product) => (
              <View
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
                onClick={() => Taro.navigateTo({ url: `/pages/product-detail/index?id=${product.id}` })}
              >
                {/* 商品图片 */}
                <View className="w-full h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Text className="block text-5xl text-gray-300">👕</Text>
                </View>
                {/* 商品信息 */}
                <View className="p-3">
                  <Text className="block text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </Text>
                  <View className="flex items-baseline mt-2">
                    <Text className="block text-xs text-orange-500">¥</Text>
                    <Text className="block text-lg font-bold text-orange-500">
                      {product.price}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 底部间距 */}
        <View className="h-20" />
      </ScrollView>
    </View>
  )
}

export default HomePage
