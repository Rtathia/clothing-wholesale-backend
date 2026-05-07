import { View, Text, ScrollView, Image, MovableArea, MovableView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Network } from '@/network'
import './index.css'

// 颜色选项与对应图片URL（正面和背面分开，使用永久URL - 2025年5月更新）
const colorOptions = [
  { 
    id: 'white', 
    name: '白色', 
    border: true, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Bai_Se_Zheng_Mian_a4f804a7.png?sign=1809418522-d0b29b5c60-0-0eea418259600d8584b6314340b44718ab30a2870e9dbac1872c2f2fd6d1724f',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Bai_Se_Bei_Mian_553761de.png?sign=1809418522-ba55414583-0-8ac4c2be84df2c3f3adf3f2ddd115d3b946ff4cfc07a83f23885c1345aa594d6'
  },
  { 
    id: 'black', 
    name: '黑色', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Hei_Se_Zheng_Mian_a2b019d5.png?sign=1809418523-555c03b398-0-fa68275ff6efb79c9d2f6bb60dfe13c8a0aad4f2bd03a2e765b82d5f9344c55b',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Hei_Se_Bei_Mian_e275c204.png?sign=1809418523-60ddf86aef-0-466ccbf855d10d61a91a0108a3bc393c84bd3b2f28770258b5520158b8c13325'
  },
  { 
    id: 'navy', 
    name: '藏青', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Cang_Qing_Zheng_Mian_be906f34.png?sign=1809418523-19a32424a7-0-b0d8bb35c42ec04298a6898b39916e89f9e953d7eba035fbe05750ce8e2ccec0',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Cang_Qing_Bei_Mian_900dd728.png?sign=1809418523-17554d3efa-0-45b4cc4bfde1267ea9df692b8ef68223e19563f14c69091495a59a329150175c'
  },
  { 
    id: 'dark-gray', 
    name: '深灰', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Shen_Hui_Zheng_Mian_b1064f92.png?sign=1809418524-831373466c-0-bb01aaa01cf25043f2b124b48a5d4e9b28b5f19292eb441d170598baa90a0dd6',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Shen_Hui_Bei_Mian_239d69f1.png?sign=1809418524-54bfcbe11a-0-0ea26570b0dbbdf126ade2e0f6377c09e20c5aa296ea4fccabbd77019c16f950'
  },
  { 
    id: 'light-gray', 
    name: '浅灰', 
    border: true, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Qian_Hui_Zheng_Mian_7c0e63e5.png?sign=1809418524-0d6dc6c8b0-0-4dbd3191fd951514a671a666757304fd9393dc1b2da7fec0649031027d509821',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Qian_Hui_Bei_Mian_9d71425a.png?sign=1809418524-b21d928fbf-0-9577a3349291a9521841738c7bc2d4fc63c68e32b558734fb938a656858afe16'
  },
  { 
    id: 'blue', 
    name: '蓝色', 
    border: false, 
    frontImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Lan_Se_Zheng_Mian_25ffe0aa.png?sign=1809418525-79ad4e2b74-0-e26e46b3e75f3e0f033ae561a49950d9fed34f12d35967c87aa2b8ffb6bdb518',
    backImageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Lan_Se_Bei_Mian_33bab108.png?sign=1809418525-2acf68e181-0-2c183b14a5e5719a771c6bd78c56ac24cba29adf374aa6146f406c0f8ad13ebb'
  },
]

// Logo位置选项（只保留正面和背面）
const logoPositions = [
  { id: 'front', name: '正面' },
  { id: 'back', name: '背面' },
]

// 默认邮箱（与"关于我们"页面保持一致）
const DEFAULT_EMAIL = 'thx1755035817@gmail.com'

