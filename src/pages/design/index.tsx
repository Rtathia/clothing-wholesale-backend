import { View, Text, ScrollView, Image, MovableArea, MovableView, Canvas } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Network } from '@/network'
import './index.css'

// 颜色选项（只保留6种颜色）
const colorOptions = [
  { id: 'white', name: '白色', hex: '#ffffff', border: true },
  { id: 'black', name: '黑色', hex: '#1a1a1a', border: false },
  { id: 'navy', name: '藏青', hex: '#1e3a5f', border: false },
  { id: 'dark-gray', name: '深灰', hex: '#4a4a4a', border: false },
  { id: 'light-gray', name: '浅灰', hex: '#c0c0c0', border: true },
  { id: 'blue', name: '蓝色', hex: '#2563eb', border: false },
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

// Hex转RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 }
}

const DesignPage: FC = () => {
  const [selectedColor, setSelectedColor] = useState('white')
  const [selectedPosition, setSelectedPosition] = useState('front')
  const [coloredImagePath, setColoredImagePath] = useState(TSHIRT_BASE_URL)
  const [uploadedLogos, setUploadedLogos] = useState<Record<string, { url: string; x: number; y: number; scale: number }>>({
    'left-sleeve': { url: '', x: 0, y: 0, scale: 1 },
    'right-sleeve': { url: '', x: 0, y: 0, scale: 1 },
    'front': { url: '', x: 0, y: 0, scale: 1 },
    'back': { url: '', x: 0, y: 0, scale: 1 },
  })
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // 获取当前颜色信息
  const currentColor = colorOptions.find((c) => c.id === selectedColor)
  
  // 当前选中位置类型
  const currentPositionType = logoPositions.find((p) => p.id === selectedPosition)?.type || 'body'

  // 使用Canvas替换颜色
  const changeTshirtColor = async (targetHex: string) => {
    if (targetHex === '#ffffff') {
      // 白色直接显示原图
      setColoredImagePath(TSHIRT_BASE_URL)
      return
    }

    setIsProcessing(true)
    const targetColor = hexToRgb(targetHex)

    try {
      // H5端使用Canvas处理
      if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            setColoredImagePath(TSHIRT_BASE_URL)
            setIsProcessing(false)
            return
          }
          canvas.width = img.width
          canvas.height = img.height
          
          ctx.drawImage(img, 0, 0)
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          // 遍历像素，将白色/浅色替换为目标颜色
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            const a = data[i + 3]
            
            // 只处理接近白色的像素（保持透明度和阴影）
            if (a > 0 && r > 200 && g > 200 && b > 200) {
              // 根据亮度调整目标颜色的明暗
              const brightness = (r + g + b) / 3 / 255
              const factor = brightness * 0.5 + 0.5 // 保留一些明暗层次
              
              data[i] = Math.round(targetColor.r * factor)
              data[i + 1] = Math.round(targetColor.g * factor)
              data[i + 2] = Math.round(targetColor.b * factor)
            }
          }
          
          ctx.putImageData(imageData, 0, 0)
          setColoredImagePath(canvas.toDataURL('image/png'))
          setIsProcessing(false)
        }
        
        img.onerror = () => {
          console.error('图片加载失败')
          setColoredImagePath(TSHIRT_BASE_URL)
          setIsProcessing(false)
        }
        
        img.src = TSHIRT_BASE_URL
      } else {
        // 小程序端使用Canvas
        const query = Taro.createSelectorQuery()
        query.select('#tshirtCanvas')
          .fields({ node: true, size: true })
          .exec((res) => {
            if (!res[0] || !res[0].node) {
              setColoredImagePath(TSHIRT_BASE_URL)
              setIsProcessing(false)
              return
            }
            
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            
            const img = canvas.createImage()
            img.onload = () => {
              canvas.width = img.width
              canvas.height = img.height
              ctx.drawImage(img, 0, 0)
              
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              const data = imageData.data
              
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                const a = data[i + 3]
                
                if (a > 0 && r > 200 && g > 200 && b > 200) {
                  const brightness = (r + g + b) / 3 / 255
                  const factor = brightness * 0.5 + 0.5
                  
                  data[i] = Math.round(targetColor.r * factor)
                  data[i + 1] = Math.round(targetColor.g * factor)
                  data[i + 2] = Math.round(targetColor.b * factor)
                }
              }
              
              ctx.putImageData(imageData, 0, 0)
              
              // 小程序导出图片
              Taro.canvasToTempFilePath({
                canvas: canvas,
                success: (fileRes) => {
                  setColoredImagePath(fileRes.tempFilePath)
                },
                fail: () => {
                  setColoredImagePath(TSHIRT_BASE_URL)
                },
                complete: () => {
                  setIsProcessing(false)
                }
              })
            }
            
            img.onerror = () => {
              setColoredImagePath(TSHIRT_BASE_URL)
              setIsProcessing(false)
            }
            
            img.src = TSHIRT_BASE_URL
          })
      }
    } catch (error) {
      console.error('颜色处理失败:', error)
      setColoredImagePath(TSHIRT_BASE_URL)
      setIsProcessing(false)
    }
  }

  // 颜色变化时处理图片
  useEffect(() => {
    if (currentColor) {
      changeTshirtColor(currentColor.hex)
    }
  }, [selectedColor])

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
      {/* 隐藏的Canvas用于处理图片 */}
      <Canvas 
        id="tshirtCanvas" 
        canvasId="tshirtCanvas"
        type="2d"
        style={{ position: 'absolute', left: '-9999px', width: '300px', height: '300px' }}
      />
      
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
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <View className="relative w-full px-8">
              {/* T恤图片 */}
              {isProcessing ? (
                <View className="w-full flex items-center justify-center" style={{ minHeight: '200px' }}>
                  <Text className="block text-gray-400">处理中...</Text>
                </View>
              ) : (
                <Image 
                  src={coloredImagePath}
                  mode="widthFix"
                  className="w-full"
                />
              )}
              
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
                    backgroundColor: option.hex,
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
