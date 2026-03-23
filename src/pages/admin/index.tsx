import { View, Text, ScrollView, Image, Input, Textarea } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import { Network } from '@/network'
import './index.css'

// 尺码数据类型
interface Size {
  id: number
  name: string
  sort_order: number
  is_active: boolean
}

// 产品尺码关联类型
interface ProductSize {
  sizeId: number
  sizeName: string
  stock: number
  isActive: boolean
}

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
  sizes: ProductSize[] // 产品尺码
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
  sizes: [],
}

const AdminPage: FC = () => {
  // 搜索状态
  const [searchKeyword, setSearchKeyword] = useState('')
  
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
  const [sizes, setSizes] = useState<Size[]>([]) // 所有可用尺码
  
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
      
      // 获取尺码列表
      const sizesRes = await Network.request({
        url: '/api/admin/sizes',
      })
      setSizes(sizesRes.data || [])
    } catch (error) {
      console.error('获取筛选数据失败:', error)
    }
  }

  // 选择图片上传
  const handleChooseImage = async (type: 'cover' | 'detail') => {
    try {
      const res = await Taro.chooseImage({
        count: type === 'cover' ? 1 : 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })
      
      setUploading(true)
      
      for (const filePath of res.tempFilePaths) {
        console.log('开始上传图片:', filePath)
        const uploadRes = await Network.uploadFile({
          url: '/api/admin/upload',
          filePath,
          name: 'file',
        })
        
        console.log('上传响应:', uploadRes)
        
        // 解析响应数据（可能是字符串或对象）
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any = uploadRes.data
        if (typeof result === 'string') {
          try {
            result = JSON.parse(result)
          } catch (e) {
            console.error('解析响应失败:', e)
          }
        }
        
        console.log('解析后的结果:', result)
        const url = result?.url || result?.data?.url
        
        if (url) {
          console.log('获取到URL:', url)
          if (type === 'cover') {
            setProductForm(prev => ({ ...prev, imageUrl: url }))
          } else {
            setProductForm(prev => ({ ...prev, detailImages: [...prev.detailImages, url] }))
          }
        } else {
          console.error('未能获取到URL:', result)
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

  // 删除图片
  const handleRemoveImage = (index: number) => {
    setProductForm(prev => {
      const arr = [...prev.detailImages]
      arr.splice(index, 1)
      return { ...prev, detailImages: arr }
    })
  }

  // 编辑产品
  const handleEditProduct = async (product: Product) => {
    setEditingProduct(product)
    
    // 获取产品关联的尺码
    let productSizes: ProductSize[] = []
    try {
      const res = await Network.request({
        url: `/api/admin/products/${product.id}/sizes`,
      })
      productSizes = (res.data || []).map((s: { sizeId: number; sizeName: string; stock: number; isActive: boolean }) => ({
        sizeId: s.sizeId,
        sizeName: s.sizeName,
        stock: s.stock,
        isActive: s.isActive,
      }))
    } catch (error) {
      console.error('获取产品尺码失败:', error)
    }
    
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
      sizes: productSizes,
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
    }

    try {
      let productId = editingProduct?.id
      
      if (editingProduct) {
        await Network.request({
          url: `/api/admin/products/${editingProduct.id}`,
          method: 'PUT',
          data,
        })
      } else {
        const res = await Network.request({
          url: '/api/admin/products',
          method: 'POST',
          data,
        })
        productId = res.data?.id
      }
      
      // 保存产品尺码关联
      if (productId && productForm.sizes.length > 0) {
        await Network.request({
          url: `/api/admin/products/${productId}/sizes`,
          method: 'POST',
          data: {
            sizes: productForm.sizes.map(s => ({
              sizeId: s.sizeId,
              stock: s.stock,
              isActive: s.isActive,
            })),
          },
        })
      }
      
      Taro.showToast({ title: editingProduct ? '更新成功' : '创建成功', icon: 'success' })
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
            {/* 搜索框 */}
            <View className="bg-white rounded-xl px-4 py-3 mb-3 flex flex-row items-center shadow-sm">
              <Text className="text-gray-400 mr-2">🔍</Text>
              <Input
                className="flex-1 bg-transparent text-sm"
                placeholder="搜索产品名称..."
                value={searchKeyword}
                onInput={(e) => setSearchKeyword(e.detail.value)}
              />
              {searchKeyword && (
                <Text
                  className="text-gray-400 text-sm"
                  onClick={() => setSearchKeyword('')}
                >
                  ✕
                </Text>
              )}
            </View>
            
            {/* 新建按钮 */}
            <View
              className="bg-blue-600 rounded-xl py-3 mb-4 flex items-center justify-center"
              onClick={handleNewProduct}
            >
              <Text className="text-white font-bold">+ 新建产品</Text>
            </View>

            {/* 产品列表 */}
            {products
              .filter(p => p.name.toLowerCase().includes(searchKeyword.toLowerCase()))
              .map((product) => (
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
            {products.filter(p => p.name.toLowerCase().includes(searchKeyword.toLowerCase())).length === 0 && (
              <View className="flex flex-col items-center justify-center py-20">
                <Text className="text-4xl text-gray-300 mb-4">📦</Text>
                <Text className="text-gray-400">
                  {searchKeyword ? '未找到相关产品' : '暂无产品，点击上方按钮创建'}
                </Text>
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

              {/* 尺码选择 */}
              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">
                  可选尺码
                  <Text className="text-xs text-gray-400 ml-2">（点击添加/移除，可设置库存）</Text>
                </Text>
                <View className="flex flex-wrap gap-2 mb-2">
                  {sizes.map((size) => {
                    const isSelected = productForm.sizes.some(s => s.sizeId === size.id)
                    
                    return (
                      <View
                        key={size.id}
                        className={`flex flex-row items-center px-3 py-2 rounded-lg ${
                          isSelected ? 'bg-blue-600' : 'bg-gray-100'
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            // 移除尺码
                            setProductForm(prev => ({
                              ...prev,
                              sizes: prev.sizes.filter(s => s.sizeId !== size.id)
                            }))
                          } else {
                            // 添加尺码
                            setProductForm(prev => ({
                              ...prev,
                              sizes: [...prev.sizes, {
                                sizeId: size.id,
                                sizeName: size.name,
                                stock: -1, // 默认无限库存
                                isActive: true,
                              }]
                            }))
                          }
                        }}
                      >
                        <Text className={`text-sm ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}
                        >
                          {size.name}
                        </Text>
                        {isSelected && (
                          <Text className="text-white text-xs ml-1">✓</Text>
                        )}
                      </View>
                    )
                  })}
                </View>
                
                {/* 已选尺码的库存设置 */}
                {productForm.sizes.length > 0 && (
                  <View className="mt-3 bg-gray-50 rounded-lg p-3">
                    <Text className="block text-xs text-gray-500 mb-2">尺码库存设置（-1表示无限库存）</Text>
                    {productForm.sizes.map((ps) => (
                      <View key={ps.sizeId} className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <Text className="text-sm text-gray-700">{ps.sizeName}</Text>
                        <View className="flex flex-row items-center">
                          <View
                            className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center"
                            onClick={() => {
                              setProductForm(prev => ({
                                ...prev,
                                sizes: prev.sizes.map(s => 
                                  s.sizeId === ps.sizeId 
                                    ? { ...s, stock: s.stock === -1 ? 0 : Math.max(-1, s.stock - 1) }
                                    : s
                                )
                              }))
                            }}
                          >
                            <Text className="text-gray-600">-</Text>
                          </View>
                          <View className="w-12 mx-2 bg-white rounded px-2 py-1 text-center">
                            <Input
                              className="w-full text-center text-sm"
                              type="number"
                              value={ps.stock.toString()}
                              onInput={(e) => {
                                const val = parseInt(e.detail.value) || 0
                                setProductForm(prev => ({
                                  ...prev,
                                  sizes: prev.sizes.map(s => 
                                    s.sizeId === ps.sizeId ? { ...s, stock: val } : s
                                  )
                                }))
                              }}
                            />
                          </View>
                          <View
                            className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center"
                            onClick={() => {
                              setProductForm(prev => ({
                                ...prev,
                                sizes: prev.sizes.map(s => 
                                  s.sizeId === ps.sizeId ? { ...s, stock: s.stock + 1 } : s
                                )
                              }))
                            }}
                          >
                            <Text className="text-gray-600">+</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
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
                        onClick={() => handleRemoveImage(index)}
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
