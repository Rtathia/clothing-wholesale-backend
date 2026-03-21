import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import './index.css'

// 款式类型数据
const styleTypes = [
  { id: 'polo-short', name: 'POLO衫', icon: '👕' },
  { id: 'polo-long', name: 'POLO长袖', icon: '🧥' },
  { id: 'tshirt', name: 'T恤', icon: '👔' },
  { id: 'hoodie', name: '卫衣', icon: '🎽' },
]

// 布料类型数据
const fabricTypes = [
  { id: 'cotton', name: '纯棉', icon: '🌿' },
  { id: 'polyester', name: '纯涤', icon: '🔬' },
  { id: 'blend', name: '棉涤混纺', icon: '🧵' },
]

// 工艺类型数据
const craftTypes = [
  { id: 'print', name: '印刷', icon: '🖨️' },
  { id: 'embroidery', name: '刺绣', icon: '🪡' },
]

// 模拟商品数据（添加工艺属性）
const mockProducts = [
  { id: 1, name: '经典POLO衫', price: '89', category: 'POLO衫', style: '短袖', fabric: '纯棉', fit: '修身', craft: '刺绣', image: 'https://img.alicdn.com/imgextra/i4/2216685773707/O1CN01JhVTtS1h6CgZWN1Px_!!2216685773707.jpg_Q75.jpg_.webp' },
  { id: 2, name: '商务长袖POLO', price: '129', category: 'POLO衫', style: '长袖', fabric: '棉涤混纺', fit: '常规', craft: '刺绣', image: 'https://img.alicdn.com/imgextra/i1/2216685773707/O1CN01FQJNdr1h6CgXlPDdE_!!2216685773707.jpg_Q75.jpg_.webp' },
  { id: 3, name: '纯棉圆领T恤', price: '59', category: 'T恤', style: '短袖', fabric: '纯棉', fit: '宽松', craft: '印刷', image: 'https://img.alicdn.com/imgextra/i3/2216685773707/O1CN01vXjLMT1h6CgWzZCFr_!!2216685773707.jpg_Q75.jpg_.webp' },
  { id: 4, name: '运动卫衣', price: '159', category: '卫衣', style: '套头', fabric: '纯涤', fit: '宽松', craft: '印刷', image: 'https://img.alicdn.com/imgextra/i2/2216685773707/O1CN01xEeUet1h6CgQJcCBl_!!2216685773707.jpg_Q75.jpg_.webp' },
  { id: 5, name: '休闲POLO衫', price: '99', category: 'POLO衫', style: '短袖', fabric: '棉涤混纺', fit: '常规', craft: '刺绣', image: 'https://img.alicdn.com/imgextra/i4/2216685773707/O1CN01JhVTtS1h6CgZWN1Px_!!2216685773707.jpg_Q75.jpg_.webp' },
  { id: 6, name: '印花T恤', price: '69', category: 'T恤', style: '短袖', fabric: '纯棉', fit: '修身', craft: '印刷', image: 'https://img.alicdn.com/imgextra/i3/2216685773707/O1CN01vXjLMT1h6CgWzZCFr_!!2216685773707.jpg_Q75.jpg_.webp' },
]

