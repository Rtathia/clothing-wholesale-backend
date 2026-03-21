# 服装定制小程序设计指南

## 一、品牌定位

- **应用类型**: 服装定制小程序（B2C/B2B 服装批发与个性化定制）
- **设计风格**: 简洁专业、商务稳重、清爽干净
- **目标用户**: 服装批发商、企业采购、个性化定制用户

## 二、配色方案

### 主色调（商务稳重型）
| 用途 | Tailwind 类名 | 色值 |
|------|--------------|------|
| 主色（按钮、强调） | `text-blue-600` / `bg-blue-600` | `#2563eb` |
| 主色深色 | `text-blue-700` / `bg-blue-700` | `#1d4ed8` |
| 辅助色（橙色点缀） | `text-orange-500` / `bg-orange-500` | `#f97316` |

### 中性色
| 用途 | Tailwind 类名 | 色值 |
|------|--------------|------|
| 背景（页面底色） | `bg-white` / `bg-gray-50` | `#ffffff` / `#f9fafb` |
| 主文字 | `text-gray-900` | `#111827` |
| 次文字 | `text-gray-600` | `#4b5563` |
| 辅助文字 | `text-gray-500` | `#6b7280` |
| 边框/分割线 | `border-gray-200` | `#e5e7eb` |

### 语义色
| 用途 | Tailwind 类名 |
|------|--------------|
| 成功/可用 | `text-green-600` |
| 警告 | `text-orange-500` |
| 错误/必填 | `text-red-500` |

## 三、字体规范

| 层级 | Tailwind 类名 | 用途 |
|------|--------------|------|
| H1 | `text-2xl font-bold` | 页面主标题 |
| H2 | `text-xl font-semibold` | 模块标题 |
| H3 | `text-lg font-semibold` | 卡片标题 |
| Body | `text-base` | 正文内容 |
| Caption | `text-sm text-gray-500` | 辅助说明 |

## 四、间距系统

| 用途 | Tailwind 类名 | 值 |
|------|--------------|-----|
| 页面边距 | `px-4` | 16px |
| 卡片内边距 | `p-4` | 16px |
| 列表项间距 | `gap-3` | 12px |
| 模块间距 | `mb-4` / `mt-4` | 16px |
| 组件间距 | `gap-2` | 8px |

## 五、组件规范

### 按钮样式

```tsx
// 主按钮
import { Button } from '@/components/ui/button'

<Button className="bg-blue-600 hover:bg-blue-700 text-white">
  确认
</Button>

// 次按钮
<Button variant="outline" className="border-gray-300">
  取消
</Button>

// 禁用态
<Button disabled className="bg-gray-300 text-gray-500">
  不可用
</Button>
```

### 卡片样式

```tsx
import { Card, CardContent } from '@/components/ui/card'

<Card className="rounded-lg border border-gray-200 bg-white">
  <CardContent className="p-4">
    {/* 内容 */}
  </CardContent>
</Card>
```

### 输入框样式

```tsx
import { Input } from '@/components/ui/input'
import { View } from '@tarojs/components'

// 必须用 View 包裹，样式放 View 上
<View className="bg-gray-50 rounded-lg px-4 py-3">
  <Input className="w-full bg-transparent" placeholder="请输入内容" />
</View>
```

### 列表项样式

```tsx
<View className="flex items-center p-4 border-b border-gray-100">
  <Text className="flex-1 text-gray-900">商品名称</Text>
  <Text className="text-gray-500">详情</Text>
</View>
```

### 空状态组件

```tsx
<View className="flex flex-col items-center justify-center py-12">
  <Text className="text-gray-400 text-lg">暂无数据</Text>
</View>
```

## 六、导航结构

### TabBar 配置（3个页面）

| 页面 | 路径 | 文字 |
|------|------|------|
| 首页 | `pages/index/index` | 首页 |
| 分类 | `pages/category/index` | 分类 |
| 设计 | `pages/design/index` | 设计 |

### TabBar 颜色

- 未选中文字：`#999999`
- 选中文字：`#1890ff`
- 背景：`#ffffff`

### 页面跳转规范

- TabBar 页面跳转：使用 `Taro.switchTab()`
- 普通页面跳转：使用 `Taro.navigateTo()`

## 七、小程序约束

### 包体积优化
- 主包 ≤ 2MB
- 图片资源使用 CDN 或对象存储
- TabBar 图标使用本地 PNG（≤ 40KB/张）

### 图片策略
- 商品图片：使用对象存储，不本地存储
- 上传的定制图片：使用对象存储

### 性能优化
- 列表使用虚拟滚动
- 图片懒加载 `lazyLoad`
- 避免频繁 `setState`

## 八、跨端兼容性

### Text 组件换行
所有垂直排列的 Text 必须添加 `block` 类：
```tsx
<Text className="block text-lg font-semibold">标题</Text>
<Text className="block text-sm text-gray-500">说明</Text>
```

### Input 样式
必须用 View 包裹，样式放 View 上（H5 端 Input 是 inline 元素）。

### 平台检测
```tsx
const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP
```

## 九、设计页面特殊规范

### 颜色选择器
- 使用圆形色块展示
- 选中状态：蓝色外圈 + 缩放效果
- 色值：黑色、白色、深灰、浅灰、深蓝、红色等

### T恤预览区
- 使用模特实拍图或纯色 T恤图
- 标注可设计区域（正面、背面、左袖、右袖）
- 虚线框标注设计范围

### 上传模块
- 支持图片上传（使用对象存储）
- 上传后显示缩略图
- 可拖拽调整位置和大小

## 十、分类页面规范

### 左侧筛选区
- 款式类型：polo衫、polo长袖、T恤、卫衣
- 布料类型：纯棉、纯涤、棉涤混纺
- 选中状态：背景蓝色 + 文字白色
- 未选中状态：背景灰色 + 文字黑色

### 右侧商品区
- 2列网格布局
- 卡片包含：商品图、名称、价格
- 点击进入详情页
