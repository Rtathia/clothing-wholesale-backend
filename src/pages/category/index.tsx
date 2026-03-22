import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import type { FC } from 'react'
import { Network } from '@/network'
import './index.css'

// 产品类型
interface Product {
  id: number
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: number | null
  fabric_id: number | null
  craft_id: number | null
  fit_id: number | null
  style_id: number | null
}

// 分类数据类型（带图标）
interface Category {
  id: number
  name: string
  icon?: string | null
}

const CategoryPage: FC = () => {
  // 筛选状态
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedFabricId, setSelectedFabricId] = useState<number | null>(null)
  const [selectedCraftId, setSelectedCraftId] = useState<number | null>(null)
  
  // 数据状态
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [fabrics, setFabrics] = useState<Category[]>([])
  const [crafts, setCrafts] = useState<Category[]>([])
  const [fits, setFits] = useState<Category[]>([])
  const [styles, setStyles] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // 获取筛选数据和产品列表
  useEffect(() => {
    fetchFilterData()
  }, [])

  // 每次页面显示时重新检查筛选参数（用于从首页跳转回来时）
  useDidShow(() => {
    const filterFromHome = Taro.getStorageSync('categoryFilter')
    console.log('useDidShow检查筛选参数:', filterFromHome, '已加载分类数:', categories.length)
    
    if (filterFromHome && categories.length > 0) {
      Taro.removeStorageSync('categoryFilter')
      
      const categoryMap: Record<string, string> = {
        'polo': 'POLO',
        'tshirt': 'T恤',
        'hoodie': '卫衣',
      }
      
      const targetName = categoryMap[filterFromHome]
      if (targetName) {
        const targetCategory = categories.find(c => c.name.includes(targetName))
        if (targetCategory) {
          setSelectedCategoryId(targetCategory.id)
        }
      }
    }
  })

  // 筛选变化时重新获取产品
  useEffect(() => {
    fetchProducts()
  }, [selectedCategoryId, selectedFabricId, selectedCraftId])

  const fetchFilterData = async () => {
    try {
      const res = await Network.request({
        url: '/api/shop/filter-data',
      })
      console.log('筛选数据响应:', res.data)
      const data = res.data.data || res.data
      const loadedCategories = data.categories || []
      setCategories(loadedCategories)
      setFabrics(data.fabrics || [])
      setCrafts(data.crafts || [])
      setFits(data.fits || [])
      setStyles(data.styles || [])
      
      // 检查是否有来自首页的筛选参数
      const filterFromHome = Taro.getStorageSync('categoryFilter')
      console.log('数据加载后检查筛选参数:', filterFromHome)
      
      if (filterFromHome) {
        Taro.removeStorageSync('categoryFilter')
        
        const categoryMap: Record<string, string> = {
          'polo': 'POLO',
          'tshirt': 'T恤',
          'hoodie': '卫衣',
        }
        
        const targetName = categoryMap[filterFromHome]
        console.log('目标分类名称:', targetName, '分类列表:', loadedCategories)
        
        if (targetName) {
          const targetCategory = loadedCategories.find((c: Category) => c.name.includes(targetName))
          console.log('匹配到的分类:', targetCategory)
          
          if (targetCategory) {
            setSelectedCategoryId(targetCategory.id)
          }
        }
      }
    } catch (error) {
      console.error('获取筛选数据失败:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategoryId) params.append('categoryId', selectedCategoryId.toString())
      if (selectedFabricId) params.append('fabricId', selectedFabricId.toString())
      if (selectedCraftId) params.append('craftId', selectedCraftId.toString())
      
      const url = params.toString() 
        ? `/api/shop/products?${params.toString()}`
        : '/api/shop/products'
      
      const res = await Network.request({ url })
      console.log('产品列表响应:', res.data)
      setProducts(res.data.data || res.data || [])
    } catch (error) {
      console.error('获取产品列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取分类名称
  const getCategoryName = (type: string, id: number | null): string => {
    if (!id) return '-'
    const lists: Category[] = 
      type === 'category' ? categories :
      type === 'fabric' ? fabrics :
      type === 'craft' ? crafts :
      type === 'fit' ? fits : styles
    const item = lists.find(l => l.id === id)
    return item ? item.name : '-'
  }

  // 重置所有筛选
  const handleReset = () => {
    setSelectedCategoryId(null)
    setSelectedFabricId(null)
    setSelectedCraftId(null)
  }

  // 格式化价格
  const formatPrice = (price: number): string => {
    return (price / 100).toFixed(2)
  }

  return (
    <View className="flex flex-col bg-gray-50" style={{ height: 'calc(100vh - 50px)' }}>
      <View className="flex flex-1">
        {/* 左侧筛选区 */}
        <View className="w-24 bg-white border-r border-gray-200 flex flex-col">
          {/* 品类 */}
          <View className="p-2 border-b border-gray-100">
            <Text className="block text-xs font-semibold text-gray-700 mb-2">品类</Text>
            <View className="flex flex-col gap-1">
              {categories.map((category) => (
                <View
                  key={category.id}
                  className={`p-2 rounded-lg text-center ${
                    selectedCategoryId === category.id
                      ? 'bg-blue-600'
                      : 'bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategoryId(
                    selectedCategoryId === category.id ? null : category.id
                  )}
                >
                  <Text className="block text-lg">{category.icon || '👕'}</Text>
                  <Text
                    className={`block text-xs mt-1 ${
                      selectedCategoryId === category.id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 布料 */}
          <View className="p-2 border-b border-gray-100">
            <Text className="block text-xs font-semibold text-gray-700 mb-2">布料</Text>
            <View className="flex flex-col gap-1">
              {fabrics.map((fabric) => (
                <View
                  key={fabric.id}
                  className={`p-2 rounded-lg text-center ${
                    selectedFabricId === fabric.id
                      ? 'bg-blue-600'
                      : 'bg-gray-50'
                  }`}
                  onClick={() => setSelectedFabricId(
                    selectedFabricId === fabric.id ? null : fabric.id
                  )}
                >
                  <Text className="block text-lg">{fabric.icon || '🌿'}</Text>
                  <Text
                    className={`block text-xs mt-1 ${
                      selectedFabricId === fabric.id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {fabric.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 工艺 */}
          <View className="p-2 flex-1">
            <Text className="block text-xs font-semibold text-gray-700 mb-2">工艺</Text>
            <View className="flex flex-col gap-1">
              {crafts.map((craft) => (
                <View
                  key={craft.id}
                  className={`p-2 rounded-lg text-center ${
                    selectedCraftId === craft.id
                      ? 'bg-blue-600'
                      : 'bg-gray-50'
                  }`}
                  onClick={() => setSelectedCraftId(
                    selectedCraftId === craft.id ? null : craft.id
                  )}
                >
                  <Text className="block text-lg">{craft.icon || '🖨️'}</Text>
                  <Text
                    className={`block text-xs mt-1 ${
                      selectedCraftId === craft.id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {craft.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 重置按钮 */}
          {(selectedCategoryId || selectedFabricId || selectedCraftId) && (
            <View className="p-2 border-t border-gray-100">
              <View
                className="p-2 bg-gray-100 rounded-lg text-center"
                onClick={handleReset}
              >
                <Text className="block text-xs text-gray-600">重置筛选</Text>
              </View>
            </View>
          )}
        </View>

        {/* 右侧商品区 */}
        <ScrollView scrollY className="flex-1 p-3">
          {/* 筛选结果提示 */}
          {(selectedCategoryId || selectedFabricId || selectedCraftId) && (
            <View className="mb-3 px-3 py-2 bg-blue-50 rounded-lg">
              <Text className="block text-sm text-blue-600">
                已筛选 {products.length} 件商品
              </Text>
            </View>
          )}

          {/* 加载状态 */}
          {loading && (
            <View className="flex items-center justify-center py-10">
              <Text className="text-gray-400">加载中...</Text>
            </View>
          )}

          {/* 商品列表 - 单列布局 */}
          {!loading && (
            <View className="flex flex-col gap-3">
              {products.map((product) => (
                <View
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm"
                  onClick={() => {
                    Taro.navigateTo({ url: `/pages/product-detail/index?id=${product.id}` })
                  }}
                >
                  {/* 商品图片 */}
                  <View className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {product.image_url ? (
                      <Image 
                        src={product.image_url}
                        mode="aspectFit"
                        className="w-full h-full"
                      />
                    ) : (
                      <Text className="text-6xl text-gray-300">👕</Text>
                    )}
                  </View>
                  
                  {/* 商品信息 */}
                  <View className="p-3">
                    <Text className="block text-base font-medium text-gray-900">
                      {product.name}
                    </Text>
                    
                    {/* 标签信息 - 垂直排列，分类：内容 格式 */}
                    <View className="mt-2">
                      <Text className="block text-xs text-gray-500">
                        品类：{getCategoryName('category', product.category_id)}
                      </Text>
                      <Text className="block text-xs text-gray-500 mt-1">
                        版型：{getCategoryName('fit', product.fit_id)}
                      </Text>
                      <Text className="block text-xs text-gray-500 mt-1">
                        材质：{getCategoryName('fabric', product.fabric_id)}
                      </Text>
                      <Text className="block text-xs text-gray-500 mt-1">
                        款式：{getCategoryName('style', product.style_id)}
                      </Text>
                    </View>
                    
                    {/* 价格 */}
                    <View className="flex items-baseline mt-2">
                      <Text className="block text-xs text-orange-500">¥</Text>
                      <Text className="block text-xl font-bold text-orange-500">
                        {formatPrice(product.price)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* 空状态 */}
          {!loading && products.length === 0 && (
            <View className="flex flex-col items-center justify-center py-20">
              <Text className="block text-4xl text-gray-300 mb-4">📦</Text>
              <Text className="block text-gray-400">暂无符合条件的商品</Text>
            </View>
          )}
          
          {/* 底部间距 */}
          <View className="h-4" />
        </ScrollView>
      </View>
    </View>
  )
}

export default CategoryPage
