// 检查静态图片是否存在
const { S3Storage } = require('coze-coding-dev-sdk');

const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  bucketName: process.env.COZE_BUCKET_NAME,
});

const staticImages = [
  // Banner图片
  'assets/banner/banner1.jpg',
  'assets/banner/banner2.jpg',
  'assets/banner/banner3.jpg',
  'assets/banner/banner4.jpg',
  // T恤颜色图片
  'assets/tshirt/white_front.png',
  'assets/tshirt/white_back.png',
  'assets/tshirt/black_front.png',
  'assets/tshirt/black_back.png',
  'assets/tshirt/navy_front.png',
  'assets/tshirt/navy_back.png',
  'assets/tshirt/red_front.png',
  'assets/tshirt/red_back.png',
  'assets/tshirt/gray_front.png',
  'assets/tshirt/gray_back.png',
  'assets/tshirt/pink_front.png',
  'assets/tshirt/pink_back.png',
  // 背景图片
  'assets/about_bg.jpg',
];

async function checkStaticImages() {
  console.log('检查静态图片...\n');
  
  for (const key of staticImages) {
    try {
      const exists = await storage.fileExists({ fileKey: key });
      console.log(`${exists ? '✅' : '❌'} ${key}`);
    } catch (e) {
      console.log(`❌ ${key} - 错误: ${e.message}`);
    }
  }
}

checkStaticImages().catch(console.error);
