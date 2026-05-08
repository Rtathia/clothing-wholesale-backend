import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { ShopModule } from './shop/shop.module';
import { MailModule } from './mail/mail.module';
import { WxController } from './wx/wx.controller';

@Module({
  imports: [UploadModule, AdminModule, ShopModule, MailModule],
  controllers: [AppController, WxController],
  providers: [AppService],
})
export class AppModule {}