const CategoryPage: FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null)
  const [selectedCraft, setSelectedCraft] = useState<string | null>(null)

  // 筛选商品
  const filteredProducts = mockProducts.filter((product) => {
    if (selectedStyle === 'polo-short' && !product.category.includes('POLO')) return false
    if (selectedStyle === 'polo-short' && !product.style.includes('短')) return false
    if (selectedStyle === 'polo-long' && !product.category.includes('POLO')) return false
    if (selectedStyle === 'polo-long' && !product.style.includes('长')) return false
    if (selectedStyle === 'tshirt' && !product.category.includes('T恤')) return false
    if (selectedStyle === 'hoodie' && !product.category.includes('卫衣')) return false
    if (selectedFabric === 'cotton' && product.fabric !== '纯棉') return false
    if (selectedFabric === 'polyester' && product.fabric !== '纯涤') return false
    if (selectedFabric === 'blend' && product.fabric !== '棉涤混纺') return false
    if (selectedCraft === 'print' && product.craft !== '印刷') return false
    if (selectedCraft === 'embroidery' && product.craft !== '刺绣') return false
    return true
  })

  // 重置所有筛选
  const handleReset = () => {
    setSelectedStyle(null)
    setSelectedFabric(null)
    setSelectedCraft(null)
  }

  return (
    <View className="flex flex-col bg-gray-50" style={{ height: 'calc(100vh - 50px)' }}>
      <View className="flex flex-1">
        {/* 左侧筛选区 */}
        <View className="w-24 bg-white border-r border-gray-200 flex flex-col">
          {/* 款式类型 */}
          <View className="p-2 border-b border-gray-100">
            <Text className="block text-xs font-semibold text-gray-700 mb-2">款式类型</Text>
            <View className="flex flex-col gap-1">
              {styleTypes.map((style) => (
                <View
                  key={style.id}
                  className={`p-2 rounded-lg text-center ${
                    selectedStyle === style.id
                      ? 'bg-blue-600'
                      : 'bg-gray-50'
                  }`}
                  onClick={() => setSelectedStyle(selectedStyle === style.id ? null : style.id)}
                >
                  <Text className="block text-lg">{style.icon}</Text>
                  <Text
                    className={`block text-xs mt-1 ${
                      selectedStyle === style.id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {style.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 布料类型 */}
          <View className="p-2 border-b border-gray-100">
            <Text className="block text-xs font-semibold text-gray-700 mb-2">布料类型</Text>
            <View className="flex flex-col gap-1">
              {fabricTypes.map((fabric) => (
                <View
                  key={fabric.id}
                  className={`p-2 rounded-lg text-center ${
                    selectedFabric === fabric.id
                      ? 'bg-blue-600'
                      : 'bg-gray-50'
                  }`}
                  onClick={() => setSelectedFabric(selectedFabric === fabric.id ? null : fabric.id)}
                >
                  <Text className="block text-lg">{fabric.icon}</Text>
                  <Text
                    className={`block text-xs mt-1 ${
                      selectedFabric === fabric.id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {fabric.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 工艺类型 */}
          <View className="p-2 flex-1">
            <Text className="block text-xs font-semibold text-gray-700 mb-2">工艺类型</Text>
            <View className="flex flex-col gap-1">
              {craftTypes.map((craft) => (
                <View
                  key={craft.id}
                  className={`p-2 rounded-lg text-center ${
                    selectedCraft === craft.id
                      ? 'bg-blue-600'
                      : 'bg-gray-50'
                  }`}
                  onClick={() => setSelectedCraft(selectedCraft === craft.id ? null : craft.id)}
                >
                  <Text className="block text-lg">{craft.icon}</Text>
                  <Text
                    className={`block text-xs mt-1 ${
                      selectedCraft === craft.id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {craft.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 重置按钮 */}
          {(selectedStyle || selectedFabric || selectedCraft) && (
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
          {(selectedStyle || selectedFabric || selectedCraft) && (
            <View className="mb-3 px-3 py-2 bg-blue-50 rounded-lg">
              <Text className="block text-sm text-blue-600">
                已筛选 {filteredProducts.length} 件商品
              </Text>
            </View>
          )}

          {/* 商品列表 - 单列布局 */}
          <View className="flex flex-col gap-3">
            {filteredProducts.map((product) => (
              <View
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
                onClick={() => {
                  Taro.navigateTo({ url: `/pages/product-detail/index?id=${product.id}` })
                }}
              >
                {/* 商品图片 */}
                <View className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Image 
                    src={product.image}
                    mode="aspectFit"
                    className="w-full h-full"
                  />
                </View>
                
                {/* 商品信息 */}
                <View className="p-3">
                  <Text className="block text-base font-medium text-gray-900">
                    {product.name}
                  </Text>
                  
                  {/* 标签信息 - 图片下方横向排列 */}
                  <View className="flex flex-row flex-wrap gap-2 mt-2">
                    <View className="px-2 py-1 bg-gray-100 rounded">
                      <Text className="block text-xs text-gray-600">{product.category}</Text>
                    </View>
                    <View className="px-2 py-1 bg-gray-100 rounded">
                      <Text className="block text-xs text-gray-600">{product.fit}</Text>
                    </View>
                    <View className="px-2 py-1 bg-gray-100 rounded">
                      <Text className="block text-xs text-gray-600">{product.fabric}</Text>
                    </View>
                    <View className="px-2 py-1 bg-gray-100 rounded">
                      <Text className="block text-xs text-gray-600">{product.style}</Text>
                    </View>
                  </View>
                  
                  {/* 价格 */}
                  <View className="flex items-baseline mt-2">
                    <Text className="block text-xs text-orange-500">¥</Text>
                    <Text className="block text-xl font-bold text-orange-500">
                      {product.price}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* 空状态 */}
          {filteredProducts.length === 0 && (
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
