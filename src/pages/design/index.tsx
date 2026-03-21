import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Network } from '@/network'
import './index.css'

// 颜色选项
const colorOptions = [
  { id: 'white', name: '白色', color: '#ffffff', border: true },
  { id: 'black', name: '黑色', color: '#1a1a1a', border: false },
  { id: 'navy', name: '藏青', color: '#1e3a5f', border: false },
  { id: 'gray', name: '深灰', color: '#4a4a4a', border: false },
  { id: 'light-gray', name: '浅灰', color: '#c0c0c0', border: true },
  { id: 'red', name: '红色', color: '#dc2626', border: false },
  { id: 'blue', name: '蓝色', color: '#2563eb', border: false },
  { id: 'green', name: '绿色', color: '#16a34a', border: false },
]

// 设计区域
const designAreas = [
  { id: 'front', name: '正面' },
  { id: 'back', name: '背面' },
  { id: 'left-sleeve', name: '左袖' },
  { id: 'right-sleeve', name: '右袖' },
]

const DesignPage: FC = () => {
  const [selectedColor, setSelectedColor] = useState('white')
  const [selectedArea, setSelectedArea] = useState('front')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // 获取当前颜色信息
  const currentColor = colorOptions.find((c) => c.id === selectedColor)

  // 上传图片
  const handleUploadImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })

      const tempFilePath = res.tempFilePaths[0]
      setIsUploading(true)

      // 上传到对象存储
      const uploadRes = await Network.uploadFile({
        url: '/api/design/upload',
        filePath: tempFilePath,
        name: 'file',
      })

      console.log('上传响应:', uploadRes)
      
      // 设置预览图片（使用本地临时路径或服务器返回的URL）
      setUploadedImage(tempFilePath)
      Taro.showToast({ title: '上传成功', icon: 'success' })
    } catch (error) {
      console.error('上传失败:', error)
      Taro.showToast({ title: '上传失败', icon: 'none' })
    } finally {
      setIsUploading(false)
    }
  }

  // 保存设计
  const handleSaveDesign = () => {
    Taro.showToast({ title: '设计已保存', icon: 'success' })
  }

  return (
    <View className="flex flex-col h-screen bg-gray-100">
      {/* 顶部操作栏 */}
      <View className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex items-center gap-2">
          <Text className="block text-lg font-semibold text-gray-900">设计定制</Text>
          <Text className="block text-sm text-gray-500">基础款T恤</Text>
        </View>
        <Button size="sm" onClick={handleSaveDesign} className="bg-blue-600 text-white">
          保存
        </Button>
      </View>

      <ScrollView scrollY className="flex-1">
        {/* T恤预览区 */}
        <View className="relative mx-4 mt-4 bg-white rounded-2xl overflow-hidden shadow-sm">
          {/* 设计区域切换 */}
          <View className="absolute top-2 right-2 z-10 flex gap-1">
            {designAreas.map((area) => (
              <View
                key={area.id}
                className={`px-2 py-1 rounded-full text-xs ${
                  selectedArea === area.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setSelectedArea(area.id)}
              >
                <Text className="block text-xs">{area.name}</Text>
              </View>
            ))}
          </View>

          {/* T恤主体 */}
          <View 
            className="w-full h-80 flex items-center justify-center relative"
            style={{ backgroundColor: currentColor?.color || '#ffffff' }}
          >
            {/* T恤轮廓 SVG */}
            <View className="w-48 h-64 relative">
              {/* 简化的T恤形状 */}
              <View className="absolute inset-0 flex items-center justify-center">
                <Text className="block text-6xl opacity-30">👕</Text>
              </View>
              
              {/* 上传的图片预览 */}
              {uploadedImage && (
                <View className="absolute top-16 left-1/2 -translate-x-1/2 w-24 h-24 border-2 border-dashed border-blue-400 rounded flex items-center justify-center overflow-hidden bg-white bg-opacity-50">
                  <Image
                    src={uploadedImage}
                    mode="aspectFit"
                    className="w-full h-full"
                  />
                </View>
              )}
              
              {/* 设计区域提示 */}
              {!uploadedImage && (
                <View className="absolute top-16 left-1/2 -translate-x-1/2 w-24 h-24 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
                  <Text className="block text-xs text-gray-500 text-center">
                    点击下方{'\n'}上传图片
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* 尺寸提示 */}
          <View className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <Text className="block text-xs text-gray-500">
              设计区域尺寸：正面 20×25cm | 建议上传 800×1000px 以上图片
            </Text>
          </View>
        </View>

        {/* 颜色选择 */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">选择颜色</Text>
          <View className="flex flex-wrap gap-3">
            {colorOptions.map((option) => (
              <View
                key={option.id}
                className="flex flex-col items-center"
                onClick={() => setSelectedColor(option.id)}
              >
                <View
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedColor === option.id ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                  }`}
                  style={{ 
                    backgroundColor: option.color,
                    border: option.border ? '1px solid #e5e7eb' : 'none'
                  }}
                />
                <Text className="block text-xs text-gray-600 mt-1">{option.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 上传模块 */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">上传设计</Text>
          
          {uploadedImage ? (
            <View className="flex flex-col items-center">
              <Image 
                src={uploadedImage} 
                mode="aspectFit" 
                className="w-32 h-32 rounded-lg border border-gray-200"
              />
              <View className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setUploadedImage(null)}
                >
                  删除
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleUploadImage}
                  disabled={isUploading}
                >
                  {isUploading ? '上传中...' : '更换'}
                </Button>
              </View>
            </View>
          ) : (
            <View
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50"
              onClick={handleUploadImage}
            >
              <Text className="block text-4xl text-gray-300 mb-2">📷</Text>
              <Text className="block text-sm text-gray-500">
                {isUploading ? '上传中...' : '点击上传图片'}
              </Text>
            </View>
          )}
        </View>

        {/* 操作说明 */}
        <View className="mx-4 mt-4 mb-6 p-4 bg-blue-50 rounded-xl">
          <Text className="block text-sm font-medium text-blue-800 mb-2">操作提示</Text>
          <Text className="block text-xs text-blue-600">
            1. 选择T恤颜色{'\n'}
            2. 上传您的定制图案{'\n'}
            3. 点击保存完成设计
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default DesignPage
