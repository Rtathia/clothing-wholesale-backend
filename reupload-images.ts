// 重新上传所有静态图片到TOS
const { S3Storage } = require('coze-coding-dev-sdk');
const { readFileSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  bucketName: process.env.COZE_BUCKET_NAME,
});

const ASSETS_DIR = './assets';

async function uploadAllImages() {
  const results = [];
  
  function getFiles(dir, baseDir = '') {
    const files = [];
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getFiles(fullPath, baseDir || dir));
      } else if (isImageFile(item)) {
        const relativePath = baseDir ? fullPath.replace(baseDir + '/', '') : item;
        files.push({ fullPath, relativePath });
      }
    }
    return files;
  }
  
  function isImageFile(filename) {
    const ext = filename.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  }
  
  const files = getFiles(ASSETS_DIR);
  console.log(`找到 ${files.length} 张图片\n`);
  
  for (const { fullPath, relativePath } of files) {
    try {
      const buffer = readFileSync(fullPath);
      const contentType = getContentType(relativePath);
      
      const key = await storage.uploadFile({
        fileContent: buffer,
        fileName: relativePath.replace(/\\/g, '/'),
        contentType,
      });
      
      // 生成永久URL
      const url = await storage.generatePresignedUrl({ 
        key, 
        expireTime: 31536000 // 1年
      });
      
      results.push({ key, url, name: relativePath });
      console.log(`✅ 上传成功: ${relativePath}`);
    } catch (e) {
      console.log(`❌ 上传失败: ${relativePath} - ${e.message}`);
    }
  }
  
  console.log('\n=== 上传完成 ===');
  console.log('图片URL映射表:\n');
  
  for (const { name, url } of results) {
    console.log(`"${name}": "${url}",`);
  }
}

function getContentType(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  const types = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
  };
  return types[ext] || 'application/octet-stream';
}

uploadAllImages().catch(console.error);
