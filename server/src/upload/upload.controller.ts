import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('design')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 上传设计图片
   */
  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('收到上传请求');

    // 验证文件
    if (!file) {
      throw new BadRequestException('未找到上传的文件');
    }

    // 验证文件类型
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('仅支持 JPG、PNG、GIF、WebP 格式的图片');
    }

    // 验证文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('文件大小不能超过 10MB');
    }

    try {
      const result = await this.uploadService.uploadFile(file);
      console.log('上传成功:', result);

      return {
        code: 200,
        msg: 'success',
        data: result,
      };
    } catch (error) {
      console.error('上传失败:', error);
      throw new BadRequestException('文件上传失败，请重试');
    }
  }
}
