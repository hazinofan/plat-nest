import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './mailer.interface';
import { Address, Options } from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  private mailTransport() {
    return nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<string>('SMTP_PORT')),
      secure: false, 
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  private replacePlaceholders(html: string, placeholders?: Record<string, string>): string {
    if (!placeholders) return html;
    return Object.keys(placeholders).reduce((content, key) => {
      return content.replace(new RegExp(`{{${key}}}`, 'g'), placeholders[key]);
    }, html);
  }

  async sendEmail(dto: SendMailDto): Promise<void> {
    const { from, recipients, subject, html, text, placeholderReplacement } = dto;
    const transport = this.mailTransport();

    const processedHtml = this.replacePlaceholders(html, placeholderReplacement);

    const mailOptions: Options = {
      from: from || this.configService.get<string>('SMTP_FROM'), 
      to: recipients,
      subject,
      html: processedHtml,
      text,
    };

    try {
      await transport.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
  
}
