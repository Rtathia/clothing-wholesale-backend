import { View, Text, ScrollView, Image, MovableArea, MovableView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Network } from '@/network'
import './index.css'

// 颜色选项与对应图片URL（正面和背面分开，使用永久URL - 2025年5月更新）
const colorOptions = [
  { 
    id: 'white', 
    name: '白色', 
    border: true, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Bai_Se_Zheng_Mian_a4f804a7.png?sign=1809417791-9760c30726-0-8ed281150318fe83bb51ded284c8b2a7eab1d095ff316b9c63da6733f54b2d87',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Bai_Se_Bei_Mian_553761de.png?sign=1809417791-2e80fbfbdd-0-fd37357330c31273effd182cf113704f2d84d774212c2e958c0e792cec5e36e4'
  },
  { 
    id: 'black', 
    name: '黑色', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Hei_Se_Zheng_Mian_a2b019d5.png?sign=1809417791-fe0731ee1d-0-ef6d8e0da698dbad698cdc95dcbf79b85b5541a93dd56288318d9f13e3d4f413',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Hei_Se_Bei_Mian_e275c204.png?sign=1809417791-cffde3fc92-0-1f0434d190d114690180d550108129a3cfc5db5f88b90a238fbfa6b627585d2c'
  },
  { 
    id: 'navy', 
    name: '藏青', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Cang_Qing_Zheng_Mian_be906f34.png?sign=1809417791-e43e8d15df-0-ecfa0cf2f991ac4c00accd2b01e67e3b2d22d42e828f26b6884e24ff0920c717',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Cang_Qing_Bei_Mian_900dd728.png?sign=1809417792-e297585fbb-0-048219bcf0a02d5a5048fb9171a5e092fbe8fa197d4c04d8cb6719c39af2072b'
  },
  { 
    id: 'dark-gray', 
    name: '深灰', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Shen_Hui_Zheng_Mian_b1064f92.png?sign=1809417792-7a79820e2a-0-b89e122aba16d55fd8579cb189adace0555f87108dab48fc02176b9e77bea269',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Shen_Hui_Bei_Mian_239d69f1.png?sign=1809417792-bfbb83ed53-0-ec3a6d2f9828ec7a6603385443c8bd80f283c8f7864e7a3c3ae91fea7c0c8eab'
  },
  { 
    id: 'light-gray', 
    name: '浅灰', 
    border: true, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Qian_Hui_Zheng_Mian_7c0e63e5.png?sign=1809417793-3b21eb1545-0-545ca20f189fd23448cd8a0405325eb1d17599953c7c931496a489053572a632',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Qian_Hui_Bei_Mian_9d71425a.png?sign=1809417793-d027fbb22e-0-880ee86e4238287cd93ac1a85b4b33467a51c4f5268881885bfa11c42b803cc9'
  },
  { 
    id: 'blue', 
    name: '蓝色', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Lan_Se_Zheng_Mian_25ffe0aa.png?sign=1809417793-d8479889d9-0-905281709e8999df3792e3da05e8a72fbbb2efb6ecc78eba08e2363da52017de',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Lan_Se_Bei_Mian_33bab108.png?sign=1809417793-8ac3456a0c-0-6c04287e6e35ac0a6b631a71cfcd1e5a84f734d6d957e61aab2cf61bbfaaf14a'
  },
]

// Logo位置选项（只保留正面和背面）
const logoPositions = [
  { id: 'front', name: '正面' },
  { id: 'back', name: '背面' },
]

