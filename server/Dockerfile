# 使用 Node.js 22 Alpine
FROM node:22-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "dist/main.js"]
