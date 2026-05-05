# 后端部署指南（Railway）

## 概述

本指南将帮助你把后端服务部署到 Railway 平台，使其可在公网访问。

## 前置准备

1. **Supabase 账号和项目**
   - 确保你已有 Supabase 项目
   - 获取 Project URL 和 anon/public key（Supabase Dashboard → Settings → API）

2. **Railway 账号**
   - 访问 https://railway.app
   - 使用 GitHub 登录

## 部署步骤

### 步骤 1：创建 GitHub 仓库

```bash
# 进入 server 目录
cd server

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 后端服务"

# 在 GitHub 创建新仓库，然后：
git remote add origin https://github.com/你的用户名/shop-backend.git
git branch -M main
git push -u origin main
```

### 步骤 2：在 Railway 创建项目

1. 登录 Railway（https://railway.app）
2. 点击 **New Project** → **Deploy from GitHub repo**
3. 选择你刚创建的仓库
4. Railway 会自动检测为 Node.js 项目

### 步骤 3：配置环境变量

在 Railway 项目设置中添加以下环境变量：

| 变量名 | 值 |
|--------|-----|
| `COZE_SUPABASE_URL` | `https://xxx.supabase.co` |
| `COZE_SUPABASE_ANON_KEY` | 你的 anon key |

### 步骤 4：部署

Railway 会自动构建并部署。等待构建完成后，你会获得一个 URL，例如：
```
https://shop-backend.up.railway.app
```

### 步骤 5：验证部署

访问健康检查端点：
```
https://你的域名.up.railway.app/api/shop/filter-data
```

应该返回 JSON 数据。

## 注意事项

1. **CORS 配置**：后端已配置允许所有来源的 CORS
2. **数据库连接**：确保 Supabase 的数据库表结构与代码匹配
3. **域名**：Railway 免费版的域名会在闲置后休眠，首次访问可能需要等待几秒

## 更新部署

推送到 GitHub 主分支后，Railway 会自动重新部署。

## 故障排查

### 502 Bad Gateway
- 检查环境变量是否正确配置
- 查看 Railway 日志排查错误

### 数据库连接失败
- 确认 Supabase 的 Project URL 和 API Key 正确
- 检查 Supabase 数据库是否已创建相应表
