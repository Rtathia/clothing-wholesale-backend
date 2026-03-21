import { View, Text, ScrollView, Image, MovableArea, MovableView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Network } from '@/network'
import './index.css'

// 颜色选项（只保留6种颜色）
const colorOptions = [
  { id: 'white', name: '白色', color: '#ffffff', filter: 'brightness(1)', border: true },
  { id: 'black', name: '黑色', color: '#1a1a1a', filter: 'brightness(0.1) contrast(1.2)', border: false },
  { id: 'navy', name: '藏青', color: '#1e3a5f', filter: 'brightness(0.4) sepia(1) saturate(3) hue-rotate(180deg)', border: false },
  { id: 'dark-gray', name: '深灰', color: '#4a4a4a', filter: 'brightness(0.4) contrast(1.1)', border: false },
  { id: 'light-gray', name: '浅灰', color: '#c0c0c0', filter: 'brightness(0.85)', border: true },
  { id: 'blue', name: '蓝色', color: '#2563eb', filter: 'brightness(0.5) sepia(1) saturate(5) hue-rotate(200deg)', border: false },
]

// Logo位置选项
const logoPositions = [
  { id: 'left-sleeve', name: '左袖', type: 'sleeve' },
  { id: 'right-sleeve', name: '右袖', type: 'sleeve' },
  { id: 'front', name: '正面', type: 'body' },
  { id: 'back', name: '背面', type: 'body' },
]

// T恤基础图片URL（白色纯色T恤基础款）
const TSHIRT_BASE_URL = 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2Fimage.png&nonce=a0bae4a0-bfa2-4a87-ba0d-ff8a140f09e7&project_id=7619676618268688390&sign=a2d65018b51d7fd5aa0e0fa11fb9e8c08a40f2a4cfc8fd3ed215937953b1d45e'

const DesignPage: FC = () => {
  const [selectedColor, setSelectedColor] = useState('white')
  const [selectedPosition, setSelectedPosition] = useState('front')
  const [uploadedLogos, setUploadedLogos] = useState<Record<string, { url: string; x: number; y: number; scale: number }>>({
    'left-sleeve': { url: '', x: 0, y: 0, scale: 1 },
    'right-sleeve': { url: '', x: 0, y: 0, scale: 1 },
    'front': { url: '', x: 0, y: 0, scale: 1 },
    'back': { url: '', x: 0, y: 0, scale: 1 },
  })
  const [isUploading, setIsUploading] = useState(false)

  // 获取当前颜色信息
  const currentColor = colorOptions.find((c) => c.id === selectedColor)
  
  // 当前选中位置类型
  const currentPositionType = logoPositions.find((p) => p.id === selectedPosition)?.type || 'body'

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

  // 删除当前位置的logo
  const handleDeleteLogo = () => {
    setUploadedLogos((prev) => ({
      ...prev,
      [selectedPosition]: { url: '', x: 0, y: 0, scale: 1 },
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
        <View className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden shadow-sm">
          <View 
            className="w-full flex items-center justify-center py-6"
            style={{ backgroundColor: currentColor?.color || '#ffffff' }}
          >
            <View className="relative w-full px-8">
              {/* T恤图片 */}
              <Image 
                src={TSHIRT_BASE_URL}
                mode="widthFix"
                className="w-full"
                style={{ filter: currentColor?.filter || 'none' }}
              />
              
              {/* 设计区域（Logo放置区域） */}
              <View 
                className="absolute border-2 border-dashed border-blue-500 rounded"
                style={currentPositionType === 'body' ? {
                  top: '28%',
                  left: '26%',
                  width: '48%',
                  height: '35%',
                } : {
                  top: '12%',
                  left: selectedPosition === 'left-sleeve' ? '5%' : '75%',
                  width: '20%',
                  height: '25%',
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
                    <Text className="block text-xs text-blue-400">
                      {currentPositionType === 'body' ? '20x25cm' : '10x10cm'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* 设计区域提示 */}
          <View className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <Text className="block text-xs text-gray-500">
              设计区域：{currentPositionType === 'body' ? '正面/背面 20x25cm' : '袖口 10x10cm'}
            </Text>
          </View>
        </View>

        {/* Logo位置选择 */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">选择Logo位置</Text>
          <View className="grid grid-cols-4 gap-2">
            {logoPositions.map((position) => (
              <View
                key={position.id}
                className={`p-3 rounded-xl text-center ${
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
                    backgroundColor: option.color,
                    border: option.border ? '1px solid #e5e7eb' : 'none'
                  }}
                />
                <Text className="block text-xs text-gray-600 mt-2">{option.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 上传Logo */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">
            上传Logo - {logoPositions.find((p) => p.id === selectedPosition)?.name}
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

        {/* 使用说明 */}
        <View className="mx-4 mt-4 mb-6 p-4 bg-blue-50 rounded-xl">
          <Text className="block text-sm font-medium text-blue-800 mb-2">使用说明</Text>
          <Text className="block text-xs text-blue-600">
            1. 选择T恤颜色{'\n'}
            2. 选择Logo位置（左袖/右袖/正面/背面）{'\n'}
            3. 上传您的Logo图片{'\n'}
            4. 拖动调整Logo位置{'\n'}
            5. 双指缩放调整Logo大小{'\n'}
            6. 点击保存完成设计
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default DesignPage
