import { View, Text, ScrollView, Image, Input, Textarea } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import { Network } from '@/network'
import './index.css'

// 产品类型
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
  detail_images: string | null
  videos: string | null
  photos: string | null
  is_active: boolean
}

// 分类数据类型
interface Category {
  id: number
  name: string
  icon?: string | null
}

// 表单数据类型
interface ProductForm {
  name: string
  description: string
  price: string
  categoryId: number | null
  fabricId: number | null
  craftId: number | null
  fitId: number | null
  styleId: number | null
  imageUrl: string
  detailImages: string[]
  videos: string[]
  photos: string[]
}

const initialForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  categoryId: null,
  fabricId: null,
  craftId: null,
  fitId: null,
  styleId: null,
  imageUrl: '',
  detailImages: [],
  videos: [],
  photos: [],
}

const AdminPage: FC = () => {
  // 页面状态
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')
  
  // 产品相关
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState<ProductForm>(initialForm)
  const [showProductForm, setShowProductForm] = useState(false)
  
  // 分类数据
  const [categories, setCategories] = useState<Category[]>([])
  const [fabrics, setFabrics] = useState<Category[]>([])
  const [crafts, setCrafts] = useState<Category[]>([])
  const [fits, setFits] = useState<Category[]>([])
  const [styles, setStyles] = useState<Category[]>([])
  
  // 上传状态
  const [uploading, setUploading] = useState(false)

  // 初始化
  useEffect(() => {
    fetchProducts()
    fetchFilterData()
  }, [])

  // 获取产品列表
  const fetchProducts = async () => {
    try {
      const res = await Network.request({
        url: '/api/admin/products',
      })
      console.log('产品列表响应:', res.data)
      setProducts(res.data || [])
    } catch (error) {
      console.error('获取产品列表失败:', error)
      Taro.showToast({ title: '获取产品列表失败', icon: 'none' })
    }
  }

  // 获取筛选数据
  const fetchFilterData = async () => {
    try {
      const res = await Network.request({
        url: '/api/shop/filter-data',
      })
      const data = res.data.data || res.data
      setCategories(data.categories || [])
      setFabrics(data.fabrics || [])
      setCrafts(data.crafts || [])
      setFits(data.fits || [])
      setStyles(data.styles || [])
    } catch (error) {
      console.error('获取筛选数据失败:', error)
    }
  }

  // 选择图片上传
  const handleChooseImage = async (type: 'cover' | 'detail' | 'photos') => {
    try {
      const res = await Taro.chooseImage({
        count: type === 'cover' ? 1 : 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })
      
      setUploading(true)
      
      for (const filePath of res.tempFilePaths) {
        const uploadRes = await Network.uploadFile({
          url: '/api/admin/upload',
          filePath,
          name: 'file',
        })
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = uploadRes.data as any
        const url = result?.data?.url || result?.url
        
        if (url) {
          if (type === 'cover') {
            setProductForm(prev => ({ ...prev, imageUrl: url }))
          } else if (type === 'detail') {
            setProductForm(prev => ({ ...prev, detailImages: [...prev.detailImages, url] }))
          } else if (type === 'photos') {
            setProductForm(prev => ({ ...prev, photos: [...prev.photos, url] }))
          }
        }
      }
      
      Taro.showToast({ title: '上传成功', icon: 'success' })
    } catch (error) {
      console.error('上传失败:', error)
      Taro.showToast({ title: '上传失败', icon: 'none' })
    } finally {
      setUploading(false)
    }
  }

  // 选择视频上传
  const handleChooseVideo = async () => {
    try {
      const res = await Taro.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        compressed: true,
      })
      
      setUploading(true)
      
      const uploadRes = await Network.uploadFile({
        url: '/api/admin/upload',
        filePath: res.tempFilePath,
        name: 'file',
      })
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = uploadRes.data as any
      const url = result?.data?.url || result?.url
      
      if (url) {
        setProductForm(prev => ({ ...prev, videos: [...prev.videos, url] }))
        Taro.showToast({ title: '上传成功', icon: 'success' })
      }
    } catch (error) {
      console.error('上传失败:', error)
      Taro.showToast({ title: '上传失败', icon: 'none' })
    } finally {
      setUploading(false)
    }
  }

  // 删除图片
  const handleRemoveImage = (type: 'detail' | 'photos' | 'videos', index: number) => {
    setProductForm(prev => {
      const arr = [...prev[type]]
      arr.splice(index, 1)
      return { ...prev, [type]: arr }
    })
  }

  // 编辑产品
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: (product.price / 100).toString(),
      categoryId: product.category_id,
      fabricId: product.fabric_id,
      craftId: product.craft_id,
      fitId: product.fit_id,
      styleId: product.style_id,
      imageUrl: product.image_url || '',
      detailImages: product.detail_images ? JSON.parse(product.detail_images) : [],
      videos: product.videos ? JSON.parse(product.videos) : [],
      photos: product.photos ? JSON.parse(product.photos) : [],
    })
    setShowProductForm(true)
  }

  // 新建产品
  const handleNewProduct = () => {
    setEditingProduct(null)
    setProductForm(initialForm)
    setShowProductForm(true)
  }

  // 保存产品
  const handleSaveProduct = async () => {
    // 验证
    if (!productForm.name) {
      Taro.showToast({ title: '请输入产品名称', icon: 'none' })
      return
    }
    if (!productForm.price) {
      Taro.showToast({ title: '请输入价格', icon: 'none' })
      return
    }

    const data = {
      name: productForm.name,
      description: productForm.description,
      price: Math.round(parseFloat(productForm.price) * 100),
      imageUrl: productForm.imageUrl || undefined,
      categoryId: productForm.categoryId || undefined,
      fabricId: productForm.fabricId || undefined,
      craftId: productForm.craftId || undefined,
      fitId: productForm.fitId || undefined,
      styleId: productForm.styleId || undefined,
      detailImages: JSON.stringify(productForm.detailImages),
      videos: JSON.stringify(productForm.videos),
      photos: JSON.stringify(productForm.photos),
    }

    try {
      if (editingProduct) {
        await Network.request({
          url: `/api/admin/products/${editingProduct.id}`,
          method: 'PUT',
          data,
        })
        Taro.showToast({ title: '更新成功', icon: 'success' })
      } else {
        await Network.request({
          url: '/api/admin/products',
          method: 'POST',
          data,
        })
        Taro.showToast({ title: '创建成功', icon: 'success' })
      }
      
      setShowProductForm(false)
      fetchProducts()
    } catch (error) {
      console.error('保存失败:', error)
      Taro.showToast({ title: '保存失败', icon: 'none' })
    }
  }

  // 删除产品
  const handleDeleteProduct = async (id: number) => {
    const confirm = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个产品吗？',
    })
    
    if (confirm.confirm) {
      try {
        await Network.request({
          url: `/api/admin/products/${id}`,
          method: 'DELETE',
        })
        Taro.showToast({ title: '删除成功', icon: 'success' })
        fetchProducts()
      } catch (error) {
        console.error('删除失败:', error)
        Taro.showToast({ title: '删除失败', icon: 'none' })
      }
    }
  }

  // 切换产品状态
  const handleToggleProduct = async (product: Product) => {
    try {
      await Network.request({
        url: `/api/admin/products/${product.id}`,
        method: 'PUT',
        data: { isActive: !product.is_active },
      })
      fetchProducts()
    } catch (error) {
      console.error('更新状态失败:', error)
      Taro.showToast({ title: '更新失败', icon: 'none' })
    }
  }

  return (
    <View className="flex flex-col h-screen bg-gray-100">
      {/* 顶部标签栏 */}
      <View className="flex flex-row bg-white border-b border-gray-200">
        {[
          { id: 'products', name: '产品管理' },
          { id: 'categories', name: '基础数据' },
        ].map((tab) => (
          <View
            key={tab.id}
            className={`flex-1 py-4 text-center ${
              activeTab === tab.id ? 'border-b-2 border-blue-600' : ''
            }`}
            onClick={() => setActiveTab(tab.id as 'products' | 'categories')}
          >
            <Text className={`text-base ${
              activeTab === tab.id ? 'text-blue-600 font-bold' : 'text-gray-600'
            }`}
            >
              {tab.name}
            </Text>
          </View>
        ))}
      </View>

      {/* 内容区域 */}
      <ScrollView scrollY className="flex-1">
        {/* 产品管理 */}
        {activeTab === 'products' && !showProductForm && (
          <View className="p-4">
            {/* 新建按钮 */}
            <View
              className="bg-blue-600 rounded-xl py-3 mb-4 flex items-center justify-center"
              onClick={handleNewProduct}
            >
              <Text className="text-white font-bold">+ 新建产品</Text>
            </View>

            {/* 产品列表 */}
            {products.map((product) => (
              <View key={product.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                <View className="flex flex-row">
                  {/* 产品图片 */}
                  <View className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-3">
                    {product.image_url ? (
                      <Image src={product.image_url} mode="aspectFill" className="w-full h-full" />
                    ) : (
                      <View className="w-full h-full flex items-center justify-center">
                        <Text className="text-2xl text-gray-300">👕</Text>
                      </View>
                    )}
                  </View>
                  
                  {/* 产品信息 */}
                  <View className="flex-1">
                    <View className="flex flex-row items-center justify-between">
                      <Text className="text-base font-bold text-gray-900">{product.name}</Text>
                      <Text className={`text-xs px-2 py-1 rounded ${
                        product.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}
                      >
                        {product.is_active ? '已上架' : '已下架'}
                      </Text>
                    </View>
                    <Text className="text-lg font-bold text-orange-500 mt-1">
                      ¥{(product.price / 100).toFixed(2)}
                    </Text>
                  </View>
                </View>
                
                {/* 操作按钮 */}
                <View className="flex flex-row justify-end mt-3 pt-3 border-t border-gray-100">
                  <View
                    className="px-4 py-2 bg-gray-100 rounded-lg mr-2"
                    onClick={() => handleToggleProduct(product)}
                  >
                    <Text className="text-sm text-gray-600">
                      {product.is_active ? '下架' : '上架'}
                    </Text>
                  </View>
                  <View
                    className="px-4 py-2 bg-blue-100 rounded-lg mr-2"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Text className="text-sm text-blue-600">编辑</Text>
                  </View>
                  <View
                    className="px-4 py-2 bg-red-100 rounded-lg"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Text className="text-sm text-red-600">删除</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* 空状态 */}
            {products.length === 0 && (
              <View className="flex flex-col items-center justify-center py-20">
                <Text className="text-4xl text-gray-300 mb-4">📦</Text>
                <Text className="text-gray-400">暂无产品，点击上方按钮创建</Text>
              </View>
            )}
          </View>
        )}

        {/* 产品编辑表单 */}
        {activeTab === 'products' && showProductForm && (
          <View className="p-4">
            {/* 返回按钮 */}
            <View
              className="flex flex-row items-center mb-4"
              onClick={() => setShowProductForm(false)}
            >
              <Text className="text-blue-600">← 返回列表</Text>
            </View>

            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                {editingProduct ? '编辑产品' : '新建产品'}
              </Text>

              {/* 基本信息 */}
              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">产品名称 *</Text>
                <View className="bg-gray-50 rounded-lg px-4 py-3">
                  <Input
                    className="w-full bg-transparent"
                    placeholder="请输入产品名称"
                    value={productForm.name}
                    onInput={(e) => setProductForm(prev => ({ ...prev, name: e.detail.value }))}
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">价格（元）*</Text>
                <View className="bg-gray-50 rounded-lg px-4 py-3">
                  <Input
                    className="w-full bg-transparent"
                    type="digit"
                    placeholder="请输入价格"
                    value={productForm.price}
                    onInput={(e) => setProductForm(prev => ({ ...prev, price: e.detail.value }))}
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">产品描述</Text>
                <View className="bg-gray-50 rounded-lg p-4">
                  <Textarea
                    style={{ width: '100%', minHeight: '80px', backgroundColor: 'transparent' }}
                    placeholder="请输入产品描述"
                    value={productForm.description}
                    onInput={(e) => setProductForm(prev => ({ ...prev, description: e.detail.value }))}
                  />
                </View>
              </View>

              {/* 分类选择 */}
              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">品类</Text>
                <View className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <View
                      key={cat.id}
                      className={`px-3 py-2 rounded-lg ${
                        productForm.categoryId === cat.id ? 'bg-blue-600' : 'bg-gray-100'
                      }`}
                      onClick={() => setProductForm(prev => ({
                        ...prev,
                        categoryId: prev.categoryId === cat.id ? null : cat.id
                      }))}
                    >
                      <Text className={`text-sm ${
                        productForm.categoryId === cat.id ? 'text-white' : 'text-gray-700'
                      }`}
                      >
                        {cat.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">布料</Text>
                <View className="flex flex-wrap gap-2">
                  {fabrics.map((fab) => (
                    <View
                      key={fab.id}
                      className={`px-3 py-2 rounded-lg ${
                        productForm.fabricId === fab.id ? 'bg-blue-600' : 'bg-gray-100'
                      }`}
                      onClick={() => setProductForm(prev => ({
                        ...prev,
                        fabricId: prev.fabricId === fab.id ? null : fab.id
                      }))}
                    >
                      <Text className={`text-sm ${
                        productForm.fabricId === fab.id ? 'text-white' : 'text-gray-700'
                      }`}
                      >
                        {fab.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">工艺</Text>
                <View className="flex flex-wrap gap-2">
                  {crafts.map((craft) => (
                    <View
                      key={craft.id}
                      className={`px-3 py-2 rounded-lg ${
                        productForm.craftId === craft.id ? 'bg-blue-600' : 'bg-gray-100'
                      }`}
                      onClick={() => setProductForm(prev => ({
                        ...prev,
                        craftId: prev.craftId === craft.id ? null : craft.id
                      }))}
                    >
                      <Text className={`text-sm ${
                        productForm.craftId === craft.id ? 'text-white' : 'text-gray-700'
                      }`}
                      >
                        {craft.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">版型</Text>
                <View className="flex flex-wrap gap-2">
                  {fits.map((fit) => (
                    <View
                      key={fit.id}
                      className={`px-3 py-2 rounded-lg ${
                        productForm.fitId === fit.id ? 'bg-blue-600' : 'bg-gray-100'
                      }`}
                      onClick={() => setProductForm(prev => ({
                        ...prev,
                        fitId: prev.fitId === fit.id ? null : fit.id
                      }))}
                    >
                      <Text className={`text-sm ${
                        productForm.fitId === fit.id ? 'text-white' : 'text-gray-700'
                      }`}
                      >
                        {fit.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">款式</Text>
                <View className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <View
                      key={style.id}
                      className={`px-3 py-2 rounded-lg ${
                        productForm.styleId === style.id ? 'bg-blue-600' : 'bg-gray-100'
                      }`}
                      onClick={() => setProductForm(prev => ({
                        ...prev,
                        styleId: prev.styleId === style.id ? null : style.id
                      }))}
                    >
                      <Text className={`text-sm ${
                        productForm.styleId === style.id ? 'text-white' : 'text-gray-700'
                      }`}
                      >
                        {style.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* 图片上传 */}
              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">封面图片</Text>
                <View className="flex flex-row flex-wrap gap-2">
                  {productForm.imageUrl && (
                    <View className="relative w-20 h-20">
                      <Image src={productForm.imageUrl} mode="aspectFill" className="w-full h-full rounded-lg" />
                      <View
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                        onClick={() => setProductForm(prev => ({ ...prev, imageUrl: '' }))}
                      >
                        <Text className="text-white text-xs">×</Text>
                      </View>
                    </View>
                  )}
                  <View
                    className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
                    onClick={() => handleChooseImage('cover')}
                  >
                    <Text className="text-2xl text-gray-400">+</Text>
                  </View>
                </View>
              </View>

              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">商品详情图片</Text>
                <View className="flex flex-row flex-wrap gap-2">
                  {productForm.detailImages.map((img, index) => (
                    <View key={index} className="relative w-20 h-20">
                      <Image src={img} mode="aspectFill" className="w-full h-full rounded-lg" />
                      <View
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                        onClick={() => handleRemoveImage('detail', index)}
                      >
                        <Text className="text-white text-xs">×</Text>
                      </View>
                    </View>
                  ))}
                  <View
                    className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
                    onClick={() => handleChooseImage('detail')}
                  >
                    <Text className="text-2xl text-gray-400">+</Text>
                  </View>
                </View>
              </View>

              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">实拍视频</Text>
                <View className="flex flex-row flex-wrap gap-2">
                  {productForm.videos.map((_video, index) => (
                    <View key={index} className="relative w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Text className="text-2xl">📹</Text>
                      <View
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                        onClick={() => handleRemoveImage('videos', index)}
                      >
                        <Text className="text-white text-xs">×</Text>
                      </View>
                    </View>
                  ))}
                  <View
                    className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
                    onClick={handleChooseVideo}
                  >
                    <Text className="text-2xl text-gray-400">+</Text>
                  </View>
                </View>
              </View>

              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">实拍图片</Text>
                <View className="flex flex-row flex-wrap gap-2">
                  {productForm.photos.map((img, index) => (
                    <View key={index} className="relative w-20 h-20">
                      <Image src={img} mode="aspectFill" className="w-full h-full rounded-lg" />
                      <View
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                        onClick={() => handleRemoveImage('photos', index)}
                      >
                        <Text className="text-white text-xs">×</Text>
                      </View>
                    </View>
                  ))}
                  <View
                    className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
                    onClick={() => handleChooseImage('photos')}
                  >
                    <Text className="text-2xl text-gray-400">+</Text>
                  </View>
                </View>
              </View>

              {/* 保存按钮 */}
              <View
                className={`rounded-xl py-3 mt-4 flex items-center justify-center ${
                  uploading ? 'bg-gray-300' : 'bg-blue-600'
                }`}
                onClick={uploading ? undefined : handleSaveProduct}
              >
                <Text className="text-white font-bold">
                  {uploading ? '上传中...' : '保存产品'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 基础数据管理 */}
        {activeTab === 'categories' && (
          <View className="p-4">
            {/* 品类 */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-base font-bold text-gray-900 mb-3">品类管理</Text>
              {categories.map((cat) => (
                <View key={cat.id} className="flex flex-row items-center py-2 border-b border-gray-100">
                  <Text className="text-lg mr-2">{cat.icon}</Text>
                  <Text className="flex-1 text-sm text-gray-700">{cat.name}</Text>
                </View>
              ))}
            </View>

            {/* 布料 */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-base font-bold text-gray-900 mb-3">布料管理</Text>
              {fabrics.map((fab) => (
                <View key={fab.id} className="flex flex-row items-center py-2 border-b border-gray-100">
                  <Text className="text-lg mr-2">{fab.icon}</Text>
                  <Text className="flex-1 text-sm text-gray-700">{fab.name}</Text>
                </View>
              ))}
            </View>

            {/* 工艺 */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-base font-bold text-gray-900 mb-3">工艺管理</Text>
              {crafts.map((craft) => (
                <View key={craft.id} className="flex flex-row items-center py-2 border-b border-gray-100">
                  <Text className="text-lg mr-2">{craft.icon}</Text>
                  <Text className="flex-1 text-sm text-gray-700">{craft.name}</Text>
                </View>
              ))}
            </View>

            {/* 版型 */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-base font-bold text-gray-900 mb-3">版型管理</Text>
              {fits.map((fit) => (
                <View key={fit.id} className="flex flex-row items-center py-2 border-b border-gray-100">
                  <Text className="flex-1 text-sm text-gray-700">{fit.name}</Text>
                </View>
              ))}
            </View>

            {/* 款式 */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-base font-bold text-gray-900 mb-3">款式管理</Text>
              {styles.map((style) => (
                <View key={style.id} className="flex flex-row items-center py-2 border-b border-gray-100">
                  <Text className="flex-1 text-sm text-gray-700">{style.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default AdminPage
