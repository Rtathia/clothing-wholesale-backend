import { View, Text, ScrollView, Swiper, SwiperItem, Input, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import { Network } from '@/network'
import './index.css'

// 导航图标数据（4个）
const navItems = [
  { id: 'all', name: '全部产品', icon: '📦', color: 'bg-blue-50' },
  { id: 'polo', name: '翻领系列', icon: '👕', color: 'bg-orange-50' },
  { id: 'tshirt', name: 'T恤系列', icon: '👔', color: 'bg-purple-50' },
  { id: 'hoodie', name: '卫衣系列', icon: '🎽', color: 'bg-pink-50' },
]

// Banner数据（使用永久URL）
const bannerItems = [
  { 
    id: 1, 
    imageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/1321321_7c94d2d2.jpg?sign=1779965007-4767d3b0df-0-4dd1f3ae0c77ec5d5eeaa394eb2803cec4d4cf1f7b2bde0410805bf976f2a9a6' 
  },
  { 
    id: 2, 
    imageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/banner1_7f31072a.jpg?sign=1779965008-6b5e33937d-0-e4a89960dc9ea3c938ad575b212e9107a8e371b917d36d645783bb8ec239f6f6' 
  },
  { 
    id: 3, 
    imageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/3_21cf1e05.png?sign=1779965007-98e5826138-0-27b35bc69b0f10e6e22297515a6f9163f41e2b8e8da12df2a81617a4dd60189d' 
  },
  { 
    id: 4, 
    imageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/444444_dce47dfb.jpg?sign=1779965008-5297a465d8-0-d8ec22e1dfe4acf8f8565cdcc190cc64739837c2ff098eb1225410fc470d328f' 
  },
]

// 推荐产品类型
interface Product {
  id: number
  name: string
  price: number
  image_url: string | null
}

// 推荐产品ID列表（#AS001 #JS001 #CN001 #HL004 #PL001 #PN001）
const FEATURED_PRODUCT_IDS = [9, 13, 15, 31, 28, 38]

const HomePage: FC = () => {
  const [searchText, setSearchText] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  
  // 获取推荐产品
  useEffect(() => {
    fetchFeaturedProducts()
  }, [])
  
  const fetchFeaturedProducts = async () => {
    try {
      // 获取所有产品，然后筛选推荐的产品
      const res = await Network.request({
        url: '/api/shop/products',
      })
      const allProducts = res.data.data || res.data || []
      // 筛选出推荐产品
      const featured = allProducts.filter((p: Product) => FEATURED_PRODUCT_IDS.includes(p.id))
      setFeaturedProducts(featured)
    } catch (error) {
      console.error('获取推荐产品失败:', error)
    }
  }

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
          {/* 搜索框 */}
          <View className="flex items-center bg-gray-100 rounded-full px-4 py-2">
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
            {featuredProducts.map((product) => (
              <View
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
                onClick={() => Taro.navigateTo({ url: `/pages/product-detail/index?id=${product.id}` })}
              >
                {/* 商品图片 */}
                <View className="w-full h-36 bg-white">
                  {product.image_url ? (
                    <Image 
                      src={product.image_url}
                      mode="aspectFill"
                      className="w-full h-full"
                    />
                  ) : (
                    <View className="w-full h-full flex items-center justify-center">
                      <Text className="block text-5xl text-gray-300">👕</Text>
                    </View>
                  )}
                </View>
                {/* 商品信息 */}
                <View className="p-3">
                  <Text className="block text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </Text>
                  <View className="flex items-baseline mt-2">
                    <Text className="block text-xs text-orange-500">¥</Text>
                    <Text className="block text-lg font-bold text-orange-500">
                      {(product.price / 100).toFixed(2)}
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
