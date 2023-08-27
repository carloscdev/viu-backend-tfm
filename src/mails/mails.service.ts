import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { handleError } from 'src/utils/handleError';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendMailUpdate(user: User, content: string) {
    try {
      const { email, name } = user;
      await this.mailerService.sendMail({
        to: email,
        from: '"Soporte VIU HUB" <support@example.com>',
        subject: 'Notificación de actualización - VIU HUB',
        template: './update-profile',
        context: {
          name,
          content,
        },
      });
    } catch (error) {
      handleError(error, 'Send Mail Update Profile');
    }
  }
}
