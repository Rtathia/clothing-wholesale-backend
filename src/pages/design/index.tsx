import { View, Text, ScrollView, Image, MovableArea, MovableView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Network } from '@/network'
import './index.css'

// 颜色选项
const colorOptions = [
  { id: 'white', name: '白色', color: '#ffffff', filter: 'brightness(1)', border: true },
  { id: 'black', name: '黑色', color: '#1a1a1a', filter: 'brightness(0.1)', border: false },
  { id: 'navy', name: '藏青', color: '#1e3a5f', filter: 'brightness(0.4) sepia(1) saturate(3) hue-rotate(180deg)', border: false },
  { id: 'gray', name: '深灰', color: '#4a4a4a', filter: 'brightness(0.4)', border: false },
  { id: 'light-gray', name: '浅灰', color: '#c0c0c0', filter: 'brightness(0.85)', border: true },
  { id: 'red', name: '红色', color: '#dc2626', filter: 'brightness(0.6) sepia(1) saturate(5) hue-rotate(-30deg)', border: false },
  { id: 'blue', name: '蓝色', color: '#2563eb', filter: 'brightness(0.5) sepia(1) saturate(5) hue-rotate(200deg)', border: false },
  { id: 'green', name: '绿色', color: '#16a34a', filter: 'brightness(0.5) sepia(1) saturate(5) hue-rotate(80deg)', border: false },
]

// Logo位置选项
const logoPositions = [
  { id: 'left-sleeve', name: '左袖', type: 'sleeve' },
  { id: 'right-sleeve', name: '右袖', type: 'sleeve' },
  { id: 'front', name: '正面', type: 'body' },
  { id: 'back', name: '背面', type: 'body' },
]

// 使用纯SVG（不带中文注释）- T恤正面
const TSHIRT_FRONT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 350"><path d="M75,60 L45,75 L15,120 L35,135 L55,105 L55,320 L245,320 L245,105 L265,135 L285,120 L255,75 L225,60 L195,60 Q150,90 105,60 L75,60 Z" fill="white" stroke="#ddd" stroke-width="2"/><ellipse cx="150" cy="65" rx="45" ry="15" fill="#f8f8f8" stroke="#ddd" stroke-width="2"/><path d="M120,65 L150,100 L180,65" fill="none" stroke="#ddd" stroke-width="2"/></svg>`

// T恤背面
const TSHIRT_BACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 350"><path d="M75,60 L45,75 L15,120 L35,135 L55,105 L55,320 L245,320 L245,105 L265,135 L285,120 L255,75 L225,60 L195,60 Q150,80 105,60 L75,60 Z" fill="white" stroke="#ddd" stroke-width="2"/><ellipse cx="150" cy="65" rx="45" ry="12" fill="#f8f8f8" stroke="#ddd" stroke-width="2"/></svg>`

// 左袖
const SLEEVE_LEFT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150"><path d="M10,20 L5,25 L0,50 L15,55 L30,35 L35,10 L100,10 L100,130 L10,130 Z" fill="white" stroke="#ddd" stroke-width="2"/></svg>`

// 右袖
const SLEEVE_RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150"><path d="M110,20 L115,25 L120,50 L105,55 L90,35 L85,10 L20,10 L20,130 L110,130 Z" fill="white" stroke="#ddd" stroke-width="2"/></svg>`

// 将SVG转为data URL（使用encodeURIComponent而不是btoa）
const svgToDataUrl = (svg: string) => {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

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
        console.log('Upload to server failed, using local path')
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

      Taro.showToast({ title: 'Upload success', icon: 'success' })
    } catch (error) {
      console.error('Upload failed:', error)
      Taro.showToast({ title: 'Upload failed', icon: 'none' })
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
    console.log('Save design:', { color: selectedColor, logos: uploadedLogos })
    Taro.showToast({ title: 'Design saved', icon: 'success' })
  }

  // 获取当前预览图
  const getCurrentImage = () => {
    if (currentPositionType === 'sleeve') {
      return selectedPosition === 'left-sleeve' 
        ? svgToDataUrl(SLEEVE_LEFT_SVG) 
        : svgToDataUrl(SLEEVE_RIGHT_SVG)
    }
    return selectedPosition === 'back' 
      ? svgToDataUrl(TSHIRT_BACK_SVG) 
      : svgToDataUrl(TSHIRT_FRONT_SVG)
  }

  return (
    <View className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <View className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex items-center gap-2">
          <Text className="block text-lg font-semibold text-gray-900">Design</Text>
          <Text className="block text-sm text-gray-500">Basic T-Shirt</Text>
        </View>
        <Button size="sm" onClick={handleSaveDesign} className="bg-blue-600 text-white">
          Save
        </Button>
      </View>

      <ScrollView scrollY className="flex-1">
        {/* Preview Area */}
        <View className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden shadow-sm">
          <View 
            className="w-full flex items-center justify-center py-6"
            style={{ backgroundColor: currentColor?.color || '#ffffff' }}
          >
            <View className="relative w-full">
              {/* T-shirt Image */}
              <Image 
                src={getCurrentImage()}
                mode="widthFix"
                className="w-full"
                style={{ filter: currentColor?.filter || 'none' }}
              />
              
              {/* Design Area */}
              <View 
                className="absolute border-2 border-dashed border-blue-500 rounded"
                style={currentPositionType === 'body' ? {
                  top: '28%',
                  left: '22%',
                  width: '56%',
                  height: '40%',
                } : {
                  top: '15%',
                  left: '20%',
                  width: '35%',
                  height: '30%',
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

          {/* Size hint */}
          <View className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <Text className="block text-xs text-gray-500">
              Design area: {currentPositionType === 'body' ? 'Front/Back 20x25cm' : 'Sleeve 10x10cm'}
            </Text>
          </View>
        </View>

        {/* Logo Position Selection */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">Logo Position</Text>
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
                  <Text className="block text-xs text-green-400 mt-1">OK</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Color Selection */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">Color</Text>
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

        {/* Upload Logo */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-xl">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">
            Upload Logo - {logoPositions.find((p) => p.id === selectedPosition)?.name}
          </Text>
          
          {uploadedLogos[selectedPosition]?.url ? (
            <View className="flex flex-col items-center">
              <Image 
                src={uploadedLogos[selectedPosition].url} 
                mode="aspectFit" 
                className="w-32 h-32 rounded-lg border border-gray-200"
              />
              <Text className="block text-xs text-gray-500 mt-2">
                Drag to adjust position
              </Text>
              <View className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleDeleteLogo}
                >
                  Delete
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleUploadImage}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Change'}
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
                {isUploading ? 'Uploading...' : 'Click to upload logo'}
              </Text>
            </View>
          )}
        </View>

        {/* Tips */}
        <View className="mx-4 mt-4 mb-6 p-4 bg-blue-50 rounded-xl">
          <Text className="block text-sm font-medium text-blue-800 mb-2">Tips</Text>
          <Text className="block text-xs text-blue-600">
            1. Select T-shirt color{'\n'}
            2. Select logo position{'\n'}
            3. Upload your logo{'\n'}
            4. Drag to adjust position{'\n'}
            5. Pinch to resize{'\n'}
            6. Click Save
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default DesignPage
