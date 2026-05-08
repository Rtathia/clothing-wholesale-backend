import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AppService {
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    const supabaseUrl = process.env.COZE_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.COZE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getHello(): string {
    return 'Hello, welcome to coze coding mini-program server!';
  }

  async getWxOpenId(code: string) {
    // 微信 AppID 和 AppSecret（需要在 Vercel 环境变量中配置）
    const appId = process.env.WX_APP_ID;
    const appSecret = process.env.WX_APP_SECRET;

    if (!appId || !appSecret) {
      // 如果没有配置微信参数，返回模拟数据（用于测试）
      return {
        code: 200,
        msg: 'success',
        data: {
          openid: 'test_openid_' + Date.now(),
          session_key: 'test_session_key'
        }
      };
    }

    try {
      // 调用微信接口获取 OpenID
      const wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
      
      const response = await fetch(wxUrl);
      const data = await response.json();

      if (data.errcode) {
        return {
          code: 400,
          msg: data.errmsg || '获取OpenID失败',
          data: null
        };
      }

      return {
        code: 200,
        msg: 'success',
        data: {
          openid: data.openid,
          session_key: data.session_key
        }
      };
    } catch (error) {
      return {
        code: 500,
        msg: '服务器错误',
        data: null
      };
    }
  }
}
