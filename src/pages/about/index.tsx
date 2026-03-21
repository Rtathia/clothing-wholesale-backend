import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import type { FC } from 'react'
import './index.css'

const AboutPage: FC = () => {
  // 复制微信号
  const handleCopyWechat = () => {
    Taro.setClipboardData({
      data: 'liule-fashion',
      success: () => {
        Taro.showToast({ title: '微信号已复制', icon: 'success' })
      }
    })
  }

  // 拨打电话
  const handleCall = () => {
    Taro.makePhoneCall({
      phoneNumber: '400-888-8888',
    })
  }

  // 复制邮箱
  const handleCopyEmail = () => {
    Taro.setClipboardData({
      data: 'service@liule-fashion.com',
      success: () => {
        Taro.showToast({ title: '邮箱已复制', icon: 'success' })
      }
    })
  }

  return (
    <View className="flex flex-col min-h-screen bg-gray-50" style={{ height: 'calc(100vh - 50px)' }}>
      <ScrollView scrollY className="flex-1">
        {/* 顶部Banner */}
        <View className="relative h-48 bg-gradient-to-br from-blue-600 to-blue-800">
          <View className="absolute inset-0 flex items-center justify-center">
            <View className="text-center">
              <Text className="block text-4xl font-bold text-white">广州柳乐服饰</Text>
              <Text className="block text-lg text-white text-opacity-80 mt-2">专注服装定制十余年</Text>
            </View>
          </View>
        </View>

        {/* 公司简介 */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <View className="flex items-center mb-4">
            <View className="w-1 h-5 bg-blue-600 rounded-full mr-3" />
            <Text className="text-lg font-bold text-gray-900">公司简介</Text>
          </View>
          <Text className="block text-sm text-gray-600 leading-relaxed">
            广州柳乐服饰有限公司成立于2010年，是一家专注于服装定制服务的现代化企业。公司坐落于广州市白云区，拥有现代化的生产车间和专业的设计团队。
          </Text>
          <Text className="block text-sm text-gray-600 leading-relaxed mt-3">
            我们致力于为企事业单位、团队组织、个人客户提供高品质的服装定制解决方案，产品涵盖POLO衫、T恤、卫衣、工作服等多个品类。
          </Text>
        </View>

        {/* 品牌故事 */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <View className="flex items-center mb-4">
            <View className="w-1 h-5 bg-orange-500 rounded-full mr-3" />
            <Text className="text-lg font-bold text-gray-900">品牌故事</Text>
          </View>
          <Text className="block text-sm text-gray-600 leading-relaxed">
            「柳乐」取自「柳暗花明，乐在其中」。创始人柳先生怀揣着对服装行业的热爱，从一个小作坊起步，经过十余年的发展，将柳乐服饰打造成行业知名品牌。
          </Text>
          <Text className="block text-sm text-gray-600 leading-relaxed mt-3">
            我们始终坚持「品质为本，客户至上」的经营理念，用匠心打造每一件服装，让每一位客户都能穿上满意的定制服装。
          </Text>
        </View>

        {/* 服务优势 */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <View className="flex items-center mb-4">
            <View className="w-1 h-5 bg-green-500 rounded-full mr-3" />
            <Text className="text-lg font-bold text-gray-900">服务优势</Text>
          </View>
          
          <View className="grid grid-cols-2 gap-3">
            {[
              { icon: '🏭', title: '自有工厂', desc: '源头直供，品质可控' },
              { icon: '🎨', title: '专业设计', desc: '资深设计师团队' },
              { icon: '⚡', title: '快速交付', desc: '7-15天极速出货' },
              { icon: '💯', title: '品质保障', desc: '质检严格，售后无忧' },
              { icon: '💰', title: '价格透明', desc: '无隐形消费' },
              { icon: '🚚', title: '全国配送', desc: '物流覆盖全国' },
            ].map((item, index) => (
              <View key={index} className="bg-gray-50 rounded-xl p-3">
                <Text className="block text-2xl mb-1">{item.icon}</Text>
                <Text className="block text-sm font-medium text-gray-900">{item.title}</Text>
                <Text className="block text-xs text-gray-500 mt-1">{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 产品品类 */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <View className="flex items-center mb-4">
            <View className="w-1 h-5 bg-purple-500 rounded-full mr-3" />
            <Text className="text-lg font-bold text-gray-900">产品品类</Text>
          </View>
          
          <View className="flex flex-wrap gap-2">
            {['POLO衫', 'T恤', '卫衣', '工作服', '运动服', '文化衫', '班服', '团服'].map((item, index) => (
              <View key={index} className="bg-blue-50 rounded-full px-4 py-2">
                <Text className="text-sm text-blue-600">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 联系我们 */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <View className="flex items-center mb-4">
            <View className="w-1 h-5 bg-red-500 rounded-full mr-3" />
            <Text className="text-lg font-bold text-gray-900">联系我们</Text>
          </View>
          
          {/* 联系方式列表 */}
          <View className="space-y-3">
            <View className="flex items-center justify-between py-3 border-b border-gray-100">
              <View className="flex items-center">
                <Text className="text-xl mr-3">📞</Text>
                <View>
                  <Text className="block text-sm font-medium text-gray-900">服务热线</Text>
                  <Text className="block text-xs text-gray-500">周一至周日 9:00-18:00</Text>
                </View>
              </View>
              <View
                className="bg-blue-600 rounded-full px-4 py-1"
                onClick={handleCall}
              >
                <Text className="text-sm text-white">拨打</Text>
              </View>
            </View>

            <View className="flex items-center justify-between py-3 border-b border-gray-100">
              <View className="flex items-center">
                <Text className="text-xl mr-3">💬</Text>
                <View>
                  <Text className="block text-sm font-medium text-gray-900">微信号</Text>
                  <Text className="block text-xs text-gray-500">扫码或搜索添加</Text>
                </View>
              </View>
              <View
                className="bg-green-600 rounded-full px-4 py-1"
                onClick={handleCopyWechat}
              >
                <Text className="text-sm text-white">复制</Text>
              </View>
            </View>

            <View className="flex items-center justify-between py-3 border-b border-gray-100">
              <View className="flex items-center">
                <Text className="text-xl mr-3">📧</Text>
                <View>
                  <Text className="block text-sm font-medium text-gray-900">电子邮箱</Text>
                  <Text className="block text-xs text-gray-500">service@liule-fashion.com</Text>
                </View>
              </View>
              <View
                className="bg-orange-500 rounded-full px-4 py-1"
                onClick={handleCopyEmail}
              >
                <Text className="text-sm text-white">复制</Text>
              </View>
            </View>

            <View className="flex items-start py-3">
              <Text className="text-xl mr-3">📍</Text>
              <View className="flex-1">
                <Text className="block text-sm font-medium text-gray-900">公司地址</Text>
                <Text className="block text-xs text-gray-500 mt-1">广东省广州市白云区XX路XX号XX产业园A栋</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 营业时间 */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <View className="flex items-center mb-4">
            <View className="w-1 h-5 bg-yellow-500 rounded-full mr-3" />
            <Text className="text-lg font-bold text-gray-900">营业时间</Text>
          </View>
          
          <View className="flex justify-between items-center py-2">
            <Text className="text-sm text-gray-600">周一至周五</Text>
            <Text className="text-sm font-medium text-gray-900">09:00 - 18:00</Text>
          </View>
          <View className="flex justify-between items-center py-2">
            <Text className="text-sm text-gray-600">周六</Text>
            <Text className="text-sm font-medium text-gray-900">09:00 - 17:00</Text>
          </View>
          <View className="flex justify-between items-center py-2">
            <Text className="text-sm text-gray-600">周日</Text>
            <Text className="text-sm font-medium text-gray-900">休息</Text>
          </View>
        </View>

        {/* 底部版权 */}
        <View className="text-center py-6 px-4">
          <Text className="block text-xs text-gray-400">© 2024 广州柳乐服饰有限公司</Text>
          <Text className="block text-xs text-gray-400 mt-1">All Rights Reserved</Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default AboutPage
