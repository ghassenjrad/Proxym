import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Put, Req, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { MailService } from './mail.service';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { debug } from 'console';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) { }

  //@HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: Record<string, any>) {
    const { email, password } = signInDto
    return this.authService.signIn(email, password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.userService.savePasswordResetToken(Number(user.idUs), token, expires);

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'delilah.hintz88@ethereal.email',
          pass: 'Mtu83sPWmGZJfAy7YB'
      }
  });

     const resetLink = `http://localhost:3001/reset-password?token=${token}`;

    const mailOptions = {
      from: 'delilah.hintz88@ethereal.email',
      to: user.email,
      subject: 'Password Reset',
      html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
    `,
    };

    await transporter.sendMail(mailOptions);

    return { message: 'Password reset email sent . Please check your email ' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    const user = await this.userService.findByResetToken(token);
    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }

    await this.userService.updatePassword(Number(user.idUs), newPassword);

    return { message: 'Password reset successful' };
  }


}


