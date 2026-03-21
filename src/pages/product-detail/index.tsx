import { View, Text, ScrollView, Image, Swiper, SwiperItem, Video } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import type { FC } from 'react'
import { Network } from '@/network'
import './index.css'

// 产品详情类型
interface Product {
  id: number
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: number | null
  fabric_id: number | null
  craft_id: number | null
  fit_id: number | null
  style_id: number | null
  detail_images: string | null // JSON数组字符串
  videos: string | null // JSON数组字符串
  photos: string | null // JSON数组字符串
  sizes?: ProductSize[] // 产品尺码
}

// 产品尺码类型
interface ProductSize {
  id: number
  sizeId: number
  sizeName: string
  stock: number
  isActive: boolean
}

// 分类数据类型
interface Category {
  id: number
  name: string
}

const ProductDetailPage: FC = () => {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'detail' | 'video' | 'photos'>('detail')
  
  // 分类数据
  const [categories, setCategories] = useState<Category[]>([])
  const [fabrics, setFabrics] = useState<Category[]>([])
  const [fits, setFits] = useState<Category[]>([])
  const [styles, setStyles] = useState<Category[]>([])

  // 解析后的图片/视频数据
  const [detailImages, setDetailImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])

  // 获取产品详情
  useEffect(() => {
    const productId = router.params.id
    if (!productId) {
      Taro.showToast({ title: '产品不存在', icon: 'none' })
      return
    }

    fetchProductDetail(parseInt(productId, 10))
    fetchFilterData()
  }, [router.params.id])

  const fetchProductDetail = async (id: number) => {
    try {
      const res = await Network.request({
        url: `/api/shop/products/${id}`,
      })
      console.log('产品详情响应:', res.data)
      const data = res.data.data || res.data
      setProduct(data)
      
      // 解析图片和视频数据
      if (data.detail_images) {
        try {
          setDetailImages(JSON.parse(data.detail_images))
        } catch (e) {
          console.error('解析详情图片失败:', e)
        }
      }
      if (data.videos) {
        try {
          setVideos(JSON.parse(data.videos))
        } catch (e) {
          console.error('解析视频失败:', e)
        }
      }
      if (data.photos) {
        try {
          setPhotos(JSON.parse(data.photos))
        } catch (e) {
          console.error('解析实拍图失败:', e)
        }
      }
    } catch (error) {
      console.error('获取产品详情失败:', error)
      Taro.showToast({ title: '获取产品详情失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const fetchFilterData = async () => {
    try {
      const res = await Network.request({
        url: '/api/shop/filter-data',
      })
      console.log('筛选数据响应:', res.data)
      const data = res.data.data || res.data
      setCategories(data.categories || [])
      setFabrics(data.fabrics || [])
      setFits(data.fits || [])
      setStyles(data.styles || [])
    } catch (error) {
      console.error('获取筛选数据失败:', error)
    }
  }

  // 获取分类名称
  const getCategoryName = (type: string, id: number | null): string => {
    if (!id) return '-'
    const lists: Category[] = 
      type === 'category' ? categories :
      type === 'fabric' ? fabrics :
      type === 'fit' ? fits : styles
    const item = lists.find(l => l.id === id)
    return item ? item.name : '-'
  }

  // 立即定制
  const handleCustomize = () => {
    if (!selectedSize) {
      Taro.showToast({ title: '请选择尺码', icon: 'none' })
      return
    }
    
    // 跳转到设计页
    Taro.switchTab({ 
      url: '/pages/design/index'
    })
  }

  // 格式化价格
  const formatPrice = (price: number): string => {
    return (price / 100).toFixed(2)
  }

  // 图片预览
  const handleImagePreview = (urls: string[], current: number) => {
    Taro.previewImage({
      urls,
      current: urls[current]
    })
  }

  if (loading) {
    return (
      <View className="flex items-center justify-center h-screen bg-white">
        <Text className="text-gray-400">加载中...</Text>
      </View>
    )
  }

  if (!product) {
    return (
      <View className="flex items-center justify-center h-screen bg-white">
        <Text className="text-gray-400">产品不存在</Text>
      </View>
    )
  }

  return (
    <View className="flex flex-col h-screen bg-gray-100">
      <ScrollView scrollY className="flex-1 pb-20">
        {/* 商品图片轮播 */}
        <Swiper
          className="w-full h-96 bg-white"
          indicatorDots
          autoplay
          circular
          indicatorColor="rgba(0,0,0,0.3)"
          indicatorActiveColor="#f97316"
        >
          <SwiperItem>
            <View className="w-full h-full flex items-center justify-center bg-white">
              {product.image_url ? (
                <Image 
                  src={product.image_url}
                  mode="aspectFit"
                  className="w-full h-full"
                />
              ) : (
                <Text className="text-6xl text-gray-300">👕</Text>
              )}
            </View>
          </SwiperItem>
        </Swiper>

        {/* 商品基础信息区 */}
        <View className="bg-white mt-2">
          {/* 商品标题 */}
          <View className="bg-gray-800 px-4 py-3">
            <Text className="block text-white text-lg font-bold">{product.name}</Text>
          </View>
          
          {/* 核心卖点 */}
          {product.description && (
            <View className="px-4 py-2 bg-gray-50">
              <Text className="block text-xs text-gray-500">{product.description}</Text>
            </View>
          )}
          
          {/* 属性列表 */}
          <View className="px-4 py-3">
            <View className="flex flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-sm text-gray-500">品类</Text>
              <Text className="text-sm text-gray-900">{getCategoryName('category', product.category_id)}</Text>
            </View>
            <View className="flex flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-sm text-gray-500">版型</Text>
              <Text className="text-sm text-gray-900">{getCategoryName('fit', product.fit_id)}</Text>
            </View>
            <View className="flex flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-sm text-gray-500">材质</Text>
              <Text className="text-sm text-gray-900">{getCategoryName('fabric', product.fabric_id)}</Text>
            </View>
            <View className="flex flex-row justify-between py-2">
              <Text className="text-sm text-gray-500">款式</Text>
              <Text className="text-sm text-gray-900">{getCategoryName('style', product.style_id)}</Text>
            </View>
          </View>
        </View>

        {/* 商品规格选择区 */}
        <View className="bg-white mt-2 px-4 py-4">
          {/* 模块标题 */}
          <View className="flex items-center mb-4">
            <Text className="text-base font-bold text-gray-900">商品规格</Text>
            <View className="w-8 h-1 bg-orange-500 ml-2" />
          </View>

          {/* 尺码选择 */}
          <View>
            <View className="flex items-center mb-2">
              <Text className="text-sm text-gray-700">尺码</Text>
              {selectedSize && (
                <Text className="text-sm text-gray-500 ml-2">已选：{selectedSize}</Text>
              )}
            </View>
            {product.sizes && product.sizes.length > 0 ? (
              <View className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isDisabled = !size.isActive || (size.stock !== -1 && size.stock <= 0)
                  return (
                    <View
                      key={size.sizeId}
                      className={`px-4 py-2 rounded-lg ${
                        isDisabled
                          ? 'bg-gray-100 border border-gray-200'
                          : selectedSize === size.sizeName
                            ? 'bg-blue-600 border border-blue-600'
                            : 'bg-blue-100 border border-blue-200'
                      }`}
                      onClick={() => !isDisabled && setSelectedSize(size.sizeName)}
                    >
                      <Text className={`text-sm ${
                        isDisabled 
                          ? 'text-gray-400' 
                          : selectedSize === size.sizeName 
                            ? 'text-white' 
                            : 'text-blue-600'
                      }`}
                      >
                        {size.sizeName}
                      </Text>
                    </View>
                  )
                })}
              </View>
            ) : (
              <View className="flex items-center justify-center py-4">
                <Text className="text-gray-400 text-sm">该商品暂无可用尺码</Text>
              </View>
            )}
          </View>
        </View>

        {/* 底部标签切换 */}
        <View className="bg-white mt-2">
          <View className="flex flex-row border-b border-gray-200">
            {[
              { id: 'detail', name: '商品详情' },
              { id: 'video', name: '实拍视频' },
              { id: 'photos', name: '实拍图' },
            ].map((tab) => (
              <View
                key={tab.id}
                className={`flex-1 py-3 text-center ${
                  activeTab === tab.id ? 'border-b-2 border-orange-500' : ''
                }`}
                onClick={() => setActiveTab(tab.id as 'detail' | 'video' | 'photos')}
              >
                <Text className={`text-sm ${
                  activeTab === tab.id ? 'text-orange-500 font-bold' : 'text-gray-600'
                }`}
                >
                  {tab.name}
                </Text>
              </View>
            ))}
          </View>
          
          {/* 内容区域 */}
          <View className="p-4">
            {/* 商品详情图片 */}
            {activeTab === 'detail' && (
              <View>
                {detailImages.length > 0 ? (
                  <View className="flex flex-col gap-2">
                    {detailImages.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        mode="widthFix"
                        className="w-full"
                        onClick={() => handleImagePreview(detailImages, index)}
                      />
                    ))}
                  </View>
                ) : (
                  <View className="flex items-center justify-center py-10">
                    <Text className="text-gray-400">暂无商品详情图片</Text>
                  </View>
                )}
              </View>
            )}
            
            {/* 实拍视频 */}
            {activeTab === 'video' && (
              <View>
                {videos.length > 0 ? (
                  <View className="flex flex-col gap-4">
                    {videos.map((videoUrl, index) => (
                      <Video
                        key={index}
                        src={videoUrl}
                        className="w-full"
                        style={{ height: '200px' }}
                        controls
                        showFullscreenBtn
                        showPlayBtn
                        showCenterPlayBtn
                      />
                    ))}
                  </View>
                ) : (
                  <View className="flex items-center justify-center py-10">
                    <Text className="text-gray-400">暂无实拍视频</Text>
                  </View>
                )}
              </View>
            )}
            
            {/* 实拍图 */}
            {activeTab === 'photos' && (
              <View>
                {photos.length > 0 ? (
                  <View className="flex flex-col gap-2">
                    {photos.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        mode="widthFix"
                        className="w-full"
                        onClick={() => handleImagePreview(photos, index)}
                      />
                    ))}
                  </View>
                ) : (
                  <View className="flex items-center justify-center py-10">
                    <Text className="text-gray-400">暂无实拍图</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 底部固定操作栏 */}
      <View 
        className="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-200 flex flex-row items-center px-4 py-3"
        style={{ paddingBottom: '20px' }}
      >
        <View className="flex-1">
          <Text className="block text-xs text-gray-500">价格</Text>
          <View className="flex items-baseline">
            <Text className="text-sm text-orange-500">¥</Text>
            <Text className="text-2xl font-bold text-orange-500">
              {formatPrice(product.price)}
            </Text>
          </View>
        </View>
        <View 
          className="px-8 py-3 bg-orange-500 rounded-full"
          onClick={handleCustomize}
        >
          <Text className="text-white font-bold">立即定制</Text>
        </View>
      </View>
    </View>
  )
}

export default ProductDetailPage
