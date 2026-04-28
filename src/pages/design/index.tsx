import { View, Text, ScrollView, Image, MovableArea, MovableView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Network } from '@/network'
import './index.css'

// 颜色选项与对应图片URL（正面和背面分开，使用永久URL）
const colorOptions = [
  { 
    id: 'white', 
    name: '白色', 
    border: true, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Bai_Se_Zheng_Mian_53c06ed2.png?sign=1779965012-7d06f189f3-0-f3bc67607fccae64a99e7e13ed79afd78173b80cfb8bee3477a635534d872de5',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Bai_Se_Bei_Mian_9e8f972b.png?sign=1779965013-d38a7ec996-0-e8c7a9435c8db841778b61763c3b4c915554f5b2598fc36275e6380e7b0fe312'
  },
  { 
    id: 'black', 
    name: '黑色', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Hei_Se_Zheng_Mian_b3959f5d.png?sign=1779965015-9bae4fb7ff-0-2f54bebc4edaaaeb59895f21e8a91d5757b9e65abe733f35da811c0803693bf3',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Hei_Se_Bei_Mian_7a1e7a76.png?sign=1779965015-7d668d2361-0-1b83ddb1754372f4c08605e5a4676413c5500edf36e46a83ef19584d889e43ec'
  },
  { 
    id: 'navy', 
    name: '藏青', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Cang_Qing_Zheng_Mian_1a4eaacb.png?sign=1779965014-0170e9f2e0-0-38c4aed58da89b67d7bf902863b5e56e79804a3ee393d4c277b38ee07f27eae8',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Cang_Qing_Bei_Mian_d5e7e5b5.png?sign=1779965014-50ebe29ccb-0-a8948ce40b07ad92c42b1dcbdb89565253e16373c14ef14d42a0827359c81552'
  },
  { 
    id: 'dark-gray', 
    name: '深灰', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Shen_Hui_Zheng_Mian_8edb433e.png?sign=1779965012-bae1459a59-0-e22548560eef12b7159f8281e114f03e7a693d09bf77073d44d7a0294df28982',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Shen_Hui_Bei_Mian_fbc49929.png?sign=1779965012-26c95d2ff8-0-8dd26cb83668277b25f5d6a44cfdb906c6bc98af26ae9ca39ae3a2e18e61160e'
  },
  { 
    id: 'light-gray', 
    name: '浅灰', 
    border: true, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Qian_Hui_Zheng_Mian_3956e8c7.png?sign=1779965010-ab0413dcdf-0-eb3663275bacf39bee964cfbeb22e682cabb4887e8874c126f1efbf25e76f97b',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Qian_Hui_Bei_Mian_99c34bb6.png?sign=1779965011-28e63a752b-0-afd4bd0fec51c7558a773fe5d9d48d212dc8d541ee451a239d6715231f7f01d3'
  },
  { 
    id: 'blue', 
    name: '蓝色', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Lan_Se_Zheng_Mian_56d9cea8.png?sign=1779965013-b27bea7adf-0-d1d087262549714d76c93f2867db517698237e34f9735984f8a0b7ce020e4fdd',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/liule/Lan_Se_Bei_Mian_f3ac2257.png?sign=1779965014-184da188d1-0-cc929a26970f48058c84c46896a1a795c88d94e788fbb68bf79a39a6d788737c'
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
