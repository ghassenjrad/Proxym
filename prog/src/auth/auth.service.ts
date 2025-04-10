import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { email: email }
        });

        

        const isPasswordValid = await bcrypt.compare(pass, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password');
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.idUs, username: user.name }
        console.log(this.jwtService.signAsync(payload));
        const access_token = await this.jwtService.signAsync(payload);
        return {
            access_token
        };

    }


}