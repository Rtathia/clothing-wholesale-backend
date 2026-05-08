import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // 使用环境变量配置，或者使用 QQ 邮箱作为默认
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.qq.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendInquiryEmail(toEmail: string, inquiryData: {
    contactName: string;
    phone: string;
    contactEmail?: string;
    quantity: string;
    notes?: string;
    designSummary: string;
  }): Promise<{ success: boolean; message: string }> {
    // 如果没有配置邮箱，返回提示
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      // 开发模式返回模拟成功，实际部署时需要配置
      console.log('邮件发送（模拟）:', {
        to: toEmail,
        ...inquiryData,
      });
      return {
        success: true,
        message: '邮件已发送（开发模式）',
      };
    }

    const htmlContent = `
      <h2>新的询盘请求</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">联系人姓名</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${inquiryData.contactName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">联系方式</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${inquiryData.phone}</td>
        </tr>
        ${inquiryData.contactEmail ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">联系邮箱</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${inquiryData.contactEmail}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">订购件数</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${inquiryData.quantity}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">设计摘要</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${inquiryData.designSummary}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">备注</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${inquiryData.notes || '无'}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; color: #666;">此邮件由服装批发小程序自动发送</p>
    `;

    try {
      await this.transporter.sendMail({
        from: `"服装批发小程序" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `【询盘】新订单 - ${inquiryData.contactName} - ${inquiryData.quantity}件`,
        html: htmlContent,
      });

      return {
        success: true,
        message: '邮件发送成功',
      };
    } catch (error) {
      console.error('邮件发送失败:', error);
      return {
        success: false,
        message: '邮件发送失败: ' + (error.message || '未知错误'),
      };
    }
  }
}
