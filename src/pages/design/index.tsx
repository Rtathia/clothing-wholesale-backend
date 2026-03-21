import { View, Text, ScrollView, Image, MovableArea, MovableView } from '@tarojs/components'
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

// Logo位置选项
const logoPositions = [
  { id: 'left-sleeve', name: '左袖', viewBox: 'front' },
  { id: 'right-sleeve', name: '右袖', viewBox: 'front' },
  { id: 'front', name: '正面', viewBox: 'front' },
  { id: 'back', name: '背面', viewBox: 'back' },
]

// 设计区域配置（相对位置百分比）
const designAreas = {
  'left-sleeve': { top: '18%', left: '8%', width: '18%', height: '15%' },
  'right-sleeve': { top: '18%', left: '74%', width: '18%', height: '15%' },
  'front': { top: '25%', left: '30%', width: '40%', height: '35%' },
  'back': { top: '20%', left: '30%', width: '40%', height: '40%' },
}

const DesignPage: FC = () => {
  const [selectedColor, setSelectedColor] = useState('white')
  const [selectedPosition, setSelectedPosition] = useState('left-sleeve')
  const [uploadedLogos, setUploadedLogos] = useState<Record<string, { url: string; x: number; y: number }>>({})
  const [isUploading, setIsUploading] = useState(false)

  // 获取当前颜色信息
  const currentColor = colorOptions.find((c) => c.id === selectedColor)
  
  // 当前视角（正面或背面）
  const currentViewBox = logoPositions.find((p) => p.id === selectedPosition)?.viewBox || 'front'

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
      try {
        const uploadRes = await Network.uploadFile({
          url: '/api/design/upload',
          filePath: tempFilePath,
          name: 'file',
        })
        console.log('上传响应:', uploadRes)
      } catch (uploadError) {
        console.log('上传到服务器失败，使用本地路径:', uploadError)
      }

      // 设置当前位置的logo
      setUploadedLogos((prev) => ({
        ...prev,
        [selectedPosition]: {
          url: tempFilePath,
          x: 0,
          y: 0,
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
    setUploadedLogos((prev) => {
      const newLogos = { ...prev }
      delete newLogos[selectedPosition]
      return newLogos
    })
  }

  // 移动logo位置
  const handleLogoMove = (position: string, x: number, y: number) => {
    setUploadedLogos((prev) => ({
      ...prev,
      [position]: {
        ...prev[position],
        x,
        y,
      },
    }))
  }

  // 保存设计
  const handleSaveDesign = () => {
    console.log('保存设计:', {
      color: selectedColor,
      logos: uploadedLogos,
    })
    Taro.showToast({ title: '设计已保存', icon: 'success' })
  }

  // 渲染T恤SVG图形
  const renderTshirtSVG = (view: 'front' | 'back') => {
    const shirtColor = currentColor?.color || '#ffffff'
    const isDark = ['black', 'navy', 'gray'].includes(selectedColor)
    const strokeColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
    
    return (
      <View className="relative w-full h-full flex items-center justify-center">
        {/* T恤主体 SVG */}
        <svg viewBox="0 0 200 220" className="w-4/5 h-auto">
          {/* T恤主体 */}
          <path
            d={view === 'front' 
              ? 'M50,50 L30,60 L10,90 L30,95 L40,75 L40,200 L160,200 L160,75 L170,95 L190,90 L170,60 L150,50 L130,50 Q100,70 70,50 L50,50 Z'
              : 'M50,50 L30,60 L10,90 L30,95 L40,75 L40,200 L160,200 L160,75 L170,95 L190,90 L170,60 L150,50 L130,50 Q100,65 70,50 L50,50 Z'
            }
            fill={shirtColor}
            stroke={strokeColor}
            strokeWidth="1"
          />
          {/* 领口 */}
          <ellipse
            cx="100"
            cy="55"
            rx="30"
            ry="10"
            fill={view === 'front' ? (isDark ? '#2a2a2a' : '#f0f0f0') : shirtColor}
            stroke={strokeColor}
            strokeWidth="1"
          />
          {view === 'front' && (
            <>
              {/* 领口V字 */}
              <path
                d="M85,55 L100,75 L115,55"
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
              />
            </>
          )}
        </svg>

        {/* 设计区域标注 */}
        {view === 'front' && (
          <>
            {/* 左袖设计区域 */}
            <View 
              className={`absolute border-2 border-dashed rounded ${selectedPosition === 'left-sleeve' ? 'border-blue-500' : 'border-gray-400'}`}
              style={{
                top: designAreas['left-sleeve'].top,
                left: designAreas['left-sleeve'].left,
                width: designAreas['left-sleeve'].width,
                height: designAreas['left-sleeve'].height,
              }}
            >
              {uploadedLogos['left-sleeve'] && (
                <MovableArea className="w-full h-full">
                  <MovableView
                    direction="all"
                    className="w-full h-full"
                    x={uploadedLogos['left-sleeve'].x}
                    y={uploadedLogos['left-sleeve'].y}
                    onChange={(e) => handleLogoMove('left-sleeve', e.detail.x, e.detail.y)}
                  >
                    <Image
                      src={uploadedLogos['left-sleeve'].url}
                      mode="aspectFit"
                      className="w-full h-full"
                    />
                  </MovableView>
                </MovableArea>
              )}
            </View>
            
            {/* 右袖设计区域 */}
            <View 
              className={`absolute border-2 border-dashed rounded ${selectedPosition === 'right-sleeve' ? 'border-blue-500' : 'border-gray-400'}`}
              style={{
                top: designAreas['right-sleeve'].top,
                left: designAreas['right-sleeve'].left,
                width: designAreas['right-sleeve'].width,
                height: designAreas['right-sleeve'].height,
              }}
            >
              {uploadedLogos['right-sleeve'] && (
                <MovableArea className="w-full h-full">
                  <MovableView
                    direction="all"
                    className="w-full h-full"
                    x={uploadedLogos['right-sleeve'].x}
                    y={uploadedLogos['right-sleeve'].y}
                    onChange={(e) => handleLogoMove('right-sleeve', e.detail.x, e.detail.y)}
                  >
                    <Image
                      src={uploadedLogos['right-sleeve'].url}
                      mode="aspectFit"
                      className="w-full h-full"
                    />
                  </MovableView>
                </MovableArea>
              )}
            </View>
            
            {/* 正面设计区域 */}
            <View 
              className={`absolute border-2 border-dashed rounded ${selectedPosition === 'front' ? 'border-blue-500' : 'border-gray-400'}`}
              style={{
                top: designAreas['front'].top,
                left: designAreas['front'].left,
                width: designAreas['front'].width,
                height: designAreas['front'].height,
              }}
            >
              {uploadedLogos['front'] && (
                <MovableArea className="w-full h-full">
                  <MovableView
                    direction="all"
                    className="w-full h-full"
                    x={uploadedLogos['front'].x}
                    y={uploadedLogos['front'].y}
                    onChange={(e) => handleLogoMove('front', e.detail.x, e.detail.y)}
                  >
                    <Image
                      src={uploadedLogos['front'].url}
                      mode="aspectFit"
                      className="w-full h-full"
                    />
                  </MovableView>
                </MovableArea>
              )}
            </View>
          </>
        )}

        {view === 'back' && (
          <>
            {/* 背面设计区域 */}
            <View 
              className={`absolute border-2 border-dashed rounded ${selectedPosition === 'back' ? 'border-blue-500' : 'border-gray-400'}`}
              style={{
                top: designAreas['back'].top,
                left: designAreas['back'].left,
                width: designAreas['back'].width,
                height: designAreas['back'].height,
              }}
            >
              {uploadedLogos['back'] && (
                <MovableArea className="w-full h-full">
                  <MovableView
                    direction="all"
                    className="w-full h-full"
                    x={uploadedLogos['back'].x}
                    y={uploadedLogos['back'].y}
                    onChange={(e) => handleLogoMove('back', e.detail.x, e.detail.y)}
                  >
                    <Image
                      src={uploadedLogos['back'].url}
                      mode="aspectFit"
                      className="w-full h-full"
                    />
                  </MovableView>
                </MovableArea>
              )}
            </View>
          </>
        )}
      </View>
    )
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
          {/* 视角切换标签 */}
          <View className="absolute top-2 right-2 z-10 flex gap-1">
            <View
              className={`px-3 py-1 rounded-full text-xs ${
                currentViewBox === 'front'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setSelectedPosition('front')}
            >
              <Text className="block text-xs">正面</Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full text-xs ${
                currentViewBox === 'back'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setSelectedPosition('back')}
            >
              <Text className="block text-xs">背面</Text>
            </View>
          </View>

          {/* T恤图形 */}
          <View 
            className="w-full h-80"
            style={{ backgroundColor: currentColor?.color || '#ffffff' }}
          >
            {renderTshirtSVG(currentViewBox as 'front' | 'back')}
          </View>

          {/* 尺寸提示 */}
          <View className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <Text className="block text-xs text-gray-500">
              设计区域：袖口 10×10cm | 正面/背面 20×25cm
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
                {uploadedLogos[position.id] && (
                  <View className="mt-1">
                    <Text className="block text-xs text-green-400">✓ 已上传</Text>
                  </View>
                )}
              </View>
            ))}
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

        {/* 上传Logo */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">
            上传Logo - {logoPositions.find((p) => p.id === selectedPosition)?.name}
          </Text>
          
          {uploadedLogos[selectedPosition] ? (
            <View className="flex flex-col items-center">
              <Image 
                src={uploadedLogos[selectedPosition].url} 
                mode="aspectFit" 
                className="w-32 h-32 rounded-lg border border-gray-200"
              />
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
              <Text className="block text-4xl text-gray-300 mb-2">📷</Text>
              <Text className="block text-sm text-gray-500">
                {isUploading ? '上传中...' : '点击上传Logo'}
              </Text>
            </View>
          )}
        </View>

        {/* 操作说明 */}
        <View className="mx-4 mt-4 mb-6 p-4 bg-blue-50 rounded-xl">
          <Text className="block text-sm font-medium text-blue-800 mb-2">操作提示</Text>
          <Text className="block text-xs text-blue-600">
            1. 选择T恤颜色{'\n'}
            2. 选择Logo位置（左袖/右袖/正面/背面）{'\n'}
            3. 上传您的Logo图片{'\n'}
            4. 拖动Logo调整位置{'\n'}
            5. 点击保存完成设计
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default DesignPage
