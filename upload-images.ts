import { S3Storage } from "coze-coding-dev-sdk";
import { readFileSync, readdirSync } from "fs";
import { join, basename } from "path";

const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

async function uploadImages() {
  const assetsDir = "/workspace/projects/assets";
  const files = readdirSync(assetsDir).filter(f => 
    f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png")
  );

  console.log("开始上传图片...\n");

  for (const file of files) {
    try {
      const filePath = join(assetsDir, file);
      const buffer = readFileSync(filePath);
      
      // 确定contentType
      let contentType = "image/jpeg";
      if (file.endsWith(".png")) contentType = "image/png";
      
      // 上传文件
      const key = await storage.uploadFile({
        fileContent: buffer,
        fileName: `liule/${file}`,
        contentType,
      });

      // 生成永久URL（30天有效期）
      const url = await storage.generatePresignedUrl({
        key,
        expireTime: 2592000, // 30天
      });

      console.log(`✅ ${file}`);
      console.log(`   Key: ${key}`);
      console.log(`   URL: ${url}\n`);
    } catch (error) {
      console.error(`❌ ${file} 上传失败:`, error.message);
    }
  }
}

uploadImages().then(() => {
  console.log("\n上传完成！");
});
