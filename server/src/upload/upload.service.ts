import { Injectable } from '@nestjs/common';
import { S3Storage } from 'coze-coding-dev-sdk';

@Injectable()
export class UploadService {
  private storage: S3Storage;

  constructor() {
    this.storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      accessKey: '',
      secretKey: '',
      bucketName: process.env.COZE_BUCKET_NAME,
      region: 'cn-beijing',
    });
  }

  /**
   * 上传文件到对象存储
   * @param file 文件对象
   * @returns 文件key和访问URL
   */
  async uploadFile(file: Express.Multer.File) {
    console.log('上传文件:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // 上传到对象存储
    const fileKey = await this.storage.uploadFile({
      fileContent: file.buffer,
      fileName: `design/${Date.now()}_${file.originalname}`,
      contentType: file.mimetype,
    });

    console.log('文件上传成功, key:', fileKey);

    // 生成可访问的URL（有效期7天）
    const fileUrl = await this.storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 7 * 24 * 60 * 60, // 7天
    });

    return {
      key: fileKey,
      url: fileUrl,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  /**
   * 删除文件
   * @param fileKey 文件key
   */
  async deleteFile(fileKey: string) {
    const result = await this.storage.deleteFile({ fileKey });
    console.log('删除文件:', fileKey, '结果:', result);
    return result;
  }
}