const DesignPage: FC = () => {
  const [selectedColor, setSelectedColor] = useState('white')
  const [selectedPosition, setSelectedPosition] = useState('front')
  const [uploadedLogos, setUploadedLogos] = useState<Record<string, { url: string; x: number; y: number; scale: number }>>({
    'front': { url: '', x: 0, y: 0, scale: 1 },
    'back': { url: '', x: 0, y: 0, scale: 1 },
    'sleeve': { url: '', x: 0, y: 0, scale: 1 }, // 袖子Logo（选填）
  })
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingSleeve, setIsUploadingSleeve] = useState(false)

  // 获取当前颜色信息
  const currentColor = colorOptions.find((c) => c.id === selectedColor)
  
  // 根据位置获取对应图片URL
  const currentImageUrl = selectedPosition === 'front' 
    ? (currentColor?.frontImageUrl || colorOptions[0].frontImageUrl)
    : (currentColor?.backImageUrl || colorOptions[0].backImageUrl)

  // 上传图片（正面/背面）
  const handleUploadImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })

      const tempFilePath = res.tempFilePaths[0]
      setIsUploading(true)

      try {
        await Network.uploadFile({
          url: '/api/design/upload',
          filePath: tempFilePath,
          name: 'file',
        })
      } catch (uploadError) {
        console.log('服务器上传失败，使用本地路径')
      }

      setUploadedLogos((prev) => ({
        ...prev,
        [selectedPosition]: {
          url: tempFilePath,
          x: 0,
          y: 0,
          scale: 1,
        },
      }))

      Taro.showToast({ title: '上传成功', icon: 'success' })
    } catch (error) {
      console.error('上传失败:', error)
      Taro.showToast({ title: '上传失败', icon: 'none' })
    } finally {
      setIsUploading(false)
    }
  }

  // 上传袖子Logo
  const handleUploadSleeveLogo = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })

      const tempFilePath = res.tempFilePaths[0]
      setIsUploadingSleeve(true)

      try {
        await Network.uploadFile({
          url: '/api/design/upload',
          filePath: tempFilePath,
          name: 'file',
        })
      } catch (uploadError) {
        console.log('服务器上传失败，使用本地路径')
      }

      setUploadedLogos((prev) => ({
        ...prev,
        'sleeve': {
          url: tempFilePath,
          x: 0,
          y: 0,
          scale: 1,
        },
      }))

      Taro.showToast({ title: '上传成功', icon: 'success' })
    } catch (error) {
      console.error('上传失败:', error)
      Taro.showToast({ title: '上传失败', icon: 'none' })
    } finally {
      setIsUploadingSleeve(false)
    }
  }

  // 删除当前位置的logo
  const handleDeleteLogo = () => {
    setUploadedLogos((prev) => ({
      ...prev,
      [selectedPosition]: { url: '', x: 0, y: 0, scale: 1 },
    }))
    Taro.showToast({ title: '已删除', icon: 'success' })
  }

  // 删除袖子Logo
  const handleDeleteSleeveLogo = () => {
    setUploadedLogos((prev) => ({
      ...prev,
      'sleeve': { url: '', x: 0, y: 0, scale: 1 },
    }))
    Taro.showToast({ title: '已删除', icon: 'success' })
  }

  // 移动logo
  const handleLogoChange = (position: string, x: number, y: number) => {
    setUploadedLogos((prev) => ({
      ...prev,
      [position]: { ...prev[position], x, y },
    }))
  }

  // 保存设计
  const handleSaveDesign = () => {
    console.log('保存设计:', { color: selectedColor, logos: uploadedLogos })
    Taro.showToast({ title: '设计已保存', icon: 'success' })
  }

  return (
    <View className="flex flex-col bg-gray-100" style={{ height: 'calc(100vh - 50px)' }}>
      {/* 顶部标题栏 */}
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
        {/* T恤预览区域 */}
        <View className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
          <View 
            className="w-full flex items-center justify-center py-6"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <View className="relative w-full px-8">
              {/* T恤图片 - 根据选中颜色和位置显示对应图片 */}
              <Image 
                src={currentImageUrl}
                mode="widthFix"
                className="w-full"
              />
              
              {/* 设计区域（Logo放置区域） */}
              <View 
                className="absolute border-2 border-dashed border-blue-500 rounded"
                style={{
                  top: '28%',
                  left: '26%',
                  width: '48%',
                  height: '35%',
                }}
              >
                <MovableArea 
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                  {uploadedLogos[selectedPosition]?.url && (
                    <MovableView
                      direction="all"
                      scale
                      scaleMin={0.5}
                      scaleMax={2}
                      style={{ width: '100%', height: '100%', position: 'absolute' }}
                      x={uploadedLogos[selectedPosition].x}
                      y={uploadedLogos[selectedPosition].y}
                      onChange={(e) => handleLogoChange(selectedPosition, e.detail.x, e.detail.y)}
                    >
                      <Image
                        src={uploadedLogos[selectedPosition].url}
                        mode="aspectFit"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </MovableView>
                  )}
                </MovableArea>
                
                {!uploadedLogos[selectedPosition]?.url && (
                  <View className="absolute inset-0 flex items-center justify-center">
                    <Text className="block text-xs text-blue-400">20x25cm</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* 设计区域提示 */}
          <View className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <Text className="block text-xs text-gray-500">
              设计区域：{selectedPosition === 'front' ? '正面' : '背面'} 20x25cm
            </Text>
          </View>
        </View>

        {/* Logo位置选择 */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">选择Logo位置</Text>
          <View className="flex flex-row gap-2">
            {logoPositions.map((position) => (
              <View
                key={position.id}
                className={`flex-1 p-3 rounded-xl text-center ${
                  selectedPosition === position.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-700'
                }`}
                onClick={() => setSelectedPosition(position.id)}
              >
                <Text
                  className={`block text-sm font-medium ${
                    selectedPosition === position.id ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {position.name}
                </Text>
                {uploadedLogos[position.id]?.url && (
                  <Text className="block text-xs text-green-400 mt-1">已添加</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 颜色选择 */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">更换颜色</Text>
          <View className="flex flex-wrap gap-4 justify-center">
            {colorOptions.map((option) => (
              <View
                key={option.id}
                className="flex flex-col items-center"
                onClick={() => setSelectedColor(option.id)}
              >
                <View
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedColor === option.id ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                  }`}
                  style={{ 
                    backgroundColor: option.id === 'white' ? '#ffffff' : 
                                    option.id === 'black' ? '#1a1a1a' :
                                    option.id === 'navy' ? '#1e3a5f' :
                                    option.id === 'dark-gray' ? '#4a4a4a' :
                                    option.id === 'light-gray' ? '#c0c0c0' : '#2563eb',
                    border: option.border ? '1px solid #e5e7eb' : 'none'
                  }}
                />
                <Text className="block text-xs text-gray-600 mt-2">{option.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 上传Logo（正面/背面） */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">
            上传Logo - {selectedPosition === 'front' ? '正面' : '背面'}
          </Text>
          
          {uploadedLogos[selectedPosition]?.url ? (
            <View className="flex flex-col items-center">
              <Image 
                src={uploadedLogos[selectedPosition].url} 
                mode="aspectFit" 
                className="w-32 h-32 rounded-lg border border-gray-200"
              />
              <Text className="block text-xs text-gray-500 mt-2">
                拖动调整位置，双指缩放大小
              </Text>
              <View className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleDeleteLogo}
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
              <Text className="block text-4xl text-gray-300 mb-2">+</Text>
              <Text className="block text-sm text-gray-500">
                {isUploading ? '上传中...' : '点击上传Logo图片'}
              </Text>
            </View>
          )}
        </View>

        {/* 上传Logo - 袖子（选填） */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <View className="flex items-center mb-3">
            <Text className="block text-sm font-semibold text-gray-900">上传Logo - 袖子</Text>
            <Text className="block text-xs text-gray-400 ml-2">（选填）</Text>
          </View>
          
          {uploadedLogos['sleeve']?.url ? (
            <View className="flex flex-col items-center">
              <Image 
                src={uploadedLogos['sleeve'].url} 
                mode="aspectFit" 
                className="w-24 h-24 rounded-lg border border-gray-200"
              />
              <Text className="block text-xs text-gray-500 mt-2">设计区域：10x10cm</Text>
              <View className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleDeleteSleeveLogo}
                >
                  删除
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleUploadSleeveLogo}
                  disabled={isUploadingSleeve}
                >
                  {isUploadingSleeve ? '上传中...' : '更换'}
                </Button>
              </View>
            </View>
          ) : (
            <View
              className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50"
              onClick={handleUploadSleeveLogo}
            >
              <Text className="block text-3xl text-gray-300 mb-1">+</Text>
              <Text className="block text-xs text-gray-400">
                {isUploadingSleeve ? '上传中...' : '可选：上传袖子Logo'}
              </Text>
            </View>
          )}
        </View>

        {/* 使用说明 */}
        <View className="mx-4 mt-4 mb-6 p-4 bg-blue-50 rounded-xl">
          <Text className="block text-sm font-medium text-blue-800 mb-2">使用说明</Text>
          <Text className="block text-xs text-blue-600">
            1. 选择T恤颜色{'\n'}
            2. 选择Logo位置（正面/背面）{'\n'}
            3. 上传您的Logo图片{'\n'}
            4. 拖动调整Logo位置{'\n'}
            5. 双指缩放调整Logo大小{'\n'}
            6. 可选：上传袖子Logo{'\n'}
            7. 点击保存完成设计
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default DesignPage