const DesignPage: FC = () => {
  const [selectedColor, setSelectedColor] = useState('white')
  const [selectedPosition, setSelectedPosition] = useState('front')
  const [uploadedLogos, setUploadedLogos] = useState<Record<string, { url: string; x: number; y: number; scale: number }>>({
    'front': { url: '', x: 0, y: 0, scale: 1 },
    'back': { url: '', x: 0, y: 0, scale: 1 },
    'sleeve': { url: '', x: 0, y: 0, scale: 1 },
  })
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingSleeve, setIsUploadingSleeve] = useState(false)
  
  // 询盘弹窗状态
  const [showInquiryDialog, setShowInquiryDialog] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    quantity: '',
    name: '',
    phone: '',
    remarks: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // 分享给朋友
  const onShareAppMessage = () => {
    return {
      title: '服装设计定制 - 在线设计你的专属服装',
      desc: '专业服装设计工具，支持Logo上传、颜色定制',
      path: '/pages/design/index',
      imageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Bai_Se_Zheng_Mian_a4f804a7.png?sign=1809418522-d0b29b5c60-0-0eea418259600d8584b6314340b44718ab30a2870e9dbac1872c2f2fd6d1724f'
    }
  }

  // 分享到朋友圈
  const onShareTimeline = () => {
    return {
      title: '服装设计定制 - 在线设计你的专属服装',
      query: '',
      imageUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/Bai_Se_Zheng_Mian_a4f804a7.png?sign=1809418522-d0b29b5c60-0-0eea418259600d8584b6314340b44718ab30a2870e9dbac1872c2f2fd6d1724f'
    }
  }

  // 挂载分享事件
  useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    } as any)
    
    Taro.eventCenter.on('onShareAppMessage', onShareAppMessage)
    Taro.eventCenter.on('onShareTimeline', onShareTimeline)
    
    return () => {
      Taro.eventCenter.off('onShareAppMessage', onShareAppMessage)
      Taro.eventCenter.off('onShareTimeline', onShareTimeline)
    }
  }, [])

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

  // 保存设计 - 先保存到本地，然后弹出询盘弹窗
  const handleSaveDesign = () => {
    // 保存设计数据到本地存储
    const designData = {
      color: selectedColor,
      colorName: currentColor?.name || '白色',
      logos: uploadedLogos,
      updateTime: new Date().toISOString(),
    }
    
    try {
      Taro.setStorageSync('savedDesign', designData)
      console.log('设计已保存:', designData)
    } catch (e) {
      console.error('保存失败:', e)
    }
    
    // 显示保存成功提示
    setSaveSuccess(true)
    Taro.showToast({ title: '设计已保存', icon: 'success', duration: 1500 })
    
    // 延迟弹出询盘弹窗，让用户看到保存成功提示
    setTimeout(() => {
      setShowInquiryDialog(true)
    }, 1500)
  }

  // 提交询盘
  const handleSubmitInquiry = async () => {
    // 表单验证
    if (!inquiryForm.quantity.trim()) {
      Taro.showToast({ title: '请输入件数', icon: 'none' })
      return
    }
    if (!inquiryForm.name.trim()) {
      Taro.showToast({ title: '请输入联系人姓名', icon: 'none' })
      return
    }
    if (!inquiryForm.phone.trim()) {
      Taro.showToast({ title: '请输入联系方式', icon: 'none' })
      return
    }

    setIsSubmitting(true)

    try {
      // 获取保存的设计信息
      const savedDesign = Taro.getStorageSync('savedDesign') || {}
      
      // 生成设计摘要
      const designSummary = 
        `服装类型：基础款T恤\n` +
        `颜色：${savedDesign.colorName || selectedColor}\n` +
        `正面Logo：${uploadedLogos.front?.url ? '已上传' : '未上传'}\n` +
        `背面Logo：${uploadedLogos.back?.url ? '已上传' : '未上传'}\n` +
        `袖子Logo：${uploadedLogos.sleeve?.url ? '已上传' : '未上传'}`
      
      // 调用后端 API 发送邮件
      const res = await Network.request({
        url: '/api/mail/inquiry',
        method: 'POST',
        data: {
          email: DEFAULT_EMAIL,
          contactName: inquiryForm.name,
          phone: inquiryForm.phone,
          quantity: inquiryForm.quantity,
          notes: inquiryForm.remarks,
          designSummary: designSummary,
        },
      })
      
      console.log('邮件发送响应:', res.data)
      
      // 检查响应
      if (res.data && res.data.code === 200) {
        Taro.showToast({ title: '询盘已发送，我们会尽快联系您', icon: 'success', duration: 3000 })
      } else {
        Taro.showToast({ title: res.data?.msg || '发送失败，请重试', icon: 'none' })
      }
      
      // 关闭弹窗
      setShowInquiryDialog(false)
      
      // 重置表单
      setInquiryForm({
        quantity: '',
        name: '',
        phone: '',
        remarks: '',
      })
      
    } catch (error) {
      console.error('提交失败:', error)
      Taro.showToast({ title: '网络错误，请重试', icon: 'none' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 关闭询盘弹窗
  const handleCloseInquiryDialog = () => {
    setShowInquiryDialog(false)
    setInquiryForm({
      quantity: '',
      name: '',
      phone: '',
      remarks: '',
    })
  }

  return (
    <View className="flex flex-col bg-gray-100" style={{ height: 'calc(100vh - 50px)' }}>
      {/* 顶部标题栏 */}
      <View className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex items-center gap-2">
          <Text className="block text-lg font-semibold text-gray-900">设计定制</Text>
          <Text className="block text-sm text-gray-500">基础款T恤</Text>
        </View>
        <Button 
          size="sm" 
          onClick={handleSaveDesign} 
          className={`${saveSuccess ? 'bg-green-600' : 'bg-blue-600'} text-white`}
        >
          {saveSuccess ? '✓ 已保存' : '保存'}
        </Button>
      </View>

      <ScrollView scrollY className="flex-1">
        {/* 保存成功提示 */}
        {saveSuccess && (
          <View className="mx-4 mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <View className="flex items-center">
              <Text className="text-green-600 text-xl mr-2">✓</Text>
              <View>
                <Text className="block text-sm font-medium text-green-800">设计已保存</Text>
                <Text className="block text-xs text-green-600 mt-1">即将为您打开询盘表单...</Text>
              </View>
            </View>
          </View>
        )}

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

      {/* 询盘弹窗 */}
      <Dialog open={showInquiryDialog} onOpenChange={setShowInquiryDialog}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>填写询盘信息</DialogTitle>
            <DialogDescription>完成设计后，请填写以下信息发起询盘</DialogDescription>
          </DialogHeader>
          
          <View className="flex flex-col gap-4 py-4">
            {/* 件数 */}
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">
                <Text className="text-red-500">*</Text> 件数
              </Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  type="number"
                  placeholder="请输入定制件数"
                  value={inquiryForm.quantity}
                  onInput={(e: any) => setInquiryForm(prev => ({ ...prev, quantity: e.detail.value }))}
                />
              </View>
            </View>

            {/* 联系人姓名 */}
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">
                <Text className="text-red-500">*</Text> 联系人姓名
              </Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  placeholder="请输入您的姓名"
                  value={inquiryForm.name}
                  onInput={(e: any) => setInquiryForm(prev => ({ ...prev, name: e.detail.value }))}
                />
              </View>
            </View>

            {/* 联系方式 */}
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">
                <Text className="text-red-500">*</Text> 联系方式
              </Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  type="number"
                  placeholder="请输入手机号码"
                  value={inquiryForm.phone}
                  onInput={(e: any) => setInquiryForm(prev => ({ ...prev, phone: e.detail.value }))}
                />
              </View>
            </View>

            {/* 备注 */}
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">
                备注（选填）
              </Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  placeholder="如有其他要求，请在此说明"
                  value={inquiryForm.remarks}
                  onInput={(e: any) => setInquiryForm(prev => ({ ...prev, remarks: e.detail.value }))}
                />
              </View>
            </View>

            {/* 设计信息摘要 */}
            <View className="bg-gray-50 rounded-xl p-3">
              <Text className="block text-xs text-gray-500 mb-2">当前设计摘要：</Text>
              <View className="flex flex-wrap gap-2">
                <View className="bg-white rounded-full px-3 py-1">
                  <Text className="block text-xs text-gray-600">
                    颜色：{colorOptions.find(c => c.id === selectedColor)?.name}
                  </Text>
                </View>
                {uploadedLogos.front?.url && (
                  <View className="bg-green-100 rounded-full px-3 py-1">
                    <Text className="block text-xs text-green-700">正面Logo ✓</Text>
                  </View>
                )}
                {uploadedLogos.back?.url && (
                  <View className="bg-green-100 rounded-full px-3 py-1">
                    <Text className="block text-xs text-green-700">背面Logo ✓</Text>
                  </View>
                )}
                {uploadedLogos.sleeve?.url && (
                  <View className="bg-green-100 rounded-full px-3 py-1">
                    <Text className="block text-xs text-green-700">袖子Logo ✓</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          {/* 弹窗按钮 */}
          <View className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleCloseInquiryDialog}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button 
              className="flex-1 bg-blue-600 text-white"
              onClick={handleSubmitInquiry}
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '发送询盘邮件'}
            </Button>
          </View>
        </DialogContent>
      </Dialog>
    </View>
  )
}

export default DesignPage
