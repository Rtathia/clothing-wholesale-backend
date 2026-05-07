import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { MailService } from './mail.service';

interface InquiryDto {
  email: string;
  contactName: string;
  phone: string;
  quantity: string;
  notes?: string;
  designSummary: string;
}

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('inquiry')
  @HttpCode(200)
  async sendInquiry(@Body() inquiryDto: InquiryDto) {
    const result = await this.mailService.sendInquiryEmail(
      inquiryDto.email,
      {
        contactName: inquiryDto.contactName,
        phone: inquiryDto.phone,
        quantity: inquiryDto.quantity,
        notes: inquiryDto.notes,
        designSummary: inquiryDto.designSummary,
      },
    );
    return { code: 200, msg: result.message, data: result };
  }
}
