import { View, Text, ScrollView, Image, MovableArea, MovableView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Network } from '@/network'
import './index.css'

// 颜色选项与对应图片URL（正面和背面分开）
const colorOptions = [
  { 
    id: 'white', 
    name: '白色', 
    border: true, 
    frontImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E7%99%BD%E8%89%B2%E6%AD%A3%E9%9D%A2.png&nonce=0255cb34-9343-4fc5-b2ba-204410486f51&project_id=7619676618268688390&sign=8045b57237364629c06adeeb20677f6eb9e9eece1e0547fe446db20673bf7310',
    backImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E7%99%BD%E8%89%B2%E8%83%8C%E9%9D%A2.png&nonce=d1172342-7cb8-4c9b-a428-a2f460cfbaef&project_id=7619676618268688390&sign=581ca23c4ce4da79aec5762e28ac751c2749eb3f560bc18a0ff067dcf0826bfa'
  },
  { 
    id: 'black', 
    name: '黑色', 
    border: false, 
    frontImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E9%BB%91%E8%89%B2%E6%AD%A3%E9%9D%A2.png&nonce=378c25e4-48fb-4cca-9de4-ad92335cacca&project_id=7619676618268688390&sign=96b6464518f1f57cee96278bf6499348465b77398ebd089357c7ffad7d0cfeb4',
    backImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E9%BB%91%E8%89%B2%E8%83%8C%E9%9D%A2.png&nonce=531dee14-1801-4c90-8912-088b97b9fd3d&project_id=7619676618268688390&sign=82caf8d2ec3f28bbac51bdc1088040cfc28221e60ab70e08a03e219a6da0df1a'
  },
  { 
    id: 'navy', 
    name: '藏青', 
    border: false, 
    frontImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E8%97%8F%E9%9D%92%E6%AD%A3%E9%9D%A2.png&nonce=7fb0ac23-5062-46e1-9121-f1b0834142e4&project_id=7619676618268688390&sign=1b59f849e2c5adc6228757e8ce819619e94561de88805f7092ef19b9c64451eb',
    backImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E8%97%8F%E9%9D%92%E8%83%8C%E9%9D%A2.png&nonce=582f0d40-e212-4a8b-a1c3-8c019ead3904&project_id=7619676618268688390&sign=e775474b4a9d849857b37030e8ff647d0df902c78f1db35deace035307ec23a2'
  },
  { 
    id: 'dark-gray', 
    name: '深灰', 
    border: false, 
    frontImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E6%B7%B1%E7%81%B0%E6%AD%A3%E9%9D%A2.png&nonce=0eaa0c4e-ac66-455f-b7bd-2b9a880ef88f&project_id=7619676618268688390&sign=320df5ba9c85dc78368215c525ae1be70d7373f51f279e4124151dcc8d3ed732',
    backImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E6%B7%B1%E7%81%B0%E8%83%8C%E9%9D%A2.png&nonce=49f73f94-b108-4b9a-b418-b4572d86c249&project_id=7619676618268688390&sign=da4bca74f752a936895805ad4223d23d6f9ff38c67e1c67d3c926fa4a66cb8b3'
  },
  { 
    id: 'light-gray', 
    name: '浅灰', 
    border: true, 
    frontImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E6%B5%85%E7%81%B0%E6%AD%A3%E9%9D%A2.png&nonce=6d28ea36-76e5-4e7a-a758-a5209817310e&project_id=7619676618268688390&sign=0674ec3b63e13adcb1e9a42e56bd43ef72e37d45610e5a5268302b5891b5eeae',
    backImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E6%B5%85%E7%81%B0%E8%83%8C%E9%9D%A2.png&nonce=cda64e5f-6d87-4856-a6d6-02b8276b5121&project_id=7619676618268688390&sign=93091d597a439f1b2aa9d4645964e930a1d0fb8c168b65a63df2aec3a9cd243a'
  },
  { 
    id: 'blue', 
    name: '蓝色', 
    border: false, 
    frontImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E8%93%9D%E8%89%B2%E6%AD%A3%E9%9D%A2.png&nonce=e65c61ca-475a-424b-9eed-6a85f22fb2a0&project_id=7619676618268688390&sign=5953b75a261783261141899b6d20abc10e07827dce4e2b7a0eab9fd28316e168',
    backImageUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E8%93%9D%E8%89%B2%E8%83%8C%E9%9D%A2.png&nonce=02cfd257-06ae-4203-b6ca-c5954e692dc9&project_id=7619676618268688390&sign=65352d3dfea77e3683432bad5f5fa42b64bad53981c7058050b987b128d17776'
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
