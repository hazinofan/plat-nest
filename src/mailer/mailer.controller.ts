import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendMailDto } from './mailer.interface';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendMail(@Body() sendMailDto: SendMailDto) {
    await this.mailerService.sendEmail(sendMailDto);
    return { message: 'Email sent successfully' };
  }
}
