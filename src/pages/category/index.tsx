import { View, Text, ScrollView } from '@tarojs/components'
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
  { id: 'cotton', name: '纯棉', desc: '透气舒适' },
  { id: 'polyester', name: '纯涤', desc: '耐磨易打理' },
  { id: 'blend', name: '棉涤混纺', desc: '兼顾两者优点' },
]

// 模拟商品数据
const mockProducts = [
  { id: 1, name: '经典POLO衫', price: '89', image: '', style: 'polo-short', fabric: 'cotton' },
  { id: 2, name: '商务长袖POLO', price: '129', image: '', style: 'polo-long', fabric: 'blend' },
  { id: 3, name: '纯棉圆领T恤', price: '59', image: '', style: 'tshirt', fabric: 'cotton' },
  { id: 4, name: '运动卫衣', price: '159', image: '', style: 'hoodie', fabric: 'polyester' },
  { id: 5, name: '休闲POLO衫', price: '99', image: '', style: 'polo-short', fabric: 'blend' },
  { id: 6, name: '印花T恤', price: '69', image: '', style: 'tshirt', fabric: 'cotton' },
]

const CategoryPage: FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null)

  // 筛选商品
  const filteredProducts = mockProducts.filter((product) => {
    if (selectedStyle && product.style !== selectedStyle) return false
    if (selectedFabric && product.fabric !== selectedFabric) return false
    return true
  })

  return (
    <View className="flex h-screen bg-gray-50">
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
        <View className="p-2 flex-1">
          <Text className="block text-xs font-semibold text-gray-700 mb-2">布料类型</Text>
          <View className="flex flex-col gap-1">
            {fabricTypes.map((fabric) => (
              <View
                key={fabric.id}
                className={`p-2 rounded-lg ${
                  selectedFabric === fabric.id
                    ? 'bg-blue-600'
                    : 'bg-gray-50'
                }`}
                onClick={() => setSelectedFabric(selectedFabric === fabric.id ? null : fabric.id)}
              >
                <Text
                  className={`block text-xs font-medium ${
                    selectedFabric === fabric.id ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {fabric.name}
                </Text>
                <Text
                  className={`block text-xs mt-1 ${
                    selectedFabric === fabric.id ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {fabric.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 重置按钮 */}
        {(selectedStyle || selectedFabric) && (
          <View className="p-2 border-t border-gray-100">
            <View
              className="p-2 bg-gray-100 rounded-lg text-center"
              onClick={() => {
                setSelectedStyle(null)
                setSelectedFabric(null)
              }}
            >
              <Text className="block text-xs text-gray-600">重置筛选</Text>
            </View>
          </View>
        )}
      </View>

      {/* 右侧商品区 */}
      <ScrollView scrollY className="flex-1 p-3">
        {/* 筛选结果提示 */}
        {(selectedStyle || selectedFabric) && (
          <View className="mb-3 px-3 py-2 bg-blue-50 rounded-lg">
            <Text className="block text-sm text-blue-600">
              已筛选 {filteredProducts.length} 件商品
            </Text>
          </View>
        )}

        {/* 商品网格 */}
        <View className="flex flex-wrap gap-2">
          {filteredProducts.map((product) => (
            <View
              key={product.id}
              className="w-[calc(50%-4px)] bg-white rounded-lg overflow-hidden shadow-sm"
              onClick={() => {
                Taro.navigateTo({ url: `/pages/product-detail/index?id=${product.id}` })
              }}
            >
              {/* 商品图片占位 */}
              <View className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Text className="block text-4xl text-gray-300">👕</Text>
              </View>
              {/* 商品信息 */}
              <View className="p-2">
                <Text className="block text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </Text>
                <View className="flex items-baseline mt-1">
                  <Text className="block text-xs text-gray-500">¥</Text>
                  <Text className="block text-lg font-bold text-orange-500">
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
      </ScrollView>
    </View>
  )
}

export default CategoryPage
