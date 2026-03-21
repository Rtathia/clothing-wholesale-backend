import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [UploadModule, AdminModule, ShopModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
