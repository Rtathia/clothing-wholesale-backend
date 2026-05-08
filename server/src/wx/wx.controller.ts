import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from '../app.service';

@Controller('wx')
export class WxController {
  constructor(private readonly appService: AppService) {}

  @Post('openid')
  async getOpenId(@Body() body: { code: string }) {
    if (!body.code) {
      return { code: 400, msg: 'code is required', data: null };
    }
    return this.appService.getWxOpenId(body.code);
  }
}
